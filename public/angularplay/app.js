
 var myApp = angular.module("nodetest", ["ngRoute"]);
myApp.config(function($routeProvider){


console.log("tt");
	$routeProvider.when("/test",{

		templateUrl:"test.html"

	});

	$routeProvider.when("/test2",{

		templateUrl:"test2.html"

	});


});


