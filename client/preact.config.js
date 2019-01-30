const CopyWebpackPlugin = require('copy-webpack-plugin')

export default function (config, env, helpers) {

    if (env.isProd) {
        config.plugins.push(new CopyWebpackPlugin([{ from: '../model', to: 'model' }])) 
    }

    return config;
}