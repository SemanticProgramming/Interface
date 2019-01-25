'use strict';

/* Controllers */

var MDBControllers = angular.module('mdbApp.controllers', []);

MDBControllers.controller('IndexCtrl', function ($scope, $rootScope, $log, $http, $location, $cookies, AuthService, NotificationService, AlertService, $uibModal, WsService, MDBDocumentService) {
    // initial values for Auth and Cookies
    $scope.loggedIn = AuthService.isLoggedIn();
    $scope.currentUser = AuthService.getUsername();
    $scope.userStatus = AuthService.getUserStatus();
    //$scope.cookies = $cookies.getAll();

    // listen for authentication events
    $scope.$watch(AuthService.isLoggedIn, function () {
        $scope.loggedIn = AuthService.isLoggedIn();
        $scope.currentUser = AuthService.getUsername();
        $scope.userStatus = AuthService.getUserStatus();
    });

    // listen for cookie events
    $scope.$watch($cookies.getAll, function () {
        $scope.cookies = $cookies.getAll();
    });

    $scope.getConnectSID = function () {
        AuthService.getConnectSID()
            .then(function () {
                //alert("connectSID: " + AuthService.connectSID);
            })
            // handle error
            .catch(function () {
                //alert("getConnectSID fail");
            });
    };

    ///////////////////////////////////////////////////////////////////////////
    //NotificationService
    ///////////////////////////////////////////////////////////////////////////

    $scope.NotificationService = NotificationService;


    $scope.alerts = AlertService.alerts;

    // NotificationService.showInfo(message) - send message string as info notification
    // NotificationService.showSuccess(message) - send message string as success notification
    // NotificationService.showError(message) - send message string as error notification

    // listen for notification events
    $scope.$watch(NotificationService.getNotification, function () {
        $scope.notification = NotificationService.getMessage();
        $scope.showInfo = NotificationService.getShowInfo();
        $scope.showSuccess = NotificationService.getShowSuccess();
        $scope.showError = NotificationService.getShowError();
    });

    ///////////////////////////////////////////////////////////////////////////
    //WsService
    ///////////////////////////////////////////////////////////////////////////

    $scope.WsService = WsService;

    ///////////////////////////////////////////////////////////////////////////
    //AuthService
    ///////////////////////////////////////////////////////////////////////////

    $scope.AuthService = AuthService; // getUserInfoByUEIDFromDB(ueid)
    //$scope.AuthService.getUserInfoByUEIDFromDB = AuthService.getUserInfoByUEIDFromDB();

    ///////////////////////////////////////////////////////////////////////////
    //MDBDocumentService & Loading spinner
    ///////////////////////////////////////////////////////////////////////////

    $scope.MDBDocumentService = MDBDocumentService;
    $scope.submit = MDBDocumentService.submit;

    // loading check
    $scope.doc_loading = MDBDocumentService.docLoading;

    $rootScope.$on('MDBDocumentService_doc_loading_update', function(event, args) {
        $scope.doc_loading = args.doc_loading;
    });

    /*///////////////////////////////////////////////////////////////////////////
    //Dynamic entry modal
    ///////////////////////////////////////////////////////////////////////////

    // button
    $scope.MY_DUMMY_SPECIMEN_0000000001 = {};

    // modal
    $scope.mdbentrymodal = '';
    $scope.mdbentrywidget = '';
    $scope.title = '';
    $scope.localID = '';

    $scope.showModalElement = function (element) {
        angular.element(element).modal('show');
    };

    $rootScope.$on('WSMDBOverlayCompositionMessage', function (event, args) {
        $scope.mdbentrywidget = args.socket_message;
        $scope.title = "STATIC: Create new MDB entry";
        $scope.showModalElement("#mdboverlayid");
    });*/
});

MDBControllers.controller('ImpressumCtrl', function ($scope, $rootScope, $log, $http, $location, $cookies, AuthService) {
    // initial values for Auth and Cookies
    $scope.loggedIn = AuthService.isLoggedIn();
    $scope.currentUser = AuthService.getUsername();
    $scope.userStatus = AuthService.getUserStatus();
    //$scope.cookies = $cookies.getAll();

    // listen for authentication events
    $scope.$watch(AuthService.isLoggedIn, function () {
        $scope.loggedIn = AuthService.isLoggedIn();
        $scope.currentUser = AuthService.getUsername();
        $scope.userStatus = AuthService.getUserStatus();
    });

    // listen for cookie events
    $scope.$watch($cookies.getAll, function () {
        $scope.cookies = $cookies.getAll();
    });

});
MDBControllers.controller('PrivacyPolicyCtrl', function ($scope, $rootScope, $log, $http, $location, $cookies, AuthService) {
    // initial values for Auth and Cookies
    $scope.loggedIn = AuthService.isLoggedIn();
    $scope.currentUser = AuthService.getUsername();
    $scope.userStatus = AuthService.getUserStatus();
    //$scope.cookies = $cookies.getAll();

    // listen for authentication events
    $scope.$watch(AuthService.isLoggedIn, function () {
        $scope.loggedIn = AuthService.isLoggedIn();
        $scope.currentUser = AuthService.getUsername();
        $scope.userStatus = AuthService.getUserStatus();
    });

    // listen for cookie events
    $scope.$watch($cookies.getAll, function () {
        $scope.cookies = $cookies.getAll();
    });

});

MDBControllers.controller('HeaderCtrl', function ($scope, $rootScope, $log, $http, $location, $cookies, $timeout, NotificationService, AlertService, AuthService, MDBDocumentService, WsService) {
    // initial values for Auth and Cookies
    $scope.loggedIn = AuthService.isLoggedIn();
    $scope.currentUser = AuthService.getUsername();
    $scope.userStatus = AuthService.getUserStatus();
    $scope.currentUEID = AuthService.getUserEntryID();

    // listen for authentication events
    $rootScope.$on('WSAuthenticationEvent', function () {
        //alert("HeaderCtrl - WSAuthenticationEvent");
        $scope.loggedIn = AuthService.isLoggedIn();
        $scope.currentUser = AuthService.getUsername();
        $scope.userStatus = AuthService.getUserStatus();
        $scope.currentUEID = AuthService.getUserEntryID();
        $scope.sesInfo = AuthService.getUserSessionInfo();
    });

    // listen for cookie events
    $scope.$watch($cookies.getAll, function () {
        $scope.cookies = $cookies.getAll();
    });

    // listen for notification events
    $scope.$watch(NotificationService.getNotification, function () {
        $scope.notification = NotificationService.getMessage();
        $scope.showInfo = NotificationService.getShowInfo();
        $scope.showSuccess = NotificationService.getShowSuccess();
        $scope.showError = NotificationService.getShowError();
    });

    ///////////////////////////////////////////////////////////////////////////
    // Collapse & Dropdown toggles
    ///////////////////////////////////////////////////////////////////////////

    $scope.isCollapsed = true;

    $scope.createMenueStatus = {
        isopen: false
    };
    $scope.toggleCreateMenuStatusDropdown = function() {
        $scope.createMenueStatus.isopen = !$scope.createMenueStatus.isopen;
    };

    $scope.authMenueStatus = {
        isopen: false
    };
    $scope.toggleAuthMenuStatusDropdown = function() {
        $scope.authMenueStatus.isopen = !$scope.authMenueStatus.isopen;
    };

    $scope.$on('$routeChangeSuccess', function () {
        $scope.isCollapsed = true;
        $scope.createMenueStatus.isopen = false;
        $scope.authMenueStatus.isopen = false;
    });

    ////TODO // SEARCHBAR TEST //////////////////////////////////

    // BACKGROUND-COLORS:

    //    .css-bg-color-previously-published{    }
    //    .css-bg-color-current-published{    }
    //    .css-bg-color-saved-draft{    }
    //    .css-bg-color-current-draft{    }
    //    .css-bg-color-deleted-draft{    }
    //    .css-bg-color-bin-draft{    }
    //    .css-bg-color-user-entry{    }

    //<li style="background:#00bfc6"><a href="#"><img style="margin-top: -5px;" src="SVG/current-published-icon.svg"></img></a></li>
    //<li style="background:#bcd1e6"><a href="#"><img style="margin-top: -5px;" src="SVG/previously-published-icon.svg"></img></a></li>
    //<li style="background:#ed6b62"><a href="#"><img style="margin-top: -5px;" src="SVG/current-draft-icon.svg"></img></a></li>
    //<li style="background:#f4a754"><a href="#"><img style="margin-top: -5px;" src="SVG/saved-draft-icon.svg"></img></a></li>
    //<li style="background:#b3b3b3"><a href="#"><img style="margin-top: -5px;" src="SVG/recycle-bin-icon.svg"></img></a></li>
    //<li style="background:#eaeaea"><a href="#"><img style="margin-top: -5px;" src="SVG/trash-icon.svg"></img></a></li>

    $scope.icons = [
        {
            value:  'Search for published entries',
            bg:     'css-bg-color-current-published',
            label:  '<span class="css-bg-color-current-published">' +
                    '<span class="css-icon-current-published-icon mdb-searchbar-icon" title="Search for published entries">' +
                        '<span class="path1"></span><span class="path2"></span><span class="path3"></span>' +
                    '</span></span>'
        },
        {
            value:  'Search for previously published entries',
            bg:     'css-bg-color-previously-published',
            label:  '<span class="css-bg-color-previously-published" style="height: 22px">' +
                        '<span class="css-icon-previously-published-icon mdb-searchbar-icon" title="Search for published entries">' +
                        '<span class="path1"></span><span class="path2"></span><span class="path3"></span></span>' +
                    '</span>'},
        {
            value:  'Search for draft entries',
            bg:     'css-bg-color-current-draft',
            label:  '<span class="css-bg-color-current-draft" style="height: 22px">' +
                        '<span class="css-icon-current-draft-icon mdb-searchbar-icon" style="height: 22px" title="Search for draft entries">' +
                        '<span class="path1"></span><span class="path2"></span></span>'+
                    '</span>'},
        {
            value:  'Search All',
            bg:     'css-bg-color-current-published',
            label:  '<i class="fa fa-globe" title="Search for all entries"></i>'}
    ];
    $scope.selectedIcon = "Search for published entries";
    $scope.selectedOption = {};
    $scope.selectedOption.versionType = '';

    $scope.selected = {};


    ///////////////////////////////////////////////////////////////////////////
    //WsService
    ///////////////////////////////////////////////////////////////////////////

    $scope.WsService = WsService;

    // websocket check
    $scope.ws_connected = WsService.isConnected();

    $scope.$watch(WsService.isConnected, function () {
        $scope.ws_connected = WsService.isConnected();
        console.info("WsService.isConnected() " + $scope.ws_connected);
    });
    // Alternative: über Broadcast
    /*$scope.ws_connected = false;

     $rootScope.$on('WsServiceConnection', function(event, args) {
     $scope.ws_connected = args.connected;
     });*/


    $scope.MY_DUMMY_SPECIMEN_0000000001 = {};
    $scope.gotoMyMDB = function (formname, form, key, value) {
        if (!value) {
            value = " "
        }
        var key_data = [];

        angular.forEach(form, function (value, key) {
            if (typeof value === 'object' && value.hasOwnProperty('$modelValue')) {

                if (value.$name == 'SC_BASIC_0000000629' || value.$name == 'SC_BASIC_0000000836') { // except password
                    // TODO: A long time ago in a galaxy far far away, we may change this workflow and send the password to websocket.
                    if (value.$modelValue) {
                        key_data.push({'localID': value.$name, 'value': 'buffalo'});
                    }
                    else {
                        key_data.push({'localID': value.$name, 'value': ''});
                    }

                }
                else { //
                    if (value.$modelValue) {
                        key_data.push({'localID': value.$name, 'value': value.$modelValue});
                    }
                    else {
                        key_data.push({'localID': value.$name, 'value': ''});
                    }

                }
            }
        });

        WsService.sendCheckInputToWebsocket(formname, key, value, key_data, $scope.currentUEID, null);
    };


    // Login & Register
    ////////////////////////////////////////////////////////////////////////////

    $scope.mdbAuthPanel = AuthService.getAuthPanel();
    $scope.$on('AuthPanel_updated', function () {
        $scope.mdbAuthPanel = AuthService.getAuthPanel();
    });

    $scope.logout = function () {

        // TODO: workaround until logout button is designed by ontology
        WsService.sendCheckInputToWebsocket("MY_DUMMY_LOGOUT_0000000001", "SC_BASIC_0000000136", null, null, $scope.currentUEID, null);

        //console.log(AuthService.getUserStatus());

        // call logout from service
        /*AuthService.sendLogoutMessaggeToWS()
         .then(function () {
         //$location.path('/');
         $scope.loggedIn = AuthService.isLoggedIn();
         $scope.currentUser = AuthService.getUsername();
         $scope.userStatus = AuthService.getUserStatus();

         });*/
    };

    $rootScope.$on('WSLoginFeedbackMessage', function (event, args) {
        if (args.validation_status == "true") {
            $scope.authMenueStatus.isopen = false;
        }
    });

    /***
     socket_message: message,
     validation_ref: message.localID,
     validation_status: message.data[0]["SC_BASIC_0000000136"].valid,
     validation_message: "Logout successful!",
     mdbueid: message.mdbueid
     connectSID: message.connectSID,
     load_page: message.load_page
     */
    $rootScope.$on('WSLogoutFeedbackMessage', function (event, args) {
        if (args.validation_status == "true") {
            $scope.authMenueStatus.isopen = false;
        }
    });


    // Notification Menu
    ///////////////////////////////////////////////////////////////////////////

    $scope.notificationMenuOpen = false;
    $scope.storedNotifications = [];
    $scope.toggleNotificationMenu = function() {
        $scope.storedNotifications = JSON.parse(localStorage.getItem("stored_logs") || "[]");

        $scope.notificationMenuOpen = !$scope.notificationMenuOpen
    };

    ////TODO///TEST//SANDRA////////////////////////////////////////
    $scope.AlertService = AlertService;

    $scope.alerts = AlertService.alerts;

    $scope.closeAlert = AlertService.closeAlert;

    //$scope.stopClose =  AlertService.stopClose;
    //$scope.leaveAlert = AlertService.leaveAlert;

    // MDB Overlay
    ///////////////////////////////////////////////////////////////////////////

    $scope.mdbCreateBtnSubmitting = false;

    // stop loading button on incoming overlay composition
    $scope.$on('MDBOverlayComposition_updated', function (event, args) {
        /*if ($rootScope.developers.indexOf(AuthService.getUsername()) > -1){
            console.log("mdbPage on MDBOverlayComposition_updated\nevent - " + event + "\nargs - " + JSON.stringify(args))
        }*/

        $scope.mdbBtnID = "#" + args.mdbOverlay.localID;

        if(angular.element($scope.mdbBtnID).length){
            angular.element($scope.mdbBtnID).button('reset');
        }

        $scope.createMenueStatus.isopen = false;
    });

    // submitCreate("MY_DUMMY_DESCRIPTION_0000000001", forms.mdbCreate, "SC_MDB_BASIC_0000000659")
    $scope.submitCreate = function (mdbformid, form, button_localID) {

        // set overlay request buttons to "submitting"
        $scope.mdbBtnID = "#" + button_localID;
        angular.element($scope.mdbBtnID).button('loading');

        // disable all buttons for a certain time
        $scope.mdbCreateBtnSubmitting = true;
        $timeout(function () {
            $scope.mdbCreateBtnSubmitting = false;
        }, 3000);

        // submit overlay request
        $scope.submit(mdbformid, form, button_localID);
    };

    ///////////////////////////////////////////////////////////////////////////
    //MDBDocumentService & Loading spinner
    ///////////////////////////////////////////////////////////////////////////

    $scope.MDBDocumentService = MDBDocumentService;
    $scope.submit = MDBDocumentService.submit;

    // loading check
    $scope.doc_loading = MDBDocumentService.docLoading;

    $rootScope.$on('MDBDocumentService_doc_loading_update', function(event, args) {
        $scope.doc_loading = args.doc_loading;
    });

    // Search overlay: Load Entry list in Background. Todo: It's not a good idea to have teh ist in every page (performance)

    //$scope.showMDBEntryList = WsService.sendShowEntryListToWebsocket;
    //$scope.showMDBEntryList("all");

});

MDBControllers.controller('UserCtrl', function ($scope, $rootScope, $log, $http, $location, AuthService, $cookies) {
// initial values for Auth and Cookies
    $scope.loggedIn = AuthService.isLoggedIn();
    $scope.currentUser = AuthService.getUsername();
    $scope.userStatus = AuthService.getUserStatus();
    $scope.cookies = $cookies.getAll();

    // listen for authentication events
    $scope.$watch(AuthService.isLoggedIn, function () {
        $scope.loggedIn = AuthService.isLoggedIn();
        $scope.currentUser = AuthService.getUsername();
        $scope.userStatus = AuthService.getUserStatus();
    });

    // listen for cookie events
    $scope.$watch($cookies.getAll, function () {
        $scope.cookies = $cookies.getAll();
    });
});

MDBControllers.controller('NewSpecimenEntryModalInstanceCtrl', function ($scope, $rootScope, $log, $http, $location, $uibModalInstance, params) {

    $scope.ok = function () {
        $uibModalInstance.close('this is result for close');
        $location.path('/entries');
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('this is result for dismiss');
    };

    // function to submit the form after all validation has occurred
    $scope.submitEntry = function () {
        // check to make sure the form is completely valid
        if ($scope.newSForm.$valid) {
            //alert('our form is amazing');
        }

        $uibModalInstance.$dismiss
            .then(function () {
                $location.path('/entries')
            });
    };

    //number of new specimen
    $scope.amountOfnewSpec = "1";
    $scope.newSpecimenEntryObject = {};
    /*$scope.taxon = [];
     $scope.taxonWithLink = [];

     $http.get('../data/namesWithLink.json')
     .success(function (data) {
     $scope.taxonWithLink = data;
     })
     .error(function (data) {
     alert("catch data - WnamesWithlink- " + data);
     })
     .catch(function (data) {
     alert("error data - NamesWithlink- " + data);
     });*/

    // close-others (Default: true) - Control whether expanding an item will cause the other items to close.
    $scope.oneAtATime = false;

    $scope.status = {
        isOpen: new Array($scope.panels.length),
        isFirstOpen: true,
        isFirstDisabled: false
    };

    for (var i = 0; i < $scope.status.isOpen.length; i++) {
        $scope.status.isOpen[i] = (i === 0);
    }

    $scope.$watch('newSpecimenEntryObject.determination.resource', function () {

        if ($scope.newSpecimenEntryObject.determination.resource) {
            $scope.temp = $scope.newSpecimenEntryObject.determination.classification.replace(/ /g, '_').replace(/-/g, '_').replace(/\(|\)|\.|\'|\[|\]/g, '').replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue');
            $scope.today = new Date();
            $scope.today = $scope.today.getFullYear() + ('0' + ($scope.today.getMonth() + 1)).slice(-2) + ('0' + $scope.today.getDate()).slice(-2);
            $scope.newSpecimenEntryObject.specimenid = "S_" + $scope.temp + "_" + $scope.today;
            $scope.panels[1].content[0].disabled = false;
            $scope.panels[1].content[2].disabled = false;
            $scope.todaydate = new Date();
            $scope.todaydate = ('0' + $scope.todaydate.getDate()).slice(-2) + '.' + ('0' + ($scope.todaydate.getMonth() + 1)).slice(-2) + '.' + $scope.todaydate.getFullYear();
            $scope.newSpecimenEntryObject.createdOn = $scope.todaydate;
            $scope.newSpecimenEntryObject.updatedOn = $scope.todaydate;
            //SpecimenEntryService.setNewSpecimenEntryPanels($scope.panels);
        }
        else {
            $scope.newSpecimenEntryObject.specimenid = "";
            $scope.newSpecimenEntryObject.amountofindividuals = "";
            $scope.panels[1].content[0].disabled = true;
            $scope.panels[1].content[2].disabled = true;
            //SpecimenEntryService.setNewSpecimenEntryPanels($scope.panels);
        }
    });

    $scope.entryChanged = function () {
        if ($scope.newSpecimenEntryObject.determination.resource) {
            //alert("$scope.s_entry_determination.$valid: " + s_entry_determination.$valid);
        }
        else {
        }
        if ($scope.s_entry_determination.$valid) {
            //alert("$scope.s_entry_determination.$valid");
        }
        else {
            //alert("$scope.s_entry_determination.$invalid");
        }
    };

    $scope.submitButton = {
        label: 'Create',
        isDisabled: true
    };

});

