var serviceMapp = angular.module('serviceMapp', []);

serviceMapp.controller('ServicesSearch', ['$scope', '$http', function($scope, $http) {
	$scope.search = [];
	$scope.search.term = "art";
	$http.get('assets/js/services.json').success(function(data) {
		var data = angular.fromJson(data);
		// console.log(data);
		$scope.services = data;
		angular.forEach($scope.services, function(service, key) {
			service.aliases = service.aliases.split(', ');
			console.log(service);
		});
	});
	$scope.services = 'serviceName';
}]);