'use strict';

// define a global application module which depends on filters, and services
var mdbApp = angular.module('mdbApp', [
    'ngRoute',
    'ui.tree',
    'ui.router',
    'ui.bootstrap',
    'ui.bootstrap.datetimepicker',
    'ngCookies',
    //'uiGmapgoogle-maps',
    'angular-websocket',
    'ngSanitize',
    'ui.layout',
    'ngTouch',
    'ui.grid',
    'ui.grid.selection',
    'ui.grid.resizeColumns',
    'ui.grid.moveColumns',
    'ui.grid.pagination',
    'ngTagsInput',
    'ngResource',
    'ngAnimate',
    'mgcrea.ngStrap',
    'mdbApp.controllers',
    'mdbApp.filters',
    'mdbApp.services',
    'mdbApp.testdirectives',
    'mdbApp.directives']);

mdbApp.value('version', '0.2');

// create app router for url management and redirect
// templateUrl: html file to show
// controller: name of the controller which is defined in controller.js
// access: {restricted: true} - restricted, if not authenticated
mdbApp.config(function ($routeProvider, $locationProvider) {
    $routeProvider.
        when('/', {
            templateUrl: 'partials/index',
            controller: 'IndexCtrl',
            access: {restricted: false}
        }).
        when('/impressum', {
            templateUrl: 'partials/impressum',
            controller: 'ImpressumCtrl',
            access: {restricted: false}
        }).
        when('/privacy_policy', {
        templateUrl: 'partials/privacy_policy',
        controller: 'ImpressumCtrl',
        access: {restricted: false}
    })
        .when('/help', {
            templateUrl: 'partials/help',
            controller: 'HelpCtrl',
            access: {restricted: false}
        }).
        when('/user', {
            templateUrl: 'partials/user',
            controller: 'UserCtrl',
            access: {restricted: false}
        }).
        when('/entries', {
            templateUrl: 'partials/entries',
            controller: 'EntriesCtrl',
            access: {restricted: true}
        }).
        when('/messages', {
            templateUrl: 'partials/messages',
            controller: 'MessagesCtrl',
            access: {restricted: false}
        }).
        when('/colleagues', {
            templateUrl: 'partials/colleagues',
            controller: 'ColleaguesCtrl',
            access: {restricted: true}
        }).
        when('/usergroups', {
            templateUrl: 'partials/usergroups',
            controller: 'UsergroupsCtrl',
            access: {restricted: true}
        }).
        when('/websocket', {
            templateUrl: 'partials/websocket',
            controller: 'WebsocketCtrl',
            access: {restricted: false}
        }).
        when('/formtest', {
            templateUrl: 'partials/formtest',
            controller: 'FormtestCtrl',
            access: {restricted: false}
        }).
        when('/ui_layout', {
            templateUrl: 'partials/ui_layout',
            controller: 'UiCtrl',
            access: {restricted: false}
        }).
        when('/morphdescription', {
            templateUrl: 'partials/morphdescription',
            controller: 'MorphDescriptionCtrl',
            access: {restricted: false}
        }).
        when('/annotation_text', {
            templateUrl: 'partials/annotation_text',
            controller: 'TextAnnotationCtrl',
            access: {restricted: false}
        }).
        when('/annotation_image', {
            templateUrl: 'partials/annotation_image',
            controller: 'ImageAnnotationCtrl',
            access: {restricted: false}
        }).
        when('/annotation', {
            templateUrl: 'partials/annotation',
            controller: 'AnnotationCtrl',
            access: {restricted: false}
        }).
        when('/annotation_partonomy', {
            templateUrl: 'partials/annotation_partonomy',
            controller: 'PartonomyAnnotationCtrl',
            access: {restricted: false}
        }).
        when('/annotation_parto', {
            templateUrl: 'partials/annotation_parto',
            controller: 'PartoAnnotationCtrl',
            access: {restricted: false}
        }).
        when('/annotation_part', {
            templateUrl: 'partials/annotation_part',
            controller: 'PartAnnotationCtrl',
            access: {restricted: false}
        }).
        when('/entry_specimen', {
            templateUrl: 'partials/entry_specimen',
            controller: 'EntrySpecCtrl',
            access: {restricted: true}
        }).
        when('/entry_description', {
            templateUrl: 'partials/entry_description',
            controller: 'EntryDescCtrl',
            access: {restricted: true}
        }).
        when('/johnsmith', {
            templateUrl: 'partials/johnsmith',
            controller: 'JohnSmithCtrl',
            access: {restricted: false}
        }).
        when('/mdb_entry', {
            templateUrl: 'partials/mdb_entry',
            controller: 'MDBEntryCtrl',
            access: {restricted: true}
        }).
        // https://www.morphdbase.de/resource/de46dd64-20171018-md-1-d_1_1
        when('/resource/:entryId', {
            templateUrl: 'partials/mdb_entry',
            controller: 'MDBEntryCtrl',
            access: {restricted: true}
        }).
        when('/mdb_entry_list/:entryType', {
            templateUrl: 'partials/mdb_entry_list/',
            controller: 'MDBEntryListCtrl',
            access: {restricted: true}
        }).
        when('/mdb_partonomy', {
            templateUrl: 'partials/mdb_partonomy',
            controller: 'MDBPartonomyCtrl',
            access: {restricted: false}
        }).
        when('/mdb_page', {
            templateUrl: 'partials/mdb_page',
            controller: 'MDBPageCtrl',
            access: {restricted: true}
        }).
        when('/entry', {
            templateUrl: 'partials/entry',
            controller: 'EntryCtrl',
            access: {restricted: false}
        }).
        when('/admin', {
            templateUrl: 'partials/admin',
            controller: 'AdminCtrl',
            access: {restricted: true}
        }).
        otherwise({
            redirectTo: '/',
            controller: 'IndexCtrl',
            access: {restricted: false}
        });
    $locationProvider.html5Mode(true);
    $locationProvider.hashPrefix('!');
});

