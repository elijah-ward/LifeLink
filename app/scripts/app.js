(function () {
    'use strict';
    
    var _templateBase = './templates';
    
    angular.module('app', [
        'ngRoute',
        'ngMaterial',
        'ngAnimate',
        'ngResource'
    ])
    .config(['$routeProvider','$mdThemingProvider', '$mdIconProvider', function ($routeProvider, $mdThemingProvider, $mdIconProvider) {


            $mdThemingProvider.theme('default')
            .primaryPalette('grey')
    .accentPalette('green')
    .warnPalette('grey');
            $mdThemingProvider.theme('dash-dark').primaryPalette('amber').dark();
            $mdThemingProvider.theme('card-grey').backgroundPalette('grey');
            $mdThemingProvider.theme('dark-orange').backgroundPalette('orange').dark();
            $mdThemingProvider.theme('dark-purple').backgroundPalette('deep-purple').dark();
            $mdThemingProvider.theme('dark-blue').backgroundPalette('blue').dark();
            $mdThemingProvider.theme('dark-blue-grey').backgroundPalette('blue-grey').dark();


            $routeProvider.when('/', {
                templateUrl: _templateBase + '/dash/dash.html' ,
                controller: 'DashController'
            });

            $routeProvider.otherwise({ redirectTo: '/' });
        }
        ]);
    

})();