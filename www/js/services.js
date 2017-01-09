angular.module('app.services', [])


        .factory('sharedUtils', ['$ionicLoading', '$ionicPopup', function($ionicLoading, $ionicPopup) {


                var functionObj = {};

                functionObj.showLoading = function() {
                    $ionicLoading.show({
                        content: '<i class=" ion-loading-c"></i> ', // The text to display in the loading indicator
                        animation: 'fade-in', // The animation to use
                        showBackdrop: true, // Will a dark overlay or backdrop cover the entire view
                        maxWidth: 200, // The maximum width of the loading indicator. Text will be wrapped if longer than maxWidth
                        showDelay: 0 // The delay in showing the indicator
                    });
                };
                functionObj.hideLoading = function() {
                    $ionicLoading.hide();
                };


                functionObj.showAlert = function(title, message) {
                    var alertPopup = $ionicPopup.alert({
                        title: title,
                        template: message
                    });
                };

                return functionObj;

            }])


        .factory("Auth", ["$firebaseAuth",
            function($firebaseAuth) {
                return $firebaseAuth();
            }
        ])

//        .factory('EmailNotification', ['$http', '$q', function($http, $q) {
//                var from = 'noreply@kilimanjaroTest.com';
//                return{
//                    sendEmail: function(to) {
//                        var defer = $q.defer();
//                        var data = {};
//                        data.personalizations = [{to: to}];
//                        data.from = from;
//                        data.content = [{type: 'text/html', value: 'Hey Username.'}]
//                        var req = {
//                            method: 'POST',
//                            url: 'https://api.sendgrid.com/v3/mail/send',
//                            headers: {
//                                'Content-Type': 'application/json',
//                            },
//                            data: data
//                        }
//
//                        $http(req).then(function(success) {
//                            defer.resolve(success)
//                        }, function(err) {
//                            defer.reject(err)
//                        });
//                        return defer.promise()
//                    }
//                }
//            }])

        .service('BlankService', [function() {

            }]);

