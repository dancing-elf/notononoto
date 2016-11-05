const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const config = require('./webpack.dev.config');
const proxy = require('http-proxy-middleware');

const app = express();
const compiler = webpack(config);

app.use(proxy('/api', {
    target: 'http://localhost:8080',
    changeOrigin: true
}));
app.use(proxy('/res', {
    target: 'http://localhost:8080',
    changeOrigin: true
}));
app.use(webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
}));
app.use(webpackHotMiddleware(compiler));

app.get("/favicon.png", function (req, res) {
    res.sendFile(__dirname + '/src/favicon.png')
});
app.get("*", function (req, res) {
    res.sendFile(__dirname + '/src/index.html')
});

app.listen(8000, 'localhost', (err) => {
    if (err) {
        console.log(err);
        return;
    }
    console.log('Listening at http://localhost:8000');
});