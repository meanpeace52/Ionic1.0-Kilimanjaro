// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('app', ['ionic', 'app.controllers', 'app.routes', 'app.directives', 'app.services', 'firebase', 'jett.ionic.filter.bar', 'angularPayments', 'creditCardInput'])

        .constant('FirebaseUrl', 'https://kilimanjaro-551ef.firebaseio.com/')
        .config(function($ionicConfigProvider, $sceDelegateProvider) {

            $ionicConfigProvider.backButton.text('').previousTitleText(false);


            $sceDelegateProvider.resourceUrlWhitelist(['self', '*://www.youtube.com/**', '*://player.vimeo.com/video/**']);

        })

        .config(function($ionicConfigProvider) {
            $ionicConfigProvider.scrolling.jsScrolling(false);
        })

        .run(function($ionicPlatform, $rootScope) {
            $rootScope.cart = {shops: [], badge: 0};
            $ionicPlatform.ready(function() {
                // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                // for form inputs)
                if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                    cordova.plugins.Keyboard.disableScroll(true);

                }
                if (navigator.splashscreen) {
                    navigator.splashscreen.hide();
                }

                if (window.StatusBar) {
                    // org.apache.cordova.statusbar required
                    StatusBar.styleDefault();
                }
            });
        })

        .config(function($windowProvider) {
            var $window = $windowProvider.$get();
            $window.Stripe.setPublishableKey('pk_test_Efg21u9cIT1MVl2F6aKwLZu4');
        })


        .run(["$rootScope", "$state", function($rootScope, $state) {
                $rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error) {
                    if (error === "AUTH_REQUIRED") {
                        $state.go("tabsController.landing");
                    }
                });
            }])

        .directive('disableSideMenuDrag', ['$ionicSideMenuDelegate', '$rootScope', function($ionicSideMenuDelegate, $rootScope) {
                return {
                    restrict: "A",
                    controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {

                            function stopDrag() {
                                $ionicSideMenuDelegate.canDragContent(false);
                            }

                            function allowDrag() {
                                $ionicSideMenuDelegate.canDragContent(true);
                            }

                            $rootScope.$on('$ionicSlides.slideChangeEnd', allowDrag);
                            $element.on('touchstart', stopDrag);
                            $element.on('touchend', allowDrag);
                            $element.on('mousedown', stopDrag);
                            $element.on('mouseup', allowDrag);

                        }]
                };
            }])
