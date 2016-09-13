const path = require("path");
const webpack = require("webpack");

const PATHS = {
    src: path.join(__dirname, "src"),
    build: path.join(__dirname, "build/dev")
};

module.exports = {
    entry: [
        "webpack-hot-middleware/client",
        "./src/index.js"
    ],
    output: {
        path: PATHS.build,
        filename: "bundle.js",
        publicPath: 'http://localhost:8000/'
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify("development")
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
                loaders: ["react-hot", "babel-loader"],
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