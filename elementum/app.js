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


// Assumption : Can include service and controllers in separate files as a good practice. But included
// all of them in one file for this example.
angularApp.service("MovieService", [
        '$http',
        function ($http) {

        	var movieService = {}

            // can store all of these inside constants file and use it from there.
            var base = 'http://api.themoviedb.org/3';
            var service = '/collection/528';
            var apiKey = 'cf852df10c90128fb734af573f4f1a0d';
            var callback = 'JSON_CALLBACK';
            var url = base + service + '?api_key=' + apiKey + '&callback=' + callback;
            var imageBaseUrl =  "https://image.tmdb.org/t/p/w500/"

            var movie_background_path = ""

            movieService.getMovies = function () {
                return $http.jsonp(url)
            };

            movieService.getMovieBasicInfo = function (movieId) {
                service  = "/movie/" + movieId
                url = base + service + '?api_key=' + apiKey + '&callback=' + callback;
                return $http.jsonp(url)
            }

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

angularApp.controller('moviesController', ['$scope','$routeParams','$http', 'MovieService','$location', function ($scope,$routeParams,$http, MovieService,$location) {

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

    // There could be a better way of adding style, but not aware of it.
    $scope.movieSelected = function(id) {
        document.getElementById('image'+id).style = "border:5px solid #1a9dba;"
        $location.path('details/' + id)
    }


    $scope.getMovieDetails =  function() {
    	console.log("get movie details")
    }

    getMovies()
    

}]);

// Assumption : have used underscore to manipulate, filter and pick values from array.
angularApp.controller('movieDetailsController', ['$scope','$routeParams','MovieService', function ($scope,$routeParams,MovieService) {
    $scope.message = "Inside details"

    $scope.crews = []
    $scope.cast = []
    $scope.director = ""
    $scope.writers = ""

    $scope.movie_title = ""
    $scope.profile_pic = ""

    MovieService.getMovieBasicInfo($routeParams.id).then(function(data) {
        $scope.backdrop_path = data.data.backdrop_path
        $scope.movie_about = data.data.overview
        $scope.movie_title = data.data.original_title
        $scope.profile_pic = data.data.backdrop_path
    })

    MovieService.getMovieCredits($routeParams.id).then(function(data) {
        $scope.cast = data.data.cast

        $scope.director = _.find(data.data.crew, function(person) {
            return person.department == "Directing"
        }).name

        $scope.stars = _.pluck(data.data.cast,'name').join(',')

        $scope.writers = _.pluck(_.filter(data.data.crew, function(person) {
            return person.department == "Writing"
        }), 'name').join(',')
        
    })

    $scope.loadProfiePic = function(image) {
        $scope.profile_pic = image
    }
}]);






