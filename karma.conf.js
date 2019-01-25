// Karma configuration
// Generated on Tue Jul 07 2015 16:28:36 GMT+0200 (CEST)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    //frameworks: ['jasmine', 'detectBrowsers'],
    frameworks: ['jasmine'],

    // configuration = only active if 'detectBrowsers' ist listed as framework
    detectBrowsers: {
        // enable/disable, default is true
        enabled: true,

        // enable/disable phantomjs support, default is true
        usePhantomJS: true,

        // post processing of browsers list
        // here you can edit the list of browsers used by karma
        postDetection: function(availableBrowser) {
          /* Karma configuration with custom launchers
           customLaunchers: {
           IE9: {
           base: 'IE',
           'x-ua-compatible': 'IE=EmulateIE9'
           }
           }
           */

          //Add IE Emulation
          var result = availableBrowser;

          if (availableBrowser.indexOf('IE')>-1) {
              result.push('IE9');
          }

          //Remove PhantomJS if another browser has been detected
          if (availableBrowser.length > 1 && availableBrowser.indexOf('PhantomJS')>-1) {
              var i = result.indexOf('PhantomJS');

              if (i !== -1) {
                  result.splice(i, 1);
              }
          }

          return result;
        }
    },

    plugins: [,
        'karma-jasmine',
        'karma-chrome-launcher',
        'karma-firefox-launcher',
        'karma-ie-launcher',
        'karma-safari-launcher',
        //'karma-opera-launcher',
        'karma-phantomjs-launcher',
        'karma-detect-browsers'
    ],

    // list of files / patterns to load in the browser

    files: [
        "bower_components/jquery/dist/jquery.min.js",
        "bower_components/jquery-ui/jquery-ui.js",
        "bower_components/datatables/media/js/jquery.dataTables.min.js",
        "bower_components/angular/angular.js",
        "bower_components/angular-datatables/dist/angular-datatables.js",
        "bower_components/angular-route/angular-route.js",
        "bower_components/angular-mocks/angular-mocks.js",
        "bower_components/angular-ui-router/release/angular-ui-router.js",
        "bower_components/angular-cookies/angular-cookies.js",
        "bower_components/angular-animate/angular-animate.js",
        "bower_components/angular-touch/angular-touch.js",
        "bower_components/angular-sanitize/angular-sanitize.js",
        "bower_components/lodash/lodash.js",
        "bower_components/angular-simple-logger/dist/angular-simple-logger.min.js",
        "bower_components/bootstrap/dist/js/bootstrap.min.js",
        "bower_components/angular-bootstrap/ui-bootstrap-tpls.js",
        "bower_components/angular-websocket/angular-websocket.min.js",
        "bower_components/angular-ui-layout/src/ui-layout.js",
        "public/js/*.js",
        "unittests/*.js"
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9988,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    //browsers: ['Firefox', 'Chrome', 'PhantomJS'],
    //browsers: ['Firefox'],
    //browsers: ['Chrome'],
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true

  })
};
