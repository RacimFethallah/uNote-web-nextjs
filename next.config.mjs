// next.config.js
module.exports = {
    webpack(config) {
        config.resolve.fallback = {
            fs: false,
            path: false,
        };
        config.module.rules.push({
            test: /\.html$/,
            use: 'ignore-loader',
        });
        return config;
    },
};