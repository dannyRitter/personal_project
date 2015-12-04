var myApp = angular.module('myApp', ['ngRoute']);

//Routing!
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
            controller: "factoryController"
        })
        .otherwise('/index');
}]);

//Main controller for pretty much everything! Should probably extrapolate out...
myApp.controller('questionsController', ['$scope', '$http', 'resultsFactory', function($scope, $http, resultsFactory){
    $scope.answer = {};
    $scope.questionIndex = 0;
    $scope.currentQuestion = 0;
    $scope.userResponseObject = {};
    $scope.answersArray = [];
    $scope.successArray = [];
    $scope.domArray = [];
    $scope.questionsArray = [];

    $scope.showButton;

    //Grab questions from database
    $scope.getQuestions = function(){
        $http.get('/data').then(function(response){

            $scope.questionsArray = [];

            for(var i = 0; i < response.data.length; i++){
                var questionObject = response.data[i];
                questionObject.index = i;
                questionObject.show = true;

                $scope.questionsArray.push(questionObject);
                $scope.questionIndex = 0;
            }
            $scope.showCurrent();
        });
    };


    $scope.submitAnswer = function (kittyFoo) {
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
                $scope.showSuccesses();
                //push domArray to resultsFactory as storedResults
                resultsFactory.setResults($scope.domArray);
                $scope.showButton = true;
                $scope.buttonReveal($scope.showButton);
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
    };

    //Show "See Results!" button function
    $scope.buttonReveal = function(value){
        if(value == true) {
            return true;
        } else {
            return false
        }
    };


    $scope.compareAnswers = function(){
        var user1 = $scope.answersArray[0];
        var user2 = $scope.answersArray[1];

        for(var i=0; i < $scope.questionsArray.length; i++){
            if(user1["question" + i] >= 3 && user2["question" + i] >= 3){
                $scope.successArray.push(i);
            }
        }
        console.log("Here are the matches!", $scope.successArray);
    };


    $scope.showSuccesses = function(){
        var A1 = $scope.successArray;
        var A2 = $scope.questionsArray;

        //GO THROUGH ALL OF SUCCESS IDs and Grab the info out of the Questions
        for(var i = 0; i < A1.length; i++){
            $scope.domArray.push(A2[(A1[i])]);
        }
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


myApp.controller('factoryController', ['$scope', '$http', 'resultsFactory', function($scope, $http, resultsFactory){

    $scope.domArray = [];
    $scope.domArray = resultsFactory.getResults();
    //console.log($scope.domArray);
}]);

myApp.factory('resultsFactory', function(){

    var storedResults = [];

    return {
        getResults: function() {
            return storedResults;
            console.log(storedResults);
        },
        setResults: function(value) {
            storedResults = value;
            return storedResults;
        },
    }
});