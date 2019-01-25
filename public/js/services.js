'use strict';

/* Services */
var MDBServices = angular.module('mdbApp.services', []);

// Demonstrate how to register services
// In this case it is a simple value service.
MDBServices.value('version', '0.1');

/////// General services ///////////////////////////////////////////////////////////////

// shows notification messages within header, fades out, info, error or success
/**
 * public functions **
 * NotificationService.getMessage() - get the notification message
 * NotificationService.resetMessage() - resets the notification message
 * NotificationService.getNotification() - returns true if there is currently an active notification
 * NotificationService.getShowInfo() - returns true if there is currently an active info notification
 * NotificationService.getShowSuccess() - returns true if there is currently an active success notification
 * NotificationService.getShowError() - returns true if there is currently an active error notification
 * NotificationService.showInfo(message) - send message string as info notification
 * NotificationService.showSuccess(message) - send message string as success notification
 * NotificationService.showError(message) - send message string as error notification
 */
MDBServices.factory('NotificationService', function ($q, $rootScope, $timeout, AlertService) {
    // message which is shown
    var message = '';
    // is currently a notification shown?
    var notification = false;

    // boolean variables to switch notifications on or off
    var showinfo = false;
    var showerror = false;
    var showsuccess = false;

    function setMessage(data) {
        setNotification(true);
        message = data;
    }

    function getMessage() {
        return message;
    }

    function resetMessage() {
        setNotification(false);
        message = '';
    }

    function setNotification(show) {
        notification = show;
    }

    function getNotification() {
        return notification;
    }

    function setShowInfo(show) {
        showinfo = show;
    }

    function getShowInfo() {
        return showinfo;
    }

    function setShowError(show) {
        showerror = show;
    }

    function getShowError() {
        return showerror;
    }

    function setShowSuccess(show) {
        showsuccess = show;
    }

    function getShowSuccess() {
        return showsuccess;
    }

    function logNotification(type, message) {
        let timestamp = new Date().getTime();
        let stored = JSON.parse(localStorage.getItem("stored_logs") || "[]");
        stored.push({type, message, timestamp});

        // only store the last 5 messages
        const MAX_NUM_STORED_MESSAGES = 5;
        stored = stored.sort((a, b) => a.timestamp - b.timestamp).reverse().slice(0, MAX_NUM_STORED_MESSAGES);

        localStorage.setItem("stored_logs", JSON.stringify(stored))
    }

    function showInfo(message) {
        setShowInfo(true);
        setMessage(message);
        AlertService.addAlert('info', message);
        logNotification("info", message);

        //$timeout(function () {
        //    setShowInfo(false);
        //    resetMessage();
        //}, 5000);
    }

    function showSuccess(message) {
        setShowSuccess(true);
        setMessage(message);
        AlertService.addAlert('success', message);
        logNotification("success", message);

        $timeout(function () {
            setShowSuccess(false);
            resetMessage();
        }, 5000);
    }

    function showError(message) {
        setShowError(true);
        setMessage(message);
        AlertService.addAlert('danger', message);
        logNotification("error", message);

        $timeout(function () {
            setShowError(false);
            resetMessage();
        }, 7500);
    }

    /***
     mdb_info_message: message.SPRO_0000000911
     */
    $rootScope.$on('WSMDBInfoMessage', function (event, args) {
        // Show info message
        showInfo(args.mdb_info_message);
    });

    /***
     mdb_error_message: message.SPRO_0000000725
     */
    $rootScope.$on('WSMDBErrorMessage', function (event, args) {
        // Show error message
        showError(args.mdb_error_message);
    });

    return {
        getMessage: getMessage,             // get the notification message
        resetMessage: resetMessage,         // resets the notification message
        getNotification: getNotification,   // returns true if there is currently an active notification
        getShowInfo: getShowInfo,           // returns true if there is currently an active info notification
        getShowSuccess: getShowSuccess,     // returns true if there is currently an active success notification
        getShowError: getShowError,         // returns true if there is currently an active error notification
        showInfo: showInfo,                 // send message string to show as info notification
        showSuccess: showSuccess,           // send message string to show as success notification
        showError: showError                // send message string to show as error notification
    }
});

// shows alerts within header, fades out, info, error or success
/**
 * public functions **
 * NotificationService.getMessage() - get the notification message
 * NotificationService.resetMessage() - resets the notification message
 * NotificationService.getNotification() - returns true if there is currently an active notification
 * NotificationService.getShowInfo() - returns true if there is currently an active info notification
 * NotificationService.getShowSuccess() - returns true if there is currently an active success notification
 * NotificationService.getShowError() - returns true if there is currently an active error notification
 * NotificationService.showInfo(message) - send message string as info notification
 * NotificationService.showSuccess(message) - send message string as success notification
 * NotificationService.showError(message) - send message string as error notification
 */
MDBServices.factory('AlertService', function ($timeout) {
    var alertService = {};
    // array of alerts
    alertService.alerts = [];

    alertService.addAlert = function (type, message) {
        alertService.alerts.push({
            type: type,
            msg: message,
            mouseover: false,
            close: function () {
                return alertService.closeAlert(this);
            }
        });

        /* $timeout(function () {
         if(alertService.alerts.length > 0){
         alertService.closeAlert(0);
         }
         }, 7500);*/
    };

    alertService.closeAlert = function (index) {
        //if (alertService.alerts[index].mouseover) {
        //    alertService.addAlert(alertService.alerts[index].type, alertService.alerts[index].msg);
        //}
        return alertService.alerts.splice(index, 1);
    };

    alertService.stopClose = function (index) {
        alertService.alerts[index].mouseover = true;
    };

    alertService.leaveAlert = function (index) {
        alertService.alerts[index].mouseover = false;
        alertService.closeAlert(index);
    };

    return alertService;
});


// authentication handling
/**
 * public functions **
 * AuthService.isLoggedIn()           - returns true, if a user is logged in
 * AuthService.getUsername()          - returns current username
 * AuthService.getUserStatus()        - returns true, if mdbUserID was found in cookies
 * AuthService.getConnectSID()        - get current connection sid
 * AuthService.getAuthPanel()         - get authentication panel (mdb document)
 * AuthService.authenticate(user, pw) - authenticate user with password
 * AuthService.logout()               - logout
 * AuthService.register()             - register user
 * AuthService.getUserSessionInfo()   - get session info of current user
 * AuthService.generateMDBUEID()      - generate MDBUEID // workaround for MDBUEID tests
 */