MDBControllers.controller('EntriesCtrl', function ($scope, $rootScope, $log, $http, $location, uiGmapGoogleMapApi, uiGmapIsReady, NotificationService, $sce) {

    $scope.forms = {};
    //$scope.entryTabs = SpecimenEntryService.generalEntryTabs;
    //$scope.specimenEntry = SpecimenEntryService.specimenEntry;
    //$scope.panels = SpecimenEntryService.specimenEntryPanels;
    //$scope.specimenTabs = SpecimenEntryService.specimenEntryTabs;
    /*$scope.taxon = [];
     $scope.taxonWithLink = [];*/
    $scope.newSpecimenEntryObject = {};
    // close-others (Default: true) - Control whether expanding an item will cause the other items to close.
    $scope.oneAtATime = false;

    $scope.status = {
        isOpen: new Array($scope.panels.length),
        isFirstOpen: true,
        isFirstDisabled: false
    };

    for (var i = 0; i < $scope.status.isOpen.length; i++) {
        $scope.status.isOpen[i] = (i === 0);
    }

    //$scope.$watch(SpecimenEntryService.getSpecimenEntry, function () {
        //$scope.specimenEntry = SpecimenEntryService.getSpecimenEntry();
    //});

    //$scope.$watch(SpecimenEntryService.getSpecimenEntryPanels, function () {
        //$scope.panels = SpecimenEntryService.getSpecimenEntryPanels();
    //});

    /*  $http.get('../data/namesWithLink.json')
     .success(function (data) {
     $scope.taxonWithLink = data;
     })
     .error(function (data) {
     alert("catch data - namesWithlink- " + data);
     })
     .catch(function (data) {
     alert("error data - namesWithlink- " + data);
     });*/

    $scope.$watch('forms.SpecimenDetailsForm.determination.$modelValue.resource', function () {
        if ($scope.forms.SpecimenDetailsForm.determination.$modelValue.resource) {
            $scope.specimenEntry.determination.resource = $scope.forms.SpecimenDetailsForm.determination.$modelValue.resource;
            $scope.specimenEntry.determination.classification = $scope.forms.SpecimenDetailsForm.determination.$modelValue.classification;
            $scope.temp = $scope.specimenEntry.determination.classification.replace(/ /g, '_').replace(/-/g, '_').replace(/\(|\)|\.|\'|\[|\]/g, '').replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue');
            $scope.today = new Date();
            $scope.today = $scope.today.getFullYear() + ('0' + ($scope.today.getMonth() + 1)).slice(-2) + ('0' + $scope.today.getDate()).slice(-2);
            $scope.specimenEntry.specimenid = "S_" + $scope.temp + "_" + $scope.today;
            $scope.panels[1].content[0].disabled = false;
            $scope.panels[1].content[2].disabled = false;
            $scope.todaydate = new Date();
            $scope.todaydate = ('0' + $scope.todaydate.getDate()).slice(-2) + '.' + ('0' + ($scope.todaydate.getMonth() + 1)).slice(-2) + '.' + $scope.todaydate.getFullYear();
            $scope.specimenEntry.createdOn = $scope.todaydate;
            $scope.specimenEntry.updatedOn = $scope.todaydate;
        }
        else {
            $scope.specimenEntry.specimenid = "";
            $scope.specimenEntry.amountofindividuals = "";
            $scope.panels[1].content[0].disabled = true;
            $scope.panels[1].content[2].disabled = true;
        }
        //SpecimenEntryService.setNewSpecimenEntryPanels($scope.panels);
        //if ($scope.forms.SpecimenDetailsForm.$valid) {
        //    SpecimenEntryService.setSpecimenEntry($scope.specimenEntry);
        //}
    });


    $scope.entryChanged = function (form) {
        if (form.determination.$modelValue.resource) {
            $scope.temp = form.determination.$modelValue.classification.replace(/ /g, '_').replace(/-/g, '_').replace(/\(|\)|\.|\'|\[|\]/g, '').replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue');
            $scope.today = new Date();
            $scope.today = $scope.today.getFullYear() + ('0' + ($scope.today.getMonth() + 1)).slice(-2) + ('0' + $scope.today.getDate()).slice(-2);
            $scope.specimenEntry.specimenid = "S_" + $scope.temp + "_" + $scope.today;
            $scope.panels[1].content[0].disabled = false;
            $scope.panels[1].content[2].disabled = false;
            $scope.todaydate = new Date();
            $scope.todaydate = ('0' + $scope.todaydate.getDate()).slice(-2) + '.' + ('0' + ($scope.todaydate.getMonth() + 1)).slice(-2) + '.' + $scope.todaydate.getFullYear();
            $scope.specimenEntry.updatedOn = $scope.todaydate;
            //SpecimenEntryService.setSpecimenEntryPanels($scope.panels);
        }
        else {
            $scope.specimenEntry.specimenid = "";
            $scope.specimenEntry.amountofindividuals = "";
            $scope.panels[1].content[0].disabled = true;
            $scope.panels[1].content[2].disabled = true;
            //SpecimenEntryService.setSpecimenEntryPanels($scope.panels);
        }

        if (form.$valid) {
            $scope.specimenEntry.specimenid = form.specimenid.$viewValue;
            $scope.specimenEntry.determination.classification = form.determination.$modelValue.classification;
            $scope.specimenEntry.determination.resource = form.determination.$modelValue.resource;
            $scope.specimenEntry.amountofindividuals = form.amountofindividuals.$viewValue;
            $scope.specimenEntry.decimalLatitude = form.decimalLatitude.$viewValue;
            $scope.specimenEntry.decimalLongitude = form.decimalLongitude.$viewValue;
            //SpecimenEntryService.setSpecimenEntry($scope.specimenEntry);
            $scope.addMarker($scope.specimenEntry.decimalLatitude, $scope.specimenEntry.decimalLongitude);
        }
    };

    <!-- 150817 - Angular UI Google Maps -->
    // Do stuff with your $scope.
    // Note: Some of the directives require at least something to be defined originally!
    // e.g. $scope.markers = []

    // uiGmapGoogleMapApi is a promise.
    // The "then" callback function provides the google.maps object.
    uiGmapGoogleMapApi.then(function (maps) {
        $scope.googlemap = {};
        $scope.map = {
            center: {
                latitude: 20.0000,
                longitude: 10.0000
            },
            zoom: 1,
            pan: 1,
            options: $scope.mapOptions,
            control: {},
            events: {
                tilesloaded: function (maps, eventName, args) {
                },
                dragend: function (maps, eventName, args) {
                },
                zoom_changed: function (maps, eventName, args) {
                }
            }
        };
    });

    $scope.windowOptions = {
        show: false
    };

    $scope.onClick = function (data) {
        $scope.windowOptions.show = !$scope.windowOptions.show;
        console.log('$scope.windowOptions.show: ', $scope.windowOptions.show);
        console.log('This is a ' + data);
        //alert('This is a ' + data);
    };

    $scope.closeClick = function () {
        $scope.windowOptions.show = false;
    };

    $scope.title = "Window Title!";

    uiGmapIsReady.promise() // if no value is put in promise() it defaults to promise(1)
        .then(function (instances) {
            console.log(instances[0].map); // get the current map
        })
        .then(function () {
            $scope.addMarkerClickFunction($scope.markers);
        });

    $scope.addMarkerClickFunction = function (markersArray) {
        angular.forEach(markersArray, function (value, key) {
            value.onClick = function () {
                $scope.onClick(value.data);
                $scope.MapOptions.markers.selected = value;
            };
        });
    };

    $scope.MapOptions = {
        minZoom: 1,//3,
        zoomControl: false,
        draggable: true,
        navigationControl: false,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        disableDoubleClickZoom: false,
        keyboardShortcuts: true,
        markers: {
            selected: {}
        },
        styles: [{
            featureType: "poi",
            elementType: "labels",
            stylers: [{
                visibility: "off"
            }]
        }, {
            featureType: "transit",
            elementType: "all",
            stylers: [{
                visibility: "off"
            }]
        }]
    };

    $scope.markers = [];

    $scope.addMarker = function (lat, long) {
        $scope.markers = [
            {
                id: 0,
                coords: {
                    latitude: lat,
                    longitude: long
                },
                data: 'Location',
                desc: 'This is the best place in the world!'
            }];
    };
});

MDBControllers.controller('MessagesCtrl', function ($scope, $rootScope, $log, $http, $location, AuthService, NotificationService, $cookies) {
    // initial values for Auth and Cookies
    $scope.loggedIn = AuthService.isLoggedIn();
    $scope.currentUser = AuthService.getUsername();
    $scope.userStatus = AuthService.getUserStatus();
    $scope.cookies = $cookies.getAll();

    // listen for authentication events
    $scope.$watch(AuthService.isLoggedIn, function () {
        $scope.loggedIn = AuthService.isLoggedIn();
        $scope.currentUser = AuthService.getUsername();
        $scope.userStatus = AuthService.getUserStatus();
    });

    // listen for cookie events
    $scope.$watch($cookies.getAll, function () {
        $scope.cookies = $cookies.getAll();
    });

});

MDBControllers.controller('UsergroupsCtrl', function ($scope, $rootScope, $log, $http, $location, AuthService, NotificationService, $cookies, WsService, $uibModal, MDBDocumentService) {
    // initial values for Auth and Cookies
    $scope.loggedIn = AuthService.isLoggedIn();
    $scope.currentUser = AuthService.getUsername();
    $scope.userStatus = AuthService.getUserStatus();
    $scope.cookies = $cookies.getAll();

    // listen for authentication events
    $scope.$watch(AuthService.isLoggedIn, function () {
        $scope.loggedIn = AuthService.isLoggedIn();
        $scope.currentUser = AuthService.getUsername();
        $scope.userStatus = AuthService.getUserStatus();
    });

    // listen for cookie events
    $scope.$watch($cookies.getAll, function () {
        $scope.cookies = $cookies.getAll();
    });


    ///////////////////////////////////////////////////////////////////////////
    //Entry modal
    ///////////////////////////////////////////////////////////////////////////

    $scope.mdbentrymodal = '';
    $scope.title = '';
    $scope.localID = '';

    $scope.showModalElement = function (element) {
        angular.element(element).modal('show');
    };

    $rootScope.$on('WSMDBOverlayCompositionMessage', function (event, args) {
        $scope.mdbentrymodal = args.socket_message;
        $scope.title = "STATIC: Create new MDB entry";
        $scope.showModalElement("#mdbEntryModal");
    });


    ///////////////////////////////////////////////////////////////////////////
    //WsService
    ///////////////////////////////////////////////////////////////////////////

    $scope.WsService = WsService;

    $scope.MY_DUMMY_SPECIMEN_0000000001 = {};

    $scope.submit = MDBDocumentService.submit;


});

MDBControllers.controller('WebsocketCtrl', function ($scope, $rootScope, $log, $http, $location, AuthService, NotificationService, $cookies, WsService) {
    // initial values for Auth and Cookies
    $scope.loggedIn = AuthService.isLoggedIn();
    $scope.currentUser = AuthService.getUsername();
    $scope.userStatus = AuthService.getUserStatus();
    $scope.cookies = $cookies.getAll();

    // listen for authentication events
    $scope.$watch(AuthService.isLoggedIn, function () {
        $scope.loggedIn = AuthService.isLoggedIn();
        $scope.currentUser = AuthService.getUsername();
        $scope.userStatus = AuthService.getUserStatus();
    });

    // listen for cookie events
    $scope.$watch($cookies.getAll, function () {
        $scope.cookies = $cookies.getAll();
    });


    ///////////////////////////////////////////////////////////////////////////
    //WsService
    ///////////////////////////////////////////////////////////////////////////

    $scope.WsService = WsService;

    $scope.query = {};
    $scope.query.sparql = "Please fill in query or select default query.";
    $scope.query.format = "JSONLD";
    $scope.query.output = "";

    $scope.setSparql = function (querystring) {
        $scope.query.sparql = querystring;
    };

    $scope.sendSparql = function () {
        $scope.query.output = "";
        $scope.query.time = "";
        $scope.WsService.sendSparqlToWebsocket($scope.query.sparql);
    };

    $scope.sendSparqlToAdmin = function () {
        $scope.query.output = "";
        $scope.query.time = "";
        $scope.WsService.sendSparqlToAdminWebsocket($scope.query.sparql);
    };

    $scope.sendSparqlToOntology = function () {
        $scope.query.output = "";
        $scope.query.time = "";
        $scope.WsService.sendSparqlToOntologyWebsocket($scope.query.sparql);
    };

    $scope.sendSparqlToDraft = function () {
        $scope.query.output = "";
        $scope.query.time = "";
        $scope.WsService.sendSparqlToDraftWebsocket($scope.query.sparql);
    };

    $scope.sendSparqlToPublish = function () {
        $scope.query.output = "";
        $scope.query.time = "";
        $scope.WsService.sendSparqlToPublishWebsocket($scope.query.sparql);
    };

    $scope.sendSparqlToExOntologies = function () {
        $scope.query.output = "";
        $scope.query.time = "";
        $scope.WsService.sendSparqlToExOntologiesWebsocket($scope.query.sparql);
    };

    $scope.sendQuery = function () {
        $scope.query.output = "";
        $scope.query.time = "";
        $scope.WsService.sendToWebsocket(JSON.parse($scope.query.sparql));
    };

    $scope.sendGenerateDocRequest = function (doc) {

        if (doc == "login") {
            $scope.WsService.sendGenerateDocToWebsocket('SC_BASIC_0000001206');
        }
        if (doc == "register") {
            $scope.WsService.sendGenerateDocToWebsocket('SC_BASIC_0000001156');
        }
    };

});

MDBControllers.controller('FormtestCtrl', function ($scope, $rootScope, $log, $http, $location, AuthService, NotificationService, $cookies, WsService) {
    // initial values for Auth and Cookies
    $scope.loggedIn = AuthService.isLoggedIn();
    $scope.currentUser = AuthService.getUsername();
    $scope.userStatus = AuthService.getUserStatus();
    $scope.cookies = $cookies.getAll();

    // listen for authentication events
    $scope.$watch(AuthService.isLoggedIn, function () {
        $scope.loggedIn = AuthService.isLoggedIn();
        $scope.currentUser = AuthService.getUsername();
        $scope.userStatus = AuthService.getUserStatus();
    });

    // listen for cookie events
    $scope.$watch($cookies.getAll, function () {
        $scope.cookies = $cookies.getAll();
    });

    $scope.logs = {};
    $scope.logs.logtext = null;
    $scope.log = function(){
        $log.log($scope.logs.logtext);
        $log.warn($scope.logs.logtext);
        $log.info($scope.logs.logtext);
        $log.error($scope.logs.logtext);
        $log.debug($scope.logs.logtext);
    };

    $("#toggle").click(function () {
        $("#toggle").effect("shake", {times: 4, distance: 6}, 700);
    });

    ///////////////////////////////////////////////////////////////////////////
    //WsService
    ///////////////////////////////////////////////////////////////////////////

    $scope.WsService = WsService;

    ////////////////////////////////////////////////////////////////////////////
    // Login & Register
    ////////////////////////////////////////////////////////////////////////////
    $scope.forms = {};
    $scope.forms.mdbForm = {};

    $scope.mdbAuthPanel = AuthService.getAuthPanel();

    $scope.$on('AuthPanel_updated', function () {
        $scope.mdbAuthPanel = AuthService.getAuthPanel();
    });


    ///////////////////////////////////////////////////////////////////////////
    //MDBUEID Test
    ///////////////////////////////////////////////////////////////////////////

    $scope.mdbueid = {};
    $scope.mdbueid.test = '2d5fefe1';

    $scope.generateMDBUEID = function () {
        AuthService.generateMDBUEID($scope.mdbueid.test);
    };

    $scope.sendGenerateDocRequest = function (doc) {

        if (doc == "login") {
            $scope.WsService.sendGenerateDocToWebsocket('SC_BASIC_0000001206');
        }
        if (doc == "register") {
            $scope.WsService.sendGenerateDocToWebsocket('SC_BASIC_0000001156');
        }
    };

    // REMOVE from DB
    $scope.remove = {};
    $scope.find = {};
    $scope.getUserByUEIDFromDB = AuthService.getUserByUEIDFromDB;
    $scope.getUserInfoByUEIDFromDB = AuthService.getUserInfoByUEIDFromDB;
    $scope.getUserInfoByUsernameFromDB = AuthService.getUserInfoByUsernameFromDB;
    $scope.removeUserByUEIDFromDB = AuthService.getUserInfoByUEIDFromDB; //AuthService.removeUserByUEIDFromDB;
    $scope.removeUserByUsernameFromDB = AuthService.getUserInfoByUsernameFromDB; //AuthService.removeUserByUsernameFromDB;
});

MDBControllers.controller('UiCtrl', function ($scope, $rootScope, $log, $http, $location, AuthService, NotificationService, $cookies, WsService) {
    // initial values for Auth and Cookies
    $scope.loggedIn = AuthService.isLoggedIn();
    $scope.currentUser = AuthService.getUsername();
    $scope.userStatus = AuthService.getUserStatus();
    $scope.cookies = $cookies.getAll();

    // listen for authentication events
    $scope.$watch(AuthService.isLoggedIn, function () {
        $scope.loggedIn = AuthService.isLoggedIn();
        $scope.currentUser = AuthService.getUsername();
        $scope.userStatus = AuthService.getUserStatus();
    });

    // listen for cookie events
    $scope.$watch($cookies.getAll, function () {
        $scope.cookies = $cookies.getAll();
    });

    ///////////////////////////////////////////////////////////////////////////
    //WsService
    ///////////////////////////////////////////////////////////////////////////

    $scope.WsService = WsService;

    ///////////////////////////////////////////////////////////////////////////
    //UI Layout
    ///////////////////////////////////////////////////////////////////////////

    // TODO: hier fehlt noch Steuerung für das ui-layout, oder?
    // Testweise:
    $scope.layout = {
        links: true,
        rechts: false
    };

});

MDBControllers.controller('AnnotationCtrl', function ($scope, $rootScope, $log, $http, $location, AuthService, NotificationService, $cookies, WsService) {
    // initial values for Auth and Cookies
    $scope.loggedIn = AuthService.isLoggedIn();
    $scope.currentUser = AuthService.getUsername();
    $scope.userStatus = AuthService.getUserStatus();
    $scope.cookies = $cookies.getAll();

    // listen for authentication events
    $scope.$watch(AuthService.isLoggedIn, function () {
        $scope.loggedIn = AuthService.isLoggedIn();
        $scope.currentUser = AuthService.getUsername();
        $scope.userStatus = AuthService.getUserStatus();
    });

    // listen for cookie events
    $scope.$watch($cookies.getAll, function () {
        $scope.cookies = $cookies.getAll();
    });

    ///////////////////////////////////////////////////////////////////////////
    //WsService
    ///////////////////////////////////////////////////////////////////////////

    $scope.WsService = WsService;

    //Annotation
    $scope.filterOptions = {
        filters: [
            {
                label: 'Quote',
                property: 'quote'
            }
        ]
    };


    /*$scope.annotationForm.text = "Cats are similar in anatomy to other felids.";*/
    /*$scope.text = "Cats are similar.";*/

});

