angular.module("goalsApp", ['ngRoute'])
    .config(function($routeProvider) {
        $routeProvider
            .when("/", {
                templateUrl: "goal-list.html",
                controller: "GoalListController",
                resolve: {
                    goals: function(Goals) {
                        return Goals.getGoals();
                    }
                }
            })
            .when("/new/goal", {
                controller: "NewGoalController",
                templateUrl: "goal-form.html"
            })
            .when("/goal/:goalId", {
                controller: "EditGoalController",
                templateUrl: "goal.html"
            })
            .otherwise({
                redirectTo: "/"
            })
    })
    .service("Goals", function($http) {
        this.getGoals = function() {
            return $http.get("/goals").
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("Error finding goals.");
                });
        }
        this.createGoal = function(goal) {
            return $http.post("/goals", goal).
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("Error creating goal.");
                });
        }
        this.getGoal = function(goalId) {
            var url = "/goals/" + goalId;
            return $http.get(url).
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("Error finding this goal.");
                });
        }
        this.editGoal = function(goal) {
            var url = "/goals/" + goal._id;
            console.log(goal._id);
            return $http.put(url, goal).
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("Error editing this goal.");
                    console.log(response);
                });
        }
        this.deleteGoal = function(goalId) {
            var url = "/goals/" + goalId;
            return $http.delete(url).
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("Error deleting this goal.");
                    console.log(response);
                });
        }
    })
    .controller("GoalListController", function(goals, $scope) {
        $scope.goals = goals.data;
    })
    .controller("NewGoalController", function($scope, $location, Goals) {
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

        $scope.items = [];

        $scope.addStep = function() {
            $scope.items.push({
            })
        }
    })
    .controller("EditGoalController", function($scope, $routeParams, Goals) {
        Goals.getGoal($routeParams.goalId).then(function(doc) {
            $scope.goal = doc.data;
        }, function(response) {
            alert(response);
        });

        $scope.toggleEdit = function() {
            $scope.editMode = true;
            $scope.goalFormUrl = "goal-form.html";
        }

        $scope.back = function() {
            $scope.editMode = false;
            $scope.goalFormUrl = "";
        }

        $scope.saveGoal = function(goal) {
            Goals.editGoal(goal);
            $scope.editMode = false;
            $scope.goalFormUrl = "";
        }

        $scope.deleteGoal = function(goalId) {
            Goals.deleteGoal(goalId);
        }
    });