const path = require("path");
const webpack = require("webpack");

const PATHS = {
    src: path.join(__dirname, "src"),
    build: path.join(__dirname, "build")
};

module.exports = {
    entry: {
        app: PATHS.src
    },
    output: {
        path: PATHS.build,
        filename: "bundle.js"
    },
    plugins: [
        new webpack.NoErrorsPlugin(),
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify("production")
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ],
    module: {
        preLoaders: [
            {
                test: /\.js$/,
                loaders: ["eslint"],
                include: [PATHS.src]
            }
        ],
        loaders: [
            {
                loaders: ["babel-loader"],
                include: [PATHS.src],
                test: /\.js$/,
                plugins: ["transform-runtime"]
            },
            {
                loader: "style-loader!css-loader",
                test: /\.css$/
            }
        ]
    }
};