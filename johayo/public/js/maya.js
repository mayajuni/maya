function index($scope){
	$scope.go = function(){
		if($scope.credentials.username !== 'maya'){
			alert('dddd');
		}else{
			alert('a');
		}
	}
}

function board($scope){
	$scope.openColse = function(){
		if($scope.oc == '열기'){
			$scope.oc = '닫기';
			$scope.display='';
		}else{
			$scope.oc = '열기';
			$scope.display='hidden';
		}
	}
}