module.exports = (dbUrl,callback) =>{
    const mongoose = require('mongoose');
    mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open',()=>{
        if(typeof callback === 'function')return callback(db);
    })
}
