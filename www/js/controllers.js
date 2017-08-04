angular.module('app.controllers', [])

        .controller('kilimanjaroCtrl', ['$rootScope', 'Auth', '$scope', '$state', '$rootScope', '$ionicHistory', '$ionicTabsDelegate', '$timeout', '$ionicModal', '$http',
            function($rootScope, Auth, $scope, $state, $rootScope, $ionicHistory, $ionicTabsDelegate, $timeout, $ionicModal, $http) {
                Auth.$onAuthStateChanged(function(user) {
                    if (user) {
                        $rootScope.currentUser = user;
                    }
                });
                var firebaseRef = firebase.database().ref('geoLocations');
                var geoFire = new GeoFire(firebaseRef);
                $rootScope.geoQuery = geoFire.query({
                    center: [0, 0],
                    radius: 80.4672
                });
                var boundKeys = [];
                $rootScope.locationBoundKeys = [];
                $rootScope.geoQuery.on("key_entered", function(key) {
                    boundKeys.push(key);
                });

                $rootScope.geoQuery.on("key_exited", function(key) {
                    boundKeys.splice(boundKeys.indexOf(key), 1);
                });
                $rootScope.geoQuery.on("ready", function() {
                    $timeout(function() {
                        $rootScope.locationBoundKeys = boundKeys;
                    });
                });

                $rootScope.$watch('currentUserLocation', function(val) {
                    if (val) {
                        $rootScope.geoQuery.updateCriteria({center: [val.lat, val.lng]});
                    }
                });


                $scope.logOut = function() {
                    Auth.$signOut().then(function() {
                        //delete $rootScope.currentUser;
                        $rootScope.cart = {shops: [], badge: 0};
                        $state.transitionTo('tabsController.landing');
                        $ionicHistory.clearCache().then(function() {
                            $ionicHistory.clearHistory();
                            $ionicTabsDelegate.select(0);
                            $timeout(function() {
                                delete $rootScope.currentUser;
                            });
                        });
                    }, function(error) {

                    });
                };

                $rootScope.setNewLocation = function(newLocation) {
                    var lat = newLocation.geometry.location.lat;
                    var lng = newLocation.geometry.location.lng;
                    $rootScope.currentUserLocation = {lat: lat, lng: lng, location: newLocation.formatted_address};
                    $rootScope.hideCustomLocationForm();
                    $rootScope.$broadcast('userLocationChanged');
                };

                $rootScope.getAutoCompleteLocations = function(val) {
                    if (!val) {
                        return[];
                    }
                    return $http.get('http://maps.googleapis.com/maps/api/geocode/json', {
                        params: {
                            address: val,
                            sensor: false
                        }
                    }).then(function(response) {
                        return response.data.results.map(function(item) {
                            return item;
                        });
                    });
                };

                $rootScope.showCustomLocationForm = function() {
                    $ionicModal.fromTemplateUrl('templates/geolocation/modal_form.html', {
                        scope: $rootScope,
                        animation: 'slide-in-up'
                    }).then(function(modal) {
                        modal.show();
                        $scope.modal = modal;
                    });
                    $rootScope.hideCustomLocationForm = function() {
                        $scope.modal.hide();
                    };
                };

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
                };
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
                };
            }])


        .controller('OrdersCtrl', ['$scope', '$rootScope', 'sharedUtils', '$firebaseArray', '$ionicModal', function($scope, $rootScope, sharedUtils, $firebaseArray, $ionicModal) {
                sharedUtils.showLoading();
                var refName = $rootScope.currentUser.uid + '-orders';
                var ref = firebase.database().ref(refName);
                $scope.orders = $firebaseArray(ref);
                $scope.loading = true;
                $scope.orders.$loaded()
                        .then(function() {
                            $scope.loading = false;
                            sharedUtils.hideLoading();
                        })
                        .catch(function(err) {
                            $scope.loading = false;
                            sharedUtils.hideLoading();
                        });

                $scope.showOrder = function(order) {
                    $scope.order = order;
                    $ionicModal.fromTemplateUrl('templates/billing/modal_order.html', {
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
                };

                $scope.getCartTotal = function(order) {
                    var total = 0;
                    angular.forEach(order.shops, function(shop) {
                        if (shop.cartItems && Object.keys(shop.cartItems).length > 0) {
                            var keys = Object.keys(shop.cartItems);
                            angular.forEach(keys, function(key) {
                                var item = shop.cartItems[key];
                                total = total + (item.price * item.quantity);
                            });
                        }
                    });
                    return total;
                };

            }])


        .controller('PaymentCtrl', ['$scope', '$rootScope', 'sharedUtils', '$ionicLoading', '$firebaseArray', '$state', '$ionicHistory', '$timeout', 'EmailNotification', 'Stripe',
            function($scope, $rootScope, sharedUtils, $ionicLoading, $firebaseArray, $state, $ionicHistory, $timeout, EmailNotification, Stripe) {
                $scope.stripeCallback = function(code, result) {
                    if (result.error) {
                        $ionicLoading.show({
                            template: result.error.message,
                            duration: 2000
                        });
                    } else {
                        saveOrder(result);
                    }
                };

                function saveOrder(stripeData) {
                    var refName = $rootScope.currentUser.uid + '-orders';
                    var ref = firebase.database().ref(refName);
                    var orders = $firebaseArray(ref);
                    sharedUtils.showLoading();
                    //notifyVendors($rootScope.cart);
                    $rootScope.cart.createdAt = Date.now();
                    $rootScope.cart.status = 'Placed';
                    $rootScope.cart.note = 'We have received your order, we are processing it now.';
                    $rootScope.cart.timestamp = Math.floor(Date.now() / 1000);
                    orders.$add($rootScope.cart).then(function(ref) {
                        chargeCard(stripeData, ref);
                        notifyVendors($rootScope.cart);
                    }, function(error) {
                        $ionicLoading.show({
                            template: error,
                            duration: 2000
                        });
                    });
                }

                function chargeCard(stripeData, firebaseData) {
                    //cardToken stripeData.id
                    //orderId firebaseData.key

                    var params = {};

                    params.token = stripeData.id;
                    params.orderId = firebaseData.key;
                    var userName = $rootScope.currentUser.email;
                    if ($rootScope.currentUser.displayName) {
                        userName = $rootScope.currentUser.displayName;
                    }
                    params.description = "Charging " + userName + " for Order ID: " + firebaseData.key;
                    params.shopData = [];
                    params.total = 0;

                    angular.forEach($rootScope.cart.shops, function(shop) {
                        var data = {};
                        var subTotal = 0;

                        if (shop.cartItems && Object.keys(shop.cartItems).length > 0) {
                            var keys = Object.keys(shop.cartItems);
                            angular.forEach(keys, function(key) {
                                var item = shop.cartItems[key];
                                subTotal = subTotal + (item.price * item.quantity);
                            });
                        }

                        data.amount = subTotal * 100;
                        data.stripeAccountId = shop.stripeAccountId;
                        params.total += data.amount;
                        params.shopData.push(data);
                    });

                    Stripe.chargeCard(params).then(function(response) {
                        finalizeOrder();
                    }, function() {
                        $ionicLoading.show({
                            template: 'Something went wrong while processing the payment, please try again later.',
                            duration: 4000
                        });
                    });
                }

                function finalizeOrder() {
                    $ionicHistory.clearHistory();
                    sharedUtils.hideLoading();

                    $ionicLoading.show({
                        template: 'Your order has been placed, thank you for shopping with us.',
                        duration: 4000
                    });
                    $state.transitionTo('tabsController.landing');
                    $timeout(function() {
                        $ionicHistory.clearHistory();
                    }, 1000);
                    $rootScope.cart = {shops: [], badge: 0};
                }

                function notifyVendors(rootScopeCart) {
                    var cart = rootScopeCart;
                    var shops = cart.shops;
                    if (shops.length) {
                        angular.forEach(shops, function(shop) {
                            var params = {};
                            params.to = shop.email;
                            var userName = $rootScope.currentUser.email;
                            if ($rootScope.currentUser.displayName) {
                                userName = $rootScope.currentUser.displayName;
                            }
                            params.subject = "Kilimanjaro: new order placed by " + userName;
                            var description = userName + " placed an order with ID(<b>" + cart.timestamp + "</b>) at your shop <b>" + shop.name + "</b>";
                            description += "<h2>Order Details</h2><hr/>";
                            description += "<ul>";
                            var total = 0;
                            angular.forEach(shop.cartItems, function(item) {
                                description += "<li><b>" + item.name + "</b> (" + item.quantity + ")</li>";
                                total += item.quantity * item.price;
                            });
                            var address = cart.address;
                            description += "</ul>";
                            description += "<h2>Address</h2><hr/>";
                            description += "<ul>";
                            var map = addressKeyMap();
                            angular.forEach(Object.keys(map), function(key) {
                                description += "<li><b>" + map[key] + ":</b> " + address[key] + "</li>";
                            });
                            description += "</ul>";
                            description += "<h2>Order Total = $" + total + "</h2>";
                            params.description = description;
                            EmailNotification.sendEmail(params).then(function(response) {

                            }, function(error) {

                            });
                        });
                    }
                }
                function addressKeyMap() {
                    return{
                        address: "Address",
                        apartmentNumber: "Apartment",
                        city: "City",
                        contactNumber: "Contact",
                        country: "Country",
                        name: "Name",
                        state: "State",
                        zip: "Zip"
                    };
                }
            }])

        .controller('AddressCtrl', ['$scope', '$rootScope', '$ionicLoading', '$firebaseObject', 'sharedUtils', '$state', function($scope, $rootScope, $ionicLoading, $firebaseObject, sharedUtils, $state) {
                sharedUtils.showLoading();
                var watch = $rootScope.$watch('currentUser', function(val) {
                    if (val) {
                        getAddress();
                        watch();
                    }
                });
                //$scope.address.country = 'US'
                $scope.saveAddress = function(valid) {
                    if (!valid) {
                        $ionicLoading.show({
                            template: 'Please fill all the details!',
                            duration: 1000
                        });
                    } else {
                        sharedUtils.showLoading();
                        $scope.address.$save().then(function(ref) {
                            sharedUtils.hideLoading();
                            $rootScope.cart.address = $scope.address;
                            $state.transitionTo('tabsController.payment');
                        }, function(error) {
                            sharedUtils.hideLoading();
                            $ionicLoading.show({
                                template: error,
                                duration: 1000
                            });
                        });
                    }
                };

                function getAddress() {
                    var refName = $rootScope.currentUser.uid + '-billingAddress';
                    var ref = firebase.database().ref('billingAddresses').child(refName);
                    $scope.address = $firebaseObject(ref);
                    $scope.address.$loaded()
                            .then(function() {
                                sharedUtils.hideLoading();
                            })
                            .catch(function(err) {
                                sharedUtils.hideLoading();
                            });
                }
            }
        ])

        .controller('kilimanjaro2Ctrl', ['$scope', '$stateParams', '$ionicModal',
            function($scope, $stateParams, $ionicModal) {
                if (!localStorage.userSeenPromo) {
                    showPromo();
                }
                var clickCount = 0;
                $scope.promoEasterEgg = function() {
                    clickCount += 1;
                    if (clickCount >= 3) {
                        delete localStorage.userSeenPromo;
                        clickCount = 0;
                    }
                };
                function showPromo() {
                    $ionicModal.fromTemplateUrl('templates/promo.html', {
                        scope: $scope,
                        animation: 'slide-in-up'
                    }).then(function(modal) {
                        modal.show();
                        $scope.modal = modal;
                        $scope.closeModal = function() {
                            $scope.modal.hide();
                            localStorage.userSeenPromo = true;
                        };
                        $scope.$on('$destroy', function() {
                            $scope.modal.remove();
                        });
                    });
                }

            }])

        .controller('loginCtrl', ['$scope', 'Auth', '$ionicLoading', '$state',
            function($scope, Auth, $ionicLoading, $state) {
                $scope.login = function(email, password) {
                    if (email && password) {
                        Auth.$signInWithEmailAndPassword(email, password).then(function(user) {
                            $ionicLoading.show({
                                template: 'Logged in successfully!',
                                duration: 3000
                            });
                            $state.go('tabsController.landing');
                        }).catch(function(error) {
                            $ionicLoading.show({
                                template: error.message,
                                duration: 3000
                            });
                        });
                    } else {
                        $ionicLoading.show({
                            template: 'Please provide email and password',
                            duration: 1000
                        });
                    }
                };
            }])

        .controller('forgotPasswordCtrl', ['$scope', 'Auth', '$ionicLoading', '$state',
            function($scope, Auth, $ionicLoading, $state) {
                $scope.sendEmail = function(email) {
                    if (email) {
                        Auth.$sendPasswordResetEmail(email).then(function(response) {
                            $ionicLoading.show({
                                template: 'You will receive a link shortly to reset your password.',
                                duration: 4000
                            });
                            $state.go('tabsController.landing');
                        }).catch(function(error) {
                            $ionicLoading.show({
                                template: error.message,
                                duration: 3000
                            });
                        });
                    } else {
                        $ionicLoading.show({
                            template: 'Please provide email',
                            duration: 1000
                        });
                    }
                };
            }])

        .controller('signupCtrl', ['$scope', '$firebaseAuth', '$ionicLoading', '$rootScope', '$state',
            function($scope, $firebaseAuth, $ionicLoading, $rootScope, $state) {
                $scope.signUp = function(user) {
                    if (user && user.email && user.password && user.name) {
                        $firebaseAuth().$createUserWithEmailAndPassword(user.email, user.password).then(function(firebaseUser) {
                            $rootScope.currentUser = firebaseUser;
                            firebaseUser.updateProfile({
                                displayName: user.name
                            });
                            $ionicLoading.show({
                                template: 'Account created successfully!',
                                duration: 3000
                            });
                            $state.go('tabsController.landing');
                        }).catch(function(error) {
                            $ionicLoading.show({
                                template: error.message,
                                duration: 3000
                            });
                        });
                    } else {
                        $ionicLoading.show({
                            template: 'Please provide email, password and name',
                            duration: 1000
                        });
                    }
                };
            }])

        .controller('componentsCtrl', ['$scope', '$stateParams',
            function($scope, $stateParams) {


            }])

        .controller('CategoriesCtrl', ['$scope', '$state', '$cordovaGeolocation', 'sharedUtils', '$ionicLoading', 'GoogleService', '$rootScope',
            function($scope, $state, $cordovaGeolocation, sharedUtils, $ionicLoading, GoogleService, $rootScope) {
                //sharedUtils.showLoading();
                var posOptions = {enableHighAccuracy: true};
                if (ionic.Platform.isAndroid()) {
                    posOptions.timeout = 10000;
                }
                function getUserLocation() {
                    sharedUtils.showLoading();
                    $cordovaGeolocation
                            .getCurrentPosition(posOptions)
                            .then(function(position) {
                                $scope.userGeolocationResolved = true;
                                sharedUtils.hideLoading();
                                var lat = position.coords.latitude;
                                var lng = position.coords.longitude;
                                $rootScope.currentUserLocation = {lat: lat, lng: lng};
                                getUserLocationString(lat, lng);
                            }, function(err) {
                                $scope.userGeolocationResolved = true;
                                sharedUtils.hideLoading();
                                $ionicLoading.show({
                                    template: 'Not able to get your location at this moment.',
                                    duration: 2000
                                });
                                $rootScope.showCustomLocationForm();
                            });
                }
                function getUserLocationString(lat, lng) {
                    GoogleService.locationFromLatLong(lat, lng).then(function(response) {
                        if (response.status === 200 && response.data.results.length) {
                            $rootScope.currentUserLocation.location = response.data.results[0].formatted_address;
                        }
                    }, function(error) {
                        $rootScope.currentUserLocation.location = 'current location';
                    });
                }
                if (!$rootScope.currentUserLocation) {
                    getUserLocation();
                }


                $scope.openSpecificCategory = function(category) {
                    $state.go("tabsController." + category);
                };

            }])

        .controller('IndexCtrl', ["$scope", '$firebaseObject', '$state', 'sharedUtils', '$rootScope', 'categoryDependentVariables', '$timeout', '$ionicScrollDelegate',
            function($scope, $firebaseObject, $state, sharedUtils, $rootScope, categoryDependentVariables, $timeout, $ionicScrollDelegate) {
                $scope.data = {};
                $scope.data.items = [];
                $scope.data.loading = true;
                console.log($ionicScrollDelegate)
                function resizeScrollDelegate() {
                    $timeout(function() {
                        $ionicScrollDelegate.resize()
                    }, 500)
                }
                function getData(catKeys) {
                    var busy = false;
                    var paginateFn = setInterval(function() {
                        if (busy) {
                            return;
                        }
                        if(!catKeys.length){
                            clearInterval(paginateFn);
                            resizeScrollDelegate();
                            return;
                        }
                        var matchId = catKeys.splice(0, 1)[0];
                        var ref = firebase.database().ref(categoryDependentVariables.ref).child(matchId);
                        var item = $firebaseObject(ref);
                        item.$loaded()
                                .then(function() {
                                    $scope.data.items.push(item);
                                    $scope.data.loading = false;
                                    sharedUtils.hideLoading();
                                    busy=false;
                                })
                                .catch(function(err) {
                                    $scope.data.loading = false;
                                    sharedUtils.hideLoading();
                                    busy=false;
                                });
                    }, 200);
                }
                var locWatcher;
                $scope.$on('$ionicView.enter', function() {
                    $scope.data.loading = true;
                    locWatcher = $rootScope.$watch('locationBoundKeys.length', function(val) {
                        $timeout(function() {
                            $scope.data.loading = true;
                        });
                        $timeout(function() {
                            $scope.data.items = [];
                            if (val) {
                                sharedUtils.showLoading();
                                var catKeys = [];
                                angular.forEach($rootScope.locationBoundKeys, function(key) {
                                    if (key.indexOf(categoryDependentVariables.geoLocationSeperater) > -1) {
                                        catKeys.push(key.split(categoryDependentVariables.geoLocationSeperater)[1]);
                                    }
                                });
                                if (catKeys.length) {
                                    //angular.forEach(catKeys, function(key) {
                                    getData(catKeys);
                                    //});
                                } else {
                                    sharedUtils.hideLoading();
                                    $scope.data.loading = false;
                                }
                            } else {
                                sharedUtils.hideLoading();
                                $scope.data.loading = false;
                            }
                        }, 200);
                    }, true);
                });
                $scope.$on('$ionicView.leave', function() {
                    locWatcher();
                });


                $scope.childClick = function(item) {
                    $state.go(categoryDependentVariables.childState, {id: item.$id});
                };
            }])


        .controller('GeneralCatShowCtrl', ["$scope", '$firebaseObject', '$stateParams', 'sharedUtils', 'EmailNotification', '$ionicLoading', '$rootScope',
            function($scope, $firebaseObject, $stateParams, sharedUtils, EmailNotification, $ionicLoading, $rootScope) {
                sharedUtils.showLoading();
                var ref = firebase.database().ref('general').child($stateParams.id);
                var generalItem = $firebaseObject(ref);
                generalItem.$loaded()
                        .then(function() {
                            $scope.generalItem = generalItem;
                            sharedUtils.hideLoading();
                        })
                        .catch(function(err) {
                            sharedUtils.hideLoading();
                        });

                $scope.contact = function() {
                    sharedUtils.showLoading();
                    var params = {};
                    var userName = $rootScope.currentUser.email;
                    if ($rootScope.currentUser.displayName) {
                        userName = $rootScope.currentUser.displayName;
                    }
                    params.to = $scope.generalItem.email;
                    params.subject = "Kilimanjaro: User interested in your service";
                    params.description = "<b>" + userName + "</b> is interested in your service <b>" + $scope.generalItem.title + "</b>";
                    params.description += "<br/>Contact: " + $rootScope.currentUser.email;
                    EmailNotification.sendEmail(params).then(function(response) {
                        sharedUtils.hideLoading();
                        $ionicLoading.show({
                            template: 'Notified the service owner successfully!',
                            duration: 2000
                        });
                    }, function(error) {
                        sharedUtils.hideLoading();
                        $ionicLoading.show({
                            template: 'Not able to contact the owner, please try again after some time!',
                            duration: 3000
                        });
                    });
                };
            }])

        .controller('EventShowCtrl', ["$scope", '$firebaseObject', '$stateParams', 'sharedUtils', 'EmailNotification', '$rootScope', '$ionicLoading',
            function($scope, $firebaseObject, $stateParams, sharedUtils, EmailNotification, $rootScope, $ionicLoading) {
                sharedUtils.showLoading();
                var ref = firebase.database().ref('events').child($stateParams.id);
                var event = $firebaseObject(ref);
                event.$loaded()
                        .then(function() {
                            $scope.event = event;
                            sharedUtils.hideLoading();
                        })
                        .catch(function(err) {
                            sharedUtils.hideLoading();
                        });
                $scope.going = function() {
                    var params = {};
                    var userName = $rootScope.currentUser.email;
                    if ($rootScope.currentUser.displayName) {
                        userName = $rootScope.currentUser.displayName;
                    }
                    params.to = $scope.event.email;
                    params.subject = "Kilimanjaro: User interested in event";
                    params.description = "<b>" + userName + "</b> is interested in your event <b>" + $scope.event.title + "</b>";
                    params.description += "<br/>Contact: " + $rootScope.currentUser.email;
                    EmailNotification.sendEmail(params).then(function(response) {
                        $ionicLoading.show({
                            template: 'Notified the event admin successfully!',
                            duration: 2000
                        });
                    }, function(error) {

                    });
                };
            }])

        .controller('clothingShopShowCtrl', ["$scope", '$firebaseObject', '$stateParams', 'sharedUtils', '$ionicModal', '$filter', '$rootScope', '$ionicLoading',
            function($scope, $firebaseObject, $stateParams, sharedUtils, $ionicModal, $filter, $rootScope, $ionicLoading) {
                sharedUtils.showLoading();
                var ref = firebase.database().ref('clothingShops').child($stateParams.id);
                var shop = $firebaseObject(ref);
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
                };

                $scope.addItemToCart = function(item) {
                    var shopPresent = $filter('filter')($rootScope.cart.shops, {$id: $scope.shop.$id}).length;
                    if (!shopPresent) {
                        $scope.fakeShop = {$id: $scope.shop.$id, name: $scope.shop.name, email: $scope.shop.email, stripeAccountId: $scope.shop.stripeAccountId};
                        delete $scope.fakeShop.items;
                        $rootScope.cart.shops.push($scope.fakeShop);
                    }
                    var shopIndex = $rootScope.cart.shops.indexOf($scope.fakeShop);
                    var cartShop = $rootScope.cart.shops[shopIndex];
                    if (!cartShop.cartItems) {
                        cartShop.cartItems = {};
                    }
                    if (cartShop.cartItems[item.$id]) {
                        cartShop.cartItems[item.$id].quantity += 1;
                    } else {
                        var itemToAdd = angular.copy(item);
                        itemToAdd.quantity = 1;
                        cartShop.cartItems[item.$id] = itemToAdd;
                    }
                    $ionicLoading.show({
                        template: 'Added to cart successfully!',
                        duration: 1000
                    });
                    $rootScope.cart.badge += 1;
                };
            }])



        .controller('foodShopShowCtrl', ["$scope", '$firebaseObject', '$rootScope', '$stateParams', 'sharedUtils', '$ionicModal', '$filter', '$ionicLoading',
            function($scope, $firebaseObject, $rootScope, $stateParams, sharedUtils, $ionicModal, $filter, $ionicLoading) {
                sharedUtils.showLoading();
                var ref = firebase.database().ref('foodShops').child($stateParams.id);
                var shop = $firebaseObject(ref);
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
                };

                $scope.addItemToCart = function(item) {
                    var shopPresent = $filter('filter')($rootScope.cart.shops, {$id: $scope.shop.$id}).length;
                    if (!shopPresent) {
                        $scope.fakeShop = {$id: $scope.shop.$id, name: $scope.shop.name, email: $scope.shop.email, stripeAccountId: $scope.shop.stripeAccountId};
                        delete $scope.fakeShop.items;
                        $rootScope.cart.shops.push($scope.fakeShop);
                    }
                    var shopIndex = $rootScope.cart.shops.indexOf($scope.fakeShop);
                    var cartShop = $rootScope.cart.shops[shopIndex];
                    if (!cartShop.cartItems) {
                        cartShop.cartItems = {};
                    }
                    if (cartShop.cartItems[item.$id]) {
                        cartShop.cartItems[item.$id].quantity += 1;
                    } else {
                        var itemToAdd = angular.copy(item);
                        itemToAdd.quantity = 1;
                        cartShop.cartItems[item.$id] = itemToAdd;
                    }
                    $ionicLoading.show({
                        template: 'Added to cart successfully!',
                        duration: 1000
                    });
                    $rootScope.cart.badge += 1;
                };

            }])


        .controller('pageCtrl', ['$scope', '$stateParams',
            function($scope, $stateParams) {


            }]);

