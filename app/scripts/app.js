//(function () {
    // 'use strict';
    
    var _templateBase = './templates';

    var app = angular.module('app', [
        'ngRoute',
        'ngMaterial',
        'ngAnimate',
        'ngResource'    ]);

   app.factory('socket', function ($rootScope) {
        console.log("TRYING TO CONNECT");
        var socket = io.connect('http://127.0.0.1:3000');
        return {
            on: function (eventName, callback) {
                socket.on(eventName, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        callback.apply(socket, args);
                    });
                });
            },
            emit: function (eventName, data, callback) {
                socket.emit(eventName, data, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        if (callback) {
                            callback.apply(socket, args);
                        }
                    });
                })
            }
        };

    });

//  // app.factory('mySocket', function (socketFactory) {
//  //  var myIoSocket = io.connect('http://127.0.0.1:3000');

//  //  mySocket = socketFactory({
//  //    ioSocket: myIoSocket
//  //  });

//   return mySocket;
// });

    app.config(['$routeProvider','$mdThemingProvider', '$mdIconProvider', function ($routeProvider, $mdThemingProvider, $mdIconProvider) {


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

    
    

// }();