//// config for angularUI Google Maps
//mdbApp.config(function (uiGmapGoogleMapApiProvider) {
//    uiGmapGoogleMapApiProvider.configure({
//        //Google API key passed as post parameter in index.html
//        //key: 'YOUR KEY',
//        v: '3.',
//        libraries: 'geometry,visualization' // 'weather,geometry,visualization,places'
//    });
//});

/*
 mdbApp.config(function($provide) {
 $provide.decorator('ngModelDirective', function($delegate) {
 var ngModel = $delegate[0], controller = ngModel.controller;
 ngModel.controller = ['$scope', '$element', '$attrs', '$injector', function(scope, element, attrs, $injector) {
 var $interpolate = $injector.get('$interpolate');
 attrs.$set('name', $interpolate(attrs.name || '')(scope));
 $injector.invoke(controller, this, {
 '$scope': scope,
 '$element': element,
 '$attrs': attrs
 });
 }];
 return $delegate;
 });
 $provide.decorator('formDirective', function($delegate) {
 var form = $delegate[0], controller = form.controller;
 form.controller = ['$scope', '$element', '$attrs', '$injector', function(scope, element, attrs, $injector) {
 var $interpolate = $injector.get('$interpolate');
 attrs.$set('name', $interpolate(attrs.name || attrs.ngForm || '')(scope));
 $injector.invoke(controller, this, {
 '$scope': scope,
 '$element': element,
 '$attrs': attrs
 });
 }];
 return $delegate;
 });
 });
 */

