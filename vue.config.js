process.env.NODE_ENV = 'production';

module.exports = {
    configureWebpack: {

        resolve: {
            alias: {
                'assets': '@/assets',
                'components': '@/components',
                'views': '@/views',
                'field':'@/field',
                'common':'@/common',
                'base':'@/base',
                'fetch':'@/fetch',
                'store':'@/store',
                'gql':'@/graphql'
            }
        }
    },
    devServer: {
        port: 8085, // 端口号
        host: 'localhost',
        https: false, // https:{type:Boolean}
        open: true, //配置自动启动浏览器
    },
    pluginOptions: {
      apollo: {
        enableMocks: true,
        enableEngine: true
      }
    }
};
