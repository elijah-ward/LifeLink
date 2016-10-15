(function(){

'use strict';

angular.module('app').controller('DashController', ['$scope', dashcontroller]);

function dashcontroller($scope){
	var self = this;
	$scope.hello = 'hello';
};


})();