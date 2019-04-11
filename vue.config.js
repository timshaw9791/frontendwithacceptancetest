process.env.NODE_ENV = 'development';

module.exports = {

    chainWebpack: config => {
        // 一个规则里的 基础Loader
        // svg是个基础loader
        const svgRule = config.module.rule('svg')

        // 清除已有的所有 loader。
        // 如果你不这样做，接下来的 loader 会附加在该规则现有的 loader 之后。
        svgRule.uses.clear()

        // 添加要替换的 loader
        svgRule
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({
                symbolId: 'icon-[name]'
            })
    },

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
        disableHostCheck: true,
        hotOnly: true
    },
    pluginOptions: {
      apollo: {
        enableMocks: true,
        enableEngine: true
      }
    },

};