MDBServices.factory('AuthService', function ($q, $rootScope, $timeout, $cookies, $http, RandomNumberService, NotificationService) {
    var mdbUserID = $cookies.get('currentUser');
    var mdbUEID = $cookies.get('currentUEID');
    var mdbUEIDURI = $cookies.get('currentUEIDURI');
    var connectSID = $cookies.get('connect.sid');
    var knownResA = $cookies.get($rootScope.keywordKnownResourceA);
    var knownResB = $cookies.get($rootScope.keywordKnownResourceB);

    // listen for cookie events
    $rootScope.$watch($cookies.getAll, function () {
        mdbUserID = $cookies.get('currentUser');
        mdbUEID = $cookies.get('currentUEID');
        mdbUEIDURI = $cookies.get('currentUEIDURI');
        connectSID = $cookies.get('connect.sid');
        knownResA = $cookies.get($rootScope.keywordKnownResourceA);
        knownResB = $cookies.get($rootScope.keywordKnownResourceB);
    });

    var session_data = [];

    if (mdbUserID) {
        // create user variable
        var user = true;
        var username = mdbUserID;
    }
    else {
        // create user variable
        var user = null;
        var username = 'Login';
    }

    function getConnectSID() {
        // create a new instance of deferred
        var deferred = $q.defer();
        // send a get request to the server
        $http.get('/user/getconnectsid')
            // handle success
            .then(function (result) {
                var data = result.data;
                var status = result.status;
                console.log("got session data: " +  JSON.stringify(data.req) + "\ngot connectSID: " + data.connectSID + "\ngot sessionID: " + data.sessionID + "\ngot sessionInfo: " + data.sessionInfo);
                setConnectSID(data.sessionID);
                deferred.resolve(data);
            })
            // handle error
            .catch(function (data) {
                //alert('connectsid error');
                deferred.reject(data);
            });

        // return promise object
        return deferred.promise;
    }

    function isLoggedIn() {
        if (user) {
            return true;
        } else {
            return false;
        }
    }

    function getUserStatus() {
        return user;
    }

    function getUsername() {
        return username;
    }

    function setUsername(name) {
        username = name;
    }

    function getUserEntryID() {
        return mdbUEID;
    }

    function setUserEntryID(id) {
        mdbUEID = id;
    }

    function setUserSessionInfo(ses_data) {
        session_data = ses_data;
    }

    function getUserSessionInfo() {
        return session_data;
    }

    function setConnectSID(data) {
        connectSID = data;
    }

    function setCookies(data) {
        if (data.username) {
            $cookies.put('currentUser', data.username);
            mdbUserID = data.username;
        }
        if (data.mdbUEID) {
            $cookies.put('currentUEID', data.mdbUEID);
            mdbUEID = data.mdbUEID;
        }
        if (data.mdbUEIDURI) {
            $cookies.put('currentUEIDURI', data.mdbUEIDURI);
            mdbUEIDURI = data.mdbUEIDURI;
        }
        if (data[$rootScope.keywordKnownResourceA]) {
            $cookies.put($rootScope.keywordKnownResourceA, data[$rootScope.keywordKnownResourceA]);
            knownResA = data[$rootScope.keywordKnownResourceA];
        }
        if (data[$rootScope.keywordKnownResourceB]) {
            $cookies.put($rootScope.keywordKnownResourceB, data[$rootScope.keywordKnownResourceB]);
            knownResB = data[$rootScope.keywordKnownResourceB];
        }
    }

    function removeCookies() {
        var cookies = $cookies.getAll();
        angular.forEach(cookies, function (v, k) {
            if (k !== 'connect.sid') {
                $cookies.remove(k);
                //alert("cookie wird entfernt: " + k + "\nCookies: " + JSON.stringify($cookies.getAll()));
            }
        });
        mdbUserID = '';
        mdbUEID = '';
        mdbUEIDURI = '';
        //mdbSID = '';
        knownResA = '';
        knownResB = '';
    }

    function generateMDBUEID(id) {
        // create a new instance of deferred
        var deferred = $q.defer();
        var MDBUEID;

        if (id) {
            MDBUEID = id;
        }
        else {
            //create a new mdb user entry id
            MDBUEID = RandomNumberService.getMDBUEID();
        }

        if (MDBUEID) {
            deferred.resolve({ status: 200, data: { mdbueid: MDBUEID, message: "MDBUEID generated. Yeah!" } });
        }
        else {
            deferred.reject({ status: 500, data: { errormsg: "No MDBUEID generated." } });
        }

        // return promise object
        return deferred.promise;
    }

    function register(form) {
        // create a new instance of deferred
        var deferred = $q.defer();

        var username = form.SC_BASIC_0000000825.$modelValue;
        var password = form.SC_BASIC_0000000836.$modelValue;


        /*var register_values = {};

         register_values.type = 'check_input';
         register_values.connectSID = connectSID;

         angular.forEach(form, function (value, key) {
         if (typeof value === 'object' && value.hasOwnProperty('$modelValue'))
         if (value.$name != 'SC_BASIC_0000000836') {
         //alert('registercheck value.$name - ' + value.$name);
         if (value.$modelValue) {
         register_values[value.$name] = value.$modelValue;
         }
         else {
         register_values[value.$name] = '';
         }

         }
         });*/

        //create a new user entry id (mdbueid)
        generateMDBUEID()
            .then(function onSuccess(response) {
                var status = response.status;
                var data = response.data;
                //$http.post('/user/register', { username: username, mdbueid: "cafecafe", password: password }) //"cafecafe", password: password})// TODO: data, password: password})
                $http.post('/user/register', { username: username, mdbueid: data.mdbueid, password: password }) //"cafecafe", password: password})// TODO: data, password: password})
                    // handle success
                    .then(function onSuccess(response) {
                        /*
                         res.status(200).json({
                         status: 'Registration successful!',
                         username: req.user.username,
                         userID: req.user._id,
                         usermdbueid: req.user.mdbueid,
                         connectSID: req.cookies['connect.sid'],
                         sessionID: req.sessionID
                         */
                        var data = response.data;
                        //var status = response.status;
                        //NotificationService.showSuccess(status);
                        deferred.resolve({ message: data.status, mdbueid: data.usermdbueid });
                        // TODO: delete another day
                        console.log("AuthService - http register - then:\nresponse: " + JSON.stringify(response));
                    })
                    // handle error
                    .catch(function onError(response) {
                        var data = response.data;
                        NotificationService.showError(data.err.message);
                        deferred.reject({ message: data.err.message });
                        // TODO: delete another day
                        console.error("AuthService - http register - catch:\nresponse: " + JSON.stringify(response));
                    });
                // TODO: delete another day
                console.log("AuthService - generateMDBUEID - then:\nresponse: " + data.message);
            })
            // handle error
            .catch(function onError(response) {
                var status = response.status;
                var data = response.data;
                deferred.reject({ message: data.errormsg });
                // TODO: delete another day
                console.error("AuthService - generateMDBUEID - catch:\nresponse: " + JSON.stringify(data.errormsg));
            });

        // return promise object
        return deferred.promise;
    }

    function authenticate(form) {

        // create a new instance of deferred
        var deferred = $q.defer();

        var username = form.SC_BASIC_0000000634.$modelValue;
        var password = form.SC_BASIC_0000000628.$modelValue;

        // send a post request to the server
        $http.post('/user/authenticate', { username: username, password: password })
            // handle success
            .then(function (request) {
                var data = request.data;
                var status = request.status;
                // TODO: delete another day
                console.log("AuthService - http authenticate - then:\nresponse: " + data);
                if (status === 200) {
                    /*
                     res.status(200).json({
                     status: 'Login successful!',
                     user: user,
                     username: user.username,
                     usermdbueid: req.user.mdbueid,
                     connectSID: req.cookies['connect.sid'],
                     sessionID: req.sessionID
                     */
                    //NotificationService.showSuccess(data.status);
                    deferred.resolve({ message: data.status, mdbueid: data.usermdbueid });
                } else {
                    NotificationService.showError(data.err);
                    user = false;
                    deferred.reject({ message: data.status, mdbueid: data.usermdbueid });
                }
            })
            // handle error
            .catch(function (data) {
                console.warn("AuthService - http authenticate - catch:\n" + JSON.stringify(data));
                // {data: Object, status: 401, config: Object, statusText: "Unauthorized", headers: function}
                NotificationService.showError(data.statusText);
                user = false;
                deferred.reject();
            });

        // return promise object
        return deferred.promise;
    }

    function invalidate() {

        // create a new instance of deferred
        var deferred = $q.defer();

        // send a get request to the server
        $http.get('/user/logout')
            // handle success
            .then(function (result) {
                var data = result.data;
                var status = result.status;
                user = false;
                setUserSessionInfo(data);
                setUsername('Login');
                removeCookies();
                //We can't use $document.reload here. Actually Angular takes care of the reload itself
                //Use window.location.reload(); if you want to reload manually.
                //window.location.reload();
                deferred.resolve();
            })
            // handle error
            .catch(function (data) {
                NotificationService.showError(data.err);
                user = false;
                deferred.reject();
            });

        // return promise object
        return deferred.promise;
    }

    function login(mdbusername, mdbueid, mdbueiduri, ws_message) {

        // create a new instance of deferred
        var deferred = $q.defer();

        var login_data = {};
        /*
         // login
         login(data.mdbusername, data.mdbueid, data.mdbueiduri, args);
         // ws_message
         socket_message: message,
         validation_ref: message.localID,
         validation_status: message.data[0]["SC_BASIC_0000000635"].valid,
         validation_message: "Login successful!",
         mdbueid: message.mdbueid
         */

        if (ws_message.validation_ref == "SC_BASIC_0000000635" && ws_message.validation_status) {
            user = true;
            setUsername(mdbusername);
            setUserEntryID(mdbueid);
            login_data.username = mdbusername;
            login_data.mdbUEID = mdbueid;
            login_data.mdbUEIDURI = mdbueiduri;
            login_data[$rootScope.keywordKnownResourceA] = ws_message.mdbKnownResA;
            login_data[$rootScope.keywordKnownResourceB] = ws_message.mdbKnownResB;
            login_data.connectSID = ws_message.connectSID;
            setCookies(login_data);
            setUserSessionInfo(login_data);
            NotificationService.showSuccess(ws_message.validation_message);
            deferred.resolve(login_data);
        }
        else {
            NotificationService.showError(data.err);
            user = false;
            deferred.reject({ message: ws_message.validation_message, mdbueid: ws_message.mdbueid });
        }

        // return promise object
        return deferred.promise;
    }

    function logout() {

        // create a new instance of deferred
        var deferred = $q.defer();

        // send a get request to the server
        $http.get('/user/logout')
            // handle success
            .then(function (result) {
                var data = result.data;
                var status = result.status;
                user = false;
                setUserSessionInfo(data);
                NotificationService.showInfo(data.status);
                setUsername('Login');
                removeCookies();
                //We can't use $document.reload here. Actually Angular takes care of the reload itself
                //Use window.location.reload(); if you want to reload manually.
                //window.location.reload();
                deferred.resolve();
            })
            // handle error
            .catch(function (data) {
                NotificationService.showError(data.err);
                user = false;
                deferred.reject();
            });

        // return promise object
        return deferred.promise;
    }

    /***
     socket_message: message,
     validation_ref: message.localID,
     validation_status: message.data[0]["SC_BASIC_0000000635"].valid,
     validation_message: "Login successful!",
     mdbueid: message.mdbueid
     */
    $rootScope.$on('WSLoginFeedbackMessage', function (event, args) {
        /*{
         "connectSID": "s:42-MDBPROTOTYPSESSIONIDID-TTESTT.MDBPROTOTYPSESSIONIDMDBPROTOTYPSESSIONIDIDI",
         "mdbueid": "a1b2c3d4",
         "data": [{
         "SC_BASIC_0000000635": {
         "valid": "true"
         }}],
         "html_form": "SC_BASIC_0000001206",
         "localID": "SC_BASIC_0000000635"
         }*/
        if (args.validation_status) {
            $http.post('/user/getuserbyueid', { mdbueid: args.mdbueid })
                // handle success
                .then(function (result) {
                    var data = result.data;
                    var status = result.status;
                    if (status === 200) {
                        // TODO: should not deliver whole user info, but fails to deliver mdbueiduri separately
                        // status: 200, mdbuser: true, mdbusername: usr.username, mdbueid: usr.mdbueid, mdbueiduri: usr, status: 'User found.'
                        // alert(JSON.stringify(data));
                        login(data.mdbusername, data.mdbueid, data.mdbueiduri.mdbueiduri, args)
                            .then(function (result) {
                                if ($rootScope.developers.indexOf(mdbUserID) > -1) console.log("AuthService - login:\n" + JSON.stringify(result));
                                $rootScope.$broadcast('WSAuthenticationEvent', {});
                            }, function (reason) {
                                alert('Failed: ' + reason);
                                $rootScope.$broadcast('WSAuthenticationEvent', {});
                            }, function (update) {
                                alert('Got notification: ' + update);
                            });
                    } else {
                        // status: 500, mdbuser: false, status: 'No user found.'
                        if ($rootScope.developers.indexOf(mdbUserID) > -1) console.log("AuthService - login:\n" + JSON.stringify(request));
                        invalidate()
                            .then(function (result) {
                                if ($rootScope.developers.indexOf(mdbUserID) > -1) console.log("AuthService - login & 500 & invalidate:\n" + JSON.stringify(result));
                                $rootScope.$broadcast('WSAuthenticationEvent', {});
                            })
                            .catch(function (result) {
                                if ($rootScope.developers.indexOf(mdbUserID) > -1) console.log("AuthService - login & 500 & invalidate:\n" + JSON.stringify(result));
                            });
                    }
                })
                // handle error
                .catch(function (result) {
                    if ($rootScope.developers.indexOf(mdbUserID) > -1) console.log("AuthService - login:\n" + JSON.stringify(result));
                    invalidate()
                        .then(function (result) {
                            if ($rootScope.developers.indexOf(mdbUserID) > -1) console.log("AuthService - login & catch & invalidate:\n" + JSON.stringify(result));
                            $rootScope.$broadcast('WSAuthenticationEvent', {});
                        })
                        .catch(function (result) {
                            if ($rootScope.developers.indexOf(mdbUserID) > -1) console.log("AuthService - login & catch & invalidate:\n" + JSON.stringify(result));
                        });
                });
        }
        else {
            invalidate()
                .then(function (result) {
                    $rootScope.$broadcast('WSAuthenticationEvent', {});
                });
        }
    });

    /***
     socket_message: message,
     validation_ref: message.localID,
     validation_status: message.data[0]["SC_BASIC_0000000833"].valid,
     validation_message: "Sign up successful!",
     validation_error:  message.data[0]["SC_BASIC_0000000833"].SPRO_0000000725,
     mdbueid: message.mdbueid,
     connectSID: message.connectSID
     */
    $rootScope.$on('WSSignupFeedbackMessage', function (event, args) {

        console.log("AuthService: WSSignupFeedbackMessage - " + JSON.stringify(args));

        if (args.validation_status == "false") {
            removeUserByUEIDFromDB(args.mdbueid);
            console.error("AuthService: Not all information required was provided for signing up to MDB. Preliminary user was removed from database.");
        }
        else {
            console.info("AuthService: " + args.validation_message);
        }
        $rootScope.$broadcast('WSAuthenticationEvent', {});
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
        /*
         {
         "connectSID": "s:42-HALLOHIERALARMEINS1ELF-TTESTT.SANDRASGANZPERSOENLICHEMDBPROTOTYPSESSIONID",
         "mdbueid": "fd30a6da",
         "data": [
         {
         "SC_BASIC_0000000136": {
         "valid": "true"
         }
         }
         ],
         "load_page": "http://www.morphdbase.de",
         "html_form": "MY_DUMMY_LOGOUT_0000000001",
         "localID": "SC_BASIC_0000000136"
         }
         */
        // TODO: Logout!
        logout().then(function (result) {
            $rootScope.$broadcast('WSAuthenticationEvent', {});
        });
    });

    /// login and register panel //////////////////////////////////
    ///////////////////////////////////////////////////////////////

    // listen to WsServiceMessage
    $rootScope.$on('WSNewAuthCompositionMessage', function (event, args) {
        var socket_message = args.socket_message;
        var socket_message_data = socket_message.data[0];
        //alert('socket_message\n' + JSON.stringify(socket_message));
        //alert('socket_message_data\n' + JSON.stringify(socket_message_data));
        //alert('socket_message_data["SPRO_0000000999"] == "SC_BASIC_0000001162"\n' + JSON.stringify(socket_message_data["SPRO_0000000999"]));
        //alert('socket_message_data["localID"]"\n' + JSON.stringify(socket_message_data["localID"]));

        // TODO: does not work recursively
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // setAuthPanel (of type REGISTER and/or LOGIN)
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        // has GUI representation
        if (socket_message_data["SPRO_0000000999"] == "SC_BASIC_0000001162") {

            var authPanelRepresentation = socket_message.data;

            for (var i = 0; i < authPanelRepresentation.length; i++) {
                for (var entry in authPanelRepresentation[i]) {

                    // if GUI component is simple panel
                    if (entry == 'SPRO_0000000999' || authPanelRepresentation[i][entry] == 'SC_BASIC_0000001162') {
                        var authSimplePanel = authPanelRepresentation[i]['SPRO_0000000069'];

                        for (var j = 0; j < authSimplePanel.length; j++) {

                            var authSimplePanelSections = authSimplePanel[j];

                            // durch die sections //////////////////////////////////////////////////////////////
                            for (var sec in authSimplePanelSections) {

                                // literal
                                if (authSimplePanelSections[sec] == 'SPRO_0000000019') {
                                    //"SPRO_0000000791": "SPRO_0000000019"
                                    authSimplePanelSections['html_input_type'] = 'text';
                                }
                                //password
                                else if (authSimplePanelSections[sec] == 'SPRO_0000000450') {
                                    // "SPRO_0000000791": "SPRO_0000000450" (== input type password)
                                    // "localID": "SC_BASIC_0000000836", (signup - New password)
                                    // "localID": "SC_BASIC_0000000628", (login - Password)
                                    authSimplePanelSections['html_input_type'] = 'password';
                                }

                                // email (== input type email)
                                else if (authSimplePanelSections[sec] == 'SPRO_0000000189') {
                                    //"SPRO_0000000791": "SPRO_0000000189" (== input type email)
                                    //"localID": "SC_BASIC_0000000825" (signup - email)
                                    //"localID": "SC_BASIC_0000000828" (signup - reenter email)
                                    //"localID": "SC_BASIC_0000000634" (login - email)
                                    authSimplePanelSections['html_input_type'] = 'text'; //(websocket validation!)
                                    //authSimplePanelSections['html_input_type'] = 'email';
                                }

                                // wenn kindknoten vorhanden //////////////////////////////////////
                                if (sec == 'SPRO_0000000069') {
                                    var authSimplePanelSection = authSimplePanelSections[sec];

                                    for (var k = 0; k < authSimplePanelSection.length; k++) {
                                        var authSimplePanelSec = authSimplePanelSection[k];

                                        // jeden einzelnen Eintrag durchgehen
                                        for (var en in authSimplePanelSec) {

                                            // literal
                                            if (authSimplePanelSec[en] == 'SPRO_0000000019') {
                                                //"SPRO_0000000791": "SPRO_0000000019"
                                                authSimplePanelSec['html_input_type'] = 'text';
                                            }
                                            //password
                                            else if (authSimplePanelSec[en] == 'SPRO_0000000450') {
                                                // "SPRO_0000000791": "SPRO_0000000450" (== input type password)
                                                // "localID": "SC_BASIC_0000000836", (signup - New password)
                                                // "localID": "SC_BASIC_0000000628", (login - Password)
                                                authSimplePanelSec['html_input_type'] = 'password';
                                            }
                                            // email
                                            else if (authSimplePanelSec[en] == 'SPRO_0000000189') {
                                                //"SPRO_0000000791": "SPRO_0000000189" (== input type email)
                                                //"localID": "SC_BASIC_0000000825" (signup - email)
                                                //"localID": "SC_BASIC_0000000828" (signup - reenter email)
                                                //"localID": "SC_BASIC_0000000634" (login - email)
                                                authSimplePanelSec['html_input_type'] = 'text'; //(websocket validation!)
                                                //authSimplePanelSections['html_input_type'] = 'email';
                                            }


                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

            authPanelRepresentation[0].load_page_localID = socket_message.load_page_localID;
            if (socket_message.load_page_localID == 'Ontologies/SOCCOMAS/SCBasic#SC_BASIC_0000001156') {
                authPanelRepresentation[0].mdbForm_label = "Sign up";
            }
            else if (socket_message.load_page_localID == 'Ontologies/SOCCOMAS/SCBasic#SC_BASIC_0000001206') {
                authPanelRepresentation[0].mdbForm_label = "Log in";
            }

            setAuthPanel(authPanelRepresentation);
        }
    });

    // authentication panel, filled with either login or register panel items
    var authPanel = [];

    function setAuthPanel(panel) {
        authPanel = panel;
        $rootScope.$broadcast('AuthPanel_updated');
    }

    function getAuthPanel() {
        return authPanel;
    }

    function getUserByUEIDFromDB(mdbueid) {
        $http.post('/user/getuserbyueid', { mdbueid: mdbueid })
            // handle success
            .then(function (result) {
                var status = result.status;
                if (status === 200) {
                    // status: 200, mdbuser: true, mdbusername: usr.username, mdbueid: usr.mdbueid, mdbueid_uri: usr.mdbueiduri, status: 'User found.'
                    //alert(JSON.stringify(data));
                }
                console.info("getUserByUEIDFromDB - " + result + "\ndata - " + JSON.stringify(result.data));
            })
    }

    // ToDo: temporary function for testing purpose
    function getUserInfoByUEIDFromDB(mdbueid) {
        $http.post('/user/getuserinfobyueid', { mdbueid: mdbueid })
            // handle success
            .then(function (result) {
                var status = result.status;
                if (status === 200) {
                    // status: 200, mdbuser: true, mdbusername: usr.username, mdbueid: usr.mdbueid, mdbueid_uri: usr.mdbueiduri, status: 'User found.'
                    //alert(JSON.stringify(data));
                }
                console.info("getUserInfoByUEIDFromDB - " + result + "\ndata - " + JSON.stringify(result.data));
            })
    }

    function getUserInfoByUsernameFromDB(username) {
        $http.post('/user/getuserbyusername', { username: username })
            // handle success
            .then(function (result) {
                var status = result.status;
                if (status === 200) {
                    // status: 200, mdbuser: true, mdbusername: usr.username, mdbueid: usr.mdbueid, mdbueid_uri: usr.mdbueiduri, status: 'User found.'
                    //alert(JSON.stringify(data));
                }
                console.info("getUserInfoByUsernameFromDB - " + result + "\ndata - " + JSON.stringify(result.data));
            })
    }

    function removeUserByUEIDFromDB(mdbueid) {
        $http.post('/user/removeuserbyueid', { mdbueid: mdbueid })
            // handle success
            .then(function (result) {
                // return res.status(200).json({removed: true, mdbusername: usr.username, mdbueid: usr.mdbueid, status: 'User removed.'})
                //return res.status(500).json({removed: false, status: 'No user found.'})
                var status = result.status;
                if (status === 200) {
                }
                console.info("removeUserByUEIDFromDB - " + result + "\ndata - " + JSON.stringify(result.data));
            })
    }

    function removeUserByUsernameFromDB(username) {
        $http.post('/user/removeuserbyusername', { username: username })
            // handle success
            .then(function (result) {
                // return res.status(200).json({removed: true, mdbusername: usr.username, mdbueid: usr.mdbueid, status: 'User removed.'})
                //return res.status(500).json({removed: false, status: 'No user found.'})
                var status = result.status;
                if (status === 200) {
                }
                console.info("removeUserByUsernameFromDB - " + result + "\ndata - " + JSON.stringify(result.data));
            })
    }

    // return available functions for use in controllers
    return ({
        sesInfo: session_data,
        isLoggedIn: isLoggedIn,
        getUserStatus: getUserStatus,
        getUsername: getUsername,
        getUserEntryID: getUserEntryID,
        getConnectSID: getConnectSID,
        getAuthPanel: getAuthPanel,
        authenticate: authenticate,
        logout: logout,
        register: register,
        getUserSessionInfo: getUserSessionInfo,
        generateMDBUEID: generateMDBUEID,
        getUserByUEIDFromDB: getUserByUEIDFromDB,
        getUserInfoByUEIDFromDB: getUserInfoByUEIDFromDB,
        getUserInfoByUsernameFromDB: getUserInfoByUsernameFromDB,
        removeUserByUEIDFromDB: removeUserByUEIDFromDB,
        removeUserByUsernameFromDB: removeUserByUsernameFromDB
    });
});

// connection to websocket
/**
 * public functions **
 * WsService.response                         - last response array for messages
 * WsService.sent                             - last sent array for messages
 * WsService.connectSID                       - returns current connection SID
 * WsService.isConnected()                    - returns true, if websocket is connected
 * WsService.sendToWebsocket()                - send request to websocket
 * WsService.sendSparqlToWebsocket()          - send SPARQL query to websocket (core_workspace)
 * WsService.sendSparqlToAdminWebsocket()     - send SPARQL query to websocket (admin_workspace)
 * WsService.sendSparqlToOntologyWebsocket()  - send SPARQL query to websocket (ontology_workspace)
 * WsService.sendGenerateDocToWebsocket()     - send "generateDoc" request for certain document id to websocket
 * WsService.sendCheckInputToWebsocket()      - send "checkInput" (form field validation request) to websocket
 */
MDBServices.factory('WsService', function ($q, $rootScope,  $http, $location, $timeout, $cookies, $websocket) {
    // Open a WebSocket connection
    var ws_url = 'wss://fuseki.morphdbase.de/javacode/soccomas-web-socket';
    var ws_protocol = [];
    var ws_options = [];
    // specify ws options if needed
    //ws_options.scope = $rootScope;
    //ws_options.rootScopeFailover = true;
    //ws_options.useApplyAsync = false;
    //ws_options.initialTimeout = 500; // 500ms
    //ws_options.maxTimeout = 5 * 60 * 1000; // 5 minutes
    ws_options.maxTimeout = 10 * 60 * 1000; // 5 minutes
    ws_options.reconnectIfNotNormalClose = true;

    var ws_socket = $websocket(ws_url, ws_protocol, ws_options);

    //connect.sid needed for websocket requests
    var mdbCurrentUser = $cookies.get('currentUser');
    var mdbUEID = $cookies.get('currentUEID');
    var mdbUEIDURI = $cookies.get('currentUEIDURI');
    var mdbKnownResA = $cookies.get($rootScope.keywordKnownResourceA);
    var mdbKnownResB = $cookies.get($rootScope.keywordKnownResourceB);

    var connectSID = $cookies.get('connect.sid');
    // TODO: workaround, um datenbank nicht vollzumüllen
    //$cookies.put('connect.sid', "s:42-HALLOHIERALARMEINS1ELF-TTESTT.SANDRASGANZPERSOENLICHEMDBPROTOTYPSESSIONID");


    // listen for cookie events
    $rootScope.$watch($cookies.getAll, function () {
        mdbCurrentUser = $cookies.get('currentUser');
        mdbUEID = $cookies.get('currentUEID');
        mdbUEIDURI = $cookies.get('currentUEIDURI');
        mdbKnownResA = $cookies.get($rootScope.keywordKnownResourceA);
        mdbKnownResB = $cookies.get($rootScope.keywordKnownResourceB);
    });

    //send panel requests only on initialization
    var is_established = false;

    //last response array for monitoring incoming messages
    var response = [];
    //last sent array for for monitoring outgoing messages
    var sent = [];

    // response from websocket
    ws_socket.onMessage(function (event) {
        var message = JSON.parse(event.data);

        // add message to variable to monitor incoming messages
        response.pop();
        response.push(message);
        // TODO: remove this later
        if ($rootScope.developers.indexOf(mdbCurrentUser) > -1)
            console.log("WSService - Socket onMessage:\n" + JSON.stringify(message));

        // broadcast only to messages of connectSID session
        if (message.connectSID == connectSID) {

            //// SET MDB Known Resources /////////////////////////////////////////////
            // if mdbKnownResA, check if already set as cookie
            if (message[$rootScope.keywordKnownResourceA] && mdbKnownResA) {

                // if cookie is different from mdbKnownResA, log current user out
                if (message[$rootScope.keywordKnownResourceA] != mdbKnownResA) {
                    //alert("LOGOUT");
                }
            }
            // if no cookie is set, put new mdbKnownResA cookie to $cookies EXCEPT message from logoutbutton
            else if (message[$rootScope.keywordKnownResourceA] && !mdbKnownResA && message.localID != "SC_BASIC_0000000136") {

                $cookies.put($rootScope.keywordKnownResourceA, message[$rootScope.keywordKnownResourceA]);
                $cookies.put($rootScope.keywordKnownResourceB, message[$rootScope.keywordKnownResourceB]);
                $cookies.put('currentUEID', message.mdbueid);
                $cookies.put('currentUEIDURI', message.mdbueid_uri);
            }

            //// SHOW MDB messages //////////////////////////////////////////
            if (message.SPRO_0000000911) {
                console.info('WSMDBInfoMessage: ' + message.SPRO_0000000911);
                $rootScope.$emit('WSMDBInfoMessage', {
                    mdb_info_message: message.SPRO_0000000911 // MDB info-message
                });
            }
            if (message.SPRO_0000000725) {
                console.info('WSMDBErrorMessage: ' + message.SPRO_0000000725);
                $rootScope.$emit('WSMDBErrorMessage', {
                    mdb_error_message: message.SPRO_0000000725 // MDB error-message
                });
            }

            //////////////////////////////////////////////////////////////////////////////////////////////////////
            //* distinguish the responses *////////////////////////////////////////////////////
            //////////////////////////////////////////////////////////////////////////////////////////////////////

            //// COMPOSITION PAGE ///////////////////////////////////////////////////
            if (message.load_page_localID) {
                //// LOGIN/REGISTER COMPOSITION
                if (message.load_page_localID.indexOf("Ontologies/SOCCOMAS/SCBasic#SC_BASIC_0000001206") > -1 || message.load_page_localID.indexOf("Ontologies/SOCCOMAS/SCBasic#SC_BASIC_0000001156") > -1) {
                    $rootScope.$emit('WSNewAuthCompositionMessage', {
                        socket_message: message,
                        socket_message_type: 'mdb_authentication_form',
                        composition_form: message.load_page_localID,
                        load_page: message.load_page,
                        close_old_page: message.close_old_page,
                        html_form: message.html_form,
                        localID: message.localID
                    });
                }

                // TODO: check, if depricated
                //USER_ENTRY_DEFAULT__DOCUMENT: user entry panel
                else if (message.load_page_localID.indexOf("SC_BASIC_0000000708") > -1) {
                    $rootScope.$emit('WSMDBPageCompositionMessage', {
                        socket_message: message,
                        socket_message_type: 'mdb_page_composition'
                    });

                    // TODO: check, if depricated
                    $rootScope.$emit('WSUserEntryCompositionMessage', {
                        socket_message: message,
                        socket_message_type: 'mdb_user_entry_composition',
                        composition_id: message.load_page_localID, // user entry panel
                        composition_items: message.data,
                        localID: message.localID,
                        load_page: message.load_page,
                        html_form: message.html_form,
                        mdb_info_message: message.SPRO_0000000911, // MDB info-message
                        mdbueid_uri: message.mdbueid_uri
                    });
                }
                //// PARTONOMY COMPOSITION
                // "load_page_localID": "resource/de46dd64-20170807-md-34-d_1_1#SC_BASIC_0000001054",
                else if (message.load_page_localID.indexOf("SC_BASIC_0000001054") > -1) {
                    $rootScope.$emit('WSMDBPartonomyPageCompositionMessage', {
                        socket_message: message,
                        socket_message_type: 'mdb_partonomy_page_composition',
                        composition_id: message.load_page_localID,
                        composition_items: message.data,
                        localID: message.localID,
                        load_page: message.load_page,
                        html_form: message.html_form,
                        mdb_info_message: message.SPRO_0000000911,
                        mdbueid_uri: message.mdbueid_uri
                    });
                }
                /*
                 {"connectSID":"s:42-HALLOHIERALARMEINS1ELF-TTESTT.SANDRASGANZPERSOENLICHEMDBPROTOTYPSESSIONID",
                 "mdbueid":"272b7f79",
                 "http://www.soccomas.org/Ontologies/SOCCOMAS/SprO#SPRO_0000000148":"http://www.morphdbase.de/resource/272b7f79#SC_BASIC_0000001483_35",
                 "http://www.soccomas.org/Ontologies/SOCCOMAS/SprO#SPRO_0000000321":"http://www.morphdbase.de/resource/272b7f79#TimeInterval_35",
                 "data":[   {"withStatus":"SC_BASIC_0000001656","entryLabel":"Klaus Maiers new Entry","SC_BASIC_0000001383":"SC_MDB_BASIC_0000000030","SPRO_0000000400":"Klaus","SPRO_0000000080":"Maier","uri":"http://www.morphdbase.de/resource/caab6b18-20171019-md-2-d_1_1"},
                            {"withStatus":"SC_BASIC_0000001656","SC_BASIC_0000001383":"SC_MDB_BASIC_0000000030","SPRO_0000000400":"Klaus","SPRO_0000000080":"Maier","uri":"http://www.morphdbase.de/resource/caab6b18-20171019-md-1-d_1_1"},
                            {"withStatus":"SC_BASIC_0000001656","SC_BASIC_0000001383":"SC_MDB_BASIC_0000000030","uri":"http://www.morphdbase.de/resource/de46dd64-20171019-md-1-d_1_1"},{"withStatus":"SC_BASIC_0000001656","SC_BASIC_0000001383":"SC_MDB_BASIC_0000000030","uri":"http://www.morphdbase.de/resource/272b7f79-20171018-md-1-d_1_1"},
                            {"withStatus":"SC_BASIC_0000001656","SC_BASIC_0000001383":"SC_MDB_BASIC_0000000030","uri":"http://www.morphdbase.de/resource/de46dd64-20171018-md-1-d_1_1"}],
                 "load_page_localID":"list_entries",
                 "mdbueid_uri":"http://www.morphdbase.de/resource/272b7f79"}
                */
                //// ENTRY LIST
                // "load_page_localID": "list_entries",
                else if (message.load_page_localID.indexOf("list_entries") > -1) {
                    console.info("service: emit WSMDBEntryListMessage");
                    $rootScope.$emit('WSMDBEntryListMessage', {
                        socket_message: message,
                        socket_message_type: 'mdb_entry_list',
                        composition_id: message.load_page_localID,
                        composition_items: message.data,
                        mdbueid_uri: message.mdbueid_uri
                    });
                }
                //// FORM COMPOSITION
                else {
                    //alert("WsService - onMessage - " + JSON.stringify(message));
                    $rootScope.$emit('WSMDBPageCompositionMessage', {
                        socket_message: message,
                        socket_message_type: 'mdb_page_composition'
                    });

                    // TODO: check, if depricated
                    $rootScope.$emit('WSEntryCompositionMessage', {
                        socket_message: message,
                        socket_message_type: 'mdb_entry_composition',
                        composition_id: message.load_page_localID, // entry panel
                        composition_items: message.data,
                        localID: message.localID,
                        load_page: message.load_page,
                        html_form: message.html_form,
                        mdb_info_message: message.SPRO_0000000911, // MDB info-message
                        mdbueid_uri: message.mdbueid_uri
                    });
                }
                // positive response to register button // TODO: no validity message is sent if registration is successful, only load_page
                if (message.localID == "SC_BASIC_0000000833") {
                    console.info("if - WSSignupFeedbackMessage");
                    $rootScope.$broadcast('WSSignupFeedbackMessage', {
                        socket_message: message,
                        validation_ref: message.localID,
                        validation_status: "true",
                        validation_message: message.SPRO_0000000911,
                        mdbueid: message.mdbueid,
                        connectSID: message.connectSID
                    });
                    // TODO: remove as soon as Prototype is finished
                    console.info("Registration status: " + message.SPRO_0000000911);
                }
                // positive response to login button // TODO: no validity message is sent if login is successful, only load_page
                /* else if(message.localID == "SC_BASIC_0000000635"){
                 $rootScope.$broadcast('WSLoginFeedbackMessage', {
                 socket_message: message,
                 validation_ref: message.localID,
                 validation_status: "true",
                 validation_message: message.SPRO_0000000911,
                 mdbueid: message.mdbueid,
                 mdbKnownResA: message[$rootScope.keywordKnownResourceA],
                 mdbKnownResB: message[$rootScope.keywordKnownResourceB],
                 connectSID: message.connectSID
                 });*/
            }
            // response to login button
            else if (message.localID == "SC_BASIC_0000000635") {
                $rootScope.$broadcast('WSLoginFeedbackMessage', {
                    socket_message: message,
                    validation_ref: message.localID,
                    validation_status: message.data[0]["SC_BASIC_0000000635"].valid,
                    validation_message: "Login successful!",
                    validation_error: message.data[0]["SC_BASIC_0000000635"].SPRO_0000000725,
                    mdbueid: message.mdbueid,
                    mdbKnownResA: message[$rootScope.keywordKnownResourceA],
                    mdbKnownResB: message[$rootScope.keywordKnownResourceB],
                    connectSID: message.connectSID
                });
                // TODO: remove as soon as Prototype is finished
                if (message.data[0]["SC_BASIC_0000000635"].SPRO_0000000725) {
                    console.warn("MDB error message: " + message.data[0]["SC_BASIC_0000000635"].SPRO_0000000725);
                }
                else {
                    console.info("Login status: " + message.data[0]["SC_BASIC_0000000635"].valid);
                }
            }
            // response to register button
            else if (message.localID == "SC_BASIC_0000000833") {
                console.info("else if - WSSignupFeedbackMessage");
                $rootScope.$broadcast('WSSignupFeedbackMessage', {
                    socket_message: message,
                    validation_ref: message.localID,
                    validation_status: message.data[0]["SC_BASIC_0000000833"].valid,
                    validation_message: "Sign up successful!",
                    validation_error: message.data[0]["SC_BASIC_0000000833"].SPRO_0000000725,
                    mdbueid: message.mdbueid,
                    connectSID: message.connectSID
                });
                // TODO: remove as soon as Prototype is finished
                if (message.data[0]["SC_BASIC_0000000833"].SPRO_0000000725) {
                    console.warn("MDB error message: " + message.data[0]["SC_BASIC_0000000833"].SPRO_0000000725);
                }
                else {
                    console.info("Registration status: " + message.data[0]["SC_BASIC_0000000833"].valid);
                }
            }
            // response to logout button
            else if (message.localID == "SC_BASIC_0000000136") {
                $rootScope.$broadcast('WSLogoutFeedbackMessage', {
                    socket_message: message,
                    validation_ref: message.localID,
                    validation_status: message.data[0]["SC_BASIC_0000000136"].valid,
                    validation_message: "Logout successful!",
                    validation_error: message.data[0]["SC_BASIC_0000000136"].SPRO_0000000725,
                    mdbueid: message.mdbueid,
                    mdbKnownResA: message[$rootScope.keywordKnownResourceA],
                    mdbKnownResB: message[$rootScope.keywordKnownResourceB],
                    connectSID: message.connectSID,
                    load_page: message.load_page
                });
                // TODO: remove as soon as Prototype is finished
                if (message.data[0]["SC_BASIC_0000000136"].SPRO_0000000725) {
                    console.warn("MDB error message: " + message.data[0]["SC_BASIC_0000000136"].SPRO_0000000725);
                }
                else {
                    console.info("Registration status: " + message.data[0]["SC_BASIC_0000000136"].valid);
                }
            }

            //// COMPOSITION OVERLAY ///////////////////////////////////////////////////
            if (message.load_overlay) {
                // OVERLAY
                $rootScope.$emit('WSMDBOverlayCompositionMessage', {
                    socket_message: message,
                    socket_message_type: 'mdb_overlay_composition'
                });
                //// SPECIMEN WIDGET
                if (message.widget.indexOf("SC_BASIC_0000001042") > -1) {
                    $rootScope.$emit('WSNewEntryModalCompositionMessage', {
                        socket_message: message,
                        socket_message_type: 'mdb_entry_modal_specimen',
                        composition_form: message.load_overlay_localID,
                        load_overlay: message.load_overlay,
                        html_form: message.html_form,
                        mdbueid_uri: message.mdbueid_uri,
                        notification: message.SPRO_0000000911,
                        localID: message.localID
                    });
                }
                else {
                    //alert("Unknown widget: " + message.widget);
                }
            }

            //// FORM VALIDATION ///////////////////////////////////////////////////
            else if (message.data && (message.data[0][message.localID]) && (message.data[0][message.localID]).hasOwnProperty('valid')) {
                var validity = message.data[0][message.localID].valid;
                $rootScope.$broadcast('WSFormValidationMessage', {
                    socket_message: message,
                    socket_message_type: 'mdb_form_validation',
                    validation_form: message.html_form,
                    validation_message: message.data,
                    validation_field: message.localID
                });
                console.info("WSFormValidationMessage: " +  JSON.stringify(message));

                //// FORM UPDATE ///////////////////////////////////////////////////
                if (validity == "true" && ((message.data[0][message.localID]).hasOwnProperty('update_uri') || (message.data[0][message.localID]).hasOwnProperty('delete_uri'))){
                    $rootScope.$broadcast('WSFormUpdateMessage', {
                        socket_message: message,
                        socket_message_type: 'mdb_form_update',
                        update_id: message.localID,
                        update_message: message.data,
                        update_uris: message.data[0][message.localID].update_uri,
                        remove_uris: message.data[0][message.localID].delete_uri,
                        update_data: message.data[0][message.localID]
                    });
                }
                else if (validity == "true" && ((message.data[0][message.localID]).hasOwnProperty('update_position'))){
                    $rootScope.$broadcast('WSPartonomyPagePositionUpdateMessage', {
                        socket_message: message
                    });
                }
            }

            //// FORM AUTOCOMPLETE DATA ///////////////////////////////////////////////////
            else if (message.data && (message.data[0][message.localID]) && (message.data[0][message.localID]).hasOwnProperty('autoCompleteData')) {
                //alert("autoCompleteData Message - " + JSON.stringify(message));
                $rootScope.$broadcast('WSFormAutocompleteMessage', {
                    socket_message: message,
                    socket_message_type: 'mdb_form_autocomplete',
                    autocomplete_form: message.html_form,
                    autocomplete_data: message.data,
                    autocomplete_field: message.localID
                });
            }
            $rootScope.$apply();
        }
        else {
            console.error("unknown ConnectSID message - " + connectSID + ' != ' + JSON.stringify(message.connectSID));
        }
    });

    ws_socket.onOpen(function () {
        connected = true;
        //$rootScope.$apply();
        if (is_established == false) {
            is_established = true;
            if (!$cookies.get('currentUser')){

                $http.get('/user/getconnectsid')
                    // handle success
                    .then(function (result) {
                        var data = result.data;
                        console.log("got session data: " +  JSON.stringify(data.req) + "\ngot connectSID: " + data.connectSID + "\ngot sessionID: " + data.sessionID + "\ngot sessionInfo: " + data.sessionInfo);
                        connectSID = data.sessionID;
                        // load login composition
                        sendGenerateDoc('SC_BASIC_0000001206');
                    })
                    // handle error
                    .catch(function (data) {
                        console.warn("no connectSID: " + JSON.stringify(data));
                    });
            }
            else{
                if ($rootScope.developers.indexOf(mdbCurrentUser) > -1) console.log("ws_socket.onOpen - currentUser: " + $cookies.get('currentUser'));

                $http.get('/user/getconnectsid')
                    // handle success
                    .then(function (result) {
                        var data = result.data;
                        console.log("got session data: " +  JSON.stringify(data) + "\ngot connectSID: " + data.connectSID + "\ngot sessionID: " + data.sessionID + "\ngot sessionInfo: " + data.sessionInfo);
                     })
                     // handle error
                    .catch(function (data) {
                        console.warn("no connectSID: " + JSON.stringify(data));
                    });
            }
        }
    });

    ws_socket.onClose(function () {
        connected = false;
    });

    ws_socket.onError();

    if (ws_socket.readyState == 1) {
        var connected = true;
    }
    else {
        var connected = null;
    }

    // websocket connection
    function isConnected() {
        if (connected) {
            return true;
        } else {
            return false;
        }
    }

    // send message to websocket
    function sendQuery(request) {
        if (typeof ws_socket !== "undefined"){

            if (ws_socket.readyState == 1) {
                ws_socket.send(JSON.stringify(request));
                //if ($rootScope.developers.indexOf(mdbCurrentUser) > -1) console.info("ws_socket.readyState: " + ws_socket.readyState);
            }
            else {
                //if ($rootScope.developers.indexOf(mdbCurrentUser) > -1) console.info("ws_socket.readyState: " + ws_socket.readyState);
                if (ws_socket){
                    ws_socket.reconnect();
                    $timeout(function () {
                        //if ($rootScope.developers.indexOf(mdbCurrentUser) > -1) console.info("ws_socket.readyState: " + ws_socket.readyState);
                        ws_socket.send(JSON.stringify(request));
                    }, 3000);
                }
            }

            // add message to variable to monitor outgoing messages
            sent.pop();
            sent.push(request);
            if ($rootScope.developers.indexOf(mdbCurrentUser) > -1) console.log("WSService - Socket send:\n" + JSON.stringify(request));
        }
    }

    // send SPARQL query to core workspace websocket
    function sendSparql(sparql) {
        var request = {
            'type': 'query',
            'query': sparql,
            'format': 'JSONLD',
            'operation': 'l',
            'dataset': '/home/rbaum/tdb/mdb_core_workspace/'
        };
        sendQuery(request);
    }

    // function for testing purposes (mdb_admin_workspace)
    // send SPARQL query to admin workspace websocket
    function sendSparqlToAdmin(sparql) {
        var request = {
            'type': 'query',
            'query': sparql,
            'format': 'JSONLD',
            'operation': 'l',
            'dataset': '/home/rbaum/tdb/mdb_admin_workspace/'
        };
        sendQuery(request);
    }

    // function for testing purposes (mdb_admin_workspace)
    // send SPARQL query to admin workspace websocket
    function sendSparqlToOntology(sparql) {
        var request = {
            'type': 'query',
            'query': sparql,
            'format': 'JSONLD',
            'operation': 'l',
            'dataset': '/home/rbaum/tdb/MDB_ontology_workspace/'
        };
        sendQuery(request);
    }

    // function for testing purposes (mdb_draft_workspace)
    // send SPARQL query to draft workspace websocket
    function sendSparqlToDraft(sparql) {
        var request = {
            'type': 'query',
            'query': sparql,
            'format': 'JSONLD',
            'operation': 'l',
            'dataset': '/home/rbaum/tdb/mdb_draft_workspace/'
        };
        sendQuery(request);
    }

    // function for testing purposes (mdb_draft_workspace)
    // send SPARQL query to draft workspace websocket
    function sendSparqlToPublish(sparql) {
        var request = {
            'type': 'query',
            'query': sparql,
            'format': 'JSONLD',
            'operation': 'l',
            'dataset': '/home/rbaum/tdb/mdb_published_workspace/'
        };
        sendQuery(request);
    }

    // function for testing purposes (external ontologies)
    // send SPARQL query to external ontologies directory
    function sendSparqlToExOntologies(sparql) {
        var request = {
            'type': 'query',
            'query': sparql,
            'format': 'JSONLD',
            'operation': 'l',
            'dataset': '/home/rbaum/tdb/external-ontologies/'
        };
        sendQuery(request);
    }

    // send GenerateDoc request for a specific MDB document (docID)
    function sendAnnotation(annotation) {

        var annotation_request = {
            'type': 'annotation_request',
            'annotation': annotation,
            'mdbueid': mdbUEID,
            'mdbueid_uri': mdbUEIDURI,
            'connectSID': connectSID
        };

        //alert("sendAnnotation - " + JSON.stringify(annotation_request));

        if (mdbKnownResA) {
            annotation_request[$rootScope.keywordKnownResourceA] = mdbKnownResA;
        }
        if (mdbKnownResB) {
            annotation_request[$rootScope.keywordKnownResourceB] = mdbKnownResB;
        }

        sendQuery(annotation_request);
    }

    // send GenerateDoc request for a specific MDB document (docID)
    function sendGenerateDoc(docID) {
        if (!connectSID) {
            connectSID = "xy"
        }
        var request = {
            'type': 'generate_doc',
            'localID': docID,
            'connectSID': connectSID
        };
        sendQuery(request);
    }

    // send custom key-value pair to websocket
    function sendWhatever(key, value) {
        var request = {
            'mdbueid': mdbUEID,
            'connectSID': connectSID
        };

        request[key] = value;
        sendQuery(request);
    }

    // send form field validation request
    function sendCheckInput(mdbformid, key, value, key_data, ueid, mdbpartid, mdbactivetab) {
        // create a new instance of deferred
        var deferred = $q.defer();

        if (ueid) {
            mdbUEID = ueid
        }
        else if (!mdbUEID) {
            mdbUEID = ''
        }
        if (!mdbUEIDURI) {
            mdbUEIDURI = '';
        }

        var check_input = {
            'type': 'check_input',
            'localID': key,
            'mdbueid': mdbUEID,
            'mdbueid_uri': mdbUEIDURI,
            'html_form': mdbformid,
            'connectSID': connectSID
        };

        if (value) {
            check_input.value = value;
        }
        else {
            check_input.value = " ";
        }
        if (key_data) {
            check_input.localIDs = key_data;
        }
        if (mdbpartid) {
            check_input.partID = mdbpartid;
        }
        if (mdbactivetab) {
            check_input.active_tab = mdbactivetab;
        }
        if (mdbKnownResA) {
            check_input[$rootScope.keywordKnownResourceA] = mdbKnownResA;
        }
        if (mdbKnownResB) {
            check_input[$rootScope.keywordKnownResourceB] = mdbKnownResB;
        }

        sendQuery(check_input);

        // return promise object
        return deferred.promise;
    }

    // send form field validation request
    function sendCheckAutocomplete(mdbformid, key, value, autocompleteontology, autocompletesubontology) {
        var deferred = $q.defer();

        if (!mdbUEID) {
            mdbUEID = ''
        }
        if (!mdbUEIDURI) {
            mdbUEIDURI = '';
        }

        /*
         {
         "type": "check_autocomplete",
         "localID": "MDB_DATASCHEME_0000000022_1",
         "mdbueid": "6cc9ca2f",
         "mdbueid_uri": "http://www.morphdbase.de/resource/6cc9ca2f",
         "html_form": "MDB_DATASCHEME_0000000968_1",
         "connectSID": "s:42-HALLOHIERALARMEINS1ELF-TTESTT.SANDRASGANZPERSOENLICHEMDBPROTOTYPSESSIONID",
         "value": "bac",
         "SPRO_0000000483": "http://www.morphdbase.de/Ontologies/MDB/MDBCore#SC_MDB_BASIC_0000000018",
         "http://www.soccomas.org/Ontologies/SOCCOMAS/SprO#SPRO_0000000321": "http://www.morphdbase.de/resource/6cc9ca2f#TimeInterval_67",
         "http://www.soccomas.org/Ontologies/SOCCOMAS/SprO#SPRO_0000000148": "http://www.morphdbase.de/resource/6cc9ca2f#SC_BASIC_0000001483_67"
         }
         */

        var check_autocomplete = {
            'type': 'check_autocomplete',
            'localID': key,
            'mdbueid': mdbUEID,
            'mdbueid_uri': mdbUEIDURI,
            'html_form': mdbformid,
            'connectSID': connectSID
        };

        if (value) {
            check_autocomplete.value = value;
        }
        if (autocompleteontology) {
            check_autocomplete['SPRO_0000000483'] = autocompleteontology;
        }
        if (autocompletesubontology) {
            check_autocomplete['SPRO_0000000746'] = autocompletesubontology;
        }
        if (mdbKnownResA) {
            check_autocomplete[$rootScope.keywordKnownResourceA] = mdbKnownResA;
        }
        if (mdbKnownResB) {
            check_autocomplete[$rootScope.keywordKnownResourceB] = mdbKnownResB;
        }

        sendQuery(check_autocomplete);

        // return promise object
        return deferred.promise;
    }

    // send ShowEntryList request
    function sendShowEntryList(type) {
        // create a new instance of deferred
        var deferred = $q.defer();

        console.log("sendShowEntryList: " + type);

        if (!mdbUEID) {
            mdbUEID = ''
        }
        if (!mdbUEIDURI) {
            mdbUEIDURI = '';
        }

        var show_entry_list = {
            'type': 'list_entries',
            'mdbueid': mdbUEID,
            'mdbueid_uri': mdbUEIDURI,
            'connectSID': connectSID,
            'value': type
        };

        if (mdbKnownResA) {
            show_entry_list[$rootScope.keywordKnownResourceA] = mdbKnownResA;
        }
        if (mdbKnownResB) {
            show_entry_list[$rootScope.keywordKnownResourceB] = mdbKnownResB;
        }

        sendQuery(show_entry_list);

        // return promise object
        return deferred.promise;
    }

    // send checkURI request
    function sendCheckURI(value) {
        // create a new instance of deferred
        var deferred = $q.defer();

        if (!mdbUEID) {
            mdbUEID = ''
        }
        if (!mdbUEIDURI) {
            mdbUEIDURI = '';
        }

        var check_uri = {
            'type': 'check_uri',
            'mdbueid': mdbUEID,
            'mdbueid_uri': mdbUEIDURI,
            'connectSID': connectSID,
            'value': value
        };

        if (mdbKnownResA) {
            check_uri[$rootScope.keywordKnownResourceA] = mdbKnownResA;
        }
        if (mdbKnownResB) {
            check_uri[$rootScope.keywordKnownResourceB] = mdbKnownResB;
        }

        sendQuery(check_uri);

        // return promise object
        return deferred.promise;
    }


    return {
        response: response,
        sent: sent,
        connectSID: connectSID,
        isConnected: isConnected,
        sendToWebsocket: sendQuery,
        sendSparqlToWebsocket: sendSparql,
        sendSparqlToAdminWebsocket: sendSparqlToAdmin,
        sendSparqlToOntologyWebsocket: sendSparqlToOntology,
        sendSparqlToDraftWebsocket: sendSparqlToDraft,
        sendSparqlToPublishWebsocket: sendSparqlToPublish,
        sendSparqlToExOntologiesWebsocket: sendSparqlToExOntologies,
        sendGenerateDocToWebsocket: sendGenerateDoc,
        sendCheckInputToWebsocket: sendCheckInput,
        sendCheckAutocompleteToWebsocket: sendCheckAutocomplete,
        sendAnnotationToWebsocket: sendAnnotation,
        sendWhateverToWebsocket: sendWhatever,
        sendShowEntryListToWebsocket: sendShowEntryList,
        sendCheckURIToWebsocket: sendCheckURI
    };
});

// serves an mdb document
/**
 * public functions **
 * MDBDocumentService.getMDBPage()    - returns page list {}
 * MDBDocumentService.getMDBOverlay() - returns overlay list {}
 */
MDBServices.factory('MDBDocumentService', function ($q, $rootScope, $cookies, $http, $timeout, $location, WsService, AuthService) {

    var mdbCurrentUser = $cookies.get('currentUser');
    var docLoading = false;

    // listen for cookie events
    $rootScope.$watch($cookies.getAll, function () {
        mdbCurrentUser = $cookies.get('currentUser');
    });

    /// MDB Page ///////////////////////////////////////////////////
    var mdbPage = {};

    function setMDBPage(data) {
        mdbPage = data;
    }

    function getMDBPage() {
        var deferred = $q.defer();
        deferred.resolve(mdbPage);
        return deferred.promise;
    }

    /*
     $rootScope.$emit('WSMDBPageCompositionMessage', {
     socket_message: message,
     socket_message_type: 'mdb_page_composition'
     });
     */
    $rootScope.$on('WSMDBPageCompositionMessage', function (event, args) {
        setMDBPage(args.socket_message);
        $rootScope.$broadcast('MDBPageComposition_updated');
        $rootScope.$broadcast('MDBDocumentService_doc_loading_update', {doc_loading: false});
        docLoading = false;
    });


    /// MDB Partonomy Page ///////////////////////////////////////////////////
    var mdbPartonomyPage = {};

    function setMDBPartonomyPage(data) {
        mdbPartonomyPage = data;
    }

    function getMDBPartonomyPage() {
        var deferred = $q.defer();
        deferred.resolve(mdbPartonomyPage);
        return deferred.promise;
    }

    /*
     $rootScope.$emit('WSMDBPartonomyPageCompositionMessage', {
     socket_message: message,
     socket_message_type: 'mdb_partonomy_page_composition'
     });
     */
    //$rootScope.$on('WSMDBPartonomyPageCompositionMessage', function (event, args) {
    //    setMDBPartonomyPage(args.socket_message);
    //    $rootScope.$broadcast('MDBPartonomyPageComposition_updated');
    //});
    $rootScope.$on('WSMDBPartonomyPageCompositionMessage', function (event, args) {
        let partoPage = args.socket_message;
        setMDBPartonomyPage(partoPage);
        $location.path('/mdb_partonomy');
        $timeout(function () {
            $rootScope.$broadcast('MDBPartonomyPageComposition_updated', {
                socket_message: partoPage,
                socket_message_type: 'mdb_partonomy_composition'
            });
        }, 500);
        $rootScope.$broadcast('MDBDocumentService_doc_loading_update', {doc_loading: false});
        docLoading = false;
    });
    //else if (validity == "true" && ((message.data[0][message.localID]).hasOwnProperty('update_position'))){
    //    $rootScope.$broadcast('WSPositionUpdateMessage', {
    //        socket_message: message
    //    });
    //}
    $rootScope.$on('WSPartonomyPagePositionUpdateMessage', function (event, args) {
        let partoPosition = args.socket_message;
        $rootScope.$broadcast('MDBPartonomyPagePosition_updated', {
            socket_message: partoPosition,
            socket_message_type: 'mdb_partonomy_page_position',
            update_id: partoPosition.localID,
            update_message: partoPosition.data,
            update_position: partoPosition.data[0][partoPosition.localID].update_position,
            update_data: partoPosition.data[0][partoPosition.localID]
        });
    });


    $rootScope.$on('WSMDBTestPartonomyPageCompositionMessage', function (event, args) {
        let partoPage = args.socket_message;
        setMDBPartonomyPage(partoPage);
        $rootScope.$broadcast('MDBPartonomyPageComposition_updated', {
            socket_message: partoPage,
            socket_message_type: 'mdb_partonomy_composition'
        });
        $rootScope.$broadcast('MDBDocumentService_doc_loading_update', {doc_loading: false});
        docLoading = false;
    });


    /// MDB Overlay ///////////////////////////////////////////////
    var mdbOverlay = {};

    function setMDBOverlay(data) {
        mdbOverlay = data;
    }

    function getMDBOverlay() {
        var deferred = $q.defer();
        deferred.resolve(mdbOverlay);
        return deferred.promise;
    }

    /*
     $rootScope.$emit('WSMDBOverlayCompositionMessage', {
     socket_message: message,
     socket_message_type: 'mdb_overlay_composition'
     });
     */
    $rootScope.$on('WSMDBOverlayCompositionMessage', function (event, args) {
        setMDBOverlay(args.socket_message);
        $rootScope.$broadcast('MDBOverlayComposition_updated', {
            mdbOverlay: args.socket_message
        });
        $rootScope.$broadcast('MDBDocumentService_doc_loading_update', {doc_loading: false});
        docLoading = false;
    });

    /// set default
    function resetDocument(doc) {
        if (doc == "page") {
            mdbPage = {}
        }
        if (doc == "partonomy_page") {
            mdbPartonomyPage = {}
        }
        if (doc == "overlay") {
            mdbOverlay = {}
        }
    }
    /// serve input data  ///////////////////////////////////////////////
    function setInput(docitems, deferred, input) {

        if (!deferred) {
            var deferred = $q.defer();
        }

        if (!input) {
            var input = {};
        }

        if (docitems) {
            angular.forEach(docitems, function (value, key, obj) {

                //console.info("1st loop - key   - " + JSON.stringify(key) + " - value - " + JSON.stringify(value) + "\nobj - " + JSON.stringify(obj));



                if (key == 'SPRO_0000000069' && obj.SPRO_0000000069.length > 0) {
                    setInput(value);
                }
                // if firstname, lastname, username, Institute || email || comment
                //  has user/GUI input [value_A] || has user/GUI input [value_B] || has user/GUI input [value_C] || has user/GUI input [input_A] || sign up comment
                else if (key == 'SC_BASIC_0000001558' || key == 'SC_BASIC_0000001572' || key == 'SC_BASIC_0000001586' || key == 'SC_BASIC_0000001663' || key == 'SPRO_0000000881') {
                    //console.info("1st loop: SC_BASIC_0000001558... - key   - " + JSON.stringify(key) + " value - " + JSON.stringify(value));
                    input[obj.localID] = value;
                }
                // has selected resource
                else if (key == 'SPRO_0000000297') {
                    //console.info("2nd loop: has selected resource" + "\nkey     - " + JSON.stringify(key) + "\nvalue   - " + JSON.stringify(value) + "\nobj.SPRO_0000000942  - " + JSON.stringify(obj.SPRO_0000000942));
                    // input restricted to subclasses of
                    if (obj.SPRO_0000000942){
                        angular.forEach(obj.SPRO_0000000942, function (val, kee, ob) {
                            if(val.selValue == value){
                                //console.info("3nd loop: has selected resource" + "\nkey     - " + JSON.stringify(kee) + "\nvalue - " + JSON.stringify(val));
                                input[obj.localID] = value;
                            }
                        });
                    }
                    // input restricted to individuals of
                    else if (obj.SPRO_0000000742){
                        angular.forEach(obj.SPRO_0000000742, function (val, kee, ob) {
                            if(val.selValue == value){
                                //console.warn("3nd loop: has selected resource" + "\nkey     - " + JSON.stringify(kee) + "\nvalue - " + JSON.stringify(val));
                                input[obj.localID] = value;
                            }
                        });
                    }
                    else {
                        console.info("MDBDocumentService - setInput(): has no selectable resources");
                    }
                }
                // has Boolean value [BOOLEAN]
                else if (key == 'SPRO_0000000772') {
                    if (value == "true"){
                        input[obj.localID] = true;
                    }
                    else{
                        input[obj.localID] = false;
                    }
                    // radio buttons
                    //if (obj.SPRO_0000000999 === "SC_BASIC_0000001218"){
                    //    input[obj.localID] = value;
                    //}
                    //else{
                    //    if (value == "true"){
                    //        input[obj.localID] = true;
                    //    }
                    //    else{
                    //        input[obj.localID] = false;
                    //    }
                    //}
                }

                angular.forEach(value, function (value, key, obj) {

                    //console.info("2nd loop - key   - " + JSON.stringify(key) + " - value - " + JSON.stringify(value));

                    if (key == 'SPRO_0000000069' && obj.SPRO_0000000069.length > 0) {
                        setInput(value, deferred, input);
                    }
                    // if firstname, lastname, username, Institute || email || comment
                    //  has user/GUI input [value_A] || has user/GUI input [value_B] || has user/GUI input [value_C] || has user/GUI input [input_A] || sign up comment
                    else if (key == 'SC_BASIC_0000001558' || key == 'SC_BASIC_0000001572' || key == 'SC_BASIC_0000001586' || key == 'SC_BASIC_0000001663' || key == 'SPRO_0000000881') {
                        //console.info("2nd loop: SC_BASIC_0000001558... - key   - " + JSON.stringify(key) + " value - " + JSON.stringify(value));
                        input[obj.localID] = value;
                    }
                    // has selected resource
                    else if (key == 'SPRO_0000000297') {
                        //console.info("2nd loop: has selected resource" + "\nkey     - " + JSON.stringify(key) + "\nvalue   - " + JSON.stringify(value) + "\nobj.SPRO_0000000942  - " + JSON.stringify(obj.SPRO_0000000942));
                        // input restricted to subclasses of
                        if (obj.SPRO_0000000942){
                            angular.forEach(obj.SPRO_0000000942, function (val, kee, ob) {
                                if(val.selValue == value){
                                    //console.warn("3nd loop: has selected resource" + "\nkey     - " + JSON.stringify(kee) + "\nvalue - " + JSON.stringify(val));
                                    input[obj.localID] = value;
                                }
                            });
                        }
                        // input restricted to individuals of
                        else if (obj.SPRO_0000000742){
                            angular.forEach(obj.SPRO_0000000742, function (val, kee, ob) {
                                if(val.selValue == value){
                                    //console.info("3nd loop: has selected resource" + "\nkey     - " + JSON.stringify(kee) + "\nvalue - " + JSON.stringify(val));
                                    input[obj.localID] = value;
                                }
                            });
                        }
                        else {
                            console.info("MDBDocumentService - setInput(): has no selectable resources");
                        }
                    }
                    // has Boolean value [BOOLEAN]
                    else if (key == 'SPRO_0000000772') {
                        if (value == "true"){
                            input[obj.localID] = true;
                        }
                        else{
                            input[obj.localID] = false;
                        }
                        // radio buttons
                        //if (obj.SPRO_0000000999 === "SC_BASIC_0000001218"){
                        //    input[obj.localID] = value;
                        //}
                        //else{
                        //    if (value == "true"){
                        //        input[obj.localID] = true;
                        //    }
                        //    else{
                        //        input[obj.localID] = false;
                        //    }
                        //}
                    }
                });
            });
            deferred.resolve(input);
        }
        else {
            deferred.reject("No items available.");
        }
        return deferred.promise;
    }
    /// data submit functions ///////////////////////////////////////////////

    function submitInputData(mdbformid, form, key, value, mdbpartid, mdbactivetab) {

        if ($rootScope.developers.indexOf(mdbCurrentUser) > -1) {
            console.info("Service - console\nFormID - " + mdbformid + "\nkey - " + key + "\nvalue - " + value);
        }
        // load spinner
        if (key === "SC_MDB_BASIC_0000000814" || key === "SC_MDB_BASIC_0000000659") { // TODO: find a better way to do this
            $(`#${mdbformid}`).append(`<div class="overlay-spinner"><div id=\"spinningLoader\" class=\"loader no-animate\"></div></div>`)
        }
        // set loading flag for spinner in case of new spec entry & new morph desc entry
        if (key === "SC_MDB_BASIC_0000000814" || key === "SC_MDB_BASIC_0000000659"){
            $rootScope.$broadcast('MDBDocumentService_doc_loading_update', {doc_loading: true});
            docLoading = true;
        }
        // if password, send "buffalo"
        if (key == 'SC_BASIC_0000000628' || key == 'SC_BASIC_0000000836') {
            // TODO: A long time ago in a galaxy far far away, we may change this workflow and send the password to websocket.
            value = 'buffalo';
        }

        let typeofvalue = typeof value;

        if (typeofvalue !== "undefined"){
            if (typeofvalue !== "null") {
                // if boolean value
                if (typeofvalue === 'number') {
                    if ($rootScope.developers.indexOf(mdbCurrentUser) > -1)
                        {console.info("Service - submitInputData\ntypeof value  - " + typeofvalue + "\nvalue - " + value);}
                }
                // if boolean value
                else if (typeofvalue === 'boolean') {
                    if ($rootScope.developers.indexOf(mdbCurrentUser) > -1)
                        {console.info("Service - submitInputData\ntypeof value  - " + typeofvalue + "\nvalue - " + value);}
                    if (value == true) {
                        value = "true";
                    } else if (value == false) {
                        value = "false";
                    }
                }
                // if empty value
                else if (value == "") {
                    if ($rootScope.developers.indexOf(mdbCurrentUser) > -1)
                        {console.info("Service - submitInputData\ntypeof value  - " + typeofvalue + "\nvalue - " + value);}
                    // Warning! This has to be a whitespace, an empty string does not work.
                    value = " ";
                }
            }
            else {
                if ($rootScope.developers.indexOf(mdbCurrentUser) > -1)
                    {console.info("Service - submitInputData\ntypeof value  - " + typeofvalue + "\nvalue - " + value);}
                // Warning! This has to be a whitespace, an empty string does not work.
                value = " ";
            }
        }
        else {
            if ($rootScope.developers.indexOf(mdbCurrentUser) > -1)
                {console.info("Service - submitInputData\ntypeof value  - " + typeofvalue + "\nvalue - " + value);}
            // Warning! This has to be a whitespace, an empty string does not work.
            value = " ";
        }

        var key_data = [];

        angular.forEach(form, function (val, key) {
            if (typeof val === 'object' && val.hasOwnProperty('$modelValue')) {
                if (!(val.$modelValue == null)) {
                    // if password
                    if (val.$name == 'SC_BASIC_0000000628' || val.$name == 'SC_BASIC_0000000836') {
                        // TODO: A long time ago in a galaxy far far away, we may change this workflow and send the password to websocket.
                        key_data.push({ 'localID': val.$name, 'value': 'buffalo' });
                    }
                    // if boolean
                    else if (typeof val.$modelValue === 'boolean') {
                        //console.log("typeof val.$modelValue - " + typeof val.$modelValue)
                        if (val.$modelValue == true){
                            key_data.push({ 'localID': val.$name, 'value': "true"});
                        }
                        else{
                            key_data.push({ 'localID': val.$name, 'value': "false"});
                        }
                    }
                    // all other modelvalues
                    else {
                        key_data.push({ 'localID': val.$name, 'value': val.$modelValue });
                    }
                }
                // if empty
                else {
                    // Warning! This has to be a whitespace, an empty string does not work.
                    key_data.push({ 'localID': val.$name, 'value': " " });
                }
            }
        });

        // if login button
        if (key == "SC_BASIC_0000000635" && mdbformid == 'Ontologies/SOCCOMAS/SCBasic#SC_BASIC_0000001206') {
            // call login from service
            AuthService.authenticate(form)
                // handle success
                .then(function (data) {
                    WsService.sendCheckInputToWebsocket(mdbformid, key, value, key_data, data.mdbueid, mdbpartid, mdbactivetab);
                    /** Should be called on WSLoginFeedbackMessage */
                    // $scope.forms.mdbForm.$setPristine();
                    // WsService.sendGenerateDocToWebsocket('SC_BASIC_0000001156');
                    //TODO: löschen!
                    //console.log("MDBDocumentService - submitAuthData - authentication successful: " + "\nFormID - " + mdbformid + "\nkey - " + key + "\nvalue - " + value + "\nkey_data - " + JSON.stringify(key_data) + "\nueid - " + data.mdbueid);
                })
                // handle error
                .catch(function (fallback) {
                    //NotificationService.showError("Invalid username and/or password");
                    $('#SC_BASIC_0000000635').effect("shake", { times: 5, distance: 2 }, 300);
                    //$('#SC_BASIC_0000000635').removeClass("btn-default").addClass("btn-danger");
                    //TODO: löschen!
                    //console.log("MDBDocumentService - submitAuthData - authentication catch: " + "\nWhut? - " + fallback);
                });
        }
        // if register button
        else if (key == "SC_BASIC_0000000833" && mdbformid == 'Ontologies/SOCCOMAS/SCBasic#SC_BASIC_0000001156') {
            // call register from service (username, password)
            AuthService.register(form)
                .then(function (data) {
                    WsService.sendCheckInputToWebsocket(mdbformid, key, value, key_data, data.mdbueid, mdbpartid, mdbactivetab);
                    //WsService.sendGenerateDocToWebsocket('SC_BASIC_0000001206');
                })
                // handle error
                .catch(function (fallback) {
                    $('#SC_BASIC_0000000833').effect("shake", { times: 5, distance: 2 }, 300);
                    //$('#SC_BASIC_0000000833').removeClass("btn-default").addClass("btn-danger");
                    //TODO: löschen!
                    console.log("MDBDocumentService - submitAuthData - register catch: " + "\nWhut? - " + JSON.stringify(fallback));
                });
        }
        // if first register email
        else if (key == "SC_BASIC_0000000825" && value) {
            WsService.sendCheckInputToWebsocket(mdbformid, key, value, key_data, null, mdbpartid, mdbactivetab);

            // TODO: Workaround: if input is first register email => check second register email as well
            if (form["SC_BASIC_0000000828"].$modelValue) {
                WsService.sendCheckInputToWebsocket(mdbformid, "SC_BASIC_0000000828", form["SC_BASIC_0000000828"].$modelValue, key_data, null, mdbpartid, mdbactivetab);
            }
        }
        // if second register email
        else if (key == "SC_BASIC_0000000828" && value) {
            WsService.sendCheckInputToWebsocket(mdbformid, key, value, key_data, null, mdbpartid, mdbactivetab);

            // TODO: Workaround: if input is second register email => check first register email again
            if (form["SC_BASIC_0000000825"].$modelValue) {
                WsService.sendCheckInputToWebsocket(mdbformid, "SC_BASIC_0000000825", form["SC_BASIC_0000000825"].$modelValue, key_data, null, mdbpartid, mdbactivetab);
            }
        }
        // if any other input
        else {
            if ($rootScope.developers.indexOf(mdbCurrentUser) > -1) {
                //console.warn("MDBDocumentService - submitInputData - sendCheckInputToWebsocket: " + "\nFormID - " + mdbformid + "\nkey - " + key + "\nvalue - " + value + "\nkey_data - " + JSON.stringify(key_data));
            }
            if (value){
                if(typeof value === "object" && value.resource) {
                    console.error("typeof value === object - " + value);
                    value = value.resource
                }
            }
            WsService.sendCheckInputToWebsocket(mdbformid, key, value, key_data, null, mdbpartid, mdbactivetab);
        }
    }

    function submitAuthData(mdbformid, form, key, value) {

        // if empty value
        if (value == "") {
            // Warning! This has to be a whitespace, an empty string does not work.
            value = " ";
        }
        // if value = null
        else if (value == null) {
            // Warning! This has to be a whitespace, an empty string does not work.
            value = " ";
        }
        // if number
        else if (!new RegExp(/^[0-9]+$/).test(value)) {
            // This is important for the case if an Integer should have the value 0 or 1.
            if (value == true) {
                value = "true";
            } else if (value == false) {
                value = "false";
            }
        }

        if (key == 'SC_BASIC_0000000628' || key == 'SC_BASIC_0000000836') {
            // TODO: A long time ago in a galaxy far far away, we may change this workflow and send the password to websocket.
            value = 'buffalo';
        }

        var key_data = [];

        angular.forEach(form, function (value, key) {
            if (typeof value === 'object' && value.hasOwnProperty('$modelValue')) {
                // if password
                if (value.$name == 'SC_BASIC_0000000628' || value.$name == 'SC_BASIC_0000000836') {
                    // TODO: A long time ago in a galaxy far far away, we may change this workflow and send the password to websocket.
                    if (value.$modelValue) {
                        key_data.push({ 'localID': value.$name, 'value': 'buffalo' });
                    }
                    else {
                        key_data.push({ 'localID': value.$name, 'value': '' });
                    }
                }
                // sign up checkbox
                else if (value.$name == 'SC_BASIC_0000000534') {
                    if (value.$modelValue) {
                        key_data.push({ 'localID': value.$name, 'value': 'true' });
                    }
                    else {
                        key_data.push({ 'localID': value.$name, 'value': 'false' });
                    }
                }
                // if boolean, change to string
                else if (typeof value.$modelValue === 'boolean') {
                    //console.log("typeof val.$modelValue - " + typeof val.$modelValue)
                    if (value.$modelValue == true){
                        key_data.push({ 'localID': value.$name, 'value': "true"});
                    }
                    else{
                        key_data.push({ 'localID': value.$name, 'value': "false"});
                    }
                }
                else { //
                    if (value.$modelValue) {
                        key_data.push({ 'localID': value.$name, 'value': value.$modelValue });
                    }
                    else {
                        key_data.push({ 'localID': value.$name, 'value': '' });
                    }
                }
            }
        });

        // login button
        if (key == "SC_BASIC_0000000635" && mdbformid == 'Ontologies/SOCCOMAS/SCBasic#SC_BASIC_0000001206') {
            // call login from service
            AuthService.authenticate(form)
                // handle success
                .then(function (data) {
                    WsService.sendCheckInputToWebsocket(mdbformid, key, value, key_data, data.mdbueid);
                    /** Should be called on WSLoginFeedbackMessage */
                    // $scope.forms.mdbForm.$setPristine();
                    // WsService.sendGenerateDocToWebsocket('SC_BASIC_0000001156');
                    //TODO: löschen!
                    //console.log("MDBDocumentService - submitAuthData - authentication successful: " + "\nFormID - " + mdbformid + "\nkey - " + key + "\nvalue - " + value + "\nkey_data - " + JSON.stringify(key_data) + "\nueid - " + data.mdbueid);
                })
                // handle error
                .catch(function (fallback) {
                    //NotificationService.showError("Invalid username and/or password");
                    $('#SC_BASIC_0000000635').effect("shake", { times: 5, distance: 2 }, 300);
                    //$('#SC_BASIC_0000000635').removeClass("btn-default").addClass("btn-danger");
                    //TODO: löschen!
                    //console.log("MDBDocumentService - submitAuthData - authentication catch: " + "\nWhut? - " + fallback);
                });
        }
        // register button
        else if (key == "SC_BASIC_0000000833" && mdbformid == 'Ontologies/SOCCOMAS/SCBasic#SC_BASIC_0000001156') {
            // call register from service (username, password)
            AuthService.register(form)
                .then(function (data) {
                    WsService.sendCheckInputToWebsocket(mdbformid, key, value, key_data, data.mdbueid);
                    //WsService.sendGenerateDocToWebsocket('SC_BASIC_0000001206');
                })
                // handle error
                .catch(function (fallback) {
                    $('#SC_BASIC_0000000833').effect("shake", { times: 5, distance: 2 }, 300);
                    //$('#SC_BASIC_0000000833').removeClass("btn-default").addClass("btn-danger");
                    //TODO: löschen!
                    console.log("MDBDocumentService - submitAuthData - register catch: " + "\nWhut? - " + JSON.stringify(fallback));
                });
        }
        // first register email
        else if (key == "SC_BASIC_0000000825" && value) {
            WsService.sendCheckInputToWebsocket(mdbformid, key, value, key_data, null);

            //  workaround, both email input fields should be checked
            if (form["SC_BASIC_0000000828"].$modelValue) {
                WsService.sendCheckInputToWebsocket(mdbformid, "SC_BASIC_0000000828", form["SC_BASIC_0000000828"].$modelValue, key_data, null);
            }
        }
        // second register email
        else if (key == "SC_BASIC_0000000828" && value) {
            WsService.sendCheckInputToWebsocket(mdbformid, key, value, key_data, null);

            // workaround, both email input fields should be checked
            if (form["SC_BASIC_0000000825"].$modelValue) {
                WsService.sendCheckInputToWebsocket(mdbformid, "SC_BASIC_0000000825", form["SC_BASIC_0000000825"].$modelValue, key_data, null);
            }
        }
        // if any other input
        else {
            //TODO: löschen!
            //console.log("MDBDocumentService - submitAuthData - sendCheckInputToWebsocket: " + "\nFormID - " + mdbformid + "\nkey - " + key + "\nvalue - " + value + "\nkey_data - " + JSON.stringify(key_data));
            WsService.sendCheckInputToWebsocket(mdbformid, key, value, key_data, null);
        }
    }

    // TODO: onSelect in autocomplete list: workaround to execute an autocomplete input correct
    function submitAutocompleteSelect(mdbformid, form, key, value, mdbpartid, mdbactivetab) {
        $timeout(function () {
            submitInputData(mdbformid, form, key, value, mdbpartid, mdbactivetab);
        }, 150);
    }
    // TODO: onChange in autocomplete list
    function submitAutocompleteChange(mdbformid, form, key, value, autocompleteontology, autocompletesubontology) {
        if (value == null) {
            // Warning! This has to be a whitespace, an empty string does not work.
            value = " "
        }
        WsService.sendCheckAutocompleteToWebsocket(mdbformid, key, value, autocompleteontology, autocompletesubontology);
    }
    /// serve test data ///////////////////////////////////////////////

    $rootScope.$on('sendTestSpecEntry', function (event, args) {
        $http.get('../data/test_entry.json')
            .then(function (result) {
                var data = result.data;
                $rootScope.$emit('WSMDBPageCompositionMessage', {
                    socket_message: data,
                    socket_message_type: 'mdb_page_composition'
                });
            })
            .catch(function (data, status, headers, config) {
                alert("mist.");
            });
    });
    $rootScope.$on('sendTestUserEntry', function (event, args) {
        $http.get('../data/test_user.json')
            .then(function (result) {
                var data = result.data;
                var status = result.status;
                $rootScope.$emit('WSMDBPageCompositionMessage', {
                    socket_message: data,
                    socket_message_type: 'mdb_page_composition'
                });
            })
            .catch(function (data, status, headers, config) {
                alert("mist.");
            });
    });
    $rootScope.$on('sendTestDescEntry', function (event, args) {
        $http.get('../data/test_description_entry.json')
            .then(function (result) {
                var data = result.data;
                var status = result.status;
                $rootScope.$emit('WSMDBPageCompositionMessage', {
                    socket_message: data,
                    socket_message_type: 'mdb_page_composition'
                });
            })
            .catch(function (data, status, headers, config) {
                alert("mist.");
            });
    });
    $rootScope.$on('sendTestAdmin', function (event, args) {
        $http.get('../data/test_admin_document.json')
            .then(function (result) {
                var data = result.data;
                var status = result.status;
                $rootScope.$emit('WSMDBPageCompositionMessage', {
                    socket_message: data,
                    socket_message_type: 'mdb_page_composition'
                });
            })
            .catch(function (data, status, headers, config) {
                alert("mist.");
            });
    });
    $rootScope.$on('sendTestOverlay', function (event, args) {
        $http.get('../data/test_entry_overlay.json')
            .then(function (result) {
                var data = result.data;
                var status = result.status;
                $rootScope.$emit('WSMDBOverlayCompositionMessage', {
                    socket_message: data,
                    socket_message_type: 'mdb_overlay_composition'
                });
            })
            .catch(function (data, status, headers, config) {
                alert("mist.");
            });
    });
    $rootScope.$on('sendTestNewEntryOverlay', function (event, args) {
        $http.get('../data/test_create_entry_overlay.json')
            .then(function (result) {
                var data = result.data;
                var status = result.status;
                $rootScope.$emit('WSMDBOverlayCompositionMessage', {
                    socket_message: data,
                    socket_message_type: 'mdb_overlay_composition'
                });
            })
            .catch(function (data, status, headers, config) {
                alert("mist.");
            });
    });
    /*$rootScope.$on('sendTestPartonomy', function (event, args) {
        $http.get('../data/test_partonomy_entry.json')
            .then(function (result) {
                var data = result.data;
                var status = result.status;
                $rootScope.$broadcast('WSMDBTestPartonomyPageCompositionMessage', {
                    socket_message: data,
                    socket_message_type: 'mdb_partonomy_composition'
                });
            })
            .catch(function (data, status, headers, config) {
                alert("mist.");
            });
    });*/

    return ({
        getMDBPage: getMDBPage,
        getMDBPartonomyPage: getMDBPartonomyPage,
        getMDBOverlay: getMDBOverlay,
        resetDocument: resetDocument,
        submitAuthData: submitInputData, //submitAuthData,
        submit: submitInputData,
        submitAutocompleteChange: submitAutocompleteChange,
        submitAutocompleteSelect: submitAutocompleteSelect,
        //submitEntryListRequest: submitEntryListRequest,
        setInput: setInput
    });
});

/////// Utilities //////////////////////////////////////////////////////////////////////

// Service for random number generation, UUID, UEID, ...
/**
 * public functions **
 * RandomNumberService.getMDBUEID() - returns random hex number with 8 digits (for mdb-ueid)
 * RandomNumberService.v16()        - returns random hex number with 16 digits
 * RandomNumberService.getUUID()    - returns random number with UUID ver.4 (rfc4122 type 4 uuid)
 * RandomNumberService.r()          - returns an pseudo random integer between 0 and x
 */
MDBServices.factory('RandomNumberService', function () {

    function r(x) {
        //return an pseudo random integer between 0 and x
        //Math.random() function is not a cryptographically-secure random number generator.
        //In case we want to do cryptography, we need a secure function
        return Math.round(Math.random() * x)
    }

    return {
        // returns random hex number with 8 digits (for mdb-ueid)
        getMDBUEID: function () {
            var n, a = '';
            for (n = 0; 8 > n; n++)a += '0123456789abcdef'.charAt(r(15));
            return a
        },
        // returns random hex number with 16 digits
        v16: function () {
            var n, a = '';
            for (n = 0; 16 > n; n++)a += '0123456789abcdef'.charAt(r(15));
            return a
        },
        // returns random number with UUID ver.4 (rfc4122 type 4 uuid)
        // with date.getTime() or the even better performance.now() as additional entropy
        getUUID: function () {
            var offset = new Date().getTime();
            // performance.now() is available in Chrome, Firefox > 15 and IE >9
            if (window.performance && typeof window.performance.now === "function") {
                offset += performance.now();
            }
            var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = (offset + Math.random() * 16) % 16 | 0;
                offset = Math.floor(offset / 16);
                return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
            });
            return uuid;
        },
        r: r
    }
});

// Manually compiles elements, fixing the recursion loop.
/**
 * public functions **
 * %
 */
MDBServices.factory('RecursionHelper', function ($compile) {
    return {
        /**
         * Manually compiles the element, fixing the recursion loop.
         * @param element
         * @param [link] A post-link function, or an object with function(s) registered via pre and post properties.
         * @returns An object containing the linking functions.
         */
        compile: function (element, link) {
            // Normalize the link parameter
            if (angular.isFunction(link)) {
                link = { post: link };
            }

            // Break the recursion loop by removing the contents
            var contents = element.contents().remove();
            var compiledContents;
            return {
                pre: (link && link.pre) ? link.pre : null,
                /**
                 * Compiles and re-adds the contents
                 */
                post: function (scope, element) {
                    // Compile the contents
                    if (!compiledContents) {
                        compiledContents = $compile(contents);
                    }
                    // Re-add the compiled contents to the element
                    compiledContents(scope, function (clone) {
                        element.append(clone);
                    });

                    // Call the post-linking function, if any
                    if (link && link.post) {
                        link.post.apply(null, arguments);
                    }
                }
            };
        }
    };
});

/*MDBServices.factory('JSONService', function ($http) {
 // TODO - ich bin unsicher, ob dieser Service funktioniert. ;)
 function getITISNames() {
 $http.get('../data/names.json')
 .success(function (data) {
 alert('data - names');
 return data;
 })
 .error(function (data) {
 alert('catch data - names -' + data);
 return data;
 })
 .catch(function (data) {
 alert('error data - names -' + data);
 return data;
 });
 }

 function getITISNamesWithLink() {
 $http.get('../data/namesWithLink.json')
 .success(function (data) {
 alert('data - namesWithLink');
 return data;
 })
 .error(function (data) {
 alert('catch data - namesWithLink -' + data);
 return data;
 })
 .catch(function (data) {
 alert('error data - namesWithLink -' + data);
 return data;
 });
 }

 return ({
 getITISNames: getITISNames,
 getITISNamesWithLink: getITISNamesWithLink
 });
 });*/
