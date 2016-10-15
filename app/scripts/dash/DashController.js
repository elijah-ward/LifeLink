//(function(){

app.controller('DashController', function ($scope, $mdDialog, socket){
	var self = this;
	$scope.hello = 'hello';

	socket.on('setup', function(data){

		$scope.sessions = data.sessions;
		console.log($scope.sessions);

	});

	$scope.showConfirm = function(ev) {
    // Appending dialog to document.body to cover sidenav in docs app
    var confirm = $mdDialog.confirm()
          .title('Which user experience would you like to view?')
          .textContent('Choose one of the following.')
          .ariaLabel('Please choose one.')
          .targetEvent(ev)
          .ok('Social Care Representative')
          .cancel('Anonymous User Seeking Assistance');

    $mdDialog.show(confirm).then(function() {
      $scope.status = 'You decided to get rid of your debt.';
    }, function() {
      $scope.status = 'You decided to keep your debt.';
    });
  };

	socket.emit('test', "Aloha");

	console.log('Hello');
});





//})();