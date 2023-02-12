const { v4: uuidv4 } = require('uuid');
const { REFRESH_TOKEN } = require('../../constants/cookie-keys.constant');
const RefreshTokenModel = require('./refresh-token.model');
const { getIp, getBrowserInfo, getCountry, encryptText, decryptText } = require('../../utils/utils');
const UsersModel = require('../users/user.model');

const REFRESH_TOKEN_EXPIRATION_MS = parseInt(process.env.REFRESH_TOKEN_EXPIRATION_MIN) * 60 * 1000;

const createRefreshToken = async (req, userId) => {
    const refreshTokenData = await RefreshTokenModel.findOne({
        $and: [{ userId }, { expireIn: { $gte: new Date() } }, { $or: [{ revoke: { $eq: null } }, { revoke: { $exists: false } }] }]
    });
    if (refreshTokenData) {
        refreshTokenData.expireIn = new Date(Date.now() + REFRESH_TOKEN_EXPIRATION_MS);
        await refreshTokenData.save();
        return refreshTokenData.refreshToken;
    } else {
        const refreshToken = new RefreshTokenModel({
            userId,
            refreshToken: uuidv4(),
            ip: getIp(req),
            browser: getBrowserInfo(req),
            country: getCountry(req),
            expireIn: new Date(Date.now() + REFRESH_TOKEN_EXPIRATION_MS)
        });
        await refreshToken.save();
        return refreshToken.refreshToken;
    }
};

const findRefreshToken = async (token) => {
    return await RefreshTokenModel.findOne({ refreshToken: token });
};

const updateRefreshToken = async (refreshToken) => {
    const refreshTokenData = await RefreshTokenModel.findOne({
        revoke: null,
        refreshToken: decryptText(refreshToken)
    });
    if (refreshTokenData) {
        refreshTokenData.expireIn = new Date(Date.now() + REFRESH_TOKEN_EXPIRATION_MS);
        return await refreshTokenData.save();
    }
};

const revokeRefreshToken = async (req) => {
    const refreshToken = req.cookies[REFRESH_TOKEN];
    if (refreshToken) {
        const refreshTokenData = await RefreshTokenModel.findOne({
            refreshToken: decryptText(refreshToken)
        });
        if (refreshTokenData) {
            refreshTokenData.revoke = new Date();
            refreshTokenData.revokeIp = getIp(req);
            await refreshTokenData.save();
        }
    }
};

const setCookie = (cookieName, token, res) => {
    const cookieOptions = {
        httpOnly: true,
        expires: new Date(Number(Date.now()) + REFRESH_TOKEN_EXPIRATION_MS),
        secure: true
    };
    res.cookie(cookieName, encryptText(token), cookieOptions);
};

const destroyCookie = (cookieName, res) => {
    res.cookie(cookieName, { expires: new Date() });
};

const getUserNameFromRefreshToken = async (refreshToken, fromUser) => {
    const refreshTokenData = await RefreshTokenModel.findOne({
        refreshToken: decryptText(refreshToken)
    });
    if (refreshTokenData && refreshTokenData.userId) {
        const userId = refreshTokenData.userId;
        const user = await UsersModel.findById(userId);
        return user.username;
    }
};

const AuthService = {
    createRefreshToken,
    setCookie,
    findRefreshToken,
    updateRefreshToken,
    revokeRefreshToken,
    destroyCookie,
    getUserNameFromRefreshToken
};

module.exports = AuthService;
