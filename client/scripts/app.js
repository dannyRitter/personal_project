var myApp = angular.module('myApp', ['ngRoute','ngAria', 'ngMaterial', 'ngMessages']);

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


//Angular materials business
myApp.config(['$mdThemingProvider', function($mdThemingProvider){
    $mdThemingProvider.theme('default')
        .primaryPalette('red')
        .accentPalette('red');
}]);


//Main controller for pretty much everything! Should probably extrapolate out...
myApp.controller('questionsController', ['$scope', '$http', 'resultsFactory', '$mdDialog', '$location', function($scope, $http, resultsFactory, $mdDialog, $location){
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
        console.log(kittyFoo);
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
                $scope.resultsAlert();
            } else {
                $scope.userResponseObject = {};
                $scope.currentQuestion = 0;
                $scope.secondUserAlert();
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


    //More angular material business
    //Welcome alert!
    $scope.welcomeAlert = function(){

        var welcomeContent = '<br><br>“Yes, please!” is a questionnaire for couples for the purpose of highlighting common interests. <br><br><br> What kind of interests? Sexy interests! The following questionnaire is all about sexual activities, desires, and kinks. Each partner will answer the questionnaire individually, with the ability to answer each question completely honestly because the results of the questionnaire will only reveal the activities that both partners indicated interest in. <br><br><br> The questionnaire is designed to be useful for all kinds of couples, regardless of gender or sexual orientation, and because of the goal the questions are fairly universal for the time being (check out the “About” page for more information). <br><br><br> Each question will have a name of the activity, a definition, and a brief quote explaining why the activity is fun for some folks. Please keep an open mind as you answer each question - it is 100% OK if you are not interested in a given activity, but remember that someone out there (probably many someones) find that activity really sexy. As a final heads up: although there are no explicit images or visual content, the language is most likely NSFW, so proceed with caution if that is a concern! <br><br><br> Now, how about we get to those questions?';

        var alert = $mdDialog.alert()
            .title('Hello there!')
            .content(welcomeContent)
            .ok('"Yes, please!"');

        $mdDialog
            .show( alert )
            .finally(function() {
                alert = undefined;
            });
    };

    //Ready player 2 alert!
    $scope.secondUserAlert = function(){
        var secondAlertContent = "Time for Partner #2! The questionnaire will start again. Remember to answer honestly as only the questions that are both answered positively will be shown in the results.<br><br><br>If partner #1 hasn’t left yet, tell them to go take a walk around the block!";
        var alert = $mdDialog.alert()
            .title('PAUSE!')
            .content(secondAlertContent)
            .ok('Ready!');

        $mdDialog
            .show( alert )
            .finally(function() {
                alert = undefined;
            });
    };

    //Results alert!
    $scope.resultsAlert = function(){
        var resultsAlertContent = "Let’s add up the positive responses of both partners to find some exciting matches!<br><br><br>Please remember that interest in a particular activity is not the same as giving consent! Use these results to get a fun conversation going about sexy things you would like to try as a couple.<br><br><br>If you are sad to see that your partner was not interested in a particular activity, try to use be honest with them about your desires. Your partner may not be super excited about an activity but they still may be open to trying something new if it is important to you! Communication is important, even if it’s scary!<br><br><br>With the disclaimers out of the way, on to the fun!";
        var alert = $mdDialog.alert()
            .title('It’s time for the Results!')
            .content(resultsAlertContent)
            .ok('See Results!');

        $mdDialog
            .show( alert )
            .then(function(){
                $location.path('/results')
            })
            .finally(function() {
                alert = undefined;
            });
    };

    //Pop up alert on initial page load
    if(!resultsFactory.getIntroAlert()){
        resultsFactory.setIntroAlert(true);
        $scope.welcomeAlert();
    }
}]);


myApp.controller('factoryController', ['$scope', '$http', 'resultsFactory', '$mdDialog', function($scope, $http, resultsFactory, $mdDialog){

    $scope.domArray = [];
    $scope.domArray = resultsFactory.getResults();
    //console.log($scope.domArray);
}]);


myApp.factory('resultsFactory', function(){

    var storedResults = [];

    var introAlert = false;

    return {
        getResults: function() {
            return storedResults;
            console.log(storedResults);
        },
        setResults: function(value) {
            storedResults = value;
            return storedResults;
        },
        getIntroAlert: function(){
            //console.log("This was hit: " , introAlert);
            return introAlert;
        },
        setIntroAlert: function(value){
            introAlert = value;
        }
    }
});