MDBControllers.controller('MorphDescriptionCtrl', function ($scope, $rootScope, $log, $http, $location, AuthService, NotificationService, $cookies, WsService, $compile, $timeout, uiGridConstants, $interval) {
    // initial values for Auth and Cookies
    $scope.loggedIn = AuthService.isLoggedIn();
    $scope.currentUser = AuthService.getUsername();
    $scope.userStatus = AuthService.getUserStatus();
    $scope.cookies = $cookies.getAll();

    // listen for authentication events
    $scope.$watch(AuthService.isLoggedIn, function () {
        $scope.loggedIn = AuthService.isLoggedIn();
        $scope.currentUser = AuthService.getUsername();
        $scope.userStatus = AuthService.getUserStatus();
    });

    // listen for cookie events
    $scope.$watch($cookies.getAll, function () {
        $scope.cookies = $cookies.getAll();
    });

    ///////////////////////////////////////////////////////////////////////////
    // WsService
    ///////////////////////////////////////////////////////////////////////////

    $scope.WsService = WsService;

    $scope.annotationForm = {};
    $scope.annotationForm.text = "Cats are similar in anatomy to other felids.";
    $scope.annotationForm.modaltext = "";
    $scope.annotationForm.ontologies = ""; //"MP,CL,BOF,OPB,SPD,TAXRANK,UO,UNITSONT,VHOG,VSAO,VTO,VT";
    $scope.annotationForm.include_views = true;
    $scope.annotationForm.display_context = false;
    $scope.annotationForm.include = "prefLabel,synonym,definition,notation,cui,semanticType,properties";
    $scope.annotationForm.longest_only = false;
    $scope.annotationForm.exclude_numbers = false;
    $scope.annotationForm.whole_word_only = true;
    $scope.annotationForm.exclude_synonyms = false;
    $scope.annotationForm.expand_class_hierarchy = false;
    $scope.annotationForm.class_hierarchy_max_level = "1";
    $scope.annotationForm.format = "json";

    // Is this code used?
    $scope.setTestValues = function () {
        $scope.tags = [{"value": "CARO", "name": "Common Anatomy Reference Ontology (CARO)"}, {
            "value": "MP",
            "name": "Mammalian Phenotype Ontology (MP)"
        }, {"value": "CL", "name": "Cell Ontology (CL)"}, {
            "value": "BOF",
            "name": "Biodiversity Ontology (BOF)"
        }, {"value": "OPB", "name": "Ontology of Physics for Biology (OPB)"}, {
            "value": "SPD",
            "name": "Spider Ontology (SPD)"
        }, {"value": "TAXRANK", "name": "Taxonomic Rank Vocabulary (TAXRANK)"}, {
            "value": "UO",
            "name": "Units of Measurement Ontology (UO)"
        }, {"value": "UNITSONT", "name": "Units Ontology (UNITSONT)"}, {
            "value": "VHOG",
            "name": "Vertebrate Homologous Organ Group Ontology (VHOG)"
        }, {"value": "VSAO", "name": "Vertebrate Skeletal Anatomy Ontology (VSAO)"}, {
            "value": "VTO",
            "name": "Vertebrate Taxonomy Ontology (VTO)"
        }, {"value": "VT", "name": "Vertebrate Trait Ontology (VT)"}];
        $scope.annotationForm.text = "The head in most insects is enclosed in a hard, heavily sclerotized, exoskeletal head capsule, or epicranium. The main exception is in those species whose larvae are not fully sclerotised, mainly some holometabola; but even most unsclerotised or weakly sclerotised larvae tend to have well sclerotised epicrania, for example the larvae of Coleoptera and Hymenoptera. The larvae of Cyclorrhapha however, tend to have hardly any head capsule at all.";
    };

    $scope.clearValues = function () {
        $scope.tags = [];
        $scope.setDefaultValues();
        $scope.annotationForm.text = "";
    };

    $scope.setDefaultValues = function () {
        $scope.tags = [];
        $scope.annotationForm.text = "Cats are similar in anatomy to other felids.";
        $scope.annotationForm.modaltext = "";
        $scope.annotationForm.ontologies = ""; //"MP,CL,BOF,OPB,SPD,TAXRANK,UO,UNITSONT,VHOG,VSAO,VTO,VT";
        $scope.annotationForm.include_views = true;
        $scope.annotationForm.display_context = false;
        $scope.annotationForm.include = "prefLabel,synonym,definition,notation,cui,semanticType,properties";
        $scope.annotationForm.longest_only = false;
        $scope.annotationForm.exclude_numbers = false;
        $scope.annotationForm.whole_word_only = true;
        $scope.annotationForm.exclude_synonyms = false;
        $scope.annotationForm.expand_class_hierarchy = false;
        $scope.annotationForm.class_hierarchy_max_level = "1";
        $scope.annotationForm.format = "json";
    };

    ///////////////////////////////////////////////////////////////////////////
    // ONTOLOGY TAGS
    ///////////////////////////////////////////////////////////////////////////

    $scope.tags = [];

    $scope.loadOntologyTags = function ($query) {
        return $http.get('../data/ontologies.json', {cache: true}).then(function (response) {
            var ontology_tags = response.data;
            return ontology_tags.filter(function (ontologytag) {
                return ontologytag.value.toLowerCase().indexOf($query.toLowerCase()) != -1;
            });
        });
    };

    ///////////////////////////////////////////////////////////////////////////
    // CHECK FOR ANNOTATIONS
    ///////////////////////////////////////////////////////////////////////////

    $scope.checkAnnotations = function () {
        var url = "https://data.bioontology.org/annotator?apikey=8b5b7825-538d-40e0-9e9e-5ab9274a9aeb";
        $scope.annotationForm.ontologies = "";
        angular.forEach($scope.tags, function (value, key) {
            if ($scope.annotationForm.ontologies == "") {
                $scope.annotationForm.ontologies = value.value;
            }
            else {
                $scope.annotationForm.ontologies = $scope.annotationForm.ontologies + "," + value.value;
            }
        });
        var parameters = $scope.annotationForm;
        var config = {
            params: parameters
        };

        $http.get(url, config)
            .then(
            function (response) {
                // success callback
                $scope.annotationForm.modaltext = $scope.annotationForm.text;
                $scope.autoannotations = [];
                $scope.htmlids = {};

                angular.forEach(response.data, function (value, key) {
                    var prefLabel = value.annotatedClass.prefLabel;
                    var annoDetails = value;
                    //alert("annotatedClass - " + JSON.stringify(value.annotatedClass.prefLabel) + "\nannotations - " + JSON.stringify(value.annotations));
                    angular.forEach(value.annotations, function (value, key) {
                        //alert("prefLabel - " + prefLabel + "\nvalue - " + JSON.stringify(value));
                        //$scope.highlightAutomaticAnnotatedText(value.from-1, value.to);
                        $scope.autoannotations.push({
                            "from": value.from,
                            "to": value.to,
                            "htmlid": "ID" + value.from + "TO" + value.to,
                            "matchType": value.matchType,
                            "text": value.text,
                            "prefLabel": prefLabel,
                            "id": annoDetails.annotatedClass["@id"],
                            "ontology": annoDetails.annotatedClass.links.ontology,
                            "type": annoDetails.annotatedClass["@type"],
                            "definition": annoDetails.annotatedClass.definition
                        });
                        //$scope.autoannotations.annotation.details.push(annoDetails);
                    });


                });

                // sort Annotations according to occurrence
                $scope.autoannotations = _.sortBy($scope.autoannotations, "from");
                //$scope.autoannotations.sortOn("from");

                // save text in not highlighted version
                $scope.unhighlightedText = $scope.annotationForm.text;

                // fill annotation data to grid data
                $scope.gridOptions.data = $scope.autoannotations;
            },
            function (response) {
                // failure call back
                //alert("buuuh - " + JSON.stringify(response));
            }
        )
            .then(function () {
                // open modal
                $('#mdbAnnoSelectionModal').modal('show');
                //necessary for grid to draw correctly
                $timeout(function () {
                    $scope.gridApi.core.handleWindowResize();

                }, 250);
            });

    };

    Array.prototype.sortOn = function (key) {
        this.sort(function (a, b) {
            if (a[key] < b[key]) {
                return -1;
            } else if (a[key] > b[key]) {
                return 1;
            }
            return 0;
        });
    };

    Array.prototype.unique = function () {
        var r = [];
        o:for (var i = 0, n = this.length; i < n; i++) {
            for (var x = 0, y = r.length; x < y; x++) {
                if (r[x].from == this[i].from) {
                    //alert('this is a DUPE!');
                    continue o;
                }
            }
            r[r.length] = this[i];
        }
        return r;
    };

    Array.prototype.isAnnoListUnique = function () {
        // unique list
        var uniques = [];
        // duplicates
        var dupes = [];
        o:for (var i = 0, n = this.length; i < n; i++) {
            for (var x = 0, y = uniques.length; x < y; x++) {
                if (uniques[x].from == this[i].from) {
                    dupes.push(this[i]);
                    //alert('this is a DUPE!');
                    continue o;
                }
            }
            uniques[uniques.length] = this[i];
        }
        return dupes;
    };

    ///////////////////////////////////////////////////////////////////////////
    // UI GRID
    ///////////////////////////////////////////////////////////////////////////

    $scope.lastSelectedRow = {};
    $scope.info = {};

    $scope.gridOptions = {
        enableRowSelection: true,
        enableSelectAll: true,
        enableGridMenu: true,
        selectionRowHeaderWidth: 35,
        rowHeight: 35,
        showGridFooter: true,
        multiSelect: true
    };

    $scope.gridOptions.columnDefs = [
        //{name: 'from', displayName: 'From', width: '70'}
        //,{name: 'to', displayName: 'To', width: '70'}
        //,
        {name: 'text', displayName: 'Annotated Text', width: '200'}
        , {
            name: 'id',
            displayName: 'Annotated Class',
            width: '200',
            cellTemplate: '<div class="ui-grid-cell-contents"><a href="{{COL_FIELD}}">{{row.entity.prefLabel}}</a></div>'
        }
        , {name: 'ontology', displayName: 'Ontology'}
        //,{ name: 'type', displayName: 'Type'}
        //,{ name: 'definition', displayName: 'Definition'}
    ];

    $scope.toggleMultiSelect = function () {
        $scope.gridApi.selection.setMultiSelect(!$scope.gridApi.grid.options.multiSelect);
    };

    $scope.toggleModifierKeysToMultiSelect = function () {
        $scope.gridApi.selection.setModifierKeysToMultiSelect(!$scope.gridApi.grid.options.modifierKeysToMultiSelect);
    };

    $scope.selectAll = function () {
        $scope.gridApi.selection.selectAllRows();
    };

    $scope.clearAll = function () {
        $scope.gridApi.selection.clearSelectedRows();
    };

    $scope.toggleRow1 = function () {
        $scope.gridApi.selection.toggleRowSelection($scope.gridOptions.data[0]);
    };

    $scope.toggleFullRowSelection = function () {
        $scope.gridOptions.enableFullRowSelection = !$scope.gridOptions.enableFullRowSelection;
        $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.OPTIONS);
    };

    $scope.setSelectable = function () {
        $scope.gridApi.selection.clearSelectedRows();

        $scope.gridOptions.isRowSelectable = function (row) {
            if (row.entity.age > 30) {
                return false;
            } else {
                return true;
            }
        };
        $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.OPTIONS);

        $scope.gridOptions.data[0].age = 31;
        $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.EDIT);
    };

    $scope.gridOptions.onRegisterApi = function (gridApi) {
        //set gridApi on scope
        $scope.gridApi = gridApi;
        gridApi.selection.on.rowSelectionChanged($scope, function (row) {
            var msg = 'row selected ' + row.isSelected;
            $log.log(msg);

            if (row.isSelected) {
                //"from": value.from,
                //"to": value.to,
                //"matchType": value.matchType,
                //"text": value.text,
                //"prefLabel": prefLabel,
                //"id": annoDetails.annotatedClass["@id"],
                //"ontology": annoDetails.annotatedClass.links.ontology,
                //"type": annoDetails.annotatedClass["@type"],
                //"definition": annoDetails.annotatedClass.definition
                $scope.highlightAnnotatedText(row.entity.from - 1, row.entity.to);
                $scope.lastSelectedRow = row.entity;
                if (!row.entity.definition)
                    $scope.lastSelectedRow.definition = "";
            }
            else {
                $scope.modaldivtextarea.html($scope.annotationForm.text);
            }

        });

        gridApi.selection.on.rowSelectionChangedBatch($scope, function (rows) {
            var msg = 'rows changed ' + rows.length;
            $log.log(msg);
        });
        // below mentioned code resolve my issue(window resizer issue)
        $interval(function () {
            $scope.gridApi.core.handleWindowResize();
        }, 10, 500);
    };

    $scope.refreshGrid = function () {
        $scope.gridApi.core.handleWindowResize();
    };

    $scope.saveAnnotations = function () {
        $scope.currentSelection = $scope.gridApi.selection.getSelectedRows();

        var unique = $scope.currentSelection.isAnnoListUnique();

        if (unique.length > 0) {
            //alert("There are text passages with more than one annotation, please choose only one for each.");
            //alert("unique.length - " + unique.length + "\nunique - " + JSON.stringify(unique));
        }
        else {
            angular.forEach($scope.currentSelection, function (value, key) {
                //alert("annotatedClass - " + JSON.stringify(value));
                /*
                 annotatedClass - {
                 "from":11,
                 "to":17,
                 "matchType":"SYN",
                 "text":"MAMMALS",
                 "prefLabel":"Mammalia",
                 "id":"http://purl.obolibrary.org/obo/NCBITaxon_40674",
                 "ontology":"https://data.bioontology.org/ontologies/CL",
                 "type":"http://www.w3.org/2002/07/owl#Class",
                 "$$hashKey":"uiGrid-000N"
                 }
                 */
                var currentAnnotation = {
                    "permissions": {
                        "read": [],
                        "update": [],
                        "delete": [],
                        "admin": []
                    },
                    "user": $scope.currentUser,
                    "ranges": [
                        {
                            "start": "/div[1]",
                            "startOffset": value.from,
                            "end": "/div[1]",
                            "endOffset": value.to
                        }
                    ],
                    "quote": value.text,
                    "highlights": [{}],
                    "text": value.prefLabel + ",\n" + value.id + ",\n" + value.ontology,
                    "tags": []
                };

                $rootScope.$emit('CreateNewAnnotationMessage', {
                    new_annotation: currentAnnotation,
                    anno_position: currentAnnotation.ranges[0].startOffset
                });

                /*
                 $rootScope.$on('CreateNewAnnotationMessage', function (event, args) {
                 //new_annotation: currentAnnotation,
                 //anno_position: currentAnnotation.ranges[0].startOffset
                 setupAnnotation(currentAnnotation);
                 });*/
            });

            // close modal
            $('#mdbAnnoSelectionModal').modal('hide');
            alert("Thank you.");
        }
    };

    ///////////////////////////////////////////////////////////////////////////
    // HIGHLIGHTER
    ///////////////////////////////////////////////////////////////////////////

    /*
     var content = "";
     var index = 0;
     var word = 'str';

     $scope.replacer = function(match, offset, str){
     console.log('replacer in=',offset);
     if (0>offset) {
     return;
     }
     index = offset + match.length;
     console.log("new index=", index, ",match=",match);
     return "<span class='highlightedText'>"+match+"</span>";
     };

     $scope.setOffset = function(i) {
     index = 0;
     };

     $scope.setContent = function(s) {
     content = s;
     };

     $scope.search = function(str) {
     word = !!str ? str : word;
     var regex = new RegExp(word);
     var sub1 = content.substring(0, index);
     var sub2 = content.substring(index);
     sub2 = sub2.replace(regex, $scope.replacer);
     return sub1 + sub2;
     };

     var div = angular.element(document.getElementById('content'));


     $scope.searchFirst=function(str){
     $scope.setOffset(0);
     $scope.setContent(div.text());
     div.html($scope.search(str));
     };

     $scope.nextSearch=function(){
     div.html($scope.search());
     };

     $scope.preSearch=function(){
     // you implement
     };
     */

    $scope.content = "";
    $scope.word = 'str';

    $scope.divtextarea = angular.element(document.getElementById('divtextarea'));
    $scope.modaldivtextarea = angular.element(document.getElementById('modaldivtextarea'));

    $scope.highlightAnnotatedText = function (from, to) {
        $scope.content = $scope.modaldivtextarea.text();

        $scope.sub1 = $scope.content.substring(0, from);
        $scope.sub2 = $scope.content.substring(from, to);
        $scope.sub3 = $scope.content.substring(to);

        $scope.word = !!$scope.sub2 ? $scope.sub2 : $scope.word;
        $scope.sub2 = "<span class='highlightedText'>" + $scope.sub2 + "</span>";

        $scope.subsubsub = $scope.sub1 + $scope.sub2 + $scope.sub3;

        $scope.modaldivtextarea.html($scope.subsubsub);
    };


    ///////////////////////////////////////////////////////////////////////////
    // ANNOTATOR JS
    ///////////////////////////////////////////////////////////////////////////

    //var annotatorA = angular.element(element).annotator(options).data('annotator');
    //angular.element(document.querySelector('[ng-app]')).injector().get("WsService").sendAnnotationToWebsocket(anno);
    //var annotatorB = Annotator._instances[0];
    //var appinjector = angular.element(document.querySelector("[ng-app]")).injector();
    //var annot1 = document.getElementById(Annotator);
    //var annot2 = document.getElementById("Annotator");
    //var annot4 = document.getElementsByClassName(Annotator);

    var annnn = new Annotator();

    var a = "dsffsdf";
    //var annotatorC = angular.element(document.querySelector('[ng-app]')).injector().get("Annotator");

    //annotatorB.setupAnnotation({text: "My tooltip text to display", ranges: [range]});
});

MDBControllers.controller('ImageAnnotationCtrl', function ($scope, $rootScope, $log, $http, $location, $cookies, AuthService, NotificationService, $uibModal, WsService, $window) {
    // initial values for Auth and Cookies
    $scope.loggedIn = AuthService.isLoggedIn();
    $scope.currentUser = AuthService.getUsername();
    $scope.userStatus = AuthService.getUserStatus();
    //$scope.cookies = $cookies.getAll();

    // listen for authentication events
    $scope.$watch(AuthService.isLoggedIn, function () {
        $scope.loggedIn = AuthService.isLoggedIn();
        $scope.currentUser = AuthService.getUsername();
        $scope.userStatus = AuthService.getUserStatus();
    });

    // listen for cookie events
    $scope.$watch($cookies.getAll, function () {
        $scope.cookies = $cookies.getAll();
    });

    //$window.location.reload();



});

MDBControllers.controller('TextAnnotationCtrl', function ($scope, $rootScope, $log, $http, $location, AuthService, NotificationService, $cookies, WsService, $compile, $timeout, uiGridConstants, $interval) {
    // initial values for Auth and Cookies
    $scope.loggedIn = AuthService.isLoggedIn();
    $scope.currentUser = AuthService.getUsername();
    $scope.userStatus = AuthService.getUserStatus();
    $scope.cookies = $cookies.getAll();

    // listen for authentication events
    $scope.$watch(AuthService.isLoggedIn, function () {
        $scope.loggedIn = AuthService.isLoggedIn();
        $scope.currentUser = AuthService.getUsername();
        $scope.userStatus = AuthService.getUserStatus();
    });

    // listen for cookie events
    $scope.$watch($cookies.getAll, function () {
        $scope.cookies = $cookies.getAll();
    });

    ///////////////////////////////////////////////////////////////////////////
    // WsService
    ///////////////////////////////////////////////////////////////////////////

    $scope.WsService = WsService;

    $scope.annotationForm = {};
    $scope.annotationForm.text = "";
    $scope.annotationForm.ontologies = "";
    $scope.annotationForm.include_views = true;
    $scope.annotationForm.display_context = false;
    $scope.annotationForm.include = "prefLabel,synonym,definition,notation,cui,semanticType,properties";
    $scope.annotationForm.longest_only = false;
    $scope.annotationForm.exclude_numbers = false;
    $scope.annotationForm.whole_word_only = true;
    $scope.annotationForm.exclude_synonyms = false;
    $scope.annotationForm.expand_class_hierarchy = false;
    $scope.annotationForm.class_hierarchy_max_level = "1";
    $scope.annotationForm.format = "json";

    $scope.divtextarea = angular.element(document.getElementById('divtextarea'));
    $scope.loadingButton = angular.element(document.getElementById('annotationLoadingButton'));


    ///////////////////////////////////////////////////////////////////////////
    // ONTOLOGY TAGS
    ///////////////////////////////////////////////////////////////////////////

    $scope.ontologytags = [];

    $scope.loadOntologyTags = function ($query) {
        return $http.get('../data/ontologies.json', {cache: true}).then(function (response) {
            var ontology_tags = response.data;
            return ontology_tags.filter(function (ontologytag) {
                return ontologytag.value.toLowerCase().indexOf($query.toLowerCase()) != -1;
            });
        });
    };

    $scope.setTestValues = function () {
        $scope.ontologytags = [
            {
                "value": "MESH",
                "name": "Medical Subject Headings (MESH)"
            },{
                "value": "CARO",
                "name": "Common Anatomy Reference Ontology (CARO)"
            },{
                "value": "MP",
                "name": "Mammalian Phenotype Ontology (MP)"
            }, {
                "value": "CL",
                "name": "Cell Ontology (CL)"
            }, {
                "value": "BOF",
                "name": "Biodiversity Ontology (BOF)"
            }, {
                "value": "TAXRANK",
                "name": "Taxonomic Rank Vocabulary (TAXRANK)"
            },{
                "value": "VTO",
                "name": "Vertebrate Taxonomy Ontology (VTO)"
            }];
        $scope.divtextarea.text("Birds and mammals are both warm-blooded animals with separate sexes determined by genetics, spinal cords, four-chambered hearts, four limbs and well-developed bony skeletons. Both groups, birds and mammals, include species that can fly and those that cannot, and both groups include species that lay eggs.");
    };

    $scope.setDefault = function () {
        $scope.clearValues();
        $scope.annotationForm.whole_word_only = true;
        $scope.annotationForm.include = "prefLabel,synonym,definition,notation,cui,semanticType,properties";
    };

    $scope.clearValues = function () {
        $scope.ontologytags = [];
        $scope.divtextarea.text("");
        $scope.annotationForm.ontologies = "";
        $scope.annotationForm.include_views = true;
        $scope.annotationForm.display_context = false;
        $scope.annotationForm.include = "";
        $scope.annotationForm.longest_only = false;
        $scope.annotationForm.exclude_numbers = false;
        $scope.annotationForm.whole_word_only = false;
        $scope.annotationForm.exclude_synonyms = false;
        $scope.annotationForm.expand_class_hierarchy = false;
        $scope.annotationForm.class_hierarchy_max_level = "1";
        $scope.annotationForm.format = "json";
    };

    $scope.setTestText = function () {
        $scope.ontologytags = [
            {
                "value": "MESH",
                "name": "Medical Subject Headings (MESH)"
            },{
                "value": "CARO",
                "name": "Common Anatomy Reference Ontology (CARO)"
            },{
                "value": "MP",
                "name": "Mammalian Phenotype Ontology (MP)"
            }, {
                "value": "CL",
                "name": "Cell Ontology (CL)"
            }, {
                "value": "BOF",
                "name": "Biodiversity Ontology (BOF)"
            }, {
                "value": "TAXRANK",
                "name": "Taxonomic Rank Vocabulary (TAXRANK)"
            },{
                "value": "VTO",
                "name": "Vertebrate Taxonomy Ontology (VTO)"
            }];
        $scope.divtextarea.html('Cell division is a cellular process.');
    };

    $scope.setTestHTML = function () {
        $scope.divtextarea.html('Cell division is a <span id="ID20TO35" class="annotatedText"><span id="ID20TO27" class="annotatedText">cellular</span> <span id="ID29TO35" class="annotatedText">process</span></span>');
    };


    ///////////////////////////////////////////////////////////////////////////
    // CHECK FOR ANNOTATIONS
    ///////////////////////////////////////////////////////////////////////////

    $scope.checkAnnotations = function () {
        var url = "https://data.bioontology.org/annotator?apikey=8b5b7825-538d-40e0-9e9e-5ab9274a9aeb";
        var parameters = $scope.annotationForm;
        parameters.text = $scope.divtextarea.text();
        parameters.text = parameters.text.replace(/<[^>]*>?/g, '');
        $scope.divtextarea.text(parameters.text);
        $scope.config = {
            params: parameters
        };
        angular.forEach($scope.ontologytags, function (value, key) {
            if ($scope.annotationForm.ontologies == "") {
                $scope.annotationForm.ontologies = value.value;
            }
            else {
                $scope.annotationForm.ontologies = $scope.annotationForm.ontologies + "," + value.value;
            }
        });
        // empty grid data
        $scope.gridOptions.data = [];
        $scope.loadingButton.button('loading');

        $scope.content = "";
        $scope.word = 'str';

        $http.get(url, $scope.config)
            .then(
            function (response) {
                // success callback

                if (response.data.length == 0){
                    alert("Sorry, no matches found.");
                    // stop loading button
                    $scope.loadingButton.button('reset');
                }
                else {

                    $scope.autoannotations = [];
                    $scope.distinctannotationlist = [];
                    $scope.distinctannotationrangeslist = [];
                    $scope.overlappingrangeslist = [];

                    // index
                    var i = 0;
                    // for each annotation
                    angular.forEach(response.data, function (value, key) {
                        var prefLabel = value.annotatedClass.prefLabel;
                        var annoDetails = value;

                        // for each range per annotation
                        angular.forEach(value.annotations, function (value, key) {

                            /////----- extract annotation data and send to grid -----/////
                            var rangeID = "ID" + value.from + "TO" + value.to;
                            var details = "";
                            if (!(annoDetails.annotatedClass.definition == null)) {
                                details = annoDetails.annotatedClass.definition[0];
                            }
                            var ont = annoDetails.annotatedClass.links.ontology;
                            var ontsplit = ont.split("/");
                            var ontabbr = ontsplit[ontsplit.length - 1];
                            $scope.autoannotations.push({
                                "temp_id": i,
                                "from": value.from,
                                "to": value.to,
                                "range_id": rangeID,
                                "matchType": value.matchType,
                                "text": value.text,
                                "quote": value.text,
                                "prefLabel": prefLabel,
                                "class_id": annoDetails.annotatedClass["@id"],
                                "ontology": annoDetails.annotatedClass.links.ontology,
                                "ontologyname": ontabbr,
                                "type": annoDetails.annotatedClass["@type"],
                                "definition": details,
                                "details": annoDetails
                            });

                            i = i + 1;

                            ///// extract distinct ranges //////////////
                            if (!(_.includes($scope.distinctannotationrangeslist, rangeID))) {
                                $scope.distinctannotationrangeslist.push(rangeID);
                                $scope.distinctannotationlist.push({
                                    "from": value.from,
                                    "to": value.to,
                                    "html_id": rangeID,
                                    "quote": value.text
                                });
                            }

                        });

                    });

                    // sort annotation data according to occurrence a-z
                    $scope.autoannotations = _.sortBy($scope.autoannotations, "from");
                    // fill annotation data to grid data
                    $scope.gridOptions.data = $scope.autoannotations;
                    // stop loading button
                    $scope.loadingButton.button('reset');

                    // sort Annotation list "to" a-z, "from" z-a
                    $scope.distinctannotationlist.sort(function (x, y) { return x.to - y.to || y.from - x.from; });
                    // reverse list
                    $scope.distinctannotationlist = $scope.distinctannotationlist.reverse();

                    angular.forEach($scope.distinctannotationlist, function (value, key) {

                        if ($scope.overlappingrangeslist.indexOf(value.html_id) <= -1){
                            $scope.content = $scope.divtextarea.html();
                            $scope.content = $scope.content.replace(/&nbsp;/gi," ");

                            $scope.sub1 = $scope.content.substring(0, value.from - 1);
                            $scope.sub2 = $scope.content.substring(value.from - 1, value.to);
                            $scope.sub3 = $scope.content.substring(value.to);

                            //alert("$scope.sub " + value.from + " " + value.to + " " + value.html_id + " " + value.quote +  "\n" + $scope.sub1 + "\n text - " + $scope.sub2 + "\n" + $scope.sub3);

                            if ($scope.sub2.indexOf(" ") > -1) {
                                $scope.wordlist = $scope.sub2.split(" ");
                                $scope.wordstart = value.from;
                                $scope.subsubArray = [];
                                $scope.subsub2 = "";

                                angular.forEach($scope.wordlist, function (word, key) {
                                    var from = $scope.wordstart;
                                    var to = parseInt($scope.wordstart) + parseInt(word.length) -1;
                                    var tempid = "ID" + from + "TO" + to;
                                    //alert("word: " + word  + "\nword.length: " + word.length + "\nword.from: " + from + "\nword.to: " + to);
                                    $scope.subsubArray.push('<span id="' + tempid + '" class="annotatedText">' + word + '</span>');
                                    $scope.wordstart = to + 2;
                                    $scope.overlappingrangeslist.push(tempid);
                                });

                                angular.forEach($scope.subsubArray, function (span, key) {

                                    if ($scope.subsub2.length == 0){
                                        $scope.subsub2 =  span;
                                    }
                                    else{
                                        $scope.subsub2 =  $scope.subsub2 + " " + span;
                                    }
                                });

                                $scope.sub2 = $scope.subsub2;
                            }

                            $scope.word = !!$scope.sub2 ? $scope.sub2 : $scope.word;
                            $scope.sub2 = "<span id='" + value.html_id + "' class='annotatedText'>" + $scope.sub2 + "</span>";
                            $scope.overlappingrangeslist.push(value.html_id);

                            $scope.subsubsub = $scope.sub1 + $scope.sub2 + $scope.sub3;

                            $scope.divtextarea.html($scope.subsubsub);
                        }
                        else {
                            //alert("$scope.overlappingrangeslist " + JSON.stringify($scope.overlappingrangeslist));
                        }
                    });

                }
            },
            function (response) {
                // failure call back
                alert("Sorry, something went wrong. Please reload page and try again."); // : " + response.data.errors[0]);

                // stop loading button
                $scope.loadingButton.button('reset');
            }
        )
            .then(function () {
                //necessary for grid to draw correctly
                $timeout(function () {
                    $scope.gridApi.core.handleWindowResize();
                }, 250);
            });

    };

    ///////////////////////////////////////////////////////////////////////////
    // UI GRID
    ///////////////////////////////////////////////////////////////////////////

    $scope.lastSelectedRow = {};
    $scope.info = {};

    $scope.gridOptions = {
        enableRowSelection: true,
        enableFullRowSelection: true,
        enableSelectAll: false,
        enableGridMenu: true,
        selectionRowHeaderWidth: 0,
        rowHeight: 30,
        showGridFooter: false,
        multiSelect: false,
        showGroupPanel: true,
        enableCellSelection: true,
        enablePaging: true,
        columnDefs: [
            {
                name: 'text',
                displayName: 'Annotated Text',
                //width: '200',
                enableColumnResizing: true
            }
            , {
                name: 'class_id',
                displayName: 'Annotated Class',
                //width: '200',
                enableColumnResizing: true,
                cellTemplate: '<div class="ui-grid-cell-contents"><a href="{{COL_FIELD}}" target="_blank">{{row.entity.prefLabel}}</a></div>'
            }, {
                name: 'ontologyname',
                displayName: 'Ontology',
                //width: '200',
                enableColumnResizing: true,
                cellTemplate: '<div class="ui-grid-cell-contents"><a href="{{row.entity.ontology}}" target="_blank">{{COL_FIELD}}</a></div>'
            }
        ]
    };

    $scope.gridOptions.onRegisterApi = function (gridApi) {
        //set gridApi on scope
        $scope.gridApi = gridApi;
        gridApi.selection.on.rowSelectionChanged($scope, function (row) {
            var msg = 'row selected ' + row.isSelected;
            $log.log(msg);

            if (row.isSelected) {
                //"temp_id": i,
                //"from": value.from,
                //"to": value.to,
                //"range_id": rangeID,
                //"matchType": value.matchType,
                //"text": value.text,
                //"quote": value.text,
                //"prefLabel": prefLabel,
                //"class_id": annoDetails.annotatedClass["@id"],
                //"ontology": annoDetails.annotatedClass.links.ontology,
                //"type": annoDetails.annotatedClass["@type"],
                //"definition": annoDetails.annotatedClass.definition[0],
                //"details": annoDetails
                if ($scope.lastSelectedRow) {
                    angular.element(document.getElementById($scope.lastSelectedRow.range_id)).removeClass('highlightedText');
                }
                angular.element(document.getElementById(row.entity.range_id)).addClass('highlightedText');
                $scope.lastSelectedRow = row.entity;
                //if (!row.entity.definition)
                //    $scope.lastSelectedRow.definition = "";
            }
            else {
                angular.element(document.getElementById(row.entity.range_id)).removeClass('highlightedText');
            }

        });
    };

});

