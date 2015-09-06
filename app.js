var app = angular.module('myApp', ['firebase','chart.js','ngRoute', 'ngCookies'])
app.config(['$routeProvider', '$locationProvider',
  function($routeProvider, $locationProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'template/auth.html',
        controller: 'AuthController'
      }).
      when('/chart', {
        templateUrl: 'template/chart.html',
        controller: 'pie',
        resolve : {user : resolveUser}
      }).
      otherwise({
        redirectTo: '/'
      })
  }]);

app.run(function($rootScope, $location){
  $rootScope.$on("$routeChangeError", function(event, next, previous, error){
    if(error === "AUTH_REQUIRED"){
      $rootScope.message = "You need to be signed in in order to visit this page"
      $location.path('/')
    }
  })
})
function resolveUser(authService){
  return authService.authObj.$requireAuth()
}
