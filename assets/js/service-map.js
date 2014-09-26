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

        dataService.getDataFromSheets();

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
                response = $filter("filter")(response, function (value) {
                    var found = false;
                    selectedTags.forEach(function (tag) {
                        if (value.tags.indexOf(tag) !== -1) {
                            found = true;
                            return true;
                        }
                    });
                    return found;
                });
            }

            if (selectedDepartments.length > 0) {
                response = $filter("filter")(response, function (value) {
                    var found = false;
                    selectedDepartments.forEach(function (department) {
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
            
//"serviceName": "sponsor": "shortName": "url": 
//"contactName": "office": "contact": "mapUrl": 
//"tags": "abstract":

        service.getDataFromSheets = function (cb) {
            $http.get("https://docs.google.com/spreadsheet/pub?key=0Aj1ydhtVRj-7dFo5eHdwQ1piMExaQ1p0b3JwbFJmLUE&single=true&gid=0&output=csv").success(function (data) {
                var rows = CSVToArray(data).slice(3);
                
                rows = rows.map(function(row) {
                    var newRow = {};
                    newRow.serviceName = row[0];
                    newRow.sponsor = row[3];
                    newRow.shortName = row[1];
                    newRow.url = row[2];
                    newRow.url = row;
                });
            });
        }

        return service;

}]);

// ref: http://stackoverflow.com/a/1293163/2343
// This will parse a delimited string into an array of
// arrays. The default delimiter is the comma, but this
// can be overriden in the second argument.
function CSVToArray(strData, strDelimiter) {
    // Check to see if the delimiter is defined. If not,
    // then default to comma.
    strDelimiter = (strDelimiter || ",");

    // Create a regular expression to parse the CSV values.
    var objPattern = new RegExp(
        (
            // Delimiters.
            "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

            // Quoted fields.
            "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

            // Standard fields.
            "([^\"\\" + strDelimiter + "\\r\\n]*))"
        ),
        "gi"
    );


    // Create an array to hold our data. Give the array
    // a default empty first row.
    var arrData = [[]];

    // Create an array to hold our individual pattern
    // matching groups.
    var arrMatches = null;


    // Keep looping over the regular expression matches
    // until we can no longer find a match.
    while (arrMatches = objPattern.exec(strData)) {

        // Get the delimiter that was found.
        var strMatchedDelimiter = arrMatches[1];

        // Check to see if the given delimiter has a length
        // (is not the start of string) and if it matches
        // field delimiter. If id does not, then we know
        // that this delimiter is a row delimiter.
        if (
            strMatchedDelimiter.length &&
            strMatchedDelimiter !== strDelimiter
        ) {

            // Since we have reached a new row of data,
            // add an empty row to our data array.
            arrData.push([]);

        }

        var strMatchedValue;

        // Now that we have our delimiter out of the way,
        // let's check to see which kind of value we
        // captured (quoted or unquoted).
        if (arrMatches[2]) {

            // We found a quoted value. When we capture
            // this value, unescape any double quotes.
            strMatchedValue = arrMatches[2].replace(
                new RegExp("\"\"", "g"),
                "\""
            );

        } else {

            // We found a non-quoted value.
            strMatchedValue = arrMatches[3];

        }


        // Now that we have our value string, let's add
        // it to the data array.
        arrData[arrData.length - 1].push(strMatchedValue);
    }

    // Return the parsed data.
    return (arrData);
}