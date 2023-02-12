const UsersModel = require('./user.model');

const findUserByUserNameOrEmail = async (username, emailId) => {
    return await UsersModel.findOne({ $or: [{ username }, { emailId }], status: 'ACT' });
};
const findUserByUsername = async (username) => {
    return await UsersModel.findOne({ username, status: 'ACT' });
};
const findUserByEmailId = async (emailId) => {
    return await UsersModel.findOne({ emailId, status: 'ACT' });
};
const findUserById = async (id) => {
    return await UsersModel.findById(id);
};
const createNewUser = async (userData) => {
    const newUser = new UsersModel(userData);
    return await newUser.save();
};

const UserService = {
    findUserByUserNameOrEmail,
    findUserById,
    findUserByUsername,
    findUserByEmailId,
    createNewUser
};

module.exports = UserService;
