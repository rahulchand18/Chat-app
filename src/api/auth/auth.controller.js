const { REFRESH_TOKEN } = require('../../constants/cookie-keys.constant');
const refreshTokenDTO = require('../models/auth/refresh-token-dto');
const UserService = require('../users/user.service');
const AuthService = require('./auth.service');

const refreshAccessToken = async (req, res, next) => {
    let validatedData = refreshTokenDTO.refreshAccessTokenDTO.validate(req.body, {
        abortEarly: false
    });
    if (validatedData.error) {
        return res.status(422).json({
            message: 'Validation Error',
            error: validatedData.error
        });
    }
    validatedData = validatedData.value;
    let decoded;
    const refreshToken = req.cookies[REFRESH_TOKEN];
    if (refreshToken && validatedData.accessToken) {
        decoded = verifyExpiredToken(validatedData.accessToken, process.env.JWT_SECRET);
    }
    if (!decoded || !refreshToken) {
        return res.status(401).json({
            message: 'Invalid token'
        });
    }
    const refreshTokenData = await AuthService.findRefreshToken(decryptText(refreshToken));

    // const user = await UserService.findUserById(userId.userId);
    const user = await UserService.findUserById(refreshTokenData.userId);
    if (!user) {
        return res.status(401).json({
            message: 'User has been logged out'
        });
    }

    const newRefreshTokenData = await AuthService.updateRefreshToken(req.cookies[REFRESH_TOKEN], res);
    if (newRefreshTokenData) {
        AuthService.setCookie(REFRESH_TOKEN, newRefreshTokenData.refreshToken, res);
        const payload = {
            userName: user.userName,
            id: user._id
        };
        return res.status(200).json({
            message: 'New Access token generated',
            data: {
                accessToken: createAccessToken(payload)
            }
        });
    }
};
const refreshTokenController = {
    refreshAccessToken
};

module.exports = refreshTokenController;
