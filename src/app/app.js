angular.module('jw-ng-template', [
    'ui.router',
    'templates-app',
    'angular-toArrayFilter',
    'ngMaterial',
    'angular-oauth2'
])

.config(($locationProvider, $urlRouterProvider) => {
    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/');
})

.config(['OAuthProvider', function(OAuthProvider) {
    OAuthProvider.configure({
        baseUrl: 'http://localhost:3006/',
        clientId: '554561301622-8jpjl2mt2h5k4e523op6jd5mpfqq7me6.apps.googleusercontent.com',
        clientSecret: 'gnnnPeUFWmswVMmPgaMm9XNt'
    });
}])

.run(['$rootScope', '$window', 'OAuth', function($rootScope, $state, $window, OAuth) {
    $rootScope.state = $state;

    $rootScope.$on('oauth:error', function(event, rejection) {
        // Ignore `invalid_grant` error - should be catched on `LoginController`.
        if ('invalid_grant' === rejection.data.error) {
            return;
        }

        // Refresh token when a `invalid_token` error occurs.
        if ('invalid_token' === rejection.data.error) {
            return OAuth.getRefreshToken();
        }

        // Redirect to `/login` with the `error_reason`.
        return $window.location.href = '/login?error_reason=' + rejection.data.error;
    });
}])

;
