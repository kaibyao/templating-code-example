var config = {};

config.environment = 'prod';
config.port = 8888;
config.languages = [ 'en-us' ];

config.paths = {
    root: "/var/www/machete",
    templates: "application/views"
};
config.paths.tests = config.paths.root + '/tests';

config.logs = {
    src: false,
    errorpath: 'error.log',
    infopath: 'info.log'
};

module.exports = config;
