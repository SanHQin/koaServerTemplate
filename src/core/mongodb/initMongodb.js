module.exports = (dbUrl,callback) =>{
    mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open',()=>{
        if(typeof callback === 'function')return callback(db);
    })
}
