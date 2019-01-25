describe('Basic Karma Test (Karma is set up correctly)', function () {
    // always true
    it('should always be true', function () {
        expect(true).toBe(true);
    });

});

describe('Basic Angular Test (MDB app works)', function () {
    beforeEach(module('mdbApp'));

    it('should have a version number', inject(function (version) {
        expect(version).toBeDefined();
    }));
    it('should provide valid version number (e.g 0.1 or 1.2.33 or 2.0beta', inject(function (version) {
        expect(version).toMatch(/\d+(?:\.\d+)+/);
    }));

});

describe('mdbApp.services Tests', function () {
    beforeEach(module('mdbApp', 'mdbApp.services'));

    it('should have a version number', inject(function (version) {
        expect(version).toBeDefined();
    }));
    it('should provide valid version number', inject(function (version) {
        expect(version).toMatch(/\d+(?:\.\d+)+/);
    }));

    //Test the RandomNumberService
    describe('RandomNumberService', function () {
        beforeEach(inject(function (_RandomNumberService_) {
            RandomNumberService = _RandomNumberService_;
        }));

        it('should provide the Random Number Service', function () {
            expect(RandomNumberService).toBeDefined();
        });

        it('should return an random integer', function () {
            expect(RandomNumberService.r(8)).toMatch(/\d{1,}/);
            expect(RandomNumberService.r(999)).toMatch(/^([1-9][0-9]{0,2})$/);
            expect(RandomNumberService.r(999999)).toMatch(/^([1-9][0-9]{0,5})$/);
            //Todo: add tests, if we use the random numbers in a security critical context
        });

        it('Two random numbers should (almost) never be se same (chance 1:1,000,000)', function () {
            //if this test fails regularly (more than two times) we need a better random function
            expect(RandomNumberService.r(1000000)).not.toEqual(RandomNumberService.r(1000000));
        });

        it('MDBUEID should provide a 8 digit random hex number', function () {
            expect(RandomNumberService.getMDBUEID().length).toEqual(8);
        });
        it('MDBUEID should consist of [a-f0-9]', function () {
            expect(RandomNumberService.getMDBUEID()).toMatch(/^[a-f0-9]+$/);
        });
        it('MDBUEID should provide a random hex number', function () {
            expect(parseInt(RandomNumberService.getMDBUEID(), 16)).toEqual(jasmine.any(Number));
        });

        it('V16 should provide a 16 digit random number', function () {
            expect(RandomNumberService.v16().length).toEqual(16);
        });
        it('V16 should consist of [a-f0-9]', function () {
            expect(RandomNumberService.v16()).toMatch(/^[a-f0-9]+$/);
        });
        it('V16 should provide a random hex number', function () {
            expect(parseInt(RandomNumberService.v16(), 16)).toEqual(jasmine.any(Number));
        });

        it('getUUID should provide a valid UUID v4', function () {
            expect(RandomNumberService.getUUID()).toMatch(/^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-4[a-fA-F0-9]{3}-[89abAB][a-fA-F0-9]{3}-[a-fA-F0-9]{12}$/);
        });


    });

    //Test the WsService
    describe('WsService', function () {
        beforeEach(inject(function (_WsService_, _$websocket_) {
            WsService = _WsService_;
        }));

        it('Websocket should NOT be connected at this point', function () {
            expect(WsService.isConnected()).toBeFalsy();
        });

        // further test of WsService need an established websocket.
        // We test this via the controller later on.
        // todo: write controller tests

    });


    //Test the AuthService
    describe('AuthService', function () {
        beforeEach(inject(function (_AuthService_) {
            AuthService = _AuthService_;
        }));
        // DEPRICATED?
        //it('AuthService should provide 22 functions', function () {
        //    expect(typeof AuthService.isLoggedIn).toEqual('function');
        //    expect(typeof AuthService.getUserStatus).toEqual('function');
        //    expect(typeof AuthService.getUsername).toEqual('function');
        //    expect(typeof AuthService.login).toEqual('function');
        //    expect(typeof AuthService.generateMDBUEID).toEqual('function');
        //    expect(typeof AuthService.getUserSessionInfo).toEqual('function');
        //    expect(typeof AuthService.getConnectSID).toEqual('function');
        //    expect(typeof AuthService.getAuthPanel).toEqual('function');
        //});

        it('AuthService function should provide the expected type of data', function () {
            //not all functions return something, to their output is undefined
            //We do not test the functions using the webservice (e.g. logincheck) at this point
            expect(typeof AuthService.isLoggedIn()).toEqual('boolean');
            expect(typeof AuthService.getUserStatus()).toEqual('object');
            expect(typeof AuthService.getUsername()).toEqual('string');
            expect(typeof AuthService.generateMDBUEID()).toEqual('object');
            expect(typeof AuthService.getUserSessionInfo()).toEqual('object');
            expect(typeof AuthService.getConnectSID()).toEqual('object');
            expect(typeof AuthService.getAuthPanel()).toEqual('object');
        });

        it('AuthService should return some values and objects', function () {
            expect(AuthService.getUsername()).toEqual('Login');
        });

    });

    //Test the NotificationService
    describe('NotificationService', function () {
        beforeEach(inject(function ($rootScope, _NotificationService_) {
            NotificationService = _NotificationService_;
            rootScope = $rootScope.$new();

            setInfoMessage = function (message) {
                NotificationService.showInfo(message)
            };

            setSuccessMessage = function (message) {
                NotificationService.showSuccess(message)
            };

            setErrorMessage = function (message) {
                NotificationService.showError(message)
            };

        }));


        it('should get the set message', function () {
            //does the 1st message get overwritten correctly?
            setNotification = setInfoMessage('Message to be overwritten');
            setNotification = setInfoMessage('Hello World');
            expect(NotificationService.getMessage()).toBe('Hello World');
        });

        it('should reset the message', function () {
            setNotification = setInfoMessage('Hello World');
            NotificationService.resetMessage();
            expect(NotificationService.getMessage()).toBe('');
        });

        it('should get the set message', function () {
            //does the 1st message get overwritten correctly?
            setNotification = setSuccessMessage('Message to be overwritten');
            setNotification = setSuccessMessage('Hello World');
            expect(NotificationService.getMessage()).toBe('Hello World');
        });

        it('should reset the message', function () {
            setNotification = setSuccessMessage('Hello World');
            NotificationService.resetMessage();
            expect(NotificationService.getMessage()).toBe('');
        });

        it('should get the set message', function () {
            //does the 1st message get overwritten correctly?
            setNotification = setErrorMessage('Message to be overwritten');
            setNotification = setErrorMessage('Hello World');
            expect(NotificationService.getMessage()).toBe('Hello World');
        });

        it('should reset the message', function () {
            setNotification = setErrorMessage('Hello World');
            NotificationService.resetMessage();
            expect(NotificationService.getMessage()).toBe('');
        });

        it('should have initial notification to be false', function () {
            expect(NotificationService.getNotification()).toBeFalsy();
        });

        it('should have initial info state to be false', function () {
            expect(NotificationService.getShowInfo()).toBeFalsy();
        });

        it('should have initial error stat to be false', function () {
            expect(NotificationService.getShowError()).toBeFalsy();
        });

        it('should have initial success stat to be false', function () {
            expect(NotificationService.getShowSuccess()).toBeFalsy();
        });

        it('should have info state set', function () {
            NotificationService.showInfo('Info message.');
            expect(NotificationService.getShowInfo()).toBeTruthy();
            expect(NotificationService.getNotification()).toBeTruthy();
            expect(NotificationService.getMessage()).toBe('Info message.');
        });

        it('should have error state set', function () {
            NotificationService.showError('Error message.');
            expect(NotificationService.getShowError()).toBeTruthy();
            expect(NotificationService.getNotification()).toBeTruthy();
            expect(NotificationService.getMessage()).toBe('Error message.');
        });

        it('should have success state set', function () {
            NotificationService.showSuccess('Success message.');
            expect(NotificationService.getShowSuccess()).toBeTruthy();
            expect(NotificationService.getNotification()).toBeTruthy();
            expect(NotificationService.getMessage()).toBe('Success message.');
        });

        it('should show message (for 3 seconds)', inject(function ($timeout) {
            NotificationService.showInfo('Hello World');
            expect(NotificationService.getShowInfo()).toBeTruthy();
            expect(NotificationService.getMessage()).toBe('Hello World');

            // Todo: test if message is unset after 3 seconds                       // This is how it SHOULD work, however app.js throws error "TypeError: next.access is undefined"
            //expect(function() {$timeout.flush();}).not.toThrow();                 // "flush" should be callable without error
            //$timeout.flush();                                                     // flush pending timed outed function "showInfo"
            //expect(function() {$timeout.verifyNoPendingTasks();}).not.toThrow();  // double check if "showInfo" is timed out
            //expect(NotificationService.getShowInfo()).toBeFalsy();                // getShowInfo should be falsy after flush
        }));

    });


});

describe('mdbApp.api Tests)', function () {
    beforeEach(module('mdbApp'));
    beforeEach(inject(function (_AuthService_) {
        AuthService = _AuthService_;
    }));

    it('Websocket should NOT be connected at this point', function () {
        expect(AuthService.getConnectSID()
            .then(
            function (SID) {
                return SID;
            }
        ))
            .not.toBe('foobar');
    });

    it('should connect to the web socket', inject(function ($http) {
        expect($http.get('/user/mdbueids'))

            .not.toBe('foobar');
    }));

});
