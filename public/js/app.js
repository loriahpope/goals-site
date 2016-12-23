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
  })
  .service("Goals", function($http) {
    this.getGoals = function() {
      return $http.get("/goals").
        then(function(response) {
            return response;
        }, function(response) {
            alert("Error retrieving goals.");
        });
    }
  })
  .controller("ListController", function(goals, $scope) {
    $scope.goals = goals.data;
  });