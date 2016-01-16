(function(){

	'use strict';

	angular.module('Sensul.controllers').controller('indexCtrl', indexCtrl);

	indexCtrl.$inject = ['$scope', '$http', 'Constant'];

	function indexCtrl($scope, $http, Constant) {

		angular.extend($scope, {
			uploads: [],
			greenhouses: [],
			data: {}
		});

		$scope.clear = function(){
			angular.extend($scope.data, {
				greenhouse: null,
				filecsv: ''
			});
			$("#filecsv").val('');
			if (!$scope.$$phase) {
			  $scope.$apply();
			}
		};

		$scope.clear();

		$http.get(Constant.url.GreenHouse).success(function(data){
			$scope.greenhouses = data.data;
		}).error(function(error){
			alert(error);
		});

		$http.get(Constant.url.Upload).success(function(data){
			$scope.uploads = data.data;
		}).error(function(error){
			alert(error);
		});

		$scope.sendUpload = function(){
			if($scope.validForm()) return false;
      $('#formUpload').ajaxSubmit({
        dataType: 'text',
        error: function(error) {
          alert(error);
        },
        success: function(data) {
        	data = JSON.parse(data);
					data.data.greenhouse = $scope.data.greenhouse;
					$scope.uploads.push(data.data);
          $scope.clear();
        }
      });
		};

		$scope.getGrowerName = function(data, exit){
			data = data || {};
			$scope.greenhouses.forEach(function(item){
				if(item._id === data._id) exit = item.grower.name;
			});
			return exit;
		};

		$scope.deleteUpload= function(item, index){
			$http.delete(Constant.url.Upload + '/' + item._id).success(function(data){
				$scope.uploads.splice(index, 1);
			}).error(function(error){
				alert(error);
			});
		};

		$scope.validForm = function(){
			if($scope.data.greenhouse === null) { alert('Favor preencher o campo Abrigo!'); return true }
			if($("#filecsv").val() === '') { alert('Favor preencher o campo Arquivo!'); return true }
			return false;
		}

  }

}());