MDBControllers.controller('PartonomyAnnotationCtrl', function ($scope, $rootScope, $log, $http, $location, AuthService, NotificationService, $cookies, $timeout, WsService) {
    // initial values for Auth and Cookies
    $scope.loggedIn = AuthService.isLoggedIn();
    $scope.currentUser = AuthService.getUsername();
    $scope.userStatus = AuthService.getUserStatus();
    $scope.cookies = $cookies.getAll();

    // listen for authentication events
    $scope.$watch(AuthService.isLoggedIn, function () {
        $scope.loggedIn = AuthService.isLoggedIn();
        $scope.currentUser = AuthService.getUsername();
        $scope.userStatus = AuthService.getUserStatus();
    });

    // listen for cookie events
    $scope.$watch($cookies.getAll, function () {
        $scope.cookies = $cookies.getAll();
    });

    ///////////////////////////////////////////////////////////////////////////
    //WsService
    ///////////////////////////////////////////////////////////////////////////

    $scope.WsService = WsService;


    ///////////////////////////////////////////////////////////////////////////
    //Tree Functions
    ///////////////////////////////////////////////////////////////////////////

    /*$scope.data = [
        {
            'id': 1,
            'title': 'Head',
            'nodes': [
                {
                    'id': 11,
                    'title': 'left ear',
                    'nodes': [
                        {
                            'id': 111,
                            'title': 'fur',
                            'nodes': [
                                {
                                    'id': 1111,
                                    'title': 'dorsal awns ',
                                    'nodes': []
                                }
                            ]
                        }
                    ]
                },
                {
                    'id': 12,
                    'title': 'right ear',
                    'nodes': []
                }
            ]
        }, {
            'id': 2,
            'title': 'legs',
            'nodrop': true, // An arbitrary property to check in custom template for nodrop-enabled
            'nodes': [
                {
                    'id': 21,
                    'title': 'fore legs',
                    'nodes': [{
                        'id': 211,
                        'title': 'femur',
                        'nodes': []
                    }, {
                        'id': 212,
                        'title': 'tibia',
                        'nodes': []
                    },]
                },
                {
                    'id': 22,
                    'title': 'hind legs',
                    'nodes': []
                }
            ]
        }, {
            'id': 3,
            'title': 'tail',
            'nodes': [
                {
                    'id': 31,
                    'title': 'fur',
                    'nodes': []
                }
            ]
        }
    ];*/


    $scope.data = [
        {
            "localId": 12342342423,
            "title": "multicellular organism",
            "is_not": false,
            "instance_of": "multicellular organism",
            "definition": "Anatomical structure that is an individual member of a species and consists of more than one cell.",
            "obo_id":"UBERON:0000468",
            "URI": "http://purl.obolibrary.org/obo/UBERON_0000468",
            "ontology": "Uberon multi-species anatomy ontology",
            "obo_namespace": "UBERON",
            "quality": "3D",
            "text_annotation":[{
                "text": "",
                "html": "",
                "autoannotations": [],
                "ontologytags":  []
            }],
            "image_annotation": [{
                "image": "",
                "annotations": []
            }],
            "nodes": [
                {
                    "localId": 12342342341,
                    "title": "head",
                    "is_not": false,
                    "instance_of": "head",
                    "definition": "The head is the anterior-most division of the body [GO].",
                    "obo_id":"UBERON:0000033",
                    "URI": "http://purl.obolibrary.org/obo/UBERON_0000033",
                    "ontology": "Uberon multi-species anatomy ontology",
                    "obo_namespace": "UBERON",
                    "quality": "3D",
                    "text_annotation":[{
                        "text": "",
                        "html": "",
                        "autoannotations": [],
                        "ontologytags":  []
                    }],
                    "image_annotation": [{
                        "image": "",
                        "annotations": []
                    }],
                    "nodes": [
                        {
                            "localId": 112342342342341,
                            "title": "left antenna",
                            "is_not": false,
                            "instance_of": "antenna",
                            "definition": "The appendage that is composed of ringlike sclerites and the anatomical structures encircled by these sclerites and that is articulated with the cranium.",
                            "obo_id":"HAO:0000101",
                            "URI": "http://purl.obolibrary.org/obo/HAO_0000101",
                            "ontology": "Hymenoptera Anatomy Ontology Portal",
                            "obo_namespace": "HAO",
                            "quality": "3D",
                            "text_annotation":[{
                                "text": "",
                                "html": "",
                                "autoannotations": [],
                                "ontologytags":  []
                            }],
                            "image_annotation": [{
                                "image": "",
                                "annotations": []
                            }],
                            "nodes": []
                        },
                        {
                            "localId": 112342324342342321,
                            "title": "right antenna",
                            "is_not": false,
                            "instance_of": "antenna",
                            "definition": "The appendage that is composed of ringlike sclerites and the anatomical structures encircled by these sclerites and that is articulated with the cranium.",
                            "obo_id":"HAO:0000101",
                            "URI": "http://purl.obolibrary.org/obo/HAO_0000101",
                            "ontology": "Hymenoptera Anatomy Ontology Portal",
                            "obo_namespace": "HAO",
                            "quality": "3D",
                            "text_annotation":[{
                                "text": "",
                                "html": "",
                                "autoannotations": [],
                                "ontologytags":  []
                            }],
                            "image_annotation": [{
                                "image": "",
                                "annotations": []
                            }],
                            "nodes": []
                        }
                    ]
                },
                {
                    "localId": 114332423545252,
                    "title": "thorax",
                    "is_not": false,
                    "instance_of": "thorax",
                    "definition": "The tagma that is composed of the prothorax, mesothorax and metathorax.",
                    "obo_id":"HAO:0001015",
                    "URI": "http://purl.obolibrary.org/obo/HAO_0001015",
                    "ontology": "Hymenoptera Anatomy Ontology Portal",
                    "obo_namespace": "HAO",
                    "quality": "3D",
                    "text_annotation":[{
                        "text": "",
                        "html": "",
                        "autoannotations": [],
                        "ontologytags":  []
                    }],
                    "image_annotation": [{
                        "image": "",
                        "annotations": []
                    }],
                    "nodes": []
                },
                {
                    "localId": 1753684584657843,
                    "title": "abdomen",
                    "is_not": true,
                    "instance_of": "abdomen",
                    "definition": "The tagma that is located posterior to the thorax.",
                    "obo_id":"HAO:0000015",
                    "URI": "http://purl.obolibrary.org/obo/HAO_0000015",
                    "ontology": "Hymenoptera Anatomy Ontology Portal",
                    "obo_namespace": "HAO",
                    "quality": "3D",
                    "text_annotation":[{
                        "text": "",
                        "html": "",
                        "autoannotations": [],
                        "ontologytags":  []
                    }],
                    "image_annotation": [{
                        "image": "",
                        "annotations": []
                    }],
                    "nodes": []
                }
            ]
        }
    ];

    $scope.remove = function (scope) {
        scope.remove();
    };

    $scope.toggle = function (scope) {
        scope.toggle();
    };

    $scope.moveLastToTheBeginning = function () {
        var a = $scope.data.pop();
        $scope.data.splice(0, 0, a);
    };


    $scope.collapseAll = function () {
        $scope.$broadcast('angular-ui-tree:collapse-all');
    };

    $scope.expandAll = function () {
        $scope.$broadcast('angular-ui-tree:expand-all');
    };

    $scope.visible = function (item) {
        return !($scope.query && $scope.query.length > 0
        && item.title.indexOf($scope.query) == -1);

    };

    $scope.selectedItemID = $scope.data[0].localId;
    $scope.selectedItem = $scope.data[0];
    $scope.selectedNode = $scope.data[0];

    $scope.setSelectedItem = function (scope, item) {
        $log.info("selected Item: " + JSON.stringify(item));

        // update text for text annotation of former selectedItem
        $scope.updateTextAnnotation(scope, $scope.selectedNode);

        $scope.selectedItem = item;
        $scope.selectedItemID = item.localId;
        $scope.selectedNode = scope.$modelValue;

        // destroy and reload olsketchtool
        window._reloadTool();

        return !($scope.selectedItem);
    };

    //$scope.setSelectedItem($scope.data[0]);

    $scope.newSubItem = function (scope) {
        var nodeData = scope.$modelValue;
        nodeData.nodes.push({
            id: nodeData.localId * 10 + nodeData.nodes.length,
            title: nodeData.title + ' part ' + (nodeData.nodes.length + 1),
            instance_of: nodeData.instance_of,
            definition: '',
            obo_id: nodeData.obo_id,
            URI: nodeData.URI,
            ontology: nodeData.ontology,
            obo_namespace: nodeData.obo_namespace,
            nodes: []
        });
    };

    $scope.update = function (item) {
        var tree = this.tree;
        var name = item.name;
        var dataItem = tree.dataItem(tree.select());
        dataItem.title = undefined; // force refresh of dataItem
        dataItem.set("title", name);
    };

    $scope.updateInstance = function (item) {
        var tree = this.tree;
        var instance = item.instance_of;
        var dataItem = tree.dataItem(tree.select());
        dataItem.instance_of = undefined; // force refresh of dataItem
        dataItem.set("instance_of", instance);
    };

    $scope.updateNamespace = function (item) {
        var tree = this.tree;
        var obonamespace = item.obo_namespace;
        var dataItem = tree.dataItem(tree.select());
        dataItem.obo_namespace = undefined; // force refresh of dataItem
        dataItem.set("obo_namespace", obonamespace);
    };

    $scope.updateTextAnnotation = function (scope, node) {

        var formerNodeData = node;
        var newNodeData = scope.$modelValue;

        formerNodeData.text_annotation[0].html = angular.element(document.getElementById('divtextarea')).html();
        formerNodeData.text_annotation[0].autoannotations = $scope.selectedItem.text_annotation[0].autoannotations;
        formerNodeData.text_annotation[0].ontologytags = $scope.ontologytags;

        // clear former preferences
        $scope.setDefault();
        angular.element(document.getElementById('divtextarea')).empty();

        var html = newNodeData.text_annotation[0].html;
        var text = newNodeData.text_annotation[0].text;

        if(html.length > 0){
            angular.element(document.getElementById('divtextarea')).html(html);
        }
        else if (text.length > 0){
            angular.element(document.getElementById('divtextarea')).text(text);
        }
        // fill annotation data to grid data
        $scope.gridOptions.data = newNodeData.text_annotation[0].autoannotations;
        $scope.ontologytags = newNodeData.text_annotation[0].ontologytags;
    };

    // formal description panels
    $scope.panelstatus = {
        isOpen: {
            formal_des_haspart: true,
            formal_des_measurement: true,
            formal_des_shapecolor: true,
            image_tools: true,
            image_help: false
        },
        isFirstOpen: true,
        isFirstDisabled: false
    };

    $scope.updateText = function (node) {
        console.warn("update Text: " + node + "\n" + JSON.stringify(node));

        /*"annotationFormText": "",*/
    };

    // text annotation
    $scope.annotationForm = {};
    $scope.annotationForm.ontologies = "";
    $scope.annotationForm.include_views = true;
    $scope.annotationForm.display_context = false;
    $scope.annotationForm.include = "prefLabel,synonym,definition,notation,cui,semanticType,properties";
    $scope.annotationForm.longest_only = false;
    $scope.annotationForm.exclude_numbers = false;
    $scope.annotationForm.whole_word_only = true;
    $scope.annotationForm.exclude_synonyms = false;
    $scope.annotationForm.expand_class_hierarchy = false;
    $scope.annotationForm.class_hierarchy_max_level = "1";
    $scope.annotationForm.format = "json";

    $scope.divtextarea = angular.element(document.getElementById('divtextarea'));
    $scope.loadingButton = angular.element(document.getElementById('annotationLoadingButton'));

    ///////////////////////////////////////////////////////////////////////////
    // ONTOLOGY TAGS
    ///////////////////////////////////////////////////////////////////////////

    $scope.ontologytags = [];

    $scope.loadOntologyTags = function ($query) {
        return $http.get('../data/ontologies.json', {cache: true}).then(function (response) {
            var ontology_tags = response.data;
            return ontology_tags.filter(function (ontologytag) {
                return ontologytag.value.toLowerCase().indexOf($query.toLowerCase()) != -1;
            });
        });
    };

    $scope.setTestValues = function () {
        $scope.ontologytags = [
            {
                "value": "MESH",
                "name": "Medical Subject Headings (MESH)"
            },{
                "value": "CARO",
                "name": "Common Anatomy Reference Ontology (CARO)"
            },{
                "value": "MP",
                "name": "Mammalian Phenotype Ontology (MP)"
            }, {
                "value": "CL",
                "name": "Cell Ontology (CL)"
            }, {
                "value": "BOF",
                "name": "Biodiversity Ontology (BOF)"
            }, {
                "value": "TAXRANK",
                "name": "Taxonomic Rank Vocabulary (TAXRANK)"
            },{
                "value": "VTO",
                "name": "Vertebrate Taxonomy Ontology (VTO)"
            }];
        angular.element(document.getElementById('divtextarea')).text("Birds and mammals are both warm-blooded animals with separate sexes determined by genetics, spinal cords, four-chambered hearts, four limbs and well-developed bony skeletons. Both groups, birds and mammals, include species that can fly and those that cannot, and both groups include species that lay eggs.");
    };

    $scope.setDefault = function () {
        $scope.clearValues();
        $scope.annotationForm.whole_word_only = true;
        $scope.annotationForm.include = "prefLabel,synonym,definition,notation,cui,semanticType,properties";
    };

    $scope.clearValues = function () {
        $scope.ontologytags = [];
        angular.element(document.getElementById('divtextarea')).text("");
        $scope.annotationForm.ontologies = "";
        $scope.annotationForm.include_views = true;
        $scope.annotationForm.display_context = false;
        $scope.annotationForm.include = "";
        $scope.annotationForm.longest_only = false;
        $scope.annotationForm.exclude_numbers = false;
        $scope.annotationForm.whole_word_only = false;
        $scope.annotationForm.exclude_synonyms = false;
        $scope.annotationForm.expand_class_hierarchy = false;
        $scope.annotationForm.class_hierarchy_max_level = "1";
        $scope.annotationForm.format = "json";
    };

    $scope.setTestText = function () {
        $scope.ontologytags = [
            {
                "value": "MESH",
                "name": "Medical Subject Headings (MESH)"
            },{
                "value": "CARO",
                "name": "Common Anatomy Reference Ontology (CARO)"
            },{
                "value": "MP",
                "name": "Mammalian Phenotype Ontology (MP)"
            }, {
                "value": "CL",
                "name": "Cell Ontology (CL)"
            }, {
                "value": "BOF",
                "name": "Biodiversity Ontology (BOF)"
            }, {
                "value": "TAXRANK",
                "name": "Taxonomic Rank Vocabulary (TAXRANK)"
            },{
                "value": "VTO",
                "name": "Vertebrate Taxonomy Ontology (VTO)"
            }];
        angular.element(document.getElementById('divtextarea')).html('Cell division is a cellular process.');
    };

    $scope.setTestHTML = function () {
        angular.element(document.getElementById('divtextarea')).html('Cell division is a <span id="ID20TO35" class="annotatedText"><span id="ID20TO27" class="annotatedText">cellular</span> <span id="ID29TO35" class="annotatedText">process</span></span>');
    };


    ///////////////////////////////////////////////////////////////////////////
    // CHECK FOR ANNOTATIONS
    ///////////////////////////////////////////////////////////////////////////

    $scope.checkAnnotations = function () {
        var url = "https://data.bioontology.org/annotator?apikey=8b5b7825-538d-40e0-9e9e-5ab9274a9aeb";
        var parameters = $scope.annotationForm;
        parameters.text = angular.element(document.getElementById('divtextarea')).text();
        parameters.text = parameters.text.replace(/<[^>]*>?/g, '');
        angular.element(document.getElementById('divtextarea')).text(parameters.text);
        $scope.selectedItem.text_annotation[0].text = parameters.text;
        $scope.config = {
            params: parameters
        };
        angular.forEach($scope.ontologytags, function (value, key) {
            if ($scope.annotationForm.ontologies == "") {
                $scope.annotationForm.ontologies = value.value;
            }
            else {
                $scope.annotationForm.ontologies = $scope.annotationForm.ontologies + "," + value.value;
            }
        });
        // empty grid data
        $scope.gridOptions.data = [];
        angular.element(document.getElementById('annotationLoadingButton')).button('loading');

        $scope.content = "";
        $scope.word = 'str';

        $http.get(url, $scope.config)
            .then(
            function (response) {
                // success callback

                if (response.data.length == 0){
                    alert("Sorry, no matches found.");
                    // stop loading button
                    angular.element(document.getElementById('annotationLoadingButton')).button('reset');
                }
                else {

                    $scope.autoannotations = [];
                    $scope.distinctannotationlist = [];
                    $scope.distinctannotationrangeslist = [];
                    $scope.overlappingrangeslist = [];

                    // index
                    var i = 0;
                    // for each annotation
                    angular.forEach(response.data, function (value, key) {
                        var prefLabel = value.annotatedClass.prefLabel;
                        var annoDetails = value;

                        // for each range per annotation
                        angular.forEach(value.annotations, function (value, key) {

                            /////----- extract annotation data and send to grid -----/////
                            var rangeID = "ID" + value.from + "TO" + value.to;
                            var details = "";
                            if (!(annoDetails.annotatedClass.definition == null)) {
                                details = annoDetails.annotatedClass.definition[0];
                            }
                            var ont = annoDetails.annotatedClass.links.ontology;
                            var ontsplit = ont.split("/");
                            var ontabbr = ontsplit[ontsplit.length - 1];
                            $scope.autoannotations.push({
                                "temp_id": i,
                                "from": value.from,
                                "to": value.to,
                                "range_id": rangeID,
                                "matchType": value.matchType,
                                "text": value.text,
                                "quote": value.text,
                                "prefLabel": prefLabel,
                                "class_id": annoDetails.annotatedClass["@id"],
                                "ontology": annoDetails.annotatedClass.links.ontology,
                                "ontologyname": ontabbr,
                                "type": annoDetails.annotatedClass["@type"],
                                "definition": details,
                                "details": annoDetails
                            });

                            i = i + 1;

                            ///// extract distinct ranges //////////////
                            if (!(_.includes($scope.distinctannotationrangeslist, rangeID))) {
                                $scope.distinctannotationrangeslist.push(rangeID);
                                $scope.distinctannotationlist.push({
                                    "from": value.from,
                                    "to": value.to,
                                    "html_id": rangeID,
                                    "quote": value.text
                                });
                            }

                        });

                    });

                    // sort annotation data according to occurrence a-z
                    $scope.autoannotations = _.sortBy($scope.autoannotations, "from");
                    // fill annotation data to grid data
                    $scope.gridOptions.data = $scope.autoannotations;
                    // stop loading button
                    angular.element(document.getElementById('annotationLoadingButton')).button('reset');

                    // sort Annotation list "to" a-z, "from" z-a
                    $scope.distinctannotationlist.sort(function (x, y) { return x.to - y.to || y.from - x.from; });
                    // reverse list
                    $scope.distinctannotationlist = $scope.distinctannotationlist.reverse();

                    angular.forEach($scope.distinctannotationlist, function (value, key) {

                        if ($scope.overlappingrangeslist.indexOf(value.html_id) <= -1){
                            $scope.content = angular.element(document.getElementById('divtextarea')).html();
                            $scope.content = $scope.content.replace(/&nbsp;/gi," ");

                            $scope.sub1 = $scope.content.substring(0, value.from - 1);
                            $scope.sub2 = $scope.content.substring(value.from - 1, value.to);
                            $scope.sub3 = $scope.content.substring(value.to);

                            //alert("$scope.sub " + value.from + " " + value.to + " " + value.html_id + " " + value.quote +  "\n" + $scope.sub1 + "\n text - " + $scope.sub2 + "\n" + $scope.sub3);

                            if ($scope.sub2.indexOf(" ") > -1) {
                                $scope.wordlist = $scope.sub2.split(" ");
                                $scope.wordstart = value.from;
                                $scope.subsubArray = [];
                                $scope.subsub2 = "";

                                angular.forEach($scope.wordlist, function (word, key) {
                                    var from = $scope.wordstart;
                                    var to = parseInt($scope.wordstart) + parseInt(word.length) -1;
                                    var tempid = "ID" + from + "TO" + to;
                                    //alert("word: " + word  + "\nword.length: " + word.length + "\nword.from: " + from + "\nword.to: " + to);
                                    $scope.subsubArray.push("<span id='" + tempid + "' class='annotatedText'>" + word + "</span>");
                                    $scope.wordstart = to + 2;
                                    $scope.overlappingrangeslist.push(tempid);
                                });

                                angular.forEach($scope.subsubArray, function (span, key) {

                                    if ($scope.subsub2.length == 0){
                                        $scope.subsub2 =  span;
                                    }
                                    else{
                                        $scope.subsub2 =  $scope.subsub2 + " " + span;
                                    }
                                });

                                $scope.sub2 = $scope.subsub2;
                            }

                            $scope.word = !!$scope.sub2 ? $scope.sub2 : $scope.word;
                            $scope.sub2 = "<span id='" + value.html_id + "' class='annotatedText'>" + $scope.sub2 + "</span>";
                            $scope.overlappingrangeslist.push(value.html_id);

                            $scope.subsubsub = $scope.sub1 + $scope.sub2 + $scope.sub3;

                            angular.element(document.getElementById('divtextarea')).html($scope.subsubsub);
                        }
                        else {
                            //alert("$scope.overlappingrangeslist " + JSON.stringify($scope.overlappingrangeslist));
                        }
                    });

                    $scope.selectedItem.text_annotation[0].autoannotations.html =
                    $scope.selectedItem.text_annotation[0].autoannotations = $scope.autoannotations;

                }
            },
            function (response) {
                // failure call back
                alert("Sorry, something went wrong. Please reload page and try again."); // : " + response.data.errors[0]);

                // stop loading button
                angular.element(document.getElementById('annotationLoadingButton')).button('reset');
            }
        )
            .then(function () {
                //necessary for grid to draw correctly
                $timeout(function () {
                    $scope.gridApi.core.handleWindowResize();
                }, 250);
            });

    };

    ///////////////////////////////////////////////////////////////////////////
    // UI GRID
    ///////////////////////////////////////////////////////////////////////////

    $scope.lastSelectedRow = {};
    $scope.info = {};

    $scope.gridOptions = {
        enableRowSelection: true,
        enableFullRowSelection: true,
        enableSelectAll: false,
        enableGridMenu: true,
        selectionRowHeaderWidth: 0,
        rowHeight: 30,
        showGridFooter: false,
        multiSelect: false,
        showGroupPanel: true,
        enableCellSelection: true,
        enablePaging: true,
        columnDefs: [
            {
                name: 'text',
                displayName: 'Annotated Text',
                //width: '200',
                enableColumnResizing: true
            }
            , {
                name: 'class_id',
                displayName: 'Annotated Class',
                //width: '200',
                enableColumnResizing: true,
                cellTemplate: '<div class="ui-grid-cell-contents"><a href="{{COL_FIELD}}" target="_blank">{{row.entity.prefLabel}}</a></div>'
            }, {
                name: 'ontologyname',
                displayName: 'Ontology',
                //width: '200',
                enableColumnResizing: true,
                cellTemplate: '<div class="ui-grid-cell-contents"><a href="{{row.entity.ontology}}" target="_blank">{{COL_FIELD}}</a></div>'
            }
        ]
    };

    $scope.gridOptions.onRegisterApi = function (gridApi) {
        //set gridApi on scope
        $scope.gridApi = gridApi;
        gridApi.selection.on.rowSelectionChanged($scope, function (row) {
            var msg = 'row selected ' + row.isSelected;
            $log.log(msg);

            if (row.isSelected) {
                //"temp_id": i,
                //"from": value.from,
                //"to": value.to,
                //"range_id": rangeID,
                //"matchType": value.matchType,
                //"text": value.text,
                //"quote": value.text,
                //"prefLabel": prefLabel,
                //"class_id": annoDetails.annotatedClass["@id"],
                //"ontology": annoDetails.annotatedClass.links.ontology,
                //"type": annoDetails.annotatedClass["@type"],
                //"definition": annoDetails.annotatedClass.definition[0],
                //"details": annoDetails
                if ($scope.lastSelectedRow) {
                    angular.element(document.getElementById($scope.lastSelectedRow.range_id)).removeClass('highlightedText');
                }
                angular.element(document.getElementById(row.entity.range_id)).addClass('highlightedText');
                $scope.lastSelectedRow = row.entity;
                //if (!row.entity.definition)
                //    $scope.lastSelectedRow.definition = "";
            }
            else {
                angular.element(document.getElementById(row.entity.range_id)).removeClass('highlightedText');
            }

        });
    };

});

