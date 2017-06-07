const path = require('path');
const webpack = require('webpack');
const isProduction = process.env.NODE_ENV === 'production';

const plugins = [
    new webpack.DefinePlugin({
        'process.env': {
            BABEL_ENV: JSON.stringify(process.env.NODE_ENV)
        }
    }),
    new webpack.optimize.UglifyJsPlugin({
        sourceMap: true,
        compress: {
            warnings: false
        }
    })
];

const config = {
    devtool: isProduction ? 'source-map' : 'eval',
    entry: './src/collection',
    output: {
        path: path.join(__dirname, 'dist'),
        filename: !isProduction ? 'collection.js' : 'collection.min.js',
        libraryTarget: 'umd',
        library: 'Collection'
    },
    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.js$/,
                loader: 'eslint-loader',
                exclude: /node_modules/
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            }
        ]
    }
};

if (isProduction) {
    config.plugins = plugins;
}

module.exports = config;