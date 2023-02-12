const { REFRESH_TOKEN } = require('../../constants/cookie-keys.constant');
const { createAccessToken } = require('../../utils/utils');
const AuthService = require('../auth/auth.service');
const UserDTO = require('./user-dto');
const UserService = require('./user.service');
const bcrypt = require('bcrypt');

const userLogin = async (req, res) => {
    try {
        let validatedData = UserDTO.loginUserDto.validate(req.body, {
            abortEarly: false
        });
        if (validatedData.error) {
            return res.status(422).json({
                message: 'Validation Error',
                error: validatedData.error
            });
        }
        validatedData = validatedData.value;
        let match = false;

        const { username, emailId } = req.body;

        const user = await UserService.findUserByUserNameOrEmail(username, emailId);
        if (!user || user === null) {
            return res.status(404).send({
                message: 'User Not Found',
                username: validatedData.username
            });
        }
        if (user.blockExpires > Date.now()) {
            res.status(403).json({
                message: 'Sorry, User has been blocked',
                username: validatedData.username
            });
        }
        match = await bcrypt.compare(validatedData.password, user.password);
        if (!match) {
            return res.status(404).json({
                message: 'Wrong email or password',
                username: validatedData.username
            });
        }

        const refreshToken = await AuthService.createRefreshToken(req, user._id);
        AuthService.setCookie(REFRESH_TOKEN, refreshToken, res);
        const payload = {
            username: user.username,
            id: user._id
        };

        res.status(200).json({
            message: 'Login Successful',
            data: {
                username: user.username,
                status: user.status,
                fullName: user.personalDetails.fullName,
                profile: user.personalDetails.profile ? { path: user.personalDetails.profile.path, fileName: user.personalDetails.profile.fileName } : null,
                joinDate: user.personalDetails.dateOfAccountCreated,
                dateOfBirth: user.personalDetails.dateOfBirth,
                accessToken: createAccessToken(payload),
                nameInitials: user.personalDetails.firstName[0] + user.personalDetails.lastName[0]
            }
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send(err);
    }
};

const userLogout = async (req, res) => {
    try {
        await AuthService.revokeRefreshToken(req);
        AuthService.destroyCookie(REFRESH_TOKEN, res);
        res.status(200).json({
            message: 'User Logout Successful'
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send(err);
    }
};

const createUser = async (req, res) => {
    try {
        const validatedData = UserDTO.createUserDto.validate(req.body, { abortEarly: false });
        if (validatedData.error) {
            return res.status(422).send({ success: false, message: 'validation error', error: validatedData.error });
        }
        const { username, emailId } = validatedData.value;
        const existingUsername = await UserService.findUserByUsername(username);
        const existingEmailId = await UserService.findUserByEmailId(emailId);
        if (existingUsername) {
            return res.status(422).send({ success: false, message: `username:${username} already exists` });
        }
        if (existingEmailId) {
            return res.status(422).send({ success: false, message: `emailId:${emailId} already exists` });
        }
        const userData = prepareUserData(validatedData.value);
        const newUser = UserService.createNewUser(userData);
        if (newUser) {
            return res.status(201).send({ success: true, message: 'User created' });
        } else {
            return res.status(405).send({ success: false, message: 'Error while creating new user' });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ success: false, error: err });
    }
};

const prepareUserData = (data) => {
    const { firstName, middleName, lastName } = data;
    return {
        username: data.username,
        'personalDetails.firstName': firstName,
        'personalDetails.middleName': middleName,
        'personalDetails.lastName': lastName,
        'personalDetails.fullName': `${firstName} ${middleName ? middleName + ' ' : ''}${lastName}`,
        password: data.password,
        emailId: data.emailId
    };
};

const userController = {
    userLogin,
    userLogout,
    createUser
};

module.exports = userController;
