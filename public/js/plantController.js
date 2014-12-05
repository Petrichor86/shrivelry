var app = angular.module('Shrivelry');

app.controller("plantController", function($scope, $location, shrivelryService){

	var getUser = function(){
		if(shrivelryService.getUser()){
			$scope.currentUser = shrivelryService.getUser();
		}
	}
	getUser();

	$scope.removePlant = function(plant) {
		shrivelryService.removePlant(plant).then(getUser);
	};
	
	$scope.addNewUser = function(){
		if(!$scope.newUser || !$scope.newUser.name || !$scope.newUser.email || !scope.newUser.password || !scope.newUser.phonNum){
			alert("Invalid user creation. Please try again. Be sure to fill out all fields!");
			$location.path('/');
		}
		else{
		shrivelryService.addNewUser($scope.newUser);
		$location.path('/login');
		}
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
	$scope.plantAdd = true;

	$scope.searchPlants = function(){
		shrivelryService.getPlants()
		.then(function(data){
			$scope.plants = data.data;
			for(var i= 0; i< $scope.plants.length; i++){
				if($scope.findplant === $scope.plants[i].name){
					$scope.plant = $scope.plants[i];
					$scope.hasPlant = false;
					$scope.plantAdd = false;
					return;
				}
			} 
			$location.path("/new");
		});
	};

	$scope.addNewPlant = function(){
	 	shrivelryService.addNewPlant($scope.plant, $scope.currentUser, $scope.nickname).then(function(){
	 		$scope.findplant = "";
	 		$scope.nickname = "";
	 		getUser();
	 	})
	};
	$scope.logIn = function(user){
		shrivelryService.login(user);

	};
	$scope.logOut = function(){
		shrivelryService.logout();
	};
	$scope.plantRequest = function(){
		alert($scope.plantForRequest + " has been added to our request list! Check back soon for database updates.");
		$location.path('/user/'+ $scope.currentUser.name);
	};
});
