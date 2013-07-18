/**
 * 공통
 */
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