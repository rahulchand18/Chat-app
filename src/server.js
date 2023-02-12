const app = require('./app');
const mongooseConnect = require('./config/db');
const http = require('http');
const server = http.Server(app);

const PORT = process.env.PORT || 5000;

console.log('Connecting to database...');
mongooseConnect().then((db) => {
    server.listen(PORT, () => {
        console.log('Server Started at', PORT);
    });
});
