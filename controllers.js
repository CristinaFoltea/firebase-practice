app.controller('mainCtrl', ['$scope', function($scope){
  $scope.name
  $scope.default = 1
  $scope.dataset
  $scope.labels = ["Vote 1", "Vote 2", "Vote 3", "Vote 4", "Vote 5", "reset"];
}])
app.controller('AuthController', ["$scope","$location","$firebaseAuth", "authService",'$cookies',function($scope,$location, $firebaseAuth, authService, $cookies){
  $scope.register = function (){
    authService.authObj.$createUser($scope.user).then(function(){
      $scope.login()
    }, function(){
      $scope.message = "This user already exist"
    })
  }
  $scope.login = function(){
    authService.authObj.$authWithPassword($scope.user).then(function(){
      $cookies.put('user', $scope.user.email)
      $location.path('/chart')
    }, function(data){
      $scope.message = "Invalid user or password"
    })
  }
}])
app.controller('currencyCtrl', ['$scope', '$firebaseObject', function($scope, $firebaseObject){
  var bitcoinRef = new Firebase('https://publicdata-cryptocurrency.firebaseio.com')
  $scope.bitcoinData = $firebaseObject(bitcoinRef)
}])
app.controller('todoCtrl', ['$scope', "$firebaseArray", function($scope, $firebaseArray){
  var todoRef = new Firebase('https://g8-to-do.firebaseio.com')
  $scope.todos = $firebaseArray(todoRef)
  $scope.item = {text : "", completed : false}
  $scope.check = function($event){
    if ($event.keyCode === 13){
      $scope.todos.$add($scope.item).then(function(data){
        $scope.item.text = ''
      })
    }
  }
  $scope.remove = function(item){
    $scope.todos.$remove(item).then(function(data){
      console.log('Remove Succeseful')
    })
  }
}])
app.controller('pie', ['$scope','$rootScope', '$firebaseArray','$firebaseAuth', '$location', 'authService','user',
function($scope,$rootScope, $firebaseArray, $firebaseAuth, $location, authService, user){
  $scope.name = user.password.email
  var ref = new Firebase('https://g8-chart.firebaseio.com/chart/')
  $scope.data = $firebaseArray(ref)
  ref.on("value", function(snapshot) {
    if (snapshot.val()=== null){
        var create = ref
        create.update({'first' : 0, 'second' : 0, 'third' : 0, 'forth' : 0, 'fifth' : 0, 'reset' : 1})
      }
    $scope.dataset = [snapshot.val().first, snapshot.val().second, snapshot.val().third, snapshot.val().forth, snapshot.val().fifth, snapshot.val().reset]
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  })
  $scope.update = function(location){
    ref.update({reset : 0 })
    var dataRef = ref.child(location)
      dataRef.transaction(function(current_value){
        return (current_value || 0) + 1;
      })
    }
  $scope.reset = function (){
    ref.update({'first' : 0, 'second' : 0, 'third' : 0, 'forth' : 0, 'fifth' : 0, "reset" : 1})
  }
  $scope.signout = function(){
    authService.authObj.$unauth()
    $cookies.remove('user')
    $location.path('/')
  }
  $scope.total = function(){
    if($scope.dataset[$scope.dataset.length-1] === 1){
      return 0
    }
    return ($scope.dataset.reduce(function(sum, value){
      return sum +=value
    }, 0))
  }
}])
