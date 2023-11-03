global.config = {
    PORT:2005,
    mongoDB:"mongodb://127.0.0.1:27017/learn",
    tempDir:'/temp',
    staticDir:'/public',
    fileDir:'/public/file',//文件存放位置，路径前还有个public
    token:'',
}

require('./base');
