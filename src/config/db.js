const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
const connect = () => {
    return mongoose
        .connect(process.env.MONGODB_URI)
        .then((result) => {
            console.log('Connected to database..');
            return result;
        })
        .catch((error) => {
            console.log('Error while connecting to database\n', error);
            setTimeout(() => {
                console.log('Trying reconnecting to database..');
                connect();
            }, 3000);
        });
};

module.exports = connect;
