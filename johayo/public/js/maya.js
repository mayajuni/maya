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
	/* 처음에는 topList를 닫아놓은다 */
	$scope.display='hidden';
	$scope.openColse = function(){
		if($scope.display=='hidden'){
			$scope.oc = '닫기';
			$scope.display='';
		}else{
			$scope.oc = '열기';
			$scope.display='hidden';
		}
	}
	
	/* 댓글 열기 닫기 */
	$scope.commentOpenColse = function(index){
		if($("#commnetDisplay"+index).attr('class') == 'hidden'){
			$("#tfoot"+index).attr('class', 'tfoot');
			$("#commnetDisplay"+index).attr('class', '');
		}else{
			$("#tfoot"+index).attr('class', '');
			$("#commnetDisplay"+index).attr('class', 'hidden');
		}
	}
	
	/* 댓글 등록 */
	$scope.insertComment = function(index, _id){
		if($("#content"+index).val() == ''){
			alert("내용을 입력해주세요.");
			$("#content"+index).focus();
			return;
		}
		if($("#id"+index).val() == ''){
			alert("아이디을 입력해주세요.");
			$("#id"+index).focus();
			return;
		}
		if($("#password"+index).val() == ''){
			alert("비밀번호을 입력해주세요.");
			$("#password"+index).focus();
			return;
		}
		
		$.ajax({
			data : "_id="+_id+"&id="+$("#id"+index).val()+"&password="+$("#password"+index).val()+"&content="+$("#content"+index).val(),
			type : "POST",
			async : false,
			url : "/board/ajaxCommentInsert",
			success : function(data) {
				var data = eval('('+data+')');
				var html = '';
				for(var i=0;i<data.boardInfo.comment.length;i++){
					html = html + '<tr><td><span class="commentTitle">'+data.boardInfo.comment[i].id+'</span> <span style="font-size: 11px;">('+data.boardInfo.comment[i].date.substring(0,4)+'/'+data.boardInfo.comment[i].date.substring(4,6)+'/'+data.boardInfo.comment[i].date.substring(6,8)+' '+data.boardInfo.comment[i].date.substring(8,10)+':'+data.boardInfo.comment[i].date.substring(10,12)+')</span></td></tr>';
					html = html + '<tr><td class="commentContent"><pre>'+data.boardInfo.comment[i].content+'</pre></td></tr>';
				}
				
				$("#comment"+index).html(html);
				return;
			},
			error : function() {
				alert("시스템 오류가 발생하였습니다. 잠시후 다시 시도해주세요.");
				return;
			}
		});
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
			 var html = '';
			 for(var i=0;i<data.boardList.length;i++){
				 html = html + '<tr><td scope="row">'+data.boardList[i].title+'</td><td scope="row">'+data.boardList[i].date.substring(0,4)+'/'+data.boardList[i].date.substring(4,6)+'/'+data.boardList[i].date.substring(6,8)+'</td></tr>';
			 }
			 $("#boardList").html(html);
			 $("#topPaging").html(data.topPaging);
		},
		error : function() {
			alert("시스템 오류가 발생하였습니다. 잠시후 다시 시도해주세요.");
			return;
		}
	});
}

function movePage(page, viewCount){
	location.href=window.location.pathname+"?page="+page+"&viewCount="+viewCount;
}