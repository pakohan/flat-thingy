angular.module('jw-ng-template').controller('StartPageCtrl', ($scope, $mdSidenav) => {
    console.log('test');
    $scope.openMenu = () => {
        console.log('test');
        $mdSidenav('left').toggle();
    };
});
