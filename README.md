# /Machete/ - A Sprout Social Template Server #
A project started on Hack Day 1, this server will serve our Mustache-lang'd, Hogan-compiled templates to our PHP webserver via Node.js. In refreshless mode, it will serve it directly to our webapp.

## Running the server ##
`node server`

## To-Dos ##
#### In development ####
Write more tests.

#### Future ####
Write the response callbacks for refreshless environment

## Configure ##

To use the `prod` configuration set your node environment to `production`:

    export NODE_ENV=production

Otherwise, the `live` configuration will be used.

## Requirements ##
The server runs off of Node.js, along with a few modules.  

#### Node.js [http://nodejs.org/](http://nodejs.org/) ####
Download and install Node.js. Instructions at [http://nodejs.org/download/](http://nodejs.org/download/).

#### PhantomJS Headless Webkit JavaScript API [http://phantomjs.org/](http://phantomjs.org/) ####
Follow the instructions here: [http://phantomjs.org/download.html](http://phantomjs.org/download.html)

#### grunt build process [http://github.com/cowboy/grunt](http://github.com/cowboy/grunt) ####
`# npm install -g grunt-cli`

#### Bunyan Node.js Logger [https://github.com/trentm/node-bunyan](https://github.com/trentm/node-bunyan) ####
`# npm install -g bunyan`

#### hoganjs compiler [http://twitter.github.com/hogan.js/](http://twitter.github.com/hogan.js/) ####
`# npm install -g hogan.js`

#### Q promise tool [http://github.com/kriskowal/q](http://github.com/kriskowal/q) ####
`# npm install -g q`


