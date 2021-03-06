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
            $scope.departments = data.departments;

            $scope.numPages = function () {
                var filteredServices = $scope.services;
                if ($scope.query !== "") {
                    filteredServices = $filter("filter")(filteredServices, $scope.query);
                }
                filteredServices = $filter("filterTags")(filteredServices, $scope.allTags, $scope.departments);
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

serviceMap.filter("filterTags", ["$filter", function ($filter) {
    return function (input, tags, departments) {
        var selectedTags = [],
            selectedDepartments = [],
            response = input,
            found = false,
            numSelectedTags;

        if (input === undefined) {
            return input;
        }


        if (tags !== undefined) {
            Object.keys(tags).forEach(function (tag) {
                if (tags[tag] !== false) {
                    selectedTags.push(tag);
                }
            });
        }

        if (departments !== undefined) {
            Object.keys(departments).forEach(function (department) {
                if (departments[department] !== false) {
                    selectedDepartments.push(department);
                }
            });
        }

        if (selectedTags.length > 0) {
            response = $filter("filter")(response, function(value) {
                var found = false;
                selectedTags.forEach(function(tag) {
                    if (value.tags.indexOf(tag) !== -1) {
                        found = true;
                        return true;
                    }
                });
                return found;
            });
        }
        
        if (selectedDepartments.length > 0) {
            response = $filter("filter")(response, function(value) {
                var found = false;
                selectedDepartments.forEach(function(department) {
                    if (value.sponsor === department) {
                        found = true;
                        return true;
                    }
                });
                return found;
            });
        }
        return response;
    }
}]);

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

        function extractAllDepartments(services) {
            var departments = {};

            services.forEach(function (service) {
                if (departments[service.sponsor] === undefined) {
                    departments[service.sponsor] = false;
                }
            });

            return departments;
        }

        service.getData = function (cb) {
            $http.get('data/services.json').success(function (data) {
                data.tags = extractAllTags(data.services);
                data.departments = extractAllDepartments(data.services);
                cb(data);
            }).error(cb);
        };

        return service;

}]);