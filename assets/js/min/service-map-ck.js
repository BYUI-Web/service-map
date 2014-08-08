var serviceMapp = angular.module('serviceMapp', []);

serviceMapp.controller('ServicesSearch', ['$scope', '$http', function($scope, $http) {
	$scope.search = [];
	$scope.search.term = "art";
	$http.get('assets/js/services.json').success(function(data) {
		$scope.services = data;
	});
}]);