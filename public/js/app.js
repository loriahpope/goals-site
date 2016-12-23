angular.module("goalsApp", ['ngRoute'])
  .config(function($routeProvider) {
    $routeProvider
      .when("/", {
        templateUrl: "list.html",
        controller: "ListController",
        resolve: {
          goals: function(Goals) {
              return Goals.getGoals();
          }
        }
      })
      .when("/new/goal", {
        templateUrl: "goal-form.html",
        controller: "NewGoalController"
      })
  })
  .service("Goals", function($http) {
    this.getGoals = function() {
      return $http.get("/goals")
        .then(function(response) {
            return response;
        }, function(response) {
            alert("Error retrieving goals.");
        });
    }
    this.createGoal = function(goal) {
      return $http.post("/goals", goal)
        .then(function(response) {
            return response;
        }, function(response) {
            alert("Error creating goal.");
        });
    }
  })
  .controller("ListController", function(goals, $scope) {
    $scope.goals = goals.data;
  })
  .controller("NewGoalController", function($scope, $location, Contacts) {
    $scope.back = function() {
        $location.path("#/");
    }

    $scope.saveGoal = function(goal) {
        Goals.createGoal(goal).then(function(doc) {
            var goalUrl = "/goal/" + doc.data._id;
            $location.path(goalUrl);
        }, function(response) {
            alert(response);
        });
    }
})