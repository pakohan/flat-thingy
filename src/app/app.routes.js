angular.module('jw-ng-template').config(($stateProvider) => {
    $stateProvider
        .state('app', {
            abstract: true,
        })
        .state('app.public', {
            url: '/',
            views: {
                '@': {
                    templateUrl: 'login/login.tpl.html',
                },
            }
        })
        .state('app.private', {
            url: '/account',
            controller: 'StartPageCtrl',
            views: {
                '@': {
                    templateUrl: 'start/start.tpl.html',
                },
            }
        });
});
