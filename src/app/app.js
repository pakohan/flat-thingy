angular.module('flat-thingy', [
    'ui.router',
    'templates-app',
    'angular-toArrayFilter',
    'ngMaterial'
])

.config(($locationProvider, $urlRouterProvider) => {
    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/');
})

.run(function($rootScope, $state) {
    $rootScope.state = $state;
})

;
