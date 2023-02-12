const jwt = require('jsonwebtoken');
const Cryptr = require('cryptr');
const { decryptText } = require('../utils/utils');
const cryptr = new Cryptr(process.env.ENCRYPT_JWT_SECRET);

function authenticateToken(req, res, next) {
    let token = null;
    if (req.header('x-token')) {
        token = req.get('x-token');
    } else if (req.headers.authorization) {
        token = req.headers.authorization.replace('Bearer ', '').replace(' ', '');
    } else if (req.body.token) {
        token = req.body.token.replace(' ', '');
    }
    if (req.query.token) {
        token = req.body.token.replace(' ', '');
    }
    if (token) {
        try {
            token = cryptr.decrypt(token);
            req.headers.authorization = 'Bearer ' + token;
        } catch (err) {
            res.status(404).json({ message: 'Invalid token ', err });
        }
    }
    next();
}

function verifyExpiredToken(encryptedToken, secretKey) {
    if (encryptedToken) {
        const token = decryptText(encryptedToken);
        return jwt.verify(token, secretKey, { ignoreExpiration: true });
    } else {
        return false;
    }
}

module.exports = {
    authenticateToken,
    verifyExpiredToken
};
