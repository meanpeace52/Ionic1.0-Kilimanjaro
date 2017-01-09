angular.module('app.controllers', [])

        .controller('kilimanjaroCtrl', ['$rootScope', 'Auth', '$scope', '$state', '$rootScope',
            function($rootScope, Auth, $scope, $state, $rootScope) {
                Auth.$onAuthStateChanged(function(user) {
                    if (user) {
                        $rootScope.currentUser = user;
                    }
                });

                $scope.logOut = function() {
                    Auth.$signOut().then(function() {
                        delete $rootScope.currentUser;
                        $rootScope.cart = {shops: [], badge: 0};
                        $state.go('tabsController.landing');
                    }, function(error) {

                    });
                }

            }])

        .controller('CartCtrl', ['$scope', '$rootScope', function($scope, $rootScope) {
                $scope.handleQuantity = function(item, shop, increment) {
                    if (increment) {
                        item.quantity += 1;
                        $rootScope.cart.badge += 1;
                    } else {
                        item.quantity -= 1;
                        $rootScope.cart.badge -= 1;
                    }
                    if (item.quantity == 0) {
                        delete shop.cartItems[item.$id];
                    }
                }
                $scope.getCartTotal = function() {
                    var total = 0;
                    angular.forEach($rootScope.cart.shops, function(shop) {
                        if (shop.cartItems && Object.keys(shop.cartItems).length > 0) {
                            var keys = Object.keys(shop.cartItems);
                            angular.forEach(keys, function(key) {
                                var item = shop.cartItems[key];
                                total = total + (item.price * item.quantity);
                            });
                        }
                    });
                    return total;
                }
            }])

        .controller('kilimanjaro2Ctrl', ['$scope', '$stateParams',
            function($scope, $stateParams) {


            }])

        .controller('loginCtrl', ['$scope', 'Auth', '$ionicLoading', '$state',
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

        .controller('forgotPasswordCtrl', ['$scope', 'Auth', '$ionicLoading', '$state',
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
                            });
                            $state.go('tabsController.landing');
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
                    $state.go("tabsController." + category);
                }

            }])

        .controller('foodShopCtrl', ["$scope", '$firebaseArray', '$state', 'sharedUtils',
            function($scope, $firebaseArray, $state, sharedUtils) {
                $scope.data = {};
                var ref = firebase.database().ref('foodShops');
                $scope.data.items = [];
                $scope.data.items = $firebaseArray(ref);
                sharedUtils.showLoading();
                $scope.data.items.$loaded()
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
                $scope.data = {};
                var ref = firebase.database().ref('events');
                $scope.data.items = $firebaseArray(ref);
                sharedUtils.showLoading();
                $scope.data.items.$loaded()
                        .then(function() {
                            sharedUtils.hideLoading();
                        })
                        .catch(function(err) {
                            sharedUtils.hideLoading();
                        });


                $scope.openEvent = function(event) {
                    $state.go('tabsController.event', {id: event.$id});
                }
            }])

        .controller('GeneralCatCtrl', ["$scope", '$firebaseArray', '$state', 'sharedUtils', '$ionicFilterBar',
            function($scope, $firebaseArray, $state, sharedUtils, $ionicFilterBar) {
                $scope.data = {};
                var ref = firebase.database().ref('general');
                $scope.data.items = $firebaseArray(ref);
                sharedUtils.showLoading();
                $scope.data.items.$loaded()
                        .then(function() {
                            sharedUtils.hideLoading();
                        })
                        .catch(function(err) {
                            sharedUtils.hideLoading();
                        });


                $scope.openEvent = function(item) {
                    $state.go('tabsController.generalItem', {id: item.$id});
                }
            }])

        .controller('GeneralCatShowCtrl', ["$scope", '$firebaseObject', '$stateParams', 'sharedUtils',
            function($scope, $firebaseObject, $stateParams, sharedUtils) {
                sharedUtils.showLoading();
                var ref = firebase.database().ref('general').child($stateParams.id);
                var generalItem = $firebaseObject(ref)
                generalItem.$loaded()
                        .then(function() {
                            $scope.generalItem = generalItem;
                            sharedUtils.hideLoading();
                        })
                        .catch(function(err) {
                            sharedUtils.hideLoading();
                        });
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
                            sharedUtils.hideLoading();
                        });
            }])
        .controller('clothingShopsCtrl', ["$scope", '$firebaseArray', '$state', 'sharedUtils',
            function($scope, $firebaseArray, $state, sharedUtils) {
                $scope.data = {};
                var ref = firebase.database().ref('clothingShops');
                $scope.data.items = $firebaseArray(ref);
                sharedUtils.showLoading();
                $scope.data.items.$loaded()
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

        .controller('clothingShopShowCtrl', ["$scope", '$firebaseObject', '$stateParams', 'sharedUtils', '$ionicModal', '$filter', '$rootScope', '$ionicLoading',
            function($scope, $firebaseObject, $stateParams, sharedUtils, $ionicModal, $filter, $rootScope, $ionicLoading) {
                sharedUtils.showLoading();
                var ref = firebase.database().ref('clothingShops').child($stateParams.id);
                var shop = $firebaseObject(ref)
                shop.$loaded()
                        .then(function() {
                            $scope.shop = shop;
                            sharedUtils.hideLoading();
                        })
                        .catch(function(err) {
                            sharedUtils.hideLoading();
                        });

                $scope.showService = function(service, key) {
                    $scope.service = service;
                    $scope.service.$id = key;
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

                $scope.addItemToCart = function(item) {
                    var shopPresent = $filter('filter')($rootScope.cart.shops, {$id: $scope.shop.$id}).length
                    if (!shopPresent) {
                        $scope.fakeShop = {$id: $scope.shop.$id, name: $scope.shop.name, email: $scope.shop.email}
                        delete $scope.fakeShop.items;
                        $rootScope.cart.shops.push($scope.fakeShop);
                    }
                    var shopIndex = $rootScope.cart.shops.indexOf($scope.fakeShop);
                    var cartShop = $rootScope.cart.shops[shopIndex];
                    if (!cartShop.cartItems) {
                        cartShop.cartItems = {};
                    }
                    if (cartShop.cartItems[item.$id]) {
                        cartShop.cartItems[item.$id].quantity += 1
                    } else {
                        var itemToAdd = angular.copy(item)
                        itemToAdd.quantity = 1;
                        cartShop.cartItems[item.$id] = itemToAdd;
                    }
                    $ionicLoading.show({
                        template: 'Added to cart successfully!',
                        duration: 1000
                    });
                    $rootScope.cart.badge += 1;
                }
            }])



        .controller('foodShopShowCtrl', ["$scope", '$firebaseObject', '$rootScope', '$stateParams', 'sharedUtils', '$ionicModal', '$filter', '$ionicLoading',
            function($scope, $firebaseObject, $rootScope, $stateParams, sharedUtils, $ionicModal, $filter, $ionicLoading) {
                sharedUtils.showLoading();
                var ref = firebase.database().ref('foodShops').child($stateParams.id);
                var shop = $firebaseObject(ref)
                shop.$loaded()
                        .then(function() {
                            $scope.shop = shop;
                            sharedUtils.hideLoading();
                        })
                        .catch(function(err) {
                            sharedUtils.hideLoading();
                        });

                $scope.showService = function(service, key) {
                    $scope.service = service;
                    $scope.service.$id = key;
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

                $scope.addItemToCart = function(item) {
                    var shopPresent = $filter('filter')($rootScope.cart.shops, {$id: $scope.shop.$id}).length
                    if (!shopPresent) {
                        $scope.fakeShop = {$id: $scope.shop.$id, name: $scope.shop.name, email: $scope.shop.email}
                        delete $scope.fakeShop.items;
                        $rootScope.cart.shops.push($scope.fakeShop);
                    }
                    var shopIndex = $rootScope.cart.shops.indexOf($scope.fakeShop);
                    var cartShop = $rootScope.cart.shops[shopIndex];
                    if (!cartShop.cartItems) {
                        cartShop.cartItems = {};
                    }
                    if (cartShop.cartItems[item.$id]) {
                        cartShop.cartItems[item.$id].quantity += 1
                    } else {
                        var itemToAdd = angular.copy(item)
                        itemToAdd.quantity = 1;
                        cartShop.cartItems[item.$id] = itemToAdd;
                    }
                    $ionicLoading.show({
                        template: 'Added to cart successfully!',
                        duration: 1000
                    });
                    $rootScope.cart.badge += 1;
                }

            }])

        .controller('kilimanjaro4Ctrl', ['$scope', '$stateParams',
            function($scope, $stateParams) {


            }])

        .controller('pageCtrl', ['$scope', '$stateParams',
            function($scope, $stateParams) {


            }])
 