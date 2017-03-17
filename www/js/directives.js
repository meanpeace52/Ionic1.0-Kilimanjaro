angular.module('app.directives', [])


        .directive('customBackButton', ['$ionicHistory', function($ionicHistory) {
                return{
                    link: function(scope, elem) {
                        elem.bind('click', function() {
                            $ionicHistory.goBack();
                        })
                    }
                }
            }])
        .directive('hideTabs', function($rootScope, $ionicTabsDelegate) {
            return {
                restrict: 'A',
                link: function($scope, $el) {
                    $scope.$on("$ionicView.beforeEnter", function() {
                        $ionicTabsDelegate.showBar(false);
                    });
                    $scope.$on("$ionicView.beforeLeave", function() {
                        $ionicTabsDelegate.showBar(true);
                    });
                }
            };
        })
        
        .directive('pdfHref', function(){
            return{
                restrict: 'A',
                link: function(scope, elem, attr){                    
                    elem.bind('click', function(){
                        var target = attr.pdfHref;
                        if(ionic.Platform.isAndroid()){
                            target = 'https://docs.google.com/gview?embedded=true&url='+attr.pdfHref
                        }
                        if(window.cordova && window.cordova.InAppBrowser){
                            window.cordova.InAppBrowser.open(target, '_blank', 'location=yes,enableviewportscale=yes')
                        }else{
                            window.open(target, '_blank', 'location=yes')
                        }
                    })
                }
            }
        })

        .directive('applySearchFilter', ['$ionicFilterBar', '$timeout', function($ionicFilterBar, $timeout) {
                return{
                    restrict: 'A',
                    scope: {data: '='},
                    link: function(scope, elem, attr) {
                        elem.bind('click', function() {
                            $ionicFilterBar.show({
                                filterProperties: [attr.filter],
                                items: scope.data.items,
                                update: function(filteredItems) {
                                    scope.data.items = filteredItems;
                                }
                            });
                        });
                    }
                }
            }])

        .directive('nativeShare', ['sharedUtils', function(sharedUtils) {
                return {
                    restrict: 'A',
                    link: function(scope, elem, attr) {
                        var b64Data = false;
                        scope.$on('$destroy', function() {
                            b64Data = null;
                        })
                        function nativeShare(options) {                            
                            if (window.cordova && window.plugins && window.plugins.socialsharing) {
                                window.plugins.socialsharing.shareWithOptions(options);
                            }
                        }
                        elem.bind('click', function() {
                            var options = {};
                            if (attr.subject) {
                                options.subject = attr.subject;
                            }
                            if (attr.message) {
                                options.message = attr.message;
                            }
                            if (attr.files) {
                                options.files = [attr.files];
                            }
                            if (b64Data) {
                                options.files = [b64Data]
                            }
                            if (attr.files && !b64Data) {
                                sharedUtils.showLoading();
                                var img = new Image;
                                img.setAttribute('crossOrigin', 'anonymous');
                                img.src = attr.files;
                                img.onload = function() {
                                    sharedUtils.hideLoading();
                                    var c = document.createElement('canvas');
                                    c.width = img.width;
                                    c.height = img.height;
                                    var x = c.getContext('2d');
                                    x.drawImage(img, 0, 0);
                                    var imgBase64 = c.toDataURL();
                                    options.files = [imgBase64];
                                    b64Data = imgBase64;
                                    nativeShare(options);
                                }
                            } else {
                                nativeShare(options);
                            }
                        })
                    }
                };
            }]);