// MODULE
var angularApp = angular.module('angularApp', ['ngRoute']);

angularApp.config(['$routeProvider',function ($routeProvider) {
    $routeProvider.
      when('/details', {
        templateUrl: 'details.html',
        controller: 'movieDetailsController'
      }).
      when('/details/:id', {
        templateUrl: 'details.html',
        controller: 'movieDetailsController'
    }).
    otherwise ({
		redirectTo: '/index.html'
	});
}])

angularApp.service("MovieService", [
        '$http',
        function ($http) {

        	var movieService = {}

            var base = 'http://api.themoviedb.org/3';
            var service = '/collection/528';
            var apiKey = 'cf852df10c90128fb734af573f4f1a0d';
            var callback = 'JSON_CALLBACK';
            var url = base + service + '?api_key=' + apiKey + '&callback=' + callback;
            var imageBaseUrl =  "https://image.tmdb.org/t/p/w500/"

            movieService.getMovies = function () {
                return $http.jsonp(url)
            };

            movieService.getMovieCredits = function (movieId) {
                service = "/movie/" + movieId + "/credits"
                url = base + service + '?api_key=' + apiKey + '&callback=' + callback;
                return $http.jsonp(url)
            }

            return movieService
        }
    ]);

// CONTROLLERS
angularApp.controller('MasterDetailCtrl', ['$scope', function ($scope) {

}]);

angularApp.controller('moviesController', ['$scope','$routeParams','$http', 'MovieService', function ($scope,$routeParams,$http, MovieService) {
	console.log("inside movies");

	$scope.movies = []
	$scope.movieBackgroundImages = []

    function getMovies() {
    	MovieService.getMovies().then(function(data) {
    		$scope.movies = data.data.parts
    		_.each($scope.movies, function(movie) {
               $scope.movieBackgroundImages.push(movie.backdrop_path)
        	})
    	})

    	
    }


    $scope.getMovieDetails =  function() {
    	console.log("get movie details")
    }

    getMovies()
    

}]);


angularApp.controller('movieDetailsController', ['$scope','$routeParams','MovieService', function ($scope,$routeParams,MovieService) {
	console.log("inside details movies");
    console.log($routeParams.id)
    $scope.message = "Inside details"

    $scope.crews = []
    $scope.cast = []
    $scope.director = []

        MovieService.getMovieCredits($routeParams.id).then(function(data) {
            
            $scope.cast = data.data.cast
        })
}]);






