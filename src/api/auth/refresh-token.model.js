const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const refreshTokenSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'user',
            required: true
        },
        refreshToken: {
            type: String,
            required: true
        },
        ip: {
            type: String,
            required: true
        },
        browser: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        },
        expireIn: {
            type: Date,
            required: true
        },
        revoke: {
            type: Date,
            required: false
        },
        revokeIp: {
            type: String,
            required: false
        }
    },
    {
        versionKey: false,
        timestamps: true
    }
);
const RefreshToken = mongoose.model('refresh-token', refreshTokenSchema);

module.exports = RefreshToken;
