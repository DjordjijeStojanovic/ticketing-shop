module.exports = {
    webpackDevMiddleware: config => {
        config.watchOptions.pool = 300;
        return config;
    },
    allowedDevOrigins: ['ticket-shop.docker'],
};