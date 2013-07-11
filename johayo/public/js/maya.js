function index($scope){
	$scope.go = function(){
		if($scope.credentials.username !== 'maya'){
			alert('dddd');
		}else{
			alert('a');
		}
	}
}

function board($scope, $http){
	$scope.openColse = function(){
		if($scope.oc == '열기'){
			$scope.oc = '닫기';
			$scope.display='';
		}else{
			$scope.oc = '열기';
			$scope.display='hidden';
		}
	}
	
	$scope.insertBoard = function(){
		if($("#division").val() == ''){
			alert("게시판 구분을 선택해주세요.");
			$("#division").focus();
			return;
		}
		if($("#title").val() == ''){
			alert("제목을 입력해주세요.");
			$("#title").focus();
			return;
		}
		if($("#content").val() == ''){
			alert("내용을 입력해주세요.");
			$("#content").focus();
			return;
		}
		
		$.ajax({
			data : $("#insert").serialize().replace(/%/g,'%25'),
			type : "POST",
			async : false,
			url : "/board/ajaxInsert",
			success : function() {
				 alert("등록되셨습니다.");
				 location.href="/board/"+$("#division").val();
				 return;
			},
			error : function() {
				alert("시스템 오류가 발생하였습니다. 잠시후 다시 시도해주세요.");
				return;
			}
		});
	}
}

function moveTopPage(page, viewCount){
	$.ajax({
		data : 'page='+page+'&viewCount='+viewCount,
		type : "POST",
		async : false,
		url : window.location.pathname+"/ajaxTopList",
		success : function(data) {
			 var data = eval('('+data+')');
			 $("#paging").html(data.paging);
		},
		error : function() {
			alert("시스템 오류가 발생하였습니다. 잠시후 다시 시도해주세요.");
			return;
		}
	});
}