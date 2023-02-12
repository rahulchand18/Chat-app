const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const FileSchema = new Schema({
    path: {
        type: String
    },
    deleted: {
        type: Boolean,
        default: false
    },
    fileName: {
        type: String
    }
});

const PersonalDetailsSchema = new Schema({
    fullName: {
        type: String
    },
    firstName: {
        type: String
    },
    middleName: {
        type: String
    },
    lastName: {
        type: String
    },
    dateOfBirth: {
        type: Date
    },
    profile: FileSchema,
    dateOfAccountCreated: {
        type: Date
    },
    profileHistory: [FileSchema]
});

const UserSchema = new Schema(
    {
        username: {
            type: String,
            unique: true
        },
        password: {
            type: String
        },
        emailId: {
            type: String
        },
        status: {
            type: String,
            default: 'ACT'
        },
        personalDetails: PersonalDetailsSchema
    },
    {
        versionKey: false,
        timestamps: true
    }
);

UserSchema.pre('save', async function (next) {
    try {
        if (!this.isModified('password')) {
            return next();
        }
        const hashed = await bcrypt.hash(this['password'], 10);
        this['password'] = hashed;
        return next();
    } catch (err) {
        return next(err);
    }
});

const UsersModel = mongoose.model('user', UserSchema);
module.exports = UsersModel;
