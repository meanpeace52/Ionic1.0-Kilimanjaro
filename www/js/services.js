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
        
        .factory('GoogleService', ['$http', '$q', function($http, $q){
              return{
                  locationFromLatLong: function(lat, lng){
                    var defer = $q.defer();
                        var url="http://maps.googleapis.com/maps/api/geocode/json?latlng="+lat+","+lng+'&sensor=true';                        
                        var req = {
                            method: 'GET',
                            url: url,
                            headers: {
                                'Content-Type': 'application/json',
                            }
                        }

                        $http(req).then(function(success) {
                            defer.resolve(success)
                        }, function(err) {
                            defer.reject(err)
                        });
                        return defer.promise;
                  }
              } 
        }])

        .factory('EmailNotification', ['$http', '$q', function($http, $q) {
                var from = 'noreply@kilimanjaroTest.com';
                return{
                    sendEmail: function(params) {
                        var defer = $q.defer();
                        var data = {};
                        data.to = params.to;
                        data.subject = params.subject;
                        data.description = params.description;
                        data.from = from;
                        var req = {
                            method: 'POST',
                            url: 'http://138.197.74.46:3000/notifications/send_mail',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            data: data
                        }

                        $http(req).then(function(success) {
                            defer.resolve(success)
                        }, function(err) {
                            defer.reject(err)
                        });
                        return defer.promise;
                    }
                }
            }])
        
        .factory('Stripe', ['$http', '$q', function($http, $q) {               
                return{
                    chargeCard: function(data) {
                        var defer = $q.defer();    
                        //data must have token amout token description
                        var req = {
                            method: 'POST',
                            url: 'http://138.197.74.46:3000/stripe/chargeByToken',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            data: data
                        }

                        $http(req).then(function(success) {
                            defer.resolve(success)
                        }, function(err) {
                            defer.reject(err)
                        });
                        return defer.promise;
                    }
                }
            }])

        .service('BlankService', [function() {

            }]);

