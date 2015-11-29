myApp.directive('questionInfo',
    function(){
        return {
            restrict: "AE",
            scope: {
                info: "=",
                action: '&'
            },
            templateUrl: "assets/views/questioninfo.html"
            //controller: questionsController
        }
    }
);