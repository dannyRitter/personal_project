var myApp = angular.module('myApp', ['ngRoute']);

myApp.config(['$routeProvider', function($routeProvider){
    $routeProvider
        .when('/index', {
            templateUrl: "/assets/views/routes/index.html",
            //controller: ""
        })
        .when('/about', {
            templateUrl: "/assets/views/routes/about.html",
            //controller: ""
        })
        .when('/contact', {
            templateUrl: "/assets/views/routes/contact.html",
            //controller: ""
        })
        .when('/questionnaire', {
            templateUrl: "/assets/views/routes/questionnaire.html",
            //controller: ""
        })
        .otherwise('/index');
}]);

myApp.controller('questionsController', ['$scope', '$http', function($scope, $http){
    console.log("running questionsController");
    $scope.answer = {};
    $scope.questionIndex = 0;
    $scope.currentQuestion = {};

    $scope.questionsArray = [];

    $scope.getQuestions = function(){
        $http.get('/data').then(function(response){
            var question = [];
            question.push(response.data[0]);
            $scope.questionsArray = response.data;
            $scope.currentQuestion = $scope.questionsArray[0];
            $scope.questionIndex = 0;
            console.log(question);
        });
    };

    $scope.getQuestions();

    $scope.postAnswer = function (kittyFoo) {
        console.log("given object:", kittyFoo);
        $http.post('/data', kittyFoo).then(function (response) {


            // increment index
            // store the questionsArray[index] in currentQuestion
        });
    };
}]);

