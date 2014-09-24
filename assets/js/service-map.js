var serviceMap = angular.module('serviceMap', []);

serviceMap.controller('ServicesSearch', ['$scope', "$filter", "dataService",

    function ($scope, $filter, dataService) {
        $scope.services = [];
        $scope.servicesPerPage = 1;
        $scope.currentPage = 1;
        $scope.query = "";

        dataService.getData(function (data) {
            $scope.services = data.services; // Add data to scope
            $scope.allTags = data.tags;
            $scope.numPages = function () {
                var filteredServices = $scope.services;
                if ($scope.query !== "") {
                    filteredServices = $filter("filter")(filteredServices, $scope.query);
                }
                return Math.ceil(filteredServices.length / $scope.servicesPerPage);
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

serviceMap.filter("isSelected", function () {
    return function (input) {
        var response = {};
        if (input !== undefined) {
            Object.keys(input).forEach(function (tag) {
                if (input[tag] !== false) {
                    response[tag] = true;
                }
            });
        }
        return response;
    }
});

serviceMap.filter("filterTags", function () {
    return function (input, tags) {
        var selectedTags = {};
        var response = [];
        if (tags !== undefined) {
            Object.keys(tags).forEach(function (tag) {
                if (tags[tag] !== false) {
                    selectedTags[tag] = true;
                }
            });
        }
        if (input !== undefined) {
            input.forEach(function(service) {
                
            });
        }
    }
});

serviceMap.factory("dataService", ["$http",
        function ($http) {
        var service = {};

        function extractAllTags(services) {
            var tags = {};
            services.forEach(function (service) {
                service.tags.forEach(function (tag) {
                    if (tags[tag] === undefined) {
                        tags[tag] = false;
                    }
                });
            });
            return tags;
        }

        service.getData = function (cb) {
            $http.get('data/services.json').success(function (data) {
                data.tags = extractAllTags(data.services);
                cb(data);
            }).error(cb);
        };

        return service;

}]);