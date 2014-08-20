var serviceMapp = angular.module('serviceMapp', []);

serviceMapp.controller('ServicesSearch', ['$scope', '$http', function($scope, $http) {
	// $scope.search = [];
	// $scope.search.term = "art";
	$http.get('data/services.json').success(function(data) {
		var data = angular.fromJson(data); // Parse JSON data
		$scope.services = data; // Add data to scope
		$scope.aliasList = [];
		$scope.query = "art";

		// Loop through services
		angular.forEach($scope.services, function(service, key) { 

			// split string into array of strings
			service.aliases = service.aliases.split(', ');
			// console.log(service);

			// add aliases to aliasList
			angular.forEach (service.aliases, function(alias, key) {
				$scope.aliasList.push(alias);
				// console.log($scope.aliasList);
			});
		});

		// filter aliasList for uniqueness
		$scope.aliasList = $scope.aliasList.filter(function(elem, pos, self) {
			return self.indexOf(elem) == pos;
		});
		// console.log("Filtered:");
		// console.log($scope.aliasList);

		$scope.aliasObjects = [];
		for (var i = 0; i < $scope.aliasList.length; i++) {
			var aliasObject = {};
			aliasObject.name = $scope.aliasList[i];
			aliasObject.selected = false;
			$scope.aliasObjects.push(aliasObject);
		}
		console.log($scope.aliasObjects);
	});
}]);