MDBControllers.controller('PartoAnnotationCtrl', function ($scope, $rootScope, $log, $http, $location, AuthService, NotificationService, $cookies, $timeout, WsService) {
    // initial values for Auth and Cookies
    $scope.loggedIn = AuthService.isLoggedIn();
    $scope.currentUser = AuthService.getUsername();
    $scope.userStatus = AuthService.getUserStatus();
    $scope.cookies = $cookies.getAll();

    // listen for authentication events
    $scope.$watch(AuthService.isLoggedIn, function () {
        $scope.loggedIn = AuthService.isLoggedIn();
        $scope.currentUser = AuthService.getUsername();
        $scope.userStatus = AuthService.getUserStatus();
    });

    // listen for cookie events
    $scope.$watch($cookies.getAll, function () {
        $scope.cookies = $cookies.getAll();
    });

    ///////////////////////////////////////////////////////////////////////////
    //WsService
    ///////////////////////////////////////////////////////////////////////////

    $scope.WsService = WsService;


    ///////////////////////////////////////////////////////////////////////////
    //Tree Functions
    ///////////////////////////////////////////////////////////////////////////

    $scope.data = [
        {
            "id": 1,
            "title": "multicellular organism",
            "is_not": false,
            "instance_of": "multicellular organism",
            "definition": "Anatomical structure that is an individual member of a species and consists of more than one cell.",
            "obo_id":"UBERON:0000468",
            "URI": "http://purl.obolibrary.org/obo/UBERON_0000468",
            "ontology": "Uberon multi-species anatomy ontology",
            "obo_namespace": "UBERON",
            "quality": "3D",
            "text_annotation":[{
                "text": "",
                "html": "",
                "autoannotations": [],
                "ontologytags":  []
            }],
            "image_annotation": [{
                "image": "",
                "annotations": []
            }],
            "nodes": [
                {
                    "id": 11,
                    "title": "head",
                    "is_not": false,
                    "instance_of": "head",
                    "definition": "The head is the anterior-most division of the body [GO].",
                    "obo_id":"UBERON:0000033",
                    "URI": "http://purl.obolibrary.org/obo/UBERON_0000033",
                    "ontology": "Uberon multi-species anatomy ontology",
                    "obo_namespace": "UBERON",
                    "quality": "3D",
                    "text_annotation":[{
                        "text": "",
                        "html": "",
                        "autoannotations": [],
                        "ontologytags":  []
                    }],
                    "image_annotation": [{
                        "image": "",
                        "annotations": []
                    }],
                    "nodes": [
                        {
                            "id": 111,
                            "title": "left antenna",
                            "is_not": false,
                            "instance_of": "antenna",
                            "definition": "The appendage that is composed of ringlike sclerites and the anatomical structures encircled by these sclerites and that is articulated with the cranium.",
                            "obo_id":"HAO:0000101",
                            "URI": "http://purl.obolibrary.org/obo/HAO_0000101",
                            "ontology": "Hymenoptera Anatomy Ontology Portal",
                            "obo_namespace": "HAO",
                            "quality": "3D",
                            "text_annotation":[{
                                "text": "",
                                "html": "",
                                "autoannotations": [],
                                "ontologytags":  []
                            }],
                            "image_annotation": [{
                                "image": "",
                                "annotations": []
                            }],
                            "nodes": []
                        },
                        {
                            "id": 1121,
                            "title": "right antenna",
                            "is_not": false,
                            "instance_of": "antenna",
                            "definition": "The appendage that is composed of ringlike sclerites and the anatomical structures encircled by these sclerites and that is articulated with the cranium.",
                            "obo_id":"HAO:0000101",
                            "URI": "http://purl.obolibrary.org/obo/HAO_0000101",
                            "ontology": "Hymenoptera Anatomy Ontology Portal",
                            "obo_namespace": "HAO",
                            "quality": "3D",
                            "text_annotation":[{
                                "text": "",
                                "html": "",
                                "autoannotations": [],
                                "ontologytags":  []
                            }],
                            "image_annotation": [{
                                "image": "",
                                "annotations": []
                            }],
                            "nodes": []
                        }
                    ]
                },
                {
                    "id": 12,
                    "title": "thorax",
                    "is_not": false,
                    "instance_of": "thorax",
                    "definition": "The tagma that is composed of the prothorax, mesothorax and metathorax.",
                    "obo_id":"HAO:0001015",
                    "URI": "http://purl.obolibrary.org/obo/HAO_0001015",
                    "ontology": "Hymenoptera Anatomy Ontology Portal",
                    "obo_namespace": "HAO",
                    "quality": "3D",
                    "text_annotation":[{
                        "text": "",
                        "html": "",
                        "autoannotations": [],
                        "ontologytags":  []
                    }],
                    "image_annotation": [{
                        "image": "",
                        "annotations": []
                    }],
                    "nodes": []
                },
                {
                    "id": 13,
                    "title": "abdomen",
                    "is_not": true,
                    "instance_of": "abdomen",
                    "definition": "The tagma that is located posterior to the thorax.",
                    "obo_id":"HAO:0000015",
                    "URI": "http://purl.obolibrary.org/obo/HAO_0000015",
                    "ontology": "Hymenoptera Anatomy Ontology Portal",
                    "obo_namespace": "HAO",
                    "quality": "3D",
                    "text_annotation":[{
                        "text": "",
                        "html": "",
                        "autoannotations": [],
                        "ontologytags":  []
                    }],
                    "image_annotation": [{
                        "image": "",
                        "annotations": []
                    }],
                    "nodes": []
                }
            ]
        }
    ];

    $scope.remove = function (scope) {
        scope.remove();
    };

    $scope.toggle = function (scope) {
        scope.toggle();
    };

    $scope.moveLastToTheBeginning = function () {
        var a = $scope.data.pop();
        $scope.data.splice(0, 0, a);
    };


    $scope.collapseAll = function () {
        $scope.$broadcast('angular-ui-tree:collapse-all');
    };

    $scope.expandAll = function () {
        $scope.$broadcast('angular-ui-tree:expand-all');
    };

    $scope.visible = function (item) {
        return !($scope.query && $scope.query.length > 0
        && item.title.indexOf($scope.query) == -1);

    };

    $scope.selectedItemID = $scope.data[0].id;
    $scope.selectedItem = $scope.data[0];
    $scope.selectedNode = $scope.data[0];

    $scope.setSelectedItem = function (scope, item) {
        $log.info("selected Item: ", item);

        // update text for text annotation of former selectedItem
        $scope.updateTextAnnotation(scope, $scope.selectedNode);

        $scope.selectedItem = item;
        $scope.selectedItemID = item.id;
        $scope.selectedNode = scope.$modelValue;

        return !($scope.selectedItem);
    };

    //$scope.setSelectedItem($scope.data[0]);

    $scope.newSubItem = function (scope) {
        var nodeData = scope.$modelValue;
        nodeData.nodes.push({
            id: nodeData.id * 10 + nodeData.nodes.length,
            title: nodeData.title + ' part ' + (nodeData.nodes.length + 1),
            instance_of: nodeData.instance_of,
            definition: '',
            obo_id: nodeData.obo_id,
            URI: nodeData.URI,
            ontology: nodeData.ontology,
            obo_namespace: nodeData.obo_namespace,
            nodes: []
        });
    };

    $scope.update = function (item) {
        var tree = this.tree;
        var name = item.name;
        var dataItem = tree.dataItem(tree.select());
        dataItem.title = undefined; // force refresh of dataItem
        dataItem.set("title", name);
    };

    $scope.updateInstance = function (item) {
        var tree = this.tree;
        var instance = item.instance_of;
        var dataItem = tree.dataItem(tree.select());
        dataItem.instance_of = undefined; // force refresh of dataItem
        dataItem.set("instance_of", instance);
    };

    $scope.updateNamespace = function (item) {
        var tree = this.tree;
        var obonamespace = item.obo_namespace;
        var dataItem = tree.dataItem(tree.select());
        dataItem.obo_namespace = undefined; // force refresh of dataItem
        dataItem.set("obo_namespace", obonamespace);
    };

    $scope.updateTextAnnotation = function (scope, node) {

        var formerNodeData = node;
        var newNodeData = scope.$modelValue;

        formerNodeData.text_annotation[0].html = angular.element(document.getElementById('divtextarea')).html();
        formerNodeData.text_annotation[0].autoannotations = $scope.selectedItem.text_annotation[0].autoannotations;
        formerNodeData.text_annotation[0].ontologytags = $scope.ontologytags;

        // clear former preferences
        $scope.setDefault();
        angular.element(document.getElementById('divtextarea')).empty();

        var html = newNodeData.text_annotation[0].html;
        var text = newNodeData.text_annotation[0].text;

        if(html.length > 0){
            angular.element(document.getElementById('divtextarea')).html(html);
        }
        else if (text.length > 0){
            angular.element(document.getElementById('divtextarea')).text(text);
        }
        // fill annotation data to grid data
        $scope.gridOptions.data = newNodeData.text_annotation[0].autoannotations;
        $scope.ontologytags = newNodeData.text_annotation[0].ontologytags;
    };


    // formal description panels
    $scope.panelstatus = {
        isOpen: {
            formal_des_haspart: true,
            formal_des_measurement: true,
            formal_des_shapecolor: true,
            image_tools: true,
            image_help: false
        },
        isFirstOpen: true,
        isFirstDisabled: false
    };

    $scope.updateText = function (node) {
        console.warn("update Text: " + node + "\n" + JSON.stringify(node));

        /*"annotationFormText": "",*/
    };


    // text annotation
    $scope.annotationForm = {};
    $scope.annotationForm.ontologies = "";
    $scope.annotationForm.include_views = true;
    $scope.annotationForm.display_context = false;
    $scope.annotationForm.include = "prefLabel,synonym,definition,notation,cui,semanticType,properties";
    $scope.annotationForm.longest_only = false;
    $scope.annotationForm.exclude_numbers = false;
    $scope.annotationForm.whole_word_only = true;
    $scope.annotationForm.exclude_synonyms = false;
    $scope.annotationForm.expand_class_hierarchy = false;
    $scope.annotationForm.class_hierarchy_max_level = "1";
    $scope.annotationForm.format = "json";

    $scope.divtextarea = angular.element(document.getElementById('divtextarea'));
    $scope.loadingButton = angular.element(document.getElementById('annotationLoadingButton'));


    ///////////////////////////////////////////////////////////////////////////
    // ONTOLOGY TAGS
    ///////////////////////////////////////////////////////////////////////////

    $scope.ontologytags = [];

    $scope.loadOntologyTags = function ($query) {
        return $http.get('../data/ontologies.json', {cache: true}).then(function (response) {
            var ontology_tags = response.data;
            return ontology_tags.filter(function (ontologytag) {
                let matches = val => val.toLowerCase().indexOf($query.toLowerCase()) > -1;
                return matches(ontologytag.value) || matches(ontologytag.name);
            });
        });
    };

    $scope.setTestValues = function () {
        $scope.ontologytags = [
            {
                "value": "MESH",
                "name": "Medical Subject Headings (MESH)"
            },{
                "value": "CARO",
                "name": "Common Anatomy Reference Ontology (CARO)"
            },{
                "value": "MP",
                "name": "Mammalian Phenotype Ontology (MP)"
            }, {
                "value": "CL",
                "name": "Cell Ontology (CL)"
            }, {
                "value": "BOF",
                "name": "Biodiversity Ontology (BOF)"
            }, {
                "value": "TAXRANK",
                "name": "Taxonomic Rank Vocabulary (TAXRANK)"
            },{
                "value": "VTO",
                "name": "Vertebrate Taxonomy Ontology (VTO)"
            }];
        angular.element(document.getElementById('divtextarea')).text("Birds and mammals are both warm-blooded animals with separate sexes determined by genetics, spinal cords, four-chambered hearts, four limbs and well-developed bony skeletons. Both groups, birds and mammals, include species that can fly and those that cannot, and both groups include species that lay eggs.");
    };

    $scope.setDefault = function () {
        $scope.clearValues();
        $scope.annotationForm.whole_word_only = true;
        $scope.annotationForm.include = "prefLabel,synonym,definition,notation,cui,semanticType,properties";
    };

    $scope.clearValues = function () {
        $scope.ontologytags = [];
        angular.element(document.getElementById('divtextarea')).text("");
        $scope.annotationForm.ontologies = "";
        $scope.annotationForm.include_views = true;
        $scope.annotationForm.display_context = false;
        $scope.annotationForm.include = "";
        $scope.annotationForm.longest_only = false;
        $scope.annotationForm.exclude_numbers = false;
        $scope.annotationForm.whole_word_only = false;
        $scope.annotationForm.exclude_synonyms = false;
        $scope.annotationForm.expand_class_hierarchy = false;
        $scope.annotationForm.class_hierarchy_max_level = "1";
        $scope.annotationForm.format = "json";
    };

    $scope.setTestText = function () {
        $scope.ontologytags = [
            {
                "value": "MESH",
                "name": "Medical Subject Headings (MESH)"
            },{
                "value": "CARO",
                "name": "Common Anatomy Reference Ontology (CARO)"
            },{
                "value": "MP",
                "name": "Mammalian Phenotype Ontology (MP)"
            }, {
                "value": "CL",
                "name": "Cell Ontology (CL)"
            }, {
                "value": "BOF",
                "name": "Biodiversity Ontology (BOF)"
            }, {
                "value": "TAXRANK",
                "name": "Taxonomic Rank Vocabulary (TAXRANK)"
            },{
                "value": "VTO",
                "name": "Vertebrate Taxonomy Ontology (VTO)"
            }];
        angular.element(document.getElementById('divtextarea')).html('Cell division is a cellular process.');
    };

    $scope.setTestHTML = function () {
        angular.element(document.getElementById('divtextarea')).html('Cell division is a <span id="ID20TO35" class="annotatedText"><span id="ID20TO27" class="annotatedText">cellular</span> <span id="ID29TO35" class="annotatedText">process</span></span>');
    };


    ///////////////////////////////////////////////////////////////////////////
    // CHECK FOR ANNOTATIONS
    ///////////////////////////////////////////////////////////////////////////

    $scope.checkAnnotations = function () {
        var url = "https://data.bioontology.org/annotator?apikey=8b5b7825-538d-40e0-9e9e-5ab9274a9aeb";

        $scope.annotationForm.ontologies = "";

        var parameters = $scope.annotationForm;
        parameters.text = angular.element(document.getElementById('divtextarea')).text();
        parameters.text = parameters.text.replace(/<[^>]*>?/g, '');
        angular.element(document.getElementById('divtextarea')).text(parameters.text);
        $scope.selectedItem.text_annotation[0].text = parameters.text;
        $scope.config = {
            params: parameters
        };
        angular.forEach($scope.ontologytags, function (value, key) {
            if ($scope.annotationForm.ontologies == "") {
                $scope.annotationForm.ontologies = value.value;
            }
            else {
                $scope.annotationForm.ontologies = $scope.annotationForm.ontologies + "," + value.value;
            }
        });
        // empty grid data
        $scope.gridOptions.data = [];
        angular.element(document.getElementById('annotationLoadingButton')).button('loading');

        $scope.content = "";
        $scope.word = 'str';

        $http.get(url, $scope.config)
            .then(
            function (response) {
                // success callback

                if (response.data.length == 0){
                    alert("Sorry, no matches found.");
                    // stop loading button
                    angular.element(document.getElementById('annotationLoadingButton')).button('reset');
                }
                else {

                    $scope.autoannotations = [];
                    $scope.distinctannotationlist = [];
                    $scope.distinctannotationrangeslist = [];
                    $scope.overlappingrangeslist = [];

                    // index
                    var i = 0;
                    // for each annotation
                    angular.forEach(response.data, function (value, key) {
                        var prefLabel = value.annotatedClass.prefLabel;
                        var annoDetails = value;

                        // for each range per annotation
                        angular.forEach(value.annotations, function (value, key) {

                            /////----- extract annotation data and send to grid -----/////
                            var rangeID = "ID" + value.from + "TO" + value.to;
                            var details = "";
                            if (!(annoDetails.annotatedClass.definition == null)) {
                                details = annoDetails.annotatedClass.definition[0];
                            }
                            var ont = annoDetails.annotatedClass.links.ontology;
                            var ontsplit = ont.split("/");
                            var ontabbr = ontsplit[ontsplit.length - 1];
                            $scope.autoannotations.push({
                                "temp_id": i,
                                "from": value.from,
                                "to": value.to,
                                "range_id": rangeID,
                                "matchType": value.matchType,
                                "text": value.text,
                                "quote": value.text,
                                "prefLabel": prefLabel,
                                "class_id": annoDetails.annotatedClass["@id"],
                                "ontology": annoDetails.annotatedClass.links.ontology,
                                "ontologyname": ontabbr,
                                "type": annoDetails.annotatedClass["@type"],
                                "definition": details,
                                "details": annoDetails
                            });

                            i = i + 1;

                            ///// extract distinct ranges //////////////
                            if (!(_.includes($scope.distinctannotationrangeslist, rangeID))) {
                                $scope.distinctannotationrangeslist.push(rangeID);
                                $scope.distinctannotationlist.push({
                                    "from": value.from,
                                    "to": value.to,
                                    "html_id": rangeID,
                                    "quote": value.text
                                });
                            }

                        });

                    });

                    // sort annotation data according to occurrence a-z
                    $scope.autoannotations = _.sortBy($scope.autoannotations, "from");
                    // fill annotation data to grid data
                    setTimeout(_ => $scope.gridOptions.data = $scope.autoannotations, 100);
                    // stop loading button
                    angular.element(document.getElementById('annotationLoadingButton')).button('reset');

                    // sort Annotation list "to" a-z, "from" z-a
                    $scope.distinctannotationlist.sort(function (x, y) { return x.to - y.to || y.from - x.from; });
                    // reverse list
                    $scope.distinctannotationlist = $scope.distinctannotationlist.reverse();

                    angular.forEach($scope.distinctannotationlist, function (value, key) {

                        if ($scope.overlappingrangeslist.indexOf(value.html_id) <= -1){
                            $scope.content = angular.element(document.getElementById('divtextarea')).html();
                            $scope.content = $scope.content.replace(/&nbsp;/gi," ");

                            $scope.sub1 = $scope.content.substring(0, value.from - 1);
                            $scope.sub2 = $scope.content.substring(value.from - 1, value.to);
                            $scope.sub3 = $scope.content.substring(value.to);

                            //alert("$scope.sub " + value.from + " " + value.to + " " + value.html_id + " " + value.quote +  "\n" + $scope.sub1 + "\n text - " + $scope.sub2 + "\n" + $scope.sub3);

                            if ($scope.sub2.indexOf(" ") > -1) {
                                $scope.wordlist = $scope.sub2.split(" ");
                                $scope.wordstart = value.from;
                                $scope.subsubArray = [];
                                $scope.subsub2 = "";

                                angular.forEach($scope.wordlist, function (word, key) {
                                    var from = $scope.wordstart;
                                    var to = parseInt($scope.wordstart) + parseInt(word.length) -1;
                                    var tempid = "ID" + from + "TO" + to;
                                    //alert("word: " + word  + "\nword.length: " + word.length + "\nword.from: " + from + "\nword.to: " + to);
                                    $scope.subsubArray.push("<span id='" + tempid + "' class='annotatedText'>" + word + "</span>");
                                    $scope.wordstart = to + 2;
                                    $scope.overlappingrangeslist.push(tempid);
                                });

                                angular.forEach($scope.subsubArray, function (span, key) {

                                    if ($scope.subsub2.length == 0){
                                        $scope.subsub2 =  span;
                                    }
                                    else{
                                        $scope.subsub2 =  $scope.subsub2 + " " + span;
                                    }
                                });

                                $scope.sub2 = $scope.subsub2;
                            }

                            $scope.word = !!$scope.sub2 ? $scope.sub2 : $scope.word;
                            $scope.sub2 = "<span id='" + value.html_id + "' class='annotatedText'>" + $scope.sub2 + "</span>";
                            $scope.overlappingrangeslist.push(value.html_id);

                            $scope.subsubsub = $scope.sub1 + $scope.sub2 + $scope.sub3;

                            angular.element(document.getElementById('divtextarea')).html($scope.subsubsub);
                        }
                        else {
                            //alert("$scope.overlappingrangeslist " + JSON.stringify($scope.overlappingrangeslist));
                        }
                    });

                    $scope.selectedItem.text_annotation[0].autoannotations.html =
                        $scope.selectedItem.text_annotation[0].autoannotations = $scope.autoannotations;

                }
            },
            function (response) {
                // failure call back
                alert("Sorry, something went wrong. Please reload page and try again."); // : " + response.data.errors[0]);

                // stop loading button
                angular.element(document.getElementById('annotationLoadingButton')).button('reset');
            }
        )
            .then(function () {
                //necessary for grid to draw correctly
                $timeout(function () {
                    $scope.gridApi.core.handleWindowResize();
                }, 250);
            });

    };

    ///////////////////////////////////////////////////////////////////////////
    // UI GRID
    ///////////////////////////////////////////////////////////////////////////

    $scope.lastSelectedRow = {};
    $scope.info = {};

    $scope.addToPartonomy = function(actionId, entity) {
        console.log("clicked on the action ", actionId, entity);

        const parentNode = $scope.selectedNode;

        const getQuality = actionId => {
            switch(actionId) {
                case 0: return "point";
                case 1: return "line";
                case 2: return "surface";
                case 3: return "space";
                case 4: return "3D";
                case 5: return "substance";
                case 6: return "not";
                default:
                    return "3D"
            }
        };

        parentNode.nodes.push({
            "id": entity.temp_id,
            "title": entity.prefLabel,
            "is_not": actionId === 6,
            "instance_of": `${entity.prefLabel}`,
            "definition": "---",
            "obo_id": entity.class_id,
            "URI": entity.ontology,
            "ontology": entity.ontologyname,
            "obo_namespace": entity.ontologyname,
            "quality": getQuality(actionId),
            "text_annotation":[{
                "text": "",
                "html": "",
                "autoannotations": [],
                "ontologytags":  []
            }],
            "image_annotation": [{
                "image": "",
                "annotations": []
            }],
            "nodes": []
        });

        //$scope.setSelectedItem($scope, parentNode.nodes[parentNode.nodes.length - 1]);

        $scope.selectedItem = parentNode.nodes[parentNode.nodes.length - 1];
        $scope.selectedItemID = $scope.selectedItem.id;
        $scope.selectedNode = parentNode.nodes[parentNode.nodes.length - 1];

        setTimeout(function() {
            // change tab to Formal description
            $("ul.nav-tabs li[index=0] a").click();

            // focus field
            setTimeout(_ => $(".description_active_part_panel input.css-data-input").focus(), 100)
        }, 100)
    };

    $scope.gridHeaderTitle = {
        "Annotated Text": "Select the definition of the term highlighted in your text.",
        "Annotated Class": "View class and ontology information provided by NCBO BioPortal (external links). To see the class definition (if available), place mouse over class name.",
        "Add to Partonomy as ...": "Select structure you want to add to the partonomy. You will be redirected to the edit screen of the new part e.g. to change the label."
    };

    const cellHeaderTemplate = `<div
        role="columnheader"
        title="{{grid.appScope.gridHeaderTitle[col.displayName]}}"
        ng-class="{ 'sortable': sortable }"
        ui-grid-one-bind-aria-labelledby-grid="col.uid + '-header-text ' + col.uid + '-sortdir-text'"
        aria-sort="{{col.sort.direction == asc ? 'ascending' : ( col.sort.direction == desc ? 'descending' : (!col.sort.direction ? 'none' : 'other'))}}">
        <div
        role="button"
        tabindex="0"
        class="ui-grid-cell-contents ui-grid-header-cell-primary-focus"
        col-index="renderIndex">
        <span
            class="ui-grid-header-cell-label"
            ui-grid-one-bind-id-grid="col.uid + '-header-text'">
            {{ col.displayName CUSTOM_FILTERS }}
        </span>

        <span
            ui-grid-one-bind-id-grid="col.uid + '-sortdir-text'"
            ui-grid-visible="col.sort.direction"
            aria-label="{{getSortDirectionAriaLabel()}}">
            <i
            ng-class="{ 'ui-grid-icon-up-dir': col.sort.direction == asc, 'ui-grid-icon-down-dir': col.sort.direction == desc, 'ui-grid-icon-blank': !col.sort.direction }"
            title="{{isSortPriorityVisible() ? i18n.headerCell.priority + ' ' + ( col.sort.priority + 1 )  : null}}"
            aria-hidden="true">
        </i>
        <sub
            ui-grid-visible="isSortPriorityVisible()"
            class="ui-grid-sort-priority-number">
            {{col.sort.priority + 1}}
        </sub>
        </span>
        </div>

        <div
        role="button"
        tabindex="0"
        ui-grid-one-bind-id-grid="col.uid + '-menu-button'"
        class="ui-grid-column-menu-button"
        ng-if="grid.options.enableColumnMenus && !col.isRowHeader  && col.colDef.enableColumnMenu !== false"
        ng-click="toggleMenu($event)"
        ng-class="{'ui-grid-column-menu-button-last-col': isLastCol}"
        ui-grid-one-bind-aria-label="i18n.headerCell.aria.columnMenuButtonLabel"
        aria-haspopup="true">
        <i
            class="ui-grid-icon-angle-down"
            aria-hidden="true">
            &nbsp;
        </i>
        </div>

        <div ui-grid-filter></div>
    </div>`;

    $scope.gridOptions = {
        enableRowSelection: true,
        enableFullRowSelection: true,
        enableSelectAll: false,
        enableGridMenu: true,
        selectionRowHeaderWidth: 0,
        rowHeight: 30,
        showGridFooter: false,
        multiSelect: false,
        showGroupPanel: true,
        enableCellSelection: false,
        enablePaging: true,
        columnDefs: [
            {
                name: 'text',
                displayName: 'Annotated Text',
                headerCellTemplate: cellHeaderTemplate,
                //width: '200',
                enableColumnResizing: true,
                cellTemplate: `<div class="ui-grid-cell-contents"><input ng-model="radioselect[COL_FIELD]" name="radioselect_{{COL_FIELD}}" type="radio" value="0" style="width:20px; height:auto;" /> {{COL_FIELD}}</div>`
                ,sortingAlgorithm: function(a, b, rowA, rowB, direction) {
                    return rowA.entity.text.localeCompare(rowB.entity.text);
                }
            },
            {
                name: 'class_id',
                displayName: 'Annotated Class',
                headerCellTemplate: cellHeaderTemplate,
                //width: '200',
                enableColumnResizing: true,
                cellTemplate: '<div class="ui-grid-cell-contents">' +
                '   <a href="{{COL_FIELD}}" target="_blank" title="{{row.entity.definition}} (Click for more information on BioPortal)">{{row.entity.prefLabel}}</a>' +
                '   <a href="https://bioportal.bioontology.org/ontologies/{{row.entity.ontologyname}}" target="_blank" title="View ontology information on BioPortal">[{{row.entity.ontologyname}}]</a>' +
                '</div>',
                sortingAlgorithm: function(a, b, rowA, rowB, direction) {
                    return rowA.entity.prefLabel.localeCompare(rowB.entity.prefLabel);
                }
            },
            {
                name: "temp_id",
                displayName: "Add to Partonomy as ...",
                headerCellTemplate: cellHeaderTemplate,
                enableSorting: false,
                enableColumnResizing: false,
                cellTemplate: `<div class="ui-grid-cell-contents">
                    <span title="structure" style="cursor:pointer;" ng-click="grid.appScope.addToPartonomy(6, row.entity)">
                      <img style="height:25px;border:1px solid black;" src="/img/icon_description_property_3D.jpg">
                    </span>
                    <span title="structure" style="cursor:pointer;" ng-click="grid.appScope.addToPartonomy(4, row.entity)">
                      <img style="height:25px;border:1px solid black;" src="/img/icon_description_property_3D.jpg">
                    </span>
                    <span title="a surface area" style="cursor:pointer;" ng-click="grid.appScope.addToPartonomy(2, row.entity)">
                      <img style="height:25px;border:1px solid black;" src="/img/icon_description_property_surface.jpg">
                    </span>
                    <span title="a line" style="cursor:pointer;" ng-click="grid.appScope.addToPartonomy(1, row.entity)">
                      <img style="height:25px;border:1px solid black;" src="/img/icon_description_property_line.jpg">
                    </span>
                    <span title="a point" style="cursor:pointer;" ng-click="grid.appScope.addToPartonomy(0, row.entity)">
                      <img style="height:25px;border:1px solid black;" src="/img/icon_description_property_point.jpg">
                    </span>
                    <span title="a space" style="cursor:pointer;" ng-click="grid.appScope.addToPartonomy(3, row.entity)">
                      <img style="height:25px;border:1px solid black;" src="/img/icon_description_property_space.jpg">
                    </span>
                    <span title="a portion" style="cursor:pointer;" ng-click="grid.appScope.addToPartonomy(5, row.entity)">
                      <img style="height:25px;border:1px solid black;" src="/img/icon_description_property_substance.jpg">
                    </span>
                </div>`
            }
        ]
    };

    $scope.gridOptions.onRegisterApi = function (gridApi) {
        //set gridApi on scope
        $scope.gridApi = gridApi;

        gridApi.selection.on.rowSelectionChanged($scope, function (row) {
            var msg = 'row selected ' + row.isSelected;
            $log.log(msg);

            if (row.isSelected) {
                //"temp_id": i,
                //"from": value.from,
                //"to": value.to,
                //"range_id": rangeID,
                //"matchType": value.matchType,
                //"text": value.text,
                //"quote": value.text,
                //"prefLabel": prefLabel,
                //"class_id": annoDetails.annotatedClass["@id"],
                //"ontology": annoDetails.annotatedClass.links.ontology,
                //"type": annoDetails.annotatedClass["@type"],
                //"definition": annoDetails.annotatedClass.definition[0],
                //"details": annoDetails
                if ($scope.lastSelectedRow) {
                    angular.element(document.getElementById($scope.lastSelectedRow.range_id)).removeClass('highlightedText');
                }
                angular.element(document.getElementById(row.entity.range_id)).addClass('highlightedText');
                $scope.lastSelectedRow = row.entity;
                //if (!row.entity.definition)
                //    $scope.lastSelectedRow.definition = "";
            }
            else {
                angular.element(document.getElementById(row.entity.range_id)).removeClass('highlightedText');
            }

        });
    };
});

