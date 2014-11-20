var serviceMap = angular.module('serviceMap', []);

serviceMap.controller('ServicesSearch', ['$scope', "$filter", "dataService",

    function ($scope, $filter, dataService) {
        $scope.services = [];
        $scope.servicesPerPage = 20;
        $scope.currentPage = 1;
        $scope.query = "";

        dataService.getData(function (data) {
            $scope.services = data.services; // Add data to scope
            $scope.departments = data.departments;
            $scope.audiences = data.audiences;

            $scope.numPages = function () {
                var filteredServices = $scope.services;
                if ($scope.query !== "") {
                    filteredServices = $filter("filter")(filteredServices, $scope.query);
                }
                filteredServices = $filter("filterTags")(filteredServices, $scope.departments, $scope.audiences);
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

serviceMap.filter("filterTags", ["$filter",
    function ($filter) {
        return function (input, departments, audiences) {
            var selectedDepartments = [],
                selectedAudiences = [],
                response = input,
                found = false,
                numSelectedTags;

            if (input === undefined) {
                return input;
            }

            if (departments !== undefined) {
                Object.keys(departments).forEach(function (department) {
                    if (departments[department] !== false) {
                        selectedDepartments.push(department);
                    }
                });
            }
            
            if (audiences !== undefined) {
                Object.keys(audiences).forEach(function(audience) {
                    if (audiences[audience] !== false) {
                        selectedAudiences.push(audience);
                    }
                })
            }

            if (selectedDepartments.length > 0) {
                response = $filter("filter")(response, function (value) {
                    var found = false;
                    selectedDepartments.forEach(function (department) {
                        if (value.owner === department) {
                            found = true;
                            return true;
                        }
                    });
                    return found;
                });
            }
            
            if (selectedAudiences.length > 0) {
                response = $filter("filter")(response, function(value) {
                    var found = false;
                    selectedAudiences.forEach(function(audience) {
                        if (value.audiences.indexOf(audience) !== -1) {
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

        function extractAllDepartments(services) {
            var departments = {};

            services.forEach(function (service) {
                if (departments[service.owner] === undefined) {
                    departments[service.owner] = false;
                }
            });

            return departments;
        }

        function extractAllAudiences(services) {
            var audiences = {};

            services.forEach(function (service) {
                var serviceAudiences = service.audiences.split(",");
                serviceAudiences.forEach(function (audience) {
                    if (audiences[audience] === undefined) {
                        audiences[audience] = false;
                    }
                });
            });
            return audiences;
        }

        service.getData = function (cb) {
            $http.get('data/export.json').success(function (data) {
                data.departments = extractAllDepartments(data.services);
                data.audiences = extractAllAudiences(data.services);
                cb(data);
            }).error(cb);
        };

        return service;

}]);