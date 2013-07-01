function index($scope){
	$scope.go = function(){
		if($scope.credentials.username !== 'maya'){
			alert('dddd');
		}else{
			alert('a');
		}
	}
}