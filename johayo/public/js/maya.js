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

function moveTopPage(page, viewCount){
	alert(window.location.pathname);
	return;
	$.ajax({
		data : 'page='+page+'&viewCount='+viewCount,
		type : "POST",
		async : false,
		url : "",
		success : function(data2) {
			var datas2 = data2.trim().split("^^");
			if(datas2[0]=="error"){
				closeLoadingWindow();;
				alert(datas2[1]);
				return;
			}else{
				alert("등록되었습니다.");
				location.href="/admJsAct/adm/hope/hopeDetail.jsp?seq="+data2[1];
			}
		},
		error : function() {
			alert("시스템 오류가 발생하였습니다. 잠시후 다시 시도해주세요.");
			closeLoadingWindow();
		}
	});
}