const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const postcssPresetEnv = require('postcss-preset-env')

const mode = process.env.NODE_ENV || 'development'

const target = mode === 'development' ? 'web' : 'browserslist'
const devtool = mode === 'development' ? 'source-map' : undefined

module.exports = {
    entry: path.resolve(__dirname, 'src', 'index.js'),

    output: {
        path: path.resolve(__dirname, 'dist'),
        clean: true,
        filename: '[name].[contenthash].js',
    },

    mode,
    target,
    devtool,

    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'src', 'index.html'),
        }),
    ],

    module: {
        rules: [
            {
                test: /\.html$/i,
                loader: 'html-loader',
            },

            {
                test: /\.scss$/i,
                use: [
                    'style-loader',
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [postcssPresetEnv],
                            },
                        },
                    },
                    'sass-loader',
                ],
            },

            {
                test: /\.(?:js|mjs|cjs)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['@babel/preset-env', { targets: 'defaults' }],
                        ],
                    },
                },
            },
        ],
    },

    devServer: {
        port: 3000,
        open: true,
        hot: true,
    },
}
