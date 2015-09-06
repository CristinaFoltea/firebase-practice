app.service('authService', function($firebaseAuth){
  this.authObj = $firebaseAuth(new Firebase ('https://g8-chart.firebaseio.com/'))
})
