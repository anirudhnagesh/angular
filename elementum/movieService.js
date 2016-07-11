angular.module("elementum.services.movies", [
])
    .service("MovieService", [
        '$http',
        function ($http) {

            var base = 'http://api.themoviedb.org/3';
            var service = '/collection/528';
            var apiKey = 'cf852df10c90128fb734af573f4f1a0d';
            var callback = 'JSON_CALLBACK';
            var url = base + service + '?api_key=' + apiKey + '&callback=' + callback;
            var imageBaseUrl =  "https://image.tmdb.org/t/p/w500/"

            this.getMovies = function () {
                $http.jsonp(url).then(function(data, status) { 

                      $scope.movies = data.data.parts
                      _.each($scope.movies, function(movie) {
                        $scope.movieBackgroundImages.push(movie.backdrop_path)
                      })


                    },function(data, status) {
                      $scope.movies = 'Maybe you missed your API key?\n\n' + JSON.stringify(data);
                });
            };
        }
    ]);