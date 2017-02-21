var app = angular.module('cats', []);

app.controller('CatsCtrl', function($scope, $http) {
    console.log($http);
    $scope.cats = [];
    $scope.newCat = {};
    $scope.submitted = false;
    $scope.editSubmitted = false;

    activate();

    function activate() {
        $http({
            url: '/api/cats',
            method: 'GET'
        }).then(function(response) {
            $scope.cats = response.data;
            console.log($scope.cats);
        }, function(responseError) {
            console.log(responseError);
            $scope.cats = [];
        });

        $scope.deleteCat = function(catIndex, cat) {
            if(confirm("Подтвердите удаление")) {
                $http({
                    url: '/api/cats/' + cat['_id'],
                    method: 'DELETE'
                }).then(function(response) {
                    $scope.cats.splice(catIndex, 1);
                }, function(responseError) {
                    alert('Не удалось удалить кота');
                });
            }
        };

        $scope.addCat = function(cat) {
            if($scope.addForm.$valid) {
                $http({
                    url: '/api/cats',
                    method: 'POST',
                    data: {
                        name: cat.name,
                        gender: cat.gender,
                        age: cat.age,
                        color: cat.color
                    }
                }).then(function(response) {
                    $scope.cats.push(response.data.cat);
                    $scope.newCat = {};
                    $scope.submitted = false;
                }, function(responseError) {
                    alert('Не удалось добавить кота');
                });
            }
        };

        $scope.editCat = function(cat) {
            if(cat.age && cat.name && cat.gender && cat.color) {
                $http({
                    url: '/api/cats/' + cat._id,
                    method: 'PUT',
                    data: {
                        name: cat.name,
                        gender: cat.gender,
                        age: cat.age,
                        color: cat.color
                    }
                }).then(function(response) {
                    console.log(response.data);
                    $scope.editSubmitted = false;
                    cat.edit = false;
                }, function(responseError) {
                    alert('Не удалось отредактировать кота');
                });
            }
        };
    }

});