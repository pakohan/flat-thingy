angular.module('flat-thingy').controller('StartPageCtrl', ($scope, $mdSidenav) => {
    $scope.openMenu = () => {
        $mdSidenav('left').toggle();
    };
});
