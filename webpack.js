// import config from './vue.config';
// config.configureWebpack.resolve.alias



// const resolve = dir => {
//     return   require('path').join(__dirname, dir);
// }

module.exports = {
    resolve: {
        alias: {
            '@': __dirname+('/src')
        }
    }
};