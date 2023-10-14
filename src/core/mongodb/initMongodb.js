const mongoose = require('mongoose');

mongoose.connect(global.config.mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'));

module.exports = db;