'use strict';

/* Filters */

var MDBFilters = angular.module('mdbApp.filters', []);

MDBFilters
    .filter('interpolate', ['version', function(version) {
        return function(text) {
            return String(text).replace(/\%VERSION\%/mg, version);
        }
    }]);