MDBControllers.controller('PartAnnotationCtrl', function ($scope, $rootScope, $log, $http, $location, AuthService, NotificationService, $cookies, $timeout, WsService) {
    // initial values for Auth and Cookies
    $scope.loggedIn = AuthService.isLoggedIn();
    $scope.currentUser = AuthService.getUsername();
    $scope.userStatus = AuthService.getUserStatus();
    $scope.cookies = $cookies.getAll();

    // listen for authentication events
    $scope.$watch(AuthService.isLoggedIn, function () {
        $scope.loggedIn = AuthService.isLoggedIn();
        $scope.currentUser = AuthService.getUsername();
        $scope.userStatus = AuthService.getUserStatus();
    });

    // listen for cookie events
    $scope.$watch($cookies.getAll, function () {
        $scope.cookies = $cookies.getAll();
    });

    ///////////////////////////////////////////////////////////////////////////
    //WsService
    ///////////////////////////////////////////////////////////////////////////

    $scope.WsService = WsService;


    ///////////////////////////////////////////////////////////////////////////
    //Tree Functions
    ///////////////////////////////////////////////////////////////////////////



        //{
        //    "SPRO_0000000111": 1,
        //    "localID":"UBERON:0000033_1",
        //    "SPRO_0000001029": "head",
        //    "label_class": "[UBERON: head]",
        //    "URI_class": "http://purl.obolibrary.org/obo/UBERON_0000033",
        //    "SC_MDB_MD_0000000497": "/img/icon_description_property_SC_MDB_BASIC_0000001156.jpg",
        //    "BFO_0000050": "UBERON:0000468_1",
        //    "BFO_0000051": []
        //}
        //

    /*$scope.data = [
        {
            "id": 1,
            "is_root": true,
            "title": "multicellular organism",
            "is_not": false,
            "instance_of": "multicellular organism",
            "definition": "Anatomical structure that is an individual member of a species and consists of more than one cell.",
            "obo_id":"UBERON:0000468",
            "URI": "http://purl.obolibrary.org/obo/UBERON_0000468",
            "ontology": "Uberon multi-species anatomy ontology",
            "obo_namespace": "UBERON",
            "label_class": "UBERON: multicellular organism",
            "text_annotation":[{
                "text": "",
                "html": "",
                "autoannotations": [],
                "ontologytags":  []
            }],
            "image_annotation": [{
                "image": "",
                "annotations": []
            }],
            "nodes": [
                {
                    "id": 11,
                    "is_root": false,
                    "title": "head",
                    "is_not": false,
                    "instance_of": "head",
                    "label_class": "UBERON: head",
                    "definition": "The head is the anterior-most division of the body [GO].",
                    "obo_id":"UBERON:0000033",
                    "URI": "http://purl.obolibrary.org/obo/UBERON_0000033",
                    "ontology": "Uberon multi-species anatomy ontology",
                    "obo_namespace": "UBERON",
                    "quality": "3D",
                    "text_annotation":[{
                        "text": "",
                        "html": "",
                        "autoannotations": [],
                        "ontologytags":  []
                    }],
                    "image_annotation": [{
                        "image": "",
                        "annotations": []
                    }],
                    "nodes": [
                        {
                            "id": 111,
                            "title": "left antenna",
                            "is_not": false,
                            "instance_of": "antenna",
                            "label_class": "HAO: antenna",
                            "definition": "The appendage that is composed of ringlike sclerites and the anatomical structures encircled by these sclerites and that is articulated with the cranium.",
                            "obo_id":"HAO:0000101",
                            "URI": "http://purl.obolibrary.org/obo/HAO_0000101",
                            "ontology": "Hymenoptera Anatomy Ontology Portal",
                            "obo_namespace": "HAO",
                            "quality": "3D",
                            "text_annotation":[{
                                "text": "",
                                "html": "",
                                "autoannotations": [],
                                "ontologytags":  []
                            }],
                            "image_annotation": [{
                                "image": "",
                                "annotations": []
                            }],
                            "nodes": []
                        },
                        {
                            "id": 1121,
                            "title": "right antenna",
                            "is_not": false,
                            "instance_of": "antenna",
                            "label_class": "HAO: antenna",
                            "definition": "The appendage that is composed of ringlike sclerites and the anatomical structures encircled by these sclerites and that is articulated with the cranium.",
                            "obo_id":"HAO:0000101",
                            "URI": "http://purl.obolibrary.org/obo/HAO_0000101",
                            "ontology": "Hymenoptera Anatomy Ontology Portal",
                            "obo_namespace": "HAO",
                            "quality": "3D",
                            "text_annotation":[{
                                "text": "",
                                "html": "",
                                "autoannotations": [],
                                "ontologytags":  []
                            }],
                            "image_annotation": [{
                                "image": "",
                                "annotations": []
                            }],
                            "nodes": []
                        }
                    ]
                },
                {
                    "id": 12,
                    "is_root": false,
                    "title": "thorax",
                    "is_not": false,
                    "instance_of": "thorax",
                    "label_class": "HAO: thorax",
                    "definition": "The tagma that is composed of the prothorax, mesothorax and metathorax.",
                    "obo_id":"HAO:0001015",
                    "URI": "http://purl.obolibrary.org/obo/HAO_0001015",
                    "ontology": "Hymenoptera Anatomy Ontology Portal",
                    "obo_namespace": "HAO",
                    "quality": "3D",
                    "text_annotation":[{
                        "text": "",
                        "html": "",
                        "autoannotations": [],
                        "ontologytags":  []
                    }],
                    "image_annotation": [{
                        "image": "",
                        "annotations": []
                    }],
                    "nodes": []
                },
                {
                    "id": 13,
                    "is_root": false,
                    "title": "abdomen",
                    "is_not": true,
                    "instance_of": "abdomen",
                    "label_class": "HAO: abdomen",
                    "definition": "The tagma that is located posterior to the thorax.",
                    "obo_id":"HAO:0000015",
                    "URI": "http://purl.obolibrary.org/obo/HAO_0000015",
                    "ontology": "Hymenoptera Anatomy Ontology Portal",
                    "obo_namespace": "HAO",
                    "quality": "3D",
                    "text_annotation":[{
                        "text": "",
                        "html": "",
                        "autoannotations": [],
                        "ontologytags":  []
                    }],
                    "image_annotation": [{
                        "image": "",
                        "annotations": []
                    }],
                    "nodes": []
                }
            ]
        }
    ];*/

    $scope.maxnodes = 1;

    $scope.data = [
        {
            "id": 1,
            "is_root": true,
            "title": "multicellular organism",
            "is_not": false,
            "instance_of": "multicellular organism",
            "definition": "Anatomical structure that is an individual member of a species and consists of more than one cell.",
            "obo_id":"UBERON:0000468",
            "URI": "http://purl.obolibrary.org/obo/UBERON_0000468",
            "ontology": "Uberon multi-species anatomy ontology",
            "obo_namespace": "UBERON",
            "label_class": "UBERON: multicellular organism",
            "text_annotation":[{
                "text": "",
                "html": "",
                "autoannotations": [],
                "ontologytags":  []
            }],
            "image_annotation": [{
                "image": "",
                "annotations": []
            }],
            "nodes": []
        }
    ];

    $scope.autoComp = [
        {"resource":"http://purl.obolibrary.org/obo/HAO_0000397","label":"HAO: head"},
        {"resource":"http://purl.obolibrary.org/obo/UBERON_0000033","label":"UBERON: head"},
        {"resource":"http://purl.obolibrary.org/obo/HAO_0002366","label":"HAO: ventral head line"},
        {"resource":"http://purl.obolibrary.org/obo/HAO_0002368","label":"HAO: ventral head width"},
        {"resource":"http://purl.obolibrary.org/obo/MP_0004085","label":"MP: abnormal heartbeat"},
        {"resource":"http://purl.obolibrary.org/obo/HAO_0002366","label":"HAO: ventral head line"},
        {"resource":"http://purl.obolibrary.org/obo/HAO_0002268","label":"HAO: head width"},
        {"resource":"http://purl.obolibrary.org/obo/HAO_0002407","label":"HAO: head height"},
        {"resource":"http://purl.obolibrary.org/obo/HAO_0002408","label":"HAO: head length"},
        {"resource":"http://purl.obolibrary.org/obo/HAO_0000101","label":"HAO: antenna"},
        {"resource":"http://purl.obolibrary.org/obo/HAO_0001769","label":"HAO: extrinsic muscle of the antenna"},
        {"resource":"http://purl.obolibrary.org/obo/HAO_0000104","label":"HAO: antennal segment"},
        {"resource":"http://purl.obolibrary.org/obo/HAO_0000106","label":"HAO: antennal suture"},
        {"resource":"http://purl.obolibrary.org/obo/HAO_0000232","label":"HAO: cranio-antennal muscle"},
        {"resource":"http://purl.obolibrary.org/obo/OARCS_0000055","label": "OARCS: antennal artery system"},
        {"resource":"http://purl.obolibrary.org/obo/OARCS_0000102","label":"OARCS: anterior aorta system"},
        {"resource":"http://purl.obolibrary.org/obo/HAO_0000745","label":"HAO: anterior cranio-mandibular muscle"},
        {"resource":"http://purl.obolibrary.org/obo/HAO_0001449","label":"HAO: anterior profemoro-protibial articulation"},
        {"resource":"http://purl.obolibrary.org/obo/HAO_0001801","label":"HAO: prepecto-anterior thoracic spiracle muscle"},
        {"resource":"http://purl.obolibrary.org/obo/HAO_0000015","label":"HAO: abdomen"},
        {"resource":"http://purl.obolibrary.org/obo/HAO_0000088","label":"HAO: adult abdomen"},
        {"resource":"http://purl.obolibrary.org/obo/HAO_0000016","label":"HAO: abdominal segment"},
        {"resource":"http://purl.obolibrary.org/obo/HAO_0000017","label":"HAO: abdominal segment 1"},
        {"resource":"http://purl.obolibrary.org/obo/HAO_0000018","label":"HAO: abdominal segment 10"},
        {"resource":"http://purl.obolibrary.org/obo/HAO_0000053","label":"HAO: abdominal tergum 2"},
        {"resource":"http://purl.obolibrary.org/obo/MP_0013119","label":"MP: abdomen swellings"},
        {"resource":"http://purl.obolibrary.org/obo/MP_0013048","label":"MP: abdomen wound"},
        {"resource":"http://purl.obolibrary.org/obo/HAO_0001970","label":"HAO: thorax"},
        {"resource":"http://purl.obolibrary.org/obo/HAO_0001115","label":"HAO: anterior thoracic spiracle occlusor muscle"},
        {"resource":"http://purl.obolibrary.org/obo/HAO_0000090","label":"HAO: adult thorax"},
        {"resource":"http://purl.obolibrary.org/obo/HAO_0000463","label":"HAO: larval thorax"},
        {"resource":"http://purl.obolibrary.org/obo/MP_0013117","label":"MP: focal hair loss in thorax region"},
        {"resource":"http://purl.obolibrary.org/obo/MP_0008923","label":"MP: thoracoschisis"}
    ];

    $scope.forms = {};
    $scope.newPart = {};

    $scope.remove = function (scope) {
        scope.remove();
    };

    $scope.toggle = function (scope) {
        scope.toggle();
    };

    $scope.moveLastToTheBeginning = function () {
        var a = $scope.data.pop();
        $scope.data.splice(0, 0, a);
    };


    $scope.collapseAll = function () {
        $scope.$broadcast('angular-ui-tree:collapse-all');
    };

    $scope.expandAll = function () {
        $scope.$broadcast('angular-ui-tree:expand-all');
    };

    $scope.visible = function (item) {
        return !($scope.query && $scope.query.length > 0
        && item.title.indexOf($scope.query) == -1);

    };

    $scope.selectedItemID = $scope.data[0].id;
    $scope.selectedItem = $scope.data[0];
    $scope.selectedNode = $scope.data[0];

    $scope.setSelectedItem = function (scope, item) {
        $log.info("selected Item: " + JSON.stringify(item));

        // update text for text annotation of former selectedItem
        $scope.updateTextAnnotation(scope, $scope.selectedNode);

        $scope.selectedItem = item;
        $scope.selectedItemID = item.id;
        $scope.selectedNode = scope.$modelValue;
        //$scope.breadcrumb = item.$$parentNode.title + " > " + item.title;

        $scope.forms.addNewPartForm.$setPristine();
        $scope.newPart = {};

        return !($scope.selectedItem);
    };

    //$scope.setSelectedItem($scope.data[0]);

    $scope.newSubItem = function (selectedItem, addNewPartForm) {
        var nodeData = selectedItem;
        nodeData.nodes.push({
            id: $scope.maxnodes + 1, //nodeData.id * 10 + nodeData.nodes.length,
            "is_root": false,
            title: addNewPartForm.hasNewTitle.$modelValue,
            instance_of: addNewPartForm.hasNewType.$modelValue.resource,
            label_class: addNewPartForm.hasNewType.$modelValue.label,
            is_not: false,
            definition: '',
            obo_id: nodeData.obo_id,
            URI: nodeData.URI,
            ontology: nodeData.ontology,
            obo_namespace: nodeData.obo_namespace,
            quality: "3D",
            "text_annotation":[{
                "text": "",
                "html": "",
                "autoannotations": [],
                "ontologytags":  []
            }],
            "image_annotation": [{
                "image": "",
                "annotations": []
            }],
            nodes: []
        });
        $scope.maxnodes = $scope.maxnodes + 1;
        $scope.forms.addNewPartForm.$setPristine();
        $scope.newPart = {};
    };

    $scope.update = function (item) {
        var tree = this.tree;
        var name = item.name;
        var dataItem = tree.dataItem(tree.select());
        dataItem.title = undefined; // force refresh of dataItem
        dataItem.set("title", name);
    };

    $scope.updateInstance = function (item) {
        var tree = this.tree;
        var instance = item.instance_of;
        var dataItem = tree.dataItem(tree.select());
        dataItem.instance_of = undefined; // force refresh of dataItem
        dataItem.set("instance_of", instance);
    };

    $scope.updateNamespace = function (item) {
        var tree = this.tree;
        var obonamespace = item.obo_namespace;
        var dataItem = tree.dataItem(tree.select());
        dataItem.obo_namespace = undefined; // force refresh of dataItem
        dataItem.set("obo_namespace", obonamespace);
    };

    $scope.updateTextAnnotation = function (scope, node) {

        var formerNodeData = node;
        var newNodeData = scope.$modelValue;

        formerNodeData.text_annotation[0].html = angular.element(document.getElementById('divtextarea')).html();
        formerNodeData.text_annotation[0].autoannotations = $scope.selectedItem.text_annotation[0].autoannotations;
        formerNodeData.text_annotation[0].ontologytags = $scope.ontologytags;

        // clear former preferences
        $scope.setDefault();
        angular.element(document.getElementById('divtextarea')).empty();

        var html = newNodeData.text_annotation[0].html;
        var text = newNodeData.text_annotation[0].text;

        if(html.length > 0){
            angular.element(document.getElementById('divtextarea')).html(html);
        }
        else if (text.length > 0){
            angular.element(document.getElementById('divtextarea')).text(text);
        }
        // fill annotation data to grid data
        $scope.gridOptions.data = newNodeData.text_annotation[0].autoannotations;
        $scope.ontologytags = newNodeData.text_annotation[0].ontologytags;
    };


    // formal description panels
    $scope.panelstatus = {
        isOpen: {
            formal_des_haspart: true,
            formal_des_measurement: true,
            formal_des_shapecolor: true,
            image_tools: true,
            image_help: false
        },
        isFirstOpen: true,
        isFirstDisabled: false
    };

    $scope.updateText = function (node) {
        console.warn("update Text: " + node + "\n" + JSON.stringify(node));

        /*"annotationFormText": "",*/
    };


    // text annotation
    $scope.annotationForm = {};
    $scope.annotationForm.ontologies = "";
    $scope.annotationForm.include_views = true;
    $scope.annotationForm.display_context = false;
    $scope.annotationForm.include = "prefLabel,synonym,definition,notation,cui,semanticType,properties";
    $scope.annotationForm.longest_only = false;
    $scope.annotationForm.exclude_numbers = false;
    $scope.annotationForm.whole_word_only = true;
    $scope.annotationForm.exclude_synonyms = false;
    $scope.annotationForm.expand_class_hierarchy = false;
    $scope.annotationForm.class_hierarchy_max_level = "1";
    $scope.annotationForm.format = "json";

    $scope.divtextarea = angular.element(document.getElementById('divtextarea'));
    $scope.loadingButton = angular.element(document.getElementById('annotationLoadingButton'));


    ///////////////////////////////////////////////////////////////////////////
    // ONTOLOGY TAGS
    ///////////////////////////////////////////////////////////////////////////

    $scope.ontologytags = [];

    $scope.loadOntologyTags = function ($query) {
        return $http.get('../data/ontologies.json', {cache: true}).then(function (response) {
            var ontology_tags = response.data;
            return ontology_tags.filter(function (ontologytag) {
                let matches = val => val.toLowerCase().indexOf($query.toLowerCase()) > -1;
                return matches(ontologytag.value) || matches(ontologytag.name);
            });
        });
    };

    $scope.setTestValues = function () {
        $scope.ontologytags = [
            {
                "value": "HAO",
                "name": "Hymenoptera Anatomy Ontology (HAO)"
            },{
                "value": "MESH",
                "name": "Medical Subject Headings (MESH)"
            },{
                "value": "CARO",
                "name": "Common Anatomy Reference Ontology (CARO)"
            }];
        //angular.element(document.getElementById('divtextarea')).text("Birds and mammals are both warm-blooded animals with separate sexes determined by genetics, spinal cords, four-chambered hearts, four limbs and well-developed bony skeletons. Both groups, birds and mammals, include species that can fly and those that cannot, and both groups include species that lay eggs.");
        angular.element(document.getElementById('divtextarea')).text("Three physical features separate insects from other arthropods: they have a body divided into three regions (head, thorax, and abdomen), have three pairs of legs, and mouthparts located outside of the head capsule. It is this position of the mouthparts which divides them from their closest relatives, the non-insect hexapods, which includes Protura, Diplura, and Collembola. (Source: https://en.wikipedia.org)");
    };

    $scope.setDefault = function () {
        $scope.clearValues();
        $scope.annotationForm.whole_word_only = true;
        $scope.annotationForm.include = "prefLabel,synonym,definition,notation,cui,semanticType,properties";
    };

    $scope.clearValues = function () {
        $scope.ontologytags = [];
        angular.element(document.getElementById('divtextarea')).text("");
        $scope.annotationForm.ontologies = "";
        $scope.annotationForm.include_views = true;
        $scope.annotationForm.display_context = false;
        $scope.annotationForm.include = "";
        $scope.annotationForm.longest_only = false;
        $scope.annotationForm.exclude_numbers = false;
        $scope.annotationForm.whole_word_only = false;
        $scope.annotationForm.exclude_synonyms = false;
        $scope.annotationForm.expand_class_hierarchy = false;
        $scope.annotationForm.class_hierarchy_max_level = "1";
        $scope.annotationForm.format = "json";
    };

    $scope.setTestText = function () {
        $scope.ontologytags = [
            {
                "value": "MESH",
                "name": "Medical Subject Headings (MESH)"
            },{
                "value": "CARO",
                "name": "Common Anatomy Reference Ontology (CARO)"
            },{
                "value": "MP",
                "name": "Mammalian Phenotype Ontology (MP)"
            }, {
                "value": "CL",
                "name": "Cell Ontology (CL)"
            }, {
                "value": "BOF",
                "name": "Biodiversity Ontology (BOF)"
            }, {
                "value": "TAXRANK",
                "name": "Taxonomic Rank Vocabulary (TAXRANK)"
            },{
                "value": "VTO",
                "name": "Vertebrate Taxonomy Ontology (VTO)"
            }];
        angular.element(document.getElementById('divtextarea')).html('Cell division is a cellular process.');
    };

    $scope.setTestHTML = function () {
        angular.element(document.getElementById('divtextarea')).html('Cell division is a <span id="ID20TO35" class="annotatedText"><span id="ID20TO27" class="annotatedText">cellular</span> <span id="ID29TO35" class="annotatedText">process</span></span>');
    };


    ///////////////////////////////////////////////////////////////////////////
    // CHECK FOR ANNOTATIONS
    ///////////////////////////////////////////////////////////////////////////

    $scope.checkAnnotations = function () {
        var url = "https://data.bioontology.org/annotator?apikey=8b5b7825-538d-40e0-9e9e-5ab9274a9aeb";

        $scope.annotationForm.ontologies = "";

        var parameters = $scope.annotationForm;
        parameters.text = angular.element(document.getElementById('divtextarea')).text();
        parameters.text = parameters.text.replace(/<[^>]*>?/g, '');
        angular.element(document.getElementById('divtextarea')).text(parameters.text);
        $scope.selectedItem.text_annotation[0].text = parameters.text;
        $scope.config = {
            params: parameters
        };
        angular.forEach($scope.ontologytags, function (value, key) {
            if ($scope.annotationForm.ontologies == "") {
                $scope.annotationForm.ontologies = value.value;
            }
            else {
                $scope.annotationForm.ontologies = $scope.annotationForm.ontologies + "," + value.value;
            }
        });
        // empty grid data
        $scope.gridOptions.data = [];
        angular.element(document.getElementById('annotationLoadingButton')).button('loading');

        $scope.content = "";
        $scope.word = 'str';

        $http.get(url, $scope.config)
            .then(
            function (response) {
                // success callback

                if (response.data.length == 0){
                    alert("Sorry, no matches found.");
                    // stop loading button
                    angular.element(document.getElementById('annotationLoadingButton')).button('reset');
                }
                else {
                    console.info(JSON.stringify(response.data));
                    $scope.autoannotations = [];
                    $scope.distinctannotationlist = [];
                    $scope.distinctannotationrangeslist = [];
                    $scope.overlappingrangeslist = [];

                    // index
                    var i = 0;
                    // for each annotation
                    angular.forEach(response.data, function (value, key) {
                        var prefLabel = value.annotatedClass.prefLabel;
                        var annoDetails = value;

                        // for each range per annotation
                        angular.forEach(value.annotations, function (value, key) {

                            /////----- extract annotation data and send to grid -----/////
                            var rangeID = "ID" + value.from + "TO" + value.to;
                            var details = "";
                            if (!(annoDetails.annotatedClass.definition == null)) {
                                details = annoDetails.annotatedClass.definition[0];
                            }
                            var ont = annoDetails.annotatedClass.links.ontology;
                            var ontsplit = ont.split("/");
                            var ontabbr = ontsplit[ontsplit.length - 1];
                            $scope.autoannotations.push({
                                "temp_id": i,
                                "from": value.from,
                                "to": value.to,
                                "range_id": rangeID,
                                "matchType": value.matchType,
                                "text": value.text,
                                "quote": value.text,
                                "prefLabel": prefLabel,
                                "class_id": annoDetails.annotatedClass["@id"],
                                "ontology": annoDetails.annotatedClass.links.ontology,
                                "ontologyname": ontabbr,
                                "type": annoDetails.annotatedClass["@type"],
                                "definition": details,
                                "details": annoDetails
                            });

                            i = i + 1;

                            ///// extract distinct ranges //////////////
                            if (!(_.includes($scope.distinctannotationrangeslist, rangeID))) {
                                $scope.distinctannotationrangeslist.push(rangeID);
                                $scope.distinctannotationlist.push({
                                    "from": value.from,
                                    "to": value.to,
                                    "html_id": rangeID,
                                    "quote": value.text
                                });
                            }

                        });

                    });

                    // sort annotation data according to occurrence a-z
                    $scope.autoannotations = _.sortBy($scope.autoannotations, "from");
                    // fill annotation data to grid data
                    setTimeout(_ => $scope.gridOptions.data = $scope.autoannotations, 100);
                    // stop loading button
                    angular.element(document.getElementById('annotationLoadingButton')).button('reset');

                    // sort Annotation list "to" a-z, "from" z-a
                    $scope.distinctannotationlist.sort(function (x, y) { return x.to - y.to || y.from - x.from; });
                    // reverse list
                    $scope.distinctannotationlist = $scope.distinctannotationlist.reverse();

                    angular.forEach($scope.distinctannotationlist, function (value, key) {

                        if ($scope.overlappingrangeslist.indexOf(value.html_id) <= -1){
                            $scope.content = angular.element(document.getElementById('divtextarea')).html();
                            $scope.content = $scope.content.replace(/&nbsp;/gi," ");

                            $scope.sub1 = $scope.content.substring(0, value.from - 1);
                            $scope.sub2 = $scope.content.substring(value.from - 1, value.to);
                            $scope.sub3 = $scope.content.substring(value.to);

                            //alert("$scope.sub " + value.from + " " + value.to + " " + value.html_id + " " + value.quote +  "\n" + $scope.sub1 + "\n text - " + $scope.sub2 + "\n" + $scope.sub3);

                            if ($scope.sub2.indexOf(" ") > -1) {
                                $scope.wordlist = $scope.sub2.split(" ");
                                $scope.wordstart = value.from;
                                $scope.subsubArray = [];
                                $scope.subsub2 = "";

                                angular.forEach($scope.wordlist, function (word, key) {
                                    var from = $scope.wordstart;
                                    var to = parseInt($scope.wordstart) + parseInt(word.length) -1;
                                    var tempid = "ID" + from + "TO" + to;
                                    //alert("word: " + word  + "\nword.length: " + word.length + "\nword.from: " + from + "\nword.to: " + to);
                                    $scope.subsubArray.push("<span id='" + tempid + "' class='annotatedText'>" + word + "</span>");
                                    $scope.wordstart = to + 2;
                                    $scope.overlappingrangeslist.push(tempid);
                                });

                                angular.forEach($scope.subsubArray, function (span, key) {

                                    if ($scope.subsub2.length == 0){
                                        $scope.subsub2 =  span;
                                    }
                                    else{
                                        $scope.subsub2 =  $scope.subsub2 + " " + span;
                                    }
                                });

                                $scope.sub2 = $scope.subsub2;
                            }

                            $scope.word = !!$scope.sub2 ? $scope.sub2 : $scope.word;
                            $scope.sub2 = "<span id='" + value.html_id + "' class='annotatedText'>" + $scope.sub2 + "</span>";
                            $scope.overlappingrangeslist.push(value.html_id);

                            $scope.subsubsub = $scope.sub1 + $scope.sub2 + $scope.sub3;

                            angular.element(document.getElementById('divtextarea')).html($scope.subsubsub);
                        }
                        else {
                            //alert("$scope.overlappingrangeslist " + JSON.stringify($scope.overlappingrangeslist));
                        }
                    });

                    $scope.selectedItem.text_annotation[0].autoannotations.html =
                        $scope.selectedItem.text_annotation[0].autoannotations = $scope.autoannotations;

                }
            },
            function (response) {
                // failure call back
                alert("Sorry, something went wrong. Please reload page and try again."); // : " + response.data.errors[0]);

                // stop loading button
                angular.element(document.getElementById('annotationLoadingButton')).button('reset');
            }
        )
            .then(function () {
                //necessary for grid to draw correctly
                $timeout(function () {
                    $scope.gridApi.core.handleWindowResize();
                }, 250);
            });

    };

    ///////////////////////////////////////////////////////////////////////////
    // UI GRID
    ///////////////////////////////////////////////////////////////////////////

    $scope.lastSelectedRow = {};
    $scope.info = {};

    $scope.addToPartonomy = function(actionId, entity) {
        console.log("clicked on the action ", actionId, entity);

        const parentNode = $scope.selectedNode;

        const getQuality = actionId => {
            switch(actionId) {
                case 0: return "point";
                case 1: return "line";
                case 2: return "surface";
                case 3: return "space";
                case 4: return "3D";
                case 5: return "substance";
                case 6: return "not";
                default:
                    return "3D"
            }
        };

        parentNode.nodes.push({
            "id": $scope.maxnodes + 1, //parentNode.id * 10 + parentNode.nodes.length,
            "is_root": false,
            "title": entity.text,
            "label_class": entity.ontologyname + ": " + entity.prefLabel,
            "is_not": actionId === 6,
            "instance_of": "antenna",
            "definition": "---",
            "obo_id": entity.class_id,
            "URI": entity.ontology,
            "ontology": entity.ontologyname,
            "obo_namespace": entity.obo_namespace,
            "quality": getQuality(actionId),
            "text_annotation":[{
                "text": "",
                "html": "",
                "autoannotations": [],
                "ontologytags":  []
            }],
            "image_annotation": [{
                "image": "",
                "annotations": []
            }],
            "nodes": []
        });

        $scope.maxnodes = $scope.maxnodes + 1;
    };

    $scope.gridHeaderTitle = {
        "Annotated Text": "Select the definition of the term highlighted in your text.",
        "Annotated Class": "View class and ontology information provided by NCBO BioPortal (external links). To see the class definition (if available), place mouse over class name.",
        "Add to Partonomy as ...": "Select structure you want to add to the partonomy. You will be redirected to the edit screen of the new part e.g. to change the label."
    };

    const cellHeaderTemplate = `<div
        role="columnheader"
        title="{{grid.appScope.gridHeaderTitle[col.displayName]}}"
        ng-class="{ 'sortable': sortable }"
        ui-grid-one-bind-aria-labelledby-grid="col.uid + '-header-text ' + col.uid + '-sortdir-text'"
        aria-sort="{{col.sort.direction == asc ? 'ascending' : ( col.sort.direction == desc ? 'descending' : (!col.sort.direction ? 'none' : 'other'))}}">
        <div
        role="button"
        tabindex="0"
        class="ui-grid-cell-contents ui-grid-header-cell-primary-focus"
        col-index="renderIndex">
        <span
            class="ui-grid-header-cell-label"
            ui-grid-one-bind-id-grid="col.uid + '-header-text'">
            {{ col.displayName CUSTOM_FILTERS }}
        </span>

        <span
            ui-grid-one-bind-id-grid="col.uid + '-sortdir-text'"
            ui-grid-visible="col.sort.direction"
            aria-label="{{getSortDirectionAriaLabel()}}">
            <i
            ng-class="{ 'ui-grid-icon-up-dir': col.sort.direction == asc, 'ui-grid-icon-down-dir': col.sort.direction == desc, 'ui-grid-icon-blank': !col.sort.direction }"
            title="{{isSortPriorityVisible() ? i18n.headerCell.priority + ' ' + ( col.sort.priority + 1 )  : null}}"
            aria-hidden="true">
        </i>
        <sub
            ui-grid-visible="isSortPriorityVisible()"
            class="ui-grid-sort-priority-number">
            {{col.sort.priority + 1}}
        </sub>
        </span>
        </div>

        <div
        role="button"
        tabindex="0"
        ui-grid-one-bind-id-grid="col.uid + '-menu-button'"
        class="ui-grid-column-menu-button"
        ng-if="grid.options.enableColumnMenus && !col.isRowHeader  && col.colDef.enableColumnMenu !== false"
        ng-click="toggleMenu($event)"
        ng-class="{'ui-grid-column-menu-button-last-col': isLastCol}"
        ui-grid-one-bind-aria-label="i18n.headerCell.aria.columnMenuButtonLabel"
        aria-haspopup="true">
        <i
            class="ui-grid-icon-angle-down"
            aria-hidden="true">
            &nbsp;
        </i>
        </div>

        <div ui-grid-filter></div>
    </div>`;

    $scope.gridOptions = {
        enableRowSelection: true,
        enableFullRowSelection: true,
        enableSelectAll: false,
        enableGridMenu: true,
        selectionRowHeaderWidth: 0,
        rowHeight: 30,
        showGridFooter: false,
        multiSelect: false,
        showGroupPanel: true,
        enableCellSelection: false,
        enablePaging: true,
        columnDefs: [
            {
                name: 'text',
                displayName: 'Annotated Text',
                headerCellTemplate: cellHeaderTemplate,
                //width: '200',
                enableColumnResizing: true,
                cellTemplate: `<div class="ui-grid-cell-contents"><input ng-model="radioselect[COL_FIELD]" name="radioselect_{{COL_FIELD}}" type="radio" value="0" style="width:20px; height:auto;" /> {{COL_FIELD}}</div>`
                ,sortingAlgorithm: function(a, b, rowA, rowB, direction) {
                return rowA.entity.text.localeCompare(rowB.entity.text);
            }
            },
            {
                name: 'class_id',
                displayName: 'Annotated Class',
                headerCellTemplate: cellHeaderTemplate,
                //width: '200',
                enableColumnResizing: true,
                cellTemplate: '<div class="ui-grid-cell-contents">' +
                '   <a href="{{COL_FIELD}}" target="_blank" title="{{row.entity.definition}} (Click for more information on BioPortal)">{{row.entity.prefLabel}}</a>' +
                '   <a href="https://bioportal.bioontology.org/ontologies/{{row.entity.ontologyname}}" target="_blank" title="View ontology information on BioPortal">[{{row.entity.ontologyname}}]</a>' +
                '</div>',
                sortingAlgorithm: function(a, b, rowA, rowB, direction) {
                    return rowA.entity.prefLabel.localeCompare(rowB.entity.prefLabel);
                }
            },
            {
                name: "temp_id",
                displayName: "Add to Partonomy as ...",
                headerCellTemplate: cellHeaderTemplate,
                enableSorting: false,
                enableColumnResizing: false,
                cellTemplate: `<div class="ui-grid-cell-contents">
                    <span title="structure" style="cursor:pointer;" ng-click="grid.appScope.addToPartonomy(6, row.entity)">
                      <img style="height:25px;border:1px solid black;" src="/img/icon_description_property_group.jpg">
                    </span>
                    <span title="structure" style="cursor:pointer;" ng-click="grid.appScope.addToPartonomy(4, row.entity)">
                      <img style="height:25px;border:1px solid black;" src="/img/icon_description_property_3D.jpg">
                    </span>
                    <span title="a surface area" style="cursor:pointer;" ng-click="grid.appScope.addToPartonomy(2, row.entity)">
                      <img style="height:25px;border:1px solid black;" src="/img/icon_description_property_surface.jpg">
                    </span>
                    <span title="a line" style="cursor:pointer;" ng-click="grid.appScope.addToPartonomy(1, row.entity)">
                      <img style="height:25px;border:1px solid black;" src="/img/icon_description_property_line.jpg">
                    </span>
                    <span title="a point" style="cursor:pointer;" ng-click="grid.appScope.addToPartonomy(0, row.entity)">
                      <img style="height:25px;border:1px solid black;" src="/img/icon_description_property_point.jpg">
                    </span>
                    <span title="a space" style="cursor:pointer;" ng-click="grid.appScope.addToPartonomy(3, row.entity)">
                      <img style="height:25px;border:1px solid black;" src="/img/icon_description_property_space.jpg">
                    </span>
                    <span title="a portion" style="cursor:pointer;" ng-click="grid.appScope.addToPartonomy(5, row.entity)">
                      <img style="height:25px;border:1px solid black;" src="/img/icon_description_property_substance.jpg">
                    </span>
                </div>`
            }
        ]
    };

    $scope.gridOptions.onRegisterApi = function (gridApi) {
        //set gridApi on scope
        $scope.gridApi = gridApi;

        gridApi.selection.on.rowSelectionChanged($scope, function (row) {
            var msg = 'row selected ' + row.isSelected;
            $log.log(msg);

            if (row.isSelected) {
                //"temp_id": i,
                //"from": value.from,
                //"to": value.to,
                //"range_id": rangeID,
                //"matchType": value.matchType,
                //"text": value.text,
                //"quote": value.text,
                //"prefLabel": prefLabel,
                //"class_id": annoDetails.annotatedClass["@id"],
                //"ontology": annoDetails.annotatedClass.links.ontology,
                //"type": annoDetails.annotatedClass["@type"],
                //"definition": annoDetails.annotatedClass.definition[0],
                //"details": annoDetails
                if ($scope.lastSelectedRow) {
                    angular.element(document.getElementById($scope.lastSelectedRow.range_id)).removeClass('highlightedText');
                }
                angular.element(document.getElementById(row.entity.range_id)).addClass('highlightedText');
                $scope.lastSelectedRow = row.entity;
                //if (!row.entity.definition)
                //    $scope.lastSelectedRow.definition = "";
            }
            else {
                angular.element(document.getElementById(row.entity.range_id)).removeClass('highlightedText');
            }

        });
    };
});

