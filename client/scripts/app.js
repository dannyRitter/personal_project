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
            templateUrl: "/assets/views/routes/questionnaire.html"
            //controller: "questionsController"
        })
        .otherwise('/index');
}]);

myApp.controller('questionsController', ['$scope', '$http', function($scope, $http){
    console.log("running questionsController");
    $scope.answer = {};
    $scope.questionIndex = 0;
    $scope.currentQuestion = 0;
    $scope.userResponseObject = {};
    $scope.userOneAnswers = [];
    $scope.userTwoAnswers = [];


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
                console.log(questionObject);
            }

            $scope.showCurrent();
        });
    };



    $scope.postAnswer = function (kittyFoo) {
        //capture info onto dynamic key
        var key = "question" + $scope.currentQuestion;
        $scope.userResponseObject[key] = kittyFoo.response;

        //console.log("given object:", kittyFoo);
        //$http.post('/data', kittyFoo).then(function (response) {


            // increment index
            // store the questionsArray[index] in currentQuestion
        //});

        $scope.currentQuestion++;

        console.log(kittyFoo);
        //Check to see if the currentQuestion is equal to the data.length (the # of questions)
        //IF IT IS, then you need to store the responseObject somewhere (array?), then reset it, then do something,
        //Like set the questions back to 0?
        //Show something that says 'OK player 2',
        ///etc.

        if($scope.currentQuestion == $scope.questionsArray.length) {
            $scope.userOneAnswers.push($scope.userResponseObject);
            $scope.userResponseObject = {};
            $scope.currentQuestion = 0;
            alert("Ok player 2!");
        }

        for(var i=0; i < $scope.questionsArray.length; i++){
            $scope.questionsArray[i].show = false;
        }

        $scope.showCurrent();
        console.log("Here is the response: ", $scope.userResponseObject);
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

