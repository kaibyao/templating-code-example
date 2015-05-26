var config = {};

config.environment = 'live';
config.port = 8888;
config.languages = [ 'en-us' ];

config.paths = {
    root: ''
};
config.paths.tests = config.paths.root + '/tests';
config.paths.templates = config.paths.root + 'application/views';

config.logs = {
    src: false,
    errorpath: 'error.log',
    infopath: 'info.log'
};

module.exports = config;
