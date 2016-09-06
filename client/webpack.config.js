const path = require('path');

const PATHS = {
    src: path.join(__dirname, 'src'),
    build: path.join(__dirname, 'build')
};

module.exports = {
    entry: {
        app: PATHS.src
    },
    output: {
        path: PATHS.build,
        filename: 'bundle.js'
    },
    module: {
        preLoaders: [
            {
                test: /\.js$/,
                loaders: ['eslint'],
                include: [PATHS.src]
            }
        ],
        loaders: [
            {
                loaders: ['babel-loader'],
                include: [PATHS.src],
                test: /\.js$/,
                plugins: ['transform-runtime']
            },
            {
                loader: "style-loader!css-loader",
                test: /\.css$/
            }
        ]
    }
};