var myApp = angular.module('myApp', ['ngRoute', 'ngMaterial', 'ngMessages']);

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
        .primaryPalette('blue-grey')
        .accentPalette('grey');
}]);




//Main controller for pretty much everything! Should probably extrapolate out...
myApp.controller('questionsController', ['$scope', '$http', 'resultsFactory', '$mdDialog', function($scope, $http, resultsFactory, $mdDialog){
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
        console.log("Yupper do");
         var alert = $mdDialog.alert()
            .title('Attention')
            .content('This is an example of how easy dialogs can be!')
            .ok('Close');

        $mdDialog
            .show( alert )
            .finally(function() {
                alert = undefined;
            });
    };

    //Ready player 2 alert!
    $scope.secondUserAlert = function(){
        var alert = $mdDialog.alert()
            .title('Ok player 2!')
            .content("It's time for the other partner to answer some sexy questions.")
            .ok('Close');

        $mdDialog
            .show( alert )
            .finally(function() {
                alert = undefined;
            });
    };

    //Results alert!
    $scope.resultsAlert = function(){
        var alert = $mdDialog.alert()
            .title('Time for the results!')
            .content('Click the button to see how your answers compared.')
            .ok('See Results!');

        $mdDialog
            .show( alert )
            .finally(function() {
                alert = undefined;
            });
    };

    //Pop up alert on initial page load
    $scope.welcomeAlert();

    ////// GROSS
    /*


     // Fictitious Employee Editor to show how to use simple and complex dialogs.

     function EmployeeEditor($scope, $mdDialog) {
     var alert;

     $scope.showAlert = showAlert;
     $scope.closeAlert = closeAlert;
     $scope.showGreeting = showCustomGreeting;

     $scope.hasAlert = function() { return !!alert };
     $scope.userName = $scope.userName || 'Bobby';

     // Dialog #1 - Show simple alert dialog and cache
     // reference to dialog instance

     function showAlert() {
         alert = $mdDialog.alert()
         .title('Attention, ' + $scope.userName)
         .content('This is an example of how easy dialogs can be!')
         .ok('Close');

         $mdDialog
         .show( alert )
         .finally(function() {
         alert = undefined;
         });
     }

     // Close the specified dialog instance and resolve with 'finished' flag
     // Normally this is not needed, just use '$mdDialog.hide()' to close
     // the most recent dialog popup.

     function closeAlert() {
     $mdDialog.hide( alert, "finished" );
     alert = undefined;
     }

     // Dialog #2 - Demonstrate more complex dialogs construction and popup.

     function showCustomGreeting($event) {
     $mdDialog.show({
     targetEvent: $event,
     template:
     '<md-dialog>' +
     '  <md-content>Hello {{ employee }}!</md-content>' +
     '  <div class="md-actions">' +
     '    <md-button ng-click="closeDialog()">' +
     '      Close Greeting' +
     '    </md-button>' +
     '  </div>' +
     '</md-dialog>',
     controller: 'GreetingController',
     onComplete: afterShowAnimation,
     locals: { employee: $scope.userName }
     });

     // When the 'enter' animation finishes...

     function afterShowAnimation(scope, element, options) {
     // post-show code here: DOM element focus, etc.
     }
     }
     }

     // Greeting controller used with the more complex 'showCustomGreeting()' custom dialog

     function GreetingController($scope, $mdDialog, employee) {
     // Assigned from construction <code>locals</code> options...
     $scope.employee = employee;

     $scope.closeDialog = function() {
     // Easily hides most recent dialog shown...
     // no specific instance reference is needed.
     $mdDialog.hide();
     };
     }

     })(angular);

     */



}]);


myApp.controller('factoryController', ['$scope', '$http', 'resultsFactory', '$mdDialog', function($scope, $http, resultsFactory, $mdDialog){

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

