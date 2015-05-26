
var isProduction = process.env.NODE_ENV === 'production';

module.exports = isProduction ? require("./config.prod") : require("./config.live");
