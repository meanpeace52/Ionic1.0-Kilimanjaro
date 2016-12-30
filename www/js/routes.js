angular.module('app.routes', [])

        .config(function($stateProvider, $urlRouterProvider) {

            // Ionic uses AngularUI Router which uses the concept of states
            // Learn more here: https://github.com/angular-ui/ui-router
            // Set up the various states which the app can be in.
            // Each state's controller can be found in controllers.js
            $stateProvider



                    .state('tabsController', {
                        url: '/home',
                        templateUrl: 'templates/tabsController.html',
                        abstract: true
                    })

                    .state('tabsController.landing', {
                        url: '/landing',
                        views: {
                            'tab1': {
                                templateUrl: 'templates/landing.html',
                                controller: 'kilimanjaro2Ctrl'
                            }
                        }
                    })

                    .state('tabsController.messages', {
                        url: '/messages',
                        views: {
                            'tab2': {
                                templateUrl: 'templates/messages.html',
                                controller: 'kilimanjaro2Ctrl'
                            }
                        }
                    })

                    .state('tabsController.login', {
                        url: '/login',
                        views: {
                            'tab1': {
                                templateUrl: 'templates/login.html',
                                controller: 'loginCtrl'
                            }
                        }
                    })

                    .state('tabsController.signup', {
                        url: '/singup',
                        views: {
                            'tab1': {
                                templateUrl: 'templates/signup.html',
                                controller: 'signupCtrl'
                            }
                        }
                    })
                    
                    .state('tabsController.forgotPassword', {
                        url: '/forgotPassword',
                        views: {
                            'tab1': {
                                templateUrl: 'templates/forgotPassword.html',
                                controller: 'forgotPasswordCtrl'
                            }
                        }
                    })

                    .state('components', {
                        url: '/components',
                        templateUrl: 'templates/components.html',
                        controller: 'componentsCtrl'
                    })

                    .state('tabsController.categories', {
                        url: '/list',
                        views: {
                            'tab1': {
                                templateUrl: 'templates/categories.html',
                                controller: 'CategoriesCtrl'
                            }
                        }, resolve: {
                            "currentAuth": ["Auth", function(Auth) {
                                    return Auth.$requireSignIn();
                                }]
                        }

                    })
                    .state('tabsController.foodCategory', {
                        url: '/category/foodShops',
                        views: {
                            'tab1': {
                                templateUrl: 'templates/categories/foodShops/index.html',
                                controller: 'foodShopCtrl'
                            }
                        }, resolve: {
                            "currentAuth": ["Auth", function(Auth) {
                                    return Auth.$requireSignIn();
                                }]
                        }

                    })
                    .state('tabsController.clothingCategory', {
                        url: '/category/clothingShops',
                        views: {
                            'tab1': {
                                templateUrl: 'templates/categories/clothingShops/index.html',
                                controller: 'clothingShopsCtrl'
                            }
                        }, resolve: {
                            "currentAuth": ["Auth", function(Auth) {
                                    return Auth.$requireSignIn();
                                }]
                        }

                    })
                    .state('tabsController.foodShop', {
                        url: '/category/foodShops/:id',
                        views: {
                            'tab1': {
                                templateUrl: 'templates/categories/foodShops/show.html',
                                controller: 'foodShopShowCtrl'
                            }
                        }, resolve: {
                            "currentAuth": ["Auth", function(Auth) {
                                    return Auth.$requireSignIn();
                                }]
                        }

                    })
                    
                    .state('tabsController.clothingShop', {
                        url: '/category/clothingShop/:id',
                        views: {
                            'tab1': {
                                templateUrl: 'templates/categories/clothingShops/show.html',
                                controller: 'clothingShopShowCtrl'
                            }
                        }, resolve: {
                            "currentAuth": ["Auth", function(Auth) {
                                    return Auth.$requireSignIn();
                                }]
                        }

                    })
                    
                    .state('tabsController.eventCategory', {
                        url: '/category/events',
                        views: {
                            'tab1': {
                                templateUrl: 'templates/categories/events/index.html',
                                controller: 'EventsCtrl'
                            }
                        }, resolve: {
                            "currentAuth": ["Auth", function(Auth) {
                                    return Auth.$requireSignIn();
                                }]
                        }

                    })
                    
                    .state('tabsController.event', {
                        url: '/category/event/:id',
                        views: {
                            'tab1': {
                                templateUrl: 'templates/categories/events/show.html',
                                controller: 'EventShowCtrl'
                            }
                        }, resolve: {
                            "currentAuth": ["Auth", function(Auth) {
                                    return Auth.$requireSignIn();
                                }]
                        }

                    })
                    .state('tabsController.kilimanjaro4', {
                        url: '/food',
                        views: {
                            'tab1': {
                                templateUrl: 'templates/kilimanjaro4.html',
                                controller: 'kilimanjaro4Ctrl'
                            }
                        }
                    })


            $urlRouterProvider.otherwise('/home/landing')



        });