const requestIp = require('request-ip');
const Cryptr = require('cryptr');
const jwt = require('jsonwebtoken');
const cryptr = new Cryptr(process.env.ENCRYPT_JWT_SECRET);

function addHoursToDate(date, hours) {
    return new Date(new Date(date).setHours(date.getHours() + hours));
}

function getBrowserInfo(req) {
    return req.headers['user-agent'] || 'XX';
}

function getCountry(req) {
    return req.headers['cf-ipcountry'] ? req.headers['cf-ipcountry'] : 'XX';
}

function getIp(req) {
    return requestIp.getClientIp(req);
}

function encryptText(text) {
    return cryptr.encrypt(text);
}

function createAccessToken(user) {
    const accessToken = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });
    return encryptText(accessToken);
}

function decryptText(encryptedString) {
    const decryptedText = cryptr.decrypt(encryptedString);
    return decryptedText;
}

function getYearMonthDayFromDate(date) {
    const dateYear = new Date(date).getFullYear();
    const dateMonth = new Date(date).getMonth() + 1;
    const dateDay = new Date(date).getDate();
    return { dateYear, dateMonth, dateDay };
}

function dynamicSort(property) {
    let sortOrder = 1;
    if (property[0] === '-') {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a, b) {
        const result = a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
        return result * sortOrder;
    };
}

module.exports = {
    addHoursToDate,
    getBrowserInfo,
    getCountry,
    getIp,
    encryptText,
    createAccessToken,
    decryptText,
    getYearMonthDayFromDate,
    dynamicSort
};
