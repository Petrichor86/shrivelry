var app = angular.module('Shrivelry');

app.controller("plantController", function($scope, $location, shrivelryService){

	var getUser = function(){
		if(shrivelryService.getUser()){
			$scope.currentUser = shrivelryService.getUser();
		}
	}
	getUser();
	
	$scope.addNewUser = function(){
		shrivelryService.addNewUser($scope.newUser);
		$location.path('/userHome/:user');
	};
	$scope.goSignUp = function(){
		$location.path("/signup");
		$scope.toSignUp = true;
	};
	$scope.goLogin = function(){
		$location.path( "/login" );
		$scope.isLoggedIn = true;
	};
	$scope.isLoggedIn = false;
	$scope.toSignUp = false;
	$scope.plant = {};
	$scope.hasPlant = true;
	$scope.findplant = "";

	$scope.searchPlants = function(){
		shrivelryService.getPlants()

		.then(function(data){
			$scope.plants = data.data;
			for(var i= 0; i< $scope.plants.length; i++){
				if($scope.findplant === $scope.plants[i].name){
					$scope.plant = $scope.plants[i];
					$scope.hasPlant = false;
					return;
				}
			} 
			$location.path("/new");
		});
	};

	$scope.addNewPlant = function(){
	 	shrivelryService.addNewPlant($scope.plant, $scope.currentUser).then(function(){
	 		getUser();;
	 	});
	};
	$scope.logIn = function(user){
		shrivelryService.login(user);

	};
	$scope.logOut = function(){
		shrivelryService.logout();
	};
});
