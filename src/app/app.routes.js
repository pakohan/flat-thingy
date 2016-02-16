angular.module('flat-thingy').config(($stateProvider) => {
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
			views: {
				'@': {
					templateUrl: 'start/start.tpl.html',
					controller: 'StartPageCtrl',
				},
			}
		});
});