// has probably some influence on route change actions
mdbApp.run(function ($rootScope, $location, $route, AuthService, $uibModalStack) {
    $rootScope.$on('$routeChangeStart', function (event, next, current) {
        if (next.access.restricted && AuthService.isLoggedIn() === false) {
            $location.path('/');
            $route.reload();
        }
        else {
            $rootScope.isLoggedIn = AuthService.isLoggedIn();
            $rootScope.CurrentUser = AuthService.getUsername();
        }
    });

    $rootScope.$on('$stateChangeStart', function () {
        var top = $uibModalStack.getTop();
        if (top) {
            $uibModalStack.dismiss(top.key);
        }
    });

    $rootScope.$on('$locationChangeStart', function (event) {
        var top = $uibModalStack.getTop();
        if (top) {
            $uibModalStack.dismiss(top.key);
            event.preventDefault();
        }
    });


    ///////////////////////////////////////////////////////////////////////////////////////////////////////////
    //// root scope variables, sparql & queries ///////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////


    $rootScope.developers = [
        "september@mdb.de",
        "august@mdb.de",
        "mai@mdb.de",
        "koehler@mdb.de",
        "d@w.de",
        "doc@delorean.com",
        "hui@ui.de",
        "hi@ha.de",
        "buddy@test.de",
        "sandra@mdb.de",
        "sandra@proto.com",
        "lars.m.vogt@gmail.com",
        "lars.m.vogt@googlemail.com",
        "p.grobe@zfmk.de",
        "loca@test.de"
    ];

    $rootScope.moreinfo = [
        "loca@test.de",
        "lala@lila.de",
        "test@test.com",
        "sandra@proto.de",
        "tdwg@mdb.com",
        "tdwg@proto.com",
        "tdwg@mdb.de"
    ];



    // keywordKnownResources
    $rootScope.keywordKnownResourceA = "http://www.soccomas.org/Ontologies/SOCCOMAS/SprO#SPRO_0000000321";
    $rootScope.keywordKnownResourceB = "http://www.soccomas.org/Ontologies/SOCCOMAS/SprO#SPRO_0000000148";


    // TODO: These queries used in websocket.html are not up to date.

    // prefixes
    $rootScope.defaultPrefixes = `
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX mdboldentry: <http://www.morphdbase.de/Ontologies/MDB/MDBEntry0v1#>
    PREFIX mdbentry: <http://www.morphdbase.de/Ontologies/MDB/MDBEntry#>`;

    // defaultQueries
    $rootScope.defaultUserQuery = $rootScope.defaultPrefixes +
    `
    SELECT ?s
    WHERE {
         GRAPH ?g {?s ?p ?o}.
         FILTER ( regex(STR(?s), 'USER'))
    }
    GROUP BY ?s`;

    $rootScope.defaultConstructQuery = $rootScope.defaultPrefixes + `
    CONSTRUCT {?s rdf:type ?o}
    WHERE {
        GRAPH ?g {?s rdf:type ?o}
    }`;

    $rootScope.defaultPConstructQuery =`
    CONSTRUCT {?s ?p ?o}
    WHERE {
       GRAPH ?g {?s ?p ?o}
    }`;

    $rootScope.defaultSelectCountSpecimenQuery = $rootScope.defaultPrefixes + `
    SELECT (COUNT(DISTINCT ?s) as ?count)
    WHERE {
        GRAPH ?g {?s rdf:type  mdbentry:MDB_ENTRY_0000000029 } .
        FILTER ( regex(STR(?s), 'http://www.morphdbase.de/resource') && regex(STR(?s), '-S_' ))
    }`;


    $rootScope.getCoreIDsQuery = $rootScope.defaultPrefixes + `
    CONSTRUCT {?s rdf:type ?o}
    WHERE {
        GRAPH ?g {?s rdf:type ?o}
    }`;

    $rootScope.registerDocumentQuery = `
    {
      "type": "check_input",
      "localID": "SC_BASIC_0000000633",
      "value": "",
      "localIDs":
        [
           { "localID": "SC_BASIC_0000000634", "value": ""},
           { "localID": "SC_BASIC_0000000628", "value": ""}
        ],
      "mdbueid": "",
      "html_form": "SC_BASIC_0000001206",
      "connectSID": "s:42-HALLOHIERALARMEINS1ELF-TTESTT.SANDRASGANZPERSOENLICHEMDBPROTOTYPSESSIONID"
    }`;

    $rootScope.loginDocumentQuery = `
    {
      "type" : "check_input",
      "localID" : "SC_BASIC_0000000140",
      "localIDs" :
        [
           {"localID" : "SC_BASIC_0000000816", "value" : ""},
           {"localID" : "SC_BASIC_0000000814", "value" : ""},
           {"localID" : "SC_BASIC_0000000815", "value" : ""},
           {"localID" : "SC_BASIC_0000000831", "value" : ""},
           {"localID" : "SC_BASIC_0000000825", "value" : ""},
           {"localID" : "SC_BASIC_0000000828", "value" : ""},
           {"localID" : "SC_BASIC_0000000836", "value" : ""},
           {"localID" : "SC_BASIC_0000000623", "value" : ""}
        ],
      "mdbueid": "",
      "html_form": "SC_BASIC_0000001156",
      "connectSID": "s:42-HALLOHIERALARMEINS1ELF-TTESTT.SANDRASGANZPERSOENLICHEMDBPROTOTYPSESSIONID"
    }`;

    $rootScope.signUpUserQuery = `{
      "type" : "check_input",
      "localID" : "SC_BASIC_0000000833",
      "localIDs" :
        [
           {"localID" : "SC_BASIC_0000000816", "value" : "Vorname"},
           {"localID" : "SC_BASIC_0000000814", "value" : "Nachname"},
           {"localID" : "SC_BASIC_0000000815", "value" : "vname"},
           {"localID" : "SC_BASIC_0000000831", "value" : "ZFMK"},
           {"localID" : "SC_BASIC_0000000825", "value" : "vname@zfmk.de"},
           {"localID" : "SC_BASIC_0000000828", "value" : "vname@zfmk.de"},
           {"localID" : "SC_BASIC_0000000623", "value" : "ABCD1234"}
        ],
      "mdbueid": "ABCD1234",
      "html_form": "SC_BASIC_0000001156",
      "connectSID": "s:42-HALLOHIERALARMEINS1ELF-TTESTT.SANDRASGANZPERSOENLICHEMDBPROTOTYPSESSIONID"
    }`;

    $rootScope.fixLogout = `
    {
      "type": "check_input",
      "localID": "SC_BASIC_0000000136",
      "mdbueid": "[XXX--HIERMDBUEIDEINTRAGEN--XXX]",
      "html_form": "MY_DUMMY_LOGOUT_0000000001",
      "connectSID": "s:42-HALLOHIERALARMEINS1ELF-TTESTT.SANDRASGANZPERSOENLICHEMDBPROTOTYPSESSIONID",
      "http://www.soccomas.org/Ontologies/SOCCOMAS/SprO#SPRO_0000000321": "http://www.morphdbase.de/resource/[XXX--HIERMDBUEIDEINTRAGEN--XXX]#TimeInterval_[XXX--HIERTimeIntervalEINTRAGEN--XXX]",
      "http://www.soccomas.org/Ontologies/SOCCOMAS/SprO#SPRO_0000000148": "http://www.morphdbase.de/resource/[XXX--HIERMDBUEIDEINTRAGEN--XXX]#SC_BASIC_0000001483_[XXX--HIERTimeIntervalEINTRAGEN--XXX]"
    }`;
});