angular.module('app.controllers', [])

        .controller('kilimanjaroCtrl', ['$rootScope', 'Auth', '$scope', '$state',
            function($rootScope, Auth, $scope, $state) {
                Auth.$onAuthStateChanged(function(user) {
                    if (user) {
                        $rootScope.currentUser = user;                        
                    }
                });

                $scope.logOut = function() {
                    Auth.$signOut().then(function() {
                        delete $rootScope.currentUser;
                        $state.go('tabsController.landing');
                    }, function(error) {

                    });
                }

            }])

        .controller('kilimanjaro2Ctrl', ['$scope', '$stateParams',
            function($scope, $stateParams) {


            }])

        .controller('loginCtrl', ['$scope', 'Auth', '$ionicLoading','$state',
            function($scope, Auth, $ionicLoading, $state) {
                $scope.login = function(email, password) {
                    if (email && password) {
                        Auth.$signInWithEmailAndPassword(email, password).then(function(user) {
                             $ionicLoading.show({
                                template: 'Logged in successfully!',
                                duration: 3000
                            })
                            $state.go('tabsController.landing')
                        }).catch(function(error) {
                            $ionicLoading.show({
                                template: error.message,
                                duration: 3000
                            })
                        });
                    } else {
                        $ionicLoading.show({
                            template: 'Please provide email and password',
                            duration: 1000
                        })
                    }
                }
            }])
        
        .controller('forgotPasswordCtrl', ['$scope', 'Auth', '$ionicLoading','$state',
            function($scope, Auth, $ionicLoading, $state) {                
                $scope.sendEmail = function(email) {
                    if (email) {
                        Auth.$sendPasswordResetEmail(email).then(function(response) {                            
                             $ionicLoading.show({
                                template: 'You will receive a link shortly to rest your password.',
                                duration: 3000
                            })
                            $state.go('tabsController.landing')
                        }).catch(function(error) {
                            $ionicLoading.show({
                                template: error.message,
                                duration: 3000
                            })
                        });
                    } else {
                        $ionicLoading.show({
                            template: 'Please provide email',
                            duration: 1000
                        })
                    }
                }
            }])

        .controller('signupCtrl', ['$scope', '$firebaseAuth', '$ionicLoading', '$rootScope', '$state',
            function($scope, $firebaseAuth, $ionicLoading, $rootScope, $state) {
                $scope.signUp = function(user) {
                    if (user && user.email && user.password) {
                        $firebaseAuth().$createUserWithEmailAndPassword(user.email, user.password).then(function(firebaseUser) {
                            $rootScope.currentUser = firebaseUser;
                            $ionicLoading.show({
                                template: 'Account created successfully!',
                                duration: 3000
                            })
                        }).catch(function(error) {
                            $ionicLoading.show({
                                template: error.message,
                                duration: 3000
                            })
                        });
                    } else {
                        $ionicLoading.show({
                            template: 'Please provide email and password',
                            duration: 1000
                        })
                    }
                }
            }])

        .controller('componentsCtrl', ['$scope', '$stateParams',
            function($scope, $stateParams) {


            }])

        .controller('CategoriesCtrl', ['$scope', '$state',
            function($scope, $state) {

                $scope.openSpecificCategory = function(category) {
                    if (category === 'Food Shops') {
                        $state.go("tabsController.foodCategory")
                    }else if (category === 'Clothing Shops') {
                        $state.go("tabsController.clothingCategory")
                    }else if (category === 'Events') {
                        $state.go("tabsController.eventCategory")
                    }
                }

            }])

        .controller('foodShopCtrl', ["$scope", '$firebaseArray', '$state', 'sharedUtils', '$rootScope',
            function($scope, $firebaseArray, $state, sharedUtils, $rootScope) {
                var ref = firebase.database().ref('foodShops');
                $scope.shops = $firebaseArray(ref);
                sharedUtils.showLoading();
                $scope.shops.$loaded()
                        .then(function() {
                            sharedUtils.hideLoading();
                        })
                        .catch(function(err) {
                            sharedUtils.hideLoading();
                        });


                $scope.openShop = function(shop) {
                    $state.go('tabsController.foodShop', {id: shop.$id});
                }
            }])
        
        .controller('EventsCtrl', ["$scope", '$firebaseArray', '$state', 'sharedUtils',
            function($scope, $firebaseArray, $state, sharedUtils) {
                var ref = firebase.database().ref('events');
                $scope.events = $firebaseArray(ref);
                sharedUtils.showLoading();
                $scope.events.$loaded()
                        .then(function() {
                            sharedUtils.hideLoading();
                        })
                        .catch(function(err) {
                            sharedUtils.hideLoading();
                        });


                $scope.openEvent = function(shop) {
                    $state.go('tabsController.event', {id: shop.$id});
                }
            }])
        
        .controller('EventShowCtrl', ["$scope", '$firebaseObject', '$stateParams', 'sharedUtils',
            function($scope, $firebaseObject, $stateParams, sharedUtils) {                
                sharedUtils.showLoading();
                var ref = firebase.database().ref('events').child($stateParams.id);                
                var event = $firebaseObject(ref)
                event.$loaded()
                        .then(function() {                            
                            $scope.event = event;
                            sharedUtils.hideLoading();
                        })
                        .catch(function(err) {
                            console.error(err);
                            sharedUtils.hideLoading();
                        });
            }])
        .controller('clothingShopsCtrl', ["$scope", '$firebaseArray', '$state', 'sharedUtils',
            function($scope, $firebaseArray, $state, sharedUtils) {
                var ref = firebase.database().ref('clothingShops');
                $scope.shops = $firebaseArray(ref);
                sharedUtils.showLoading();
                $scope.shops.$loaded()
                        .then(function() {
                            sharedUtils.hideLoading();
                        })
                        .catch(function(err) {
                            sharedUtils.hideLoading();
                        });


                $scope.openShop = function(shop) {
                    $state.go('tabsController.clothingShop', {id: shop.$id});
                }
            }])
        
        .controller('clothingShopShowCtrl', ["$scope", '$firebaseObject', '$stateParams', 'sharedUtils', '$ionicModal',
            function($scope, $firebaseObject, $stateParams, sharedUtils, $ionicModal) {
                var id = $stateParams.id;
                sharedUtils.showLoading();
                var ref = firebase.database().ref('clothingShops').child($stateParams.id);                
                var shop = $firebaseObject(ref)
                shop.$loaded()
                        .then(function() {                            
                            $scope.shop = shop;
                            sharedUtils.hideLoading();
                        })
                        .catch(function(err) {
                            console.error(err);
                            sharedUtils.hideLoading();
                        });

                $scope.showService = function(service) {
                    $scope.service = service;
                    $ionicModal.fromTemplateUrl('templates/categories/clothingShops/modal_service.html', {
                        scope: $scope,
                        animation: 'slide-in-up'
                    }).then(function(modal) {                        
                        modal.show();
                        $scope.modal = modal;
                    });                    
                    $scope.closeModal = function() {
                        $scope.modal.hide();
                    };                    
                    $scope.$on('$destroy', function() {
                        $scope.modal.remove();
                    });                    
                }
            }])
        
        

        .controller('foodShopShowCtrl', ["$scope", '$firebaseObject', '$state', '$stateParams', 'sharedUtils', '$ionicModal',
            function($scope, $firebaseObject, $state, $stateParams, sharedUtils, $ionicModal) {
                var id = $stateParams.id;
                sharedUtils.showLoading();
                var ref = firebase.database().ref('foodShops').child($stateParams.id);                
                var shop = $firebaseObject(ref)
                shop.$loaded()
                        .then(function() {                            
                            $scope.shop = shop;
                            sharedUtils.hideLoading();
                        })
                        .catch(function(err) {
                            console.error(err);
                            sharedUtils.hideLoading();
                        });

                $scope.showService = function(service) {
                    $scope.service = service;
                    $ionicModal.fromTemplateUrl('templates/categories/foodShops/modal_service.html', {
                        scope: $scope,
                        animation: 'slide-in-up'
                    }).then(function(modal) {                        
                        modal.show();
                        $scope.modal = modal;
                    });                    
                    $scope.closeModal = function() {
                        $scope.modal.hide();
                    };                    
                    $scope.$on('$destroy', function() {
                        $scope.modal.remove();
                    });                    
                }
            }])

        .controller('kilimanjaro4Ctrl', ['$scope', '$stateParams',
            function($scope, $stateParams) {


            }])

        .controller('pageCtrl', ['$scope', '$stateParams',
            function($scope, $stateParams) {


            }])
 