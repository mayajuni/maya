function main($scope){
	
}


/* 게시판 정보 */
function board($scope){
	/* top게시판 목록 열기 닫기 */
	$scope.topDisplay = 'hidden';
	$scope.openColse = function(){
		if($scope.topDisplay =='hidden'){
			$scope.oc = '닫기';
			$scope.topDisplay='';			
		}else{
			$scope.oc = '열기';
			$scope.topDisplay='hidden';
		}
	}
	
	$scope.goDetail = function (_id, index){
		$.ajaxSetup({cache:false});
		$("#boardInfo").load(window.location.pathname+"/detail?_id="+_id);
		$("span[name='aTag']").each(function(){
			$(this).attr('class', '');			
		});
		$("#aTag"+index).attr('class', 'clickOk');
	}
	
	/* 게시판 페이지 이동 */
	$scope.movePage = function (page, viewCount){
		location.href=window.location.pathname+"?page="+page+"&viewCount="+viewCount;
	}
	
	/* 게시판 등록 */
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

/* 상위 게시판 페이지 이동 ajax */
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
				 html = html + '<tr><td scope="row"><span onclick="goDetail(\''+data.boardList[i]._id+'\', \''+i+'\');" name="aTag" id="aTag'+i+'" style="cursor: pointer;">';
				 html = html + data.boardList[i].title+'</span>';
				 if(data.boardList[i].comment.length > 0)
					 html = html + ' <span style="color: #FF3636;">(<b>'+data.boardList[i].comment.length+'</b>)</span>';
				 html = html + '</td><td scope="row">'+data.boardList[i].date.substring(0,4)+'/'+data.boardList[i].date.substring(4,6)+'/'+data.boardList[i].date.substring(6,8)+'</td></tr>';
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

/* 상세 보기 */
function goDetail(_id, index){
	$.ajaxSetup({cache:false}); 
	$("#boardInfo").load(window.location.pathname+"/detail?_id="+_id);
	$("span[name='aTag']").each(function(){
		$(this).attr('class','');			
	});
	$("#aTag"+index).attr('class','clickOk');
}

/* 댓글 리스트 리셋 */
function commentList(index, data){
	$("#comDeleteBox").remove();
	var html = '';
	
	for(var i=0;i<data.boardInfo.comment.length;i++){
		html = html + '<tr><td colspan="3"><span class="commentTitle">'+data.boardInfo.comment[i].id+'</span> <span style="font-size: 11px;">('+data.boardInfo.comment[i].date.substring(0,4)+'/'+data.boardInfo.comment[i].date.substring(4,6)+'/'+data.boardInfo.comment[i].date.substring(6,8)+' '+data.boardInfo.comment[i].date.substring(8,10)+':'+data.boardInfo.comment[i].date.substring(10,12)+')</span>';
		html = html + '<span style="cursor: pointer;" onclick="showDelete(\''+index+'\', \''+data.boardInfo._id+'\', \''+data.boardInfo.comment[i].id+'\', \''+data.boardInfo.comment[i].date+'\', event)"> x </span></td></tr>';
		html = html + '<tr><td colspan="3" class="commentContent"><pre>'+data.boardInfo.comment[i].content+'</pre></td></tr>';
	}
	
	$("#comment"+index).html(html);
}

/* 댓글 열기 닫기 */
function commentOpenColse(index){
	if($("#commnetDisplay"+index).attr('class') == 'hidden'){
		$("#tfoot"+index).attr('class', 'tfoot');
		$("#commnetDisplay"+index).attr('class', '');
	}else{
		$("#tfoot"+index).attr('class', '');
		$("#commnetDisplay"+index).attr('class', 'hidden');
	}
}

/* 댓글 등록 */
function insertComment(index, _id){
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
			commentList(index, data);
			return;
		},
		error : function() {
			alert("시스템 오류가 발생하였습니다. 잠시후 다시 시도해주세요.");
			return;
		}
	});
}

/* 댓글 삭제 */
function deleteComment(index, boardId, id, commentDate){
	if($("#delPassword").val() == ''){
		alert("비밀번호를 입력해주세요.");
		$("#delPassword").focus();
		return;
	}
	
	$.ajax({
		data : "_id="+boardId+"&id="+id+"&password="+$("#delPassword").val()+"&commentDate="+commentDate,
		type : "POST",
		async : false,
		url : "/board/ajaxCommentDelete",
		success : function(data) {
			var data = eval('('+data+')');
			commentList(index, data);
			return;
		},
		error : function() {
			alert("시스템 오류가 발생하였습니다. 잠시후 다시 시도해주세요.");
			return;
		}
	});
	return;
}

/* 비밀번호 묻는창 오픈 */
function showDelete(index, boardId, id, commentDate, e){
	if(!e) e = window.Event;
	
	var x = e.clientX + (document.documentElement.scrollLeft?document.documentElement.scrollLeft:document.body.scrollLeft);
	var y = e.clientY + (document.documentElement.scrollTop?document.documentElement.scrollTop:document.body.scrollTop);
	
	$("#comDeleteBox").remove();
	
	$('body').append('<div id="comDeleteBox"></div>');
	
	$("#comDeleteBox").css(
		      {'border-style':'solid',
		       'background':'white',
		       position:'absolute',
		       'border-width':'1px 1px 1px 1px',
		       'top': (y)+'px',
		       'left': (x+17)+'px',
		       'z-index':'10',
		       'border-radius':'5px',
		       'text-align' : 'center'
		      });

	$("#comDeleteBox").html("<div>" +
			   "<input type='password' id='delPassword' size='10' placeholder='비밀번호'>" +
			   '<input type="button" value="삭제" onclick="deleteComment(\''+index+'\', \''+boardId+'\', \''+id+'\', \''+commentDate+'\')">' +
			   "<input type='button' value='취소' onclick='closeMemo()'></div>");
}

/* 비밀번호 묻는창 닫기 */
function closeMemo(){
	$("#comDeleteBox").remove();
}

/* 관리자 화면 */
function showAdmin(){
	var height = 140;
    var width = 170;

    $('#adminView').dialog({
        title: "관리자 로그인",
        autoOpen: true,
        height: height,
        width: width,
        position:[,],
        modal: true,
        closeOnEscape:true,
        resizable: false,
        autoResize: true,
        overlay: {
            opacity: 0.5,
            background: "black"
        },
        open: function(event, ui) {
            //폼이 오픈될때 로직을 넣어주세요.
            //alert('open');
        },
        close: function(event, ui) {
            //폼이 종료될때 로직을 넣어주세요.
            //alert('close');
        },
		buttons: {
			'로그인' : function(){
				login();
			},
			'닫기': function() {
                $(this).dialog('close');
			}
		}
    });
}

/* 관리자 화면 비밀번호 text에서 enter 눌렀을때 */
function adminKey(){
	var key = event.keyCode;
	if(key == '13')
		login();
}

/* 로그인 */
function login(){
	if($("#adminPw").val() == ''){
		alert("관리자 비밀번호를 입력해주세요.");
		$("#adminPw").focus();
		return;
	}
	$.ajax({
		data : "adminPw="+$("#adminPw").val(),
		type : "POST",
		async : false,
		url : "/admin/login",
		success : function(data) {
			var data = eval('('+data+')');
			if("" == data.err){
				location.href = window.location.pathname;
				return;
			}else{
				alert(data.err);
			}
			return;
		},
		error : function() {
			alert("시스템 오류가 발생하였습니다. 잠시후 다시 시도해주세요.");
			return;
		}
	});
}