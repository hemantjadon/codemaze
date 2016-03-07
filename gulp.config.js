module.exports = function (){
    var config = {
        allLessFiles : 'codeMaze/dev/**/*.less',
        lessOutputPath : 'codeMaze/dist',
        allJsFiles : 'codeMaze/dev/**/*.js',
        jsOutputPath: 'codeMaze/dist',
        allJSXFiles: 'codeMaze/dev/**/*.jsx',
        jsxOutputPath : 'codeMaze/dist'
    }
    
    return config;
}