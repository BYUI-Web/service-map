var serviceMap = angular.module('serviceMap', []);

serviceMap.controller('ServicesSearch', ['$scope', '$http', "$filter",
    function ($scope, $http) {
        $scope.services = [];
        $scope.servicesPerPage = 1;
        $scope.currentPage = 1;
        $scope.query = "";
        
        $http.get('data/services.json').success(function (data) {
            $scope.services = data.services; // Add data to scope
            $scope.allTags = data.allTags;
            $scope.numPages = function() {
                var filteredServices = $filter("filter")($scope.services, function($value) {
                    return ;
                })
                return Math.ceil($scope.services.length / $scope.servicesPerPage);
            };
        });

        $scope.range = function (n) {
            return new Array(n);
        };

        $scope.changePage = function (n) {
            if (n >= 1 && n <= $scope.numPages()) {
                $scope.currentPage = n;
            }
        };
}]);

//We already have a limitTo filter built-in to angular,
//let's make a startFrom filter
serviceMap.filter('startFrom', function () {
    return function (input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
});