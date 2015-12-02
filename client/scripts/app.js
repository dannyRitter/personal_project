var myApp = angular.module('myApp', ['ngRoute']);


myApp.config(['$routeProvider', function($routeProvider){
    $routeProvider
        .when('/index', {
            templateUrl: "/assets/views/routes/questionnaire.html",
            controller: "questionsController"
        })
        .when('/about', {
            templateUrl: "/assets/views/routes/about.html"
            //controller: "questionsController"
        })
        .when('/contact', {
            templateUrl: "/assets/views/routes/contact.html"
            //controller: "questionsController"
        })
        .when('/questionnaire', {
            templateUrl: "/assets/views/routes/questionnaire.html",
            controller: "questionsController"
        })
        .when('/results', {
            templateUrl: "/assets/views/routes/results.html",
            controller: "questionsController"
        })
        .otherwise('/index');
}]);

myApp.controller('questionsController', ['$scope', '$http', function($scope, $http){
    $scope.answer = {};
    $scope.questionIndex = 0;
    $scope.currentQuestion = 0;
    $scope.userResponseObject = {};
    $scope.answersArray = [];
    $scope.successArray = ["Does this work?", "Maybe?"];


    $scope.questionsArray = [];

    $scope.getQuestions = function(){
        $http.get('/data').then(function(response){

            $scope.questionsArray = [];

            for(var i = 0; i < response.data.length; i++){
                var questionObject = response.data[i];
                questionObject.index = i;
                questionObject.show = true;



                $scope.questionsArray.push(questionObject);
                //$scope.currentQuestion = $scope.questionsArray[i];
                $scope.questionIndex = 0;
                //console.log(questionObject);
            }

            $scope.showCurrent();
        });
    };



    $scope.postAnswer = function (kittyFoo) {
        //capture info onto dynamic key
        var key = "question" + $scope.currentQuestion;
        $scope.userResponseObject[key] = kittyFoo.response;

        $scope.currentQuestion++;

        if($scope.currentQuestion == $scope.questionsArray.length) {
            $scope.answersArray.push($scope.userResponseObject);

            if($scope.answersArray.length == 2){
                //react to being done
                console.log("User response objects: ", $scope.answersArray[0], $scope.answersArray[1]);
                $scope.compareAnswers();

                alert("Time for the results!");
            } else {
                $scope.userResponseObject = {};
                $scope.currentQuestion = 0;
                alert("Ok player 2!");
            }

        }


        for(var i=0; i < $scope.questionsArray.length; i++){
            $scope.questionsArray[i].show = false;
        }

        $scope.showCurrent();
        //console.log("Here is the response: ", $scope.userResponseObject);
    };


    $scope.compareAnswers = function(){
        //var SA = $scope.successArray;
        var user1 = $scope.answersArray[0];
        var user2 = $scope.answersArray[1];

        console.log("HERE: ", user1, user2);

        for(var i=0; i < $scope.questionsArray.length; i++){
            if(user1["question" + i] >= 3 && user2["question" + i] >= 3){
                $scope.successArray.push("question" + i);
            }
        }

        console.log("Here are the matches!", $scope.successArray);
    };


    $scope.showCurrent = function(){

        for(var i=0; i < $scope.questionsArray.length; i++){
            if($scope.questionsArray[i].index == $scope.currentQuestion){
                $scope.questionsArray[i].show = true;
            } else {
                $scope.questionsArray[i].show = false;
            }
        }
    };

    $scope.getQuestions();
}]);
