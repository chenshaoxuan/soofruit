/**
 * Created by xz_liu on 2016/3/9.
 */
var app = angular.module('admin');

app.controller('Dic', function ($scope, $http, $route) {
    document.title = 'Dictionary Management';

    $http.get('/dics').success(function (result) {
        $scope.dics = result;
    });

    $http.get('/dicTypes').success(function (result) {
        $scope.dicTypes = result;
    });

    $scope.getDic = function (_id) {
        $http.get('/dics/' + _id).success(function (result) {
            if (!result.code) {
                $scope.dicEdit = result;
            }
        });
    };

    $scope.createDic = function (dic) {
        $http.post('/dics', dic).success(function (result) {
            if (!result.code) {
                $route.reload();
            }
        });
    };

    $scope.deleteDic = function (_id) {
        $http.delete('/dics/' + _id).success(function (result) {
            if (result.code == 0) {
                $route.reload();
            }
        });
    };
});