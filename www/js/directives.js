angular.module('app.directives', [])


        .directive('customBackButton', ['$ionicHistory', function($ionicHistory) {
                return{
                    link: function(scope, elem){
                        elem.bind('click', function(){
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
        });