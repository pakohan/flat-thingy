angular.module('jw-ng-template').config(($stateProvider) => {
	$stateProvider
		.state('app', {
			abstract: true,
			views: {
				'frame': {
					templateUrl: 'frame/frame.tpl.html',
				},
			}
		})
		.state('app.main', {
			abstract: true,
			views: {
				'frame': {
					templateUrl: 'frame/frame.tpl.html',
				},
				'@sidenav': {
					templateUrl: ''
				}
			}
		});
});

