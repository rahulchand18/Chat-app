const fs = require('fs');
const { extname } = require('path');
const FOLDER_NAMES = require('../constants/folder-name.constants');

function fileName(req, file, callback) {
    const fileExtName = extname(file.originalname);
    const fileName = file.originalname.split(' ').join('-');
    callback(null, `${fileName.substring(0, fileName.lastIndexOf('.'))}-${Date.now()}${fileExtName}`);
}

function notImageType(imageName) {
    if (!imageName.match(/\.(jpg|jpeg|png)$/)) {
        return true;
    }
    return false;
}

function getHolidayFileDestination(req, file, callback) {
    const folderName = FOLDER_NAMES.HOLIDAY;
    let uploadError = null;
    if (notImageType(file.originalname)) {
        uploadError = new Error('invalid image type');
        req.fileValidationError = 'Forbidden extension';
    }
    const path = process.cwd() + `/uploads/${folderName}`;
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
    }
    callback(uploadError, `./uploads/${folderName}`);
}

function getRecruitFileDestination(req, file, callback) {
    const folderName = FOLDER_NAMES.RECRUIT;
    if (!fs.existsSync(process.cwd() + '/uploads')) {
        fs.mkdirSync(process.cwd() + '/uploads');
    }
    const path = process.cwd() + `/uploads/${folderName}`;
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
    }
    callback(null, `./uploads/${folderName}`);
}

function getEmployeeProfileDestination(req, file, callback) {
    try {
        const folderName = FOLDER_NAMES.EMPLOYEES;
        if (!fs.existsSync(process.cwd() + '/uploads')) {
            fs.mkdirSync(process.cwd() + '/uploads');
        }
        if (!fs.existsSync(process.cwd() + `/uploads/${folderName}`)) {
            fs.mkdirSync(process.cwd() + `/uploads/${folderName}`);
        }
        const path = process.cwd() + `/uploads/${folderName}/${req.params.employeeId}`;
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path);
        }

        callback(null, `./uploads/${folderName}/${req.params.employeeId}`);
    } catch (err) {
        console.log(err);
    }
}

function getEmployeeCertificateDestination(req, file, callback) {
    const folderName = FOLDER_NAMES.EMPLOYEES;
    if (!fs.existsSync(process.cwd() + '/uploads')) {
        fs.mkdirSync(process.cwd() + '/uploads');
    }
    if (!fs.existsSync(process.cwd() + `/uploads/${folderName}`)) {
        fs.mkdirSync(process.cwd() + `/uploads/${folderName}`);
    }
    if (!fs.existsSync(process.cwd() + `/uploads/${folderName}/${req.params.employeeId}`)) {
        fs.mkdirSync(process.cwd() + `/uploads/${folderName}/${req.params.employeeId}`);
    }
    const path = process.cwd() + `/uploads/${folderName}/${req.params.employeeId}/certificates`;
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
    }

    callback(null, `./uploads/${folderName}/${req.params.employeeId}/certificates`);
}
function getEmployeeCelebrationDestination(req, file, callback) {
    const folderName = FOLDER_NAMES.EMPLOYEES;
    if (!fs.existsSync(process.cwd() + '/uploads')) {
        fs.mkdirSync(process.cwd() + '/uploads');
    }
    if (!fs.existsSync(process.cwd() + `/uploads/${folderName}`)) {
        fs.mkdirSync(process.cwd() + `/uploads/${folderName}`);
    }
    if (!fs.existsSync(process.cwd() + `/uploads/${folderName}/${req.params.employeeId}`)) {
        fs.mkdirSync(process.cwd() + `/uploads/${folderName}/${req.params.employeeId}`);
    }
    const path = process.cwd() + `/uploads/${folderName}/${req.params.employeeId}/celebrations`;
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
    }

    callback(null, `./uploads/${folderName}/${req.params.employeeId}/celebrations`);
}

module.exports = {
    fileName,
    getHolidayFileDestination,
    getRecruitFileDestination,
    getEmployeeProfileDestination,
    getEmployeeCertificateDestination,
    getEmployeeCelebrationDestination
};
