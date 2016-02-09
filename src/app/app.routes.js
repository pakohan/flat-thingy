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
		});
});

