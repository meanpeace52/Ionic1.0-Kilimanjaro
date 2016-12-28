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

        .service('BlankService', [function() {

            }]);

