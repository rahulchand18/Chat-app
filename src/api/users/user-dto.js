const Joi = require('joi');

const loginUserDto = Joi.object({
    username: Joi.string(),
    emailId: Joi.string(),
    password: Joi.string().min(4).alphanum().required()
});
const createUserDto = Joi.object({
    username: Joi.string().required(),
    firstName: Joi.string().required(),
    middleName: Joi.string(),
    lastName: Joi.string().required(),
    emailId: Joi.string().required(),
    password: Joi.string().min(4).alphanum().required()
});

const UserDTO = {
    loginUserDto,
    createUserDto
};

module.exports = UserDTO;
