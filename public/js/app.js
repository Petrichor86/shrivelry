var app = angular.module("Shrivelry",['ngRoute', 'ngCookies']);

app.run(function(shrivelryService, $rootScope, $location){
	// debugger;
	// $rootScope.$on("$routeChangeStart", function(a, b, next){
	// 	if(shrivelryService.getUser){
	// 		$rootScope.currentUser = shrivelryService.getUser();
	// 	} else if($location.path() !== '/') {
	// 			$location.path('/login');
	// 	} 
	// });
})


app.config(function($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl: 'templates/startPage.html',
			controller: 'plantController'
		})
		.when('/signup', {
			templateUrl: 'templates/signUp.html',
			controller: 'plantController'
		})
		.when('/new', {
			templateUrl: 'templates/newPlantForm.html',
			controller: 'plantController'
		})
		.when('/search', {
			templateUrl: 'templates/plantSearch.html',
			controller: 'plantController'
		})
		.when('/user/:id', {
			templateUrl: 'templates/userHome.html',
			controller: 'plantController'
		})
		.when('/login', {
			templateUrl: 'templates/login.html',
			controller: 'plantController'
		})

		.otherwise({
			redirectTo: '/'
		});
});