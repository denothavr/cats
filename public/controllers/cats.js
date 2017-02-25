var app = angular.module('cats', []);

app.controller('CatsCtrl', function($scope, $http) {
    console.log($http);
    $scope.cats = [];
    $scope.newCat = {};
    $scope.submitted = false;
    $scope.editSubmitted = false;
    $scope.search = '';

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
                        color: cat.color,
                        image: cat.image || ''
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

        $scope.editCat = function(cat, backupCat,catIndex) {
            if(cat.age && cat.name && cat.gender && cat.color) {
                $http({
                    url: '/api/cats/' + cat._id,
                    method: 'PUT',
                    data: {
                        name: cat.name,
                        gender: cat.gender,
                        age: cat.age,
                        color: cat.color,
                        image: cat.image || ''
                    }
                }).then(function(response) {
                    console.log(backupCat);
                    var newCat = response.data.cat
                    console.log($scope.cats[catIndex]);
                    $scope.cats[catIndex] = angular.copy(newCat);
                    $scope.editSubmitted = false;
                    $scope.cats[catIndex].edit = false;
                }, function(responseError) {
                    alert('Не удалось отредактировать кота');
                });
            }
        };

        $scope.editCatFlag = function(cat) {
            $scope.editedCat = angular.copy(cat);
            cat.edit = !cat.edit;
        }
    }

});