var app = angular.module("Shrivelry");

app.service('shrivelryService', function($http, $cookieStore, $location){

	var baseUrl = "http://localhost:8002";
    var currentUser;

    var getUser = function(){
    	return $cookieStore.get('shrivelryUser');
    }

    this.getUser = function(){
    	return $cookieStore.get('shrivelryUser');	
    }

    this.logout = function(){
    	$cookieStore.remove('shrivelryUser');
    	$location.path('/');
    }

    this.login = function(user){
    	return $http({
    		method: 'POST',
    		url: baseUrl + '/login',
    		data: user
    	}).then(function(res){
    		console.log(res);
    		$cookieStore.put('shrivelryUser', res.data);
    		currentUser = getUser();

    			//if pass doesn't match don't reload login page!

    		$location.path('/user/' + res.data.name);
    	})
    }

	this.getUsers = function() {
		return $http({
			method: "GET",
			url: baseUrl + "/users"
		});
	}
	this.addNewUser = function(newUser) {
		console.log(newUser);
		return $http({
			method: "POST",
			url: baseUrl + "/signup",
			data: {name: newUser.name,
				email: newUser.email,
				password: newUser.password,
				phoneNum: newUser.phoneNum
			}
		});
	}
	
	this.getPlants = function()	{
		return $http({
			method: "GET",
			url: baseUrl + "/plants"
		});
	}
	this.addNewPlant = function(plant, user) {
		return $http({
		method: "POST",
		url: baseUrl + "/users/myplants",
		data: {
			plant: plant, user: user
		}
	}).then(function(res){
		$cookieStore.put('shrivelryUser', res.data);
	});
  };



 });