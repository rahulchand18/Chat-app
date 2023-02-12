const express = require('express');
const passport = require('passport');
const UserRoutes = require('./api/users/user.routes');
require('./middleware/auth');

const router = express.Router();

router.get('/', (req, res) => {
    return res.status(200).json({
        success: true,
        message: 'API working'
    });
});

router.use('/api/v1/user', UserRoutes);

module.exports = router;
