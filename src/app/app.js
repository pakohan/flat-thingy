angular.module('jw-ng-template', [
	'ui.router',
	'templates-app',
	'angular-toArrayFilter',
	'ngMaterial'
])

.config(($locationProvider, $urlRouterProvider) => {
	$locationProvider.html5Mode(true);
	$urlRouterProvider.otherwise('/');
})

.run(($rootScope, $state) => {
	$rootScope.state = $state;
})

;