MDBControllers.controller('EntrySpecCtrl', function ($scope, $rootScope, $log, $http, $location, $cookies, AuthService, NotificationService, $uibModal, WsService, MDBDocumentService) {
    // initial values for Auth and Cookies
    $scope.loggedIn = AuthService.isLoggedIn();
    $scope.currentUser = AuthService.getUsername();
    $scope.userStatus = AuthService.getUserStatus();
    //$scope.cookies = $cookies.getAll();

    // listen for authentication events
    $scope.$watch(AuthService.isLoggedIn, function () {
        $scope.loggedIn = AuthService.isLoggedIn();
        $scope.currentUser = AuthService.getUsername();
        $scope.userStatus = AuthService.getUserStatus();
    });

    // listen for cookie events
    $scope.$watch($cookies.getAll, function () {
        $scope.cookies = $cookies.getAll();
    });

    $scope.getConnectSID = function () {
        AuthService.getConnectSID()
            .then(function () {
                //alert("connectSID: " + AuthService.connectSID);
            })
            // handle error
            .catch(function () {
                //alert("getConnectSID fail");
            });
    };

    ///////////////////////////////////////////////////////////////////////////
    //NotificationService
    ///////////////////////////////////////////////////////////////////////////

    $scope.NotificationService = NotificationService;

    // NotificationService.showInfo(message) - send message string as info notification
    // NotificationService.showSuccess(message) - send message string as success notification
    // NotificationService.showError(message) - send message string as error notification

    // listen for notification events
    $scope.$watch(NotificationService.getNotification, function () {
        $scope.notification = NotificationService.getMessage();
        $scope.showInfo = NotificationService.getShowInfo();
        $scope.showSuccess = NotificationService.getShowSuccess();
        $scope.showError = NotificationService.getShowError();
    });

    ///////////////////////////////////////////////////////////////////////////
    //WsService
    ///////////////////////////////////////////////////////////////////////////

    $scope.WsService = WsService;

    ///////////////////////////////////////////////////////////////////////////
    //AuthService
    ///////////////////////////////////////////////////////////////////////////

    $scope.AuthService = AuthService; // getUserInfoByUEIDFromDB(ueid)
    //$scope.AuthService.getUserInfoByUEIDFromDB = getUserInfoByUEIDFromDB.getUserInfoFromDB();

    ///////////////////////////////////////////////////////////////////////////
    //Show entry
    ///////////////////////////////////////////////////////////////////////////

    $scope.loadMDBEntry = function (mdb_entry_id) {
        $location.path('/mdb_entry');
        var value = "";
        var key_data = [];
        WsService.sendCheckInputToWebsocket(mdb_entry_id, "SC_BASIC_0000000931", value, key_data, $scope.cookies['currentUEID'], null);
    };

    $scope.loadMDBEntryJSON = function (mdb_entry_id) {
        var value = "";
        var key_data = [];
        WsService.sendCheckInputToWebsocket(mdb_entry_id, "SC_BASIC_0000000931", value, key_data, $scope.cookies['currentUEID'], null);
    };

    ///////////////////////////////////////////////////////////////////////////
    //Dynamic entry modal
    ///////////////////////////////////////////////////////////////////////////

    $scope.loadingButton = angular.element(document.getElementById('SC_MDB_BASIC_0000000814'));
    if ( document.getElementById('loadingExcuse') !== null ) {
        document.getElementById('loadingExcuse').style.display = 'none';
    }

    // button
    $scope.MY_DUMMY_SPECIMEN_0000000001 = {};

    $scope.submit = MDBDocumentService.submit;

    // modal
    //$scope.mdboverlay = '';

    $scope.openTestModal = function () {
        //$rootScope.$broadcast('sendTestOverlay');
        $rootScope.$broadcast('sendTestNewEntryOverlay');
    };

    $rootScope.$on('WSMDBOverlayCompositionMessage', function (event, args) {
        $scope.loadingButton.button('reset');
        if ( document.getElementById('loadingExcuse') !== null ) {
            document.getElementById('loadingExcuse').style.display = 'none';
        }
        //$scope.mdboverlay = args.socket_message;
    });

    $scope.showModalElement = function (element) {
        angular.element(element).modal('show');
    };
});

MDBControllers.controller('EntryDescCtrl', function ($scope, $rootScope, $log, $http, $location, $cookies, AuthService, NotificationService, $uibModal, WsService, MDBDocumentService) {
    // initial values for Auth and Cookies
    $scope.loggedIn = AuthService.isLoggedIn();
    $scope.currentUser = AuthService.getUsername();
    $scope.userStatus = AuthService.getUserStatus();
    //$scope.cookies = $cookies.getAll();

    // listen for authentication events
    $scope.$watch(AuthService.isLoggedIn, function () {
        $scope.loggedIn = AuthService.isLoggedIn();
        $scope.currentUser = AuthService.getUsername();
        $scope.userStatus = AuthService.getUserStatus();
    });

    // listen for cookie events
    $scope.$watch($cookies.getAll, function () {
        $scope.cookies = $cookies.getAll();
    });

    $scope.getConnectSID = function () {
        AuthService.getConnectSID()
            .then(function () {
                //alert("connectSID: " + AuthService.connectSID);
            })
            // handle error
            .catch(function () {
                //alert("getConnectSID fail");
            });
    };

    ///////////////////////////////////////////////////////////////////////////
    //NotificationService
    ///////////////////////////////////////////////////////////////////////////

    $scope.NotificationService = NotificationService;

    // NotificationService.showInfo(message) - send message string as info notification
    // NotificationService.showSuccess(message) - send message string as success notification
    // NotificationService.showError(message) - send message string as error notification

    // listen for notification events
    $scope.$watch(NotificationService.getNotification, function () {
        $scope.notification = NotificationService.getMessage();
        $scope.showInfo = NotificationService.getShowInfo();
        $scope.showSuccess = NotificationService.getShowSuccess();
        $scope.showError = NotificationService.getShowError();
    });

    ///////////////////////////////////////////////////////////////////////////
    //WsService
    ///////////////////////////////////////////////////////////////////////////

    $scope.WsService = WsService;

    ///////////////////////////////////////////////////////////////////////////
    //AuthService
    ///////////////////////////////////////////////////////////////////////////

    $scope.AuthService = AuthService; // getUserInfoByUEIDFromDB(ueid)
    //$scope.AuthService.getUserInfoByUEIDFromDB = AuthService.getUserInfoByUEIDFromDB();

    ///////////////////////////////////////////////////////////////////////////
    //Show entry
    ///////////////////////////////////////////////////////////////////////////

    $scope.loadMDBEntry = function (mdb_entry_id) {
        $location.path('/mdb_entry');
        var value = "";
        var key_data = [];
        WsService.sendCheckInputToWebsocket(mdb_entry_id, "SC_BASIC_0000000931", value, key_data, $scope.cookies['currentUEID'], null);
    };

    $scope.loadMDBEntryJSON = function (mdb_entry_id) {
        var value = "";
        var key_data = [];
        WsService.sendCheckInputToWebsocket(mdb_entry_id, "SC_BASIC_0000000931", value, key_data, $scope.cookies['currentUEID'], null);
    };


    ///////////////////////////////////////////////////////////////////////////
    //Dynamic entry modal
    ///////////////////////////////////////////////////////////////////////////

    $scope.loadingButton = angular.element(document.getElementById('SC_MDB_BASIC_0000000659'));
    if ( document.getElementById('loadingExcuse') !== null ) {
        document.getElementById('loadingExcuse').style.display = 'none';
    }

    // button
    $scope.MY_DUMMY_SPECIMEN_0000000001 = {};

    $scope.submit = MDBDocumentService.submit;

    // modal
    $scope.mdboverlay = '';

    $scope.openTestModal = function () {
        $rootScope.$broadcast('sendTestOverlay');
    };

    $rootScope.$on('WSMDBOverlayCompositionMessage', function (event, args) {
        $scope.loadingButton.button('reset');
        if ( document.getElementById('loadingExcuse') !== null ) {
            document.getElementById('loadingExcuse').style.display = 'none';
        }
        $scope.mdboverlay = args.socket_message;
    });

    $scope.showModalElement = function (element) {
        angular.element(element).modal('show');
    };
});

MDBControllers.controller('MDBEntryCtrl', function ($scope, $rootScope, $routeParams, $log, $http, $location, $cookies, $compile, AuthService, NotificationService, WsService) {
// initial values for Auth and Cookies
    $scope.loggedIn = AuthService.isLoggedIn();
    $scope.currentUser = AuthService.getUsername();
    $scope.userStatus = AuthService.getUserStatus();
    $scope.cookies = $cookies.getAll();

    // listen for authentication events
    $scope.$watch(AuthService.isLoggedIn, function () {
        $scope.loggedIn = AuthService.isLoggedIn();
        $scope.currentUser = AuthService.getUsername();
        $scope.userStatus = AuthService.getUserStatus();
    });

    // listen for cookie events
    $scope.$watch($cookies.getAll, function () {
        $scope.cookies = $cookies.getAll();
    });

    ///////////////////////////////////////////////////////////////////////////
    //WsService
    ///////////////////////////////////////////////////////////////////////////
    $scope.WsService = WsService;

    //WsService.sent[0] = {
    //    "type": "check_input",
    //    "localID": "SC_BASIC_0000000931",
    //    "mdbueid": "421701d8",
    //    "mdbueid_uri": "",
    //    "html_form": "de46dd64-20170705-s-2-d_1_1#SC_BASIC_0000001506_1",
    //    "connectSID": "s:42-HALLOHIERALARMEINS1ELF-TTESTT.SANDRASGANZPERSOENLICHEMDBPROTOTYPSESSIONID",
    //    "localIDs": [],
    //    "http://www.soccomas.org/Ontologies/SOCCOMAS/SprO#SPRO_0000000321": "#TimeInterval_1",
    //    "http://www.soccomas.org/Ontologies/SOCCOMAS/SprO#SPRO_0000000148": "#SC_BASIC_0000001483_1"
    //}

    $scope.entry_Id = $routeParams.entryId;

    if ($scope.entry_Id){
        var value = " ";
        var key_data = [];
        var mdb_entry_id = $scope.entry_Id + "#SC_BASIC_0000001506_1";
        var value = "http://www.morphdbase.de/resource/" + $scope.entry_Id;
        //WsService.sendCheckInputToWebsocket(mdb_entry_id, "SC_BASIC_0000000931", value, key_data, $scope.cookies['currentUEID'], null);
        WsService.sendCheckURIToWebsocket(value);
    }


    // TODO: adjust default entry
    // "de46dd64-20170131-s-7-d_1_1#SC_BASIC_0000001506_1"
    // "6cc9ca2f-20170106-s-3-d_1_1#SC_BASIC_0000001506_1"
    // "de46dd64-20170208-s-16-d_1_1#SC_BASIC_0000001506_1"
    // "de46dd64-20170619-s-2-d_1_1#SC_BASIC_0000001506_1"
    // "de46dd64-20170619-s-9-d_1_1#SC_BASIC_0000001506_1"
    // "de46dd64-20170621-s-7-d_1_1#SC_BASIC_0000001506_1"
    // "de46dd64-20170623-s-7-d_1_1#SC_BASIC_0000001506_1"
    // "de46dd64-20170630-s-8-d_1_1#SC_BASIC_0000001506_1"
    // "de46dd64-20170705-s-1-d_1_1#SC_BASIC_0000001506_1"
    //$scope.WsService.sendCheckInputToWebsocket("de46dd64-20170705-s-1-d_1_1#SC_BASIC_0000001506_1", "SC_BASIC_0000000931", "", [], $scope.cookies['currentUEID']);

});

MDBControllers.controller('MDBEntryListCtrl', function ($scope, $rootScope, $routeParams, $log, $http, $location, AuthService, NotificationService, $cookies, WsService, MDBDocumentService) {
    // initial values for Auth and Cookies
    $scope.loggedIn = AuthService.isLoggedIn();
    $scope.currentUser = AuthService.getUsername();
    $scope.userStatus = AuthService.getUserStatus();
    $scope.cookies = $cookies.getAll();

    // listen for authentication events
    $scope.$watch(AuthService.isLoggedIn, function () {
        $scope.loggedIn = AuthService.isLoggedIn();
        $scope.currentUser = AuthService.getUsername();
        $scope.userStatus = AuthService.getUserStatus();
    });

    // listen for cookie events
    $scope.$watch($cookies.getAll, function () {
        $scope.cookies = $cookies.getAll();
    });

    ///////////////////////////////////////////////////////////////////////////
    //WsService
    ///////////////////////////////////////////////////////////////////////////

    $scope.WsService = WsService;

    ///////////////////////////////////////////////////////////////////////////
    //MDBDocumentService & Loading spinner
    ///////////////////////////////////////////////////////////////////////////

    $scope.MDBDocumentService = MDBDocumentService;
    $scope.showMDBEntryList = WsService.sendShowEntryListToWebsocket;

    $scope.entryType = $routeParams.entryType;
    $scope.showMDBEntryList($scope.entryType);

    // loading check
    $scope.doc_loading = MDBDocumentService.docLoading;

    $rootScope.$on('MDBDocumentService_doc_loading_update', function(event, args) {
        $scope.doc_loading = args.doc_loading;
    });

});


MDBControllers.controller('MDBPartonomyCtrl', function ($scope, $rootScope, $log, $http, $location, $cookies, $compile, AuthService, NotificationService, WsService) {
// initial values for Auth and Cookies
    $scope.loggedIn = AuthService.isLoggedIn();
    $scope.currentUser = AuthService.getUsername();
    $scope.userStatus = AuthService.getUserStatus();
    $scope.cookies = $cookies.getAll();

    // listen for authentication events
    $scope.$watch(AuthService.isLoggedIn, function () {
        $scope.loggedIn = AuthService.isLoggedIn();
        $scope.currentUser = AuthService.getUsername();
        $scope.userStatus = AuthService.getUserStatus();
    });

    // listen for cookie events
    $scope.$watch($cookies.getAll, function () {
        $scope.cookies = $cookies.getAll();
    });

    ///////////////////////////////////////////////////////////////////////////
    //WsService
    ///////////////////////////////////////////////////////////////////////////
    $scope.WsService = WsService;

    // TODO: adjust default entry
    // "de46dd64-20170131-s-7-d_1_1#SC_BASIC_0000001506_1"
    // "6cc9ca2f-20170106-s-3-d_1_1#SC_BASIC_0000001506_1"
    // "de46dd64-20170208-s-16-d_1_1#SC_BASIC_0000001506_1"
    // "de46dd64-20170619-s-2-d_1_1#SC_BASIC_0000001506_1"
    // "de46dd64-20170619-s-9-d_1_1#SC_BASIC_0000001506_1"
    // "de46dd64-20170621-s-7-d_1_1#SC_BASIC_0000001506_1"
    // "de46dd64-20170623-s-7-d_1_1#SC_BASIC_0000001506_1"
    // "de46dd64-20170630-s-8-d_1_1#SC_BASIC_0000001506_1"
    // "de46dd64-20170705-s-1-d_1_1#SC_BASIC_0000001506_1"
    //$scope.WsService.sendCheckInputToWebsocket("de46dd64-20170705-s-1-d_1_1#SC_BASIC_0000001506_1", "SC_BASIC_0000000931", "", [], $scope.cookies['currentUEID']);

});

MDBControllers.controller('EntryCtrl', function ($scope, $rootScope, $log, $http, $location, AuthService, NotificationService, $cookies, WsService) {
// initial values for Auth and Cookies
    $scope.loggedIn = AuthService.isLoggedIn();
    $scope.currentUser = AuthService.getUsername();
    $scope.userStatus = AuthService.getUserStatus();
    $scope.cookies = $cookies.getAll();

    // listen for authentication events
    $scope.$watch(AuthService.isLoggedIn, function () {
        $scope.loggedIn = AuthService.isLoggedIn();
        $scope.currentUser = AuthService.getUsername();
        $scope.userStatus = AuthService.getUserStatus();
    });

    // listen for cookie events
    $scope.$watch($cookies.getAll, function () {
        $scope.cookies = $cookies.getAll();
    });

    ///////////////////////////////////////////////////////////////////////////
    //WsService
    ///////////////////////////////////////////////////////////////////////////
    $scope.WsService = WsService;
    // "de46dd64-20170131-s-7-d_1_1#SC_BASIC_0000001506_1"
    // "6cc9ca2f-20170106-s-3-d_1_1#SC_BASIC_0000001506_1"
    // "de46dd64-20170208-s-16-d_1_1#SC_BASIC_0000001506_1"
    //$scope.WsService.sendCheckInputToWebsocket("de46dd64-20170208-s-16-d_1_1#SC_BASIC_0000001506_1", "SC_BASIC_0000000931", "", [], $scope.cookies['currentUEID']);

});

MDBControllers.controller('AdminCtrl', function ($scope, $rootScope, $log, $http, $location, $cookies, AuthService, WsService) {
// initial values for Auth and Cookies
    $scope.loggedIn = AuthService.isLoggedIn();
    $scope.currentUser = AuthService.getUsername();
    $scope.userStatus = AuthService.getUserStatus();
    $scope.cookies = $cookies.getAll();

    // listen for authentication events
    $scope.$watch(AuthService.isLoggedIn, function () {
        $scope.loggedIn = AuthService.isLoggedIn();
        $scope.currentUser = AuthService.getUsername();
        $scope.userStatus = AuthService.getUserStatus();
    });

    // listen for cookie events
    $scope.$watch($cookies.getAll, function () {
        $scope.cookies = $cookies.getAll();
    });

    ///// TEST //// TODO: remove, if deprecated.
    $scope.localPageParams = {};
    $scope.localPageParams.overlay = "overlay";

    $scope.sendOverlayRequestToWebsocket = function(){
        if($scope.localPageParams.overlay){
            WsService.sendWhateverToWebsocket("type", $scope.localPageParams.overlay);
        }

    };
});

MDBControllers.controller('MDBPageCtrl', function ($scope, $rootScope, $log, $http, $location, $cookies, AuthService, MDBDocumentService) {
// initial values for Auth and Cookies
    $scope.loggedIn = AuthService.isLoggedIn();
    $scope.currentUser = AuthService.getUsername();
    $scope.userStatus = AuthService.getUserStatus();
    $scope.cookies = $cookies.getAll();

    // listen for authentication events
    $scope.$watch(AuthService.isLoggedIn, function () {
        $scope.loggedIn = AuthService.isLoggedIn();
        $scope.currentUser = AuthService.getUsername();
        $scope.userStatus = AuthService.getUserStatus();
    });

    // listen for cookie events
    $scope.$watch($cookies.getAll, function () {
        $scope.cookies = $cookies.getAll();
    });

    // update id of mdbpage
    //$scope.$on('MDBPageComposition_updated', function () {
    //    MDBDocumentService.getMDBPage()
    //        .then(function(mdbpage) {
    //            $scope.mdbpage = mdbpage;
    //            if ($scope.mdbpage.data) {
    //                $scope.mdbformid = $scope.mdbpage.load_page_localID;
    //                MDBDocumentService.setInput($scope.mdbpage.data)
    //                    .then(function(items) {
    //                        $scope.mdbDoc = items;
    //                    });
    //            }
    //        });
    //    $scope.loading = false;
    //    $scope.nopage = false;
    //});

    // modal

    //$scope.mdbentrywidget = {};
    //
    //$scope.showModalElement = function (element) {
    //    angular.element(element).modal('show');
    //};
    //
    //$rootScope.$on('WSMDBOverlayCompositionMessage', function (event, args) {
    //    $scope.mdbentrywidget = args.socket_message;
    //    $scope.showModalElement("#mdboverlayid");
    //});
    //
    //$scope.openTestOverlay = function () {
    //   $rootScope.$broadcast('sendTestOverlay');
    //};


});

MDBControllers.controller('JohnSmithCtrl', function ($scope, $rootScope, $log, $http, $location, AuthService, NotificationService, $cookies, WsService) {
    // initial values for Auth and Cookies
    $scope.loggedIn = AuthService.isLoggedIn();
    $scope.currentUser = AuthService.getUsername();
    $scope.userStatus = AuthService.getUserStatus();
    $scope.cookies = $cookies.getAll();

    // listen for authentication events
    $scope.$watch(AuthService.isLoggedIn, function () {
        $scope.loggedIn = AuthService.isLoggedIn();
        $scope.currentUser = AuthService.getUsername();
        $scope.userStatus = AuthService.getUserStatus();
    });

    // listen for cookie events
    $scope.$watch($cookies.getAll, function () {
        $scope.cookies = $cookies.getAll();
    });

    ///////////////////////////////////////////////////////////////////////////
    //WsService
    ///////////////////////////////////////////////////////////////////////////

    $scope.WsService = WsService;

});

MDBControllers.controller('HelpCtrl', function ($scope, $rootScope, $log, $http, $location, AuthService, NotificationService, $cookies, WsService) {
    // initial values for Auth and Cookies
    $scope.loggedIn = AuthService.isLoggedIn();
    $scope.currentUser = AuthService.getUsername();
    $scope.userStatus = AuthService.getUserStatus();
    $scope.cookies = $cookies.getAll();

    // listen for authentication events
    $scope.$watch(AuthService.isLoggedIn, function () {
        $scope.loggedIn = AuthService.isLoggedIn();
        $scope.currentUser = AuthService.getUsername();
        $scope.userStatus = AuthService.getUserStatus();
    });

    // listen for cookie events
    $scope.$watch($cookies.getAll, function () {
        $scope.cookies = $cookies.getAll();
    });

    ///////////////////////////////////////////////////////////////////////////
    //WsService
    ///////////////////////////////////////////////////////////////////////////

    $scope.WsService = WsService;

});


////Template for copying////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
MDBControllers.controller('CopyTemplateCtrl', function ($scope, $rootScope, $log, $http, $location, AuthService, NotificationService, $cookies, WsService) {
    // initial values for Auth and Cookies
    $scope.loggedIn = AuthService.isLoggedIn();
    $scope.currentUser = AuthService.getUsername();
    $scope.userStatus = AuthService.getUserStatus();
    $scope.cookies = $cookies.getAll();

    // listen for authentication events
    $scope.$watch(AuthService.isLoggedIn, function () {
        $scope.loggedIn = AuthService.isLoggedIn();
        $scope.currentUser = AuthService.getUsername();
        $scope.userStatus = AuthService.getUserStatus();
    });

    // listen for cookie events
    $scope.$watch($cookies.getAll, function () {
        $scope.cookies = $cookies.getAll();
    });

    ///////////////////////////////////////////////////////////////////////////
    //WsService
    ///////////////////////////////////////////////////////////////////////////

    $scope.WsService = WsService;

});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////