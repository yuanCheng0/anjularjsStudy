// app.js

// define our application and pull in ngRoute and ngAnimate
var animateApp = angular.module('animateApp', ['ngRoute', 'ngAnimate']);

// ROUTING ===============================================
// set our routing for this application
// each route will pull in a different controller
animateApp.config(function($routeProvider) {

    $routeProvider

        // home page
        .when('/', {
            templateUrl: 'tpl/page-home.html',
            controller: 'mainController'
        })

        // about page
        .when('/about', {
            templateUrl: 'tpl/page-about.html',
            controller: 'aboutController'
        })

        // contact page
        .when('/contact', {
            templateUrl: 'tpl/page-contact.html',
            controller: 'contactController'
        });

});


//home page controller
animateApp.controller('mainController', ['$scope',function($scope) {
    $scope.pageClass = 'page-home';
}]);

// about page controller
animateApp.controller('aboutController', function($scope) {
    $scope.pageClass = 'page-about';
});

// contact page controller
animateApp.controller('contactController', function($scope) {
    $scope.pageClass = 'page-contact';
});