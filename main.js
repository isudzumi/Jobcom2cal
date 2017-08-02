
$(function(){

	if(location.pathname == "/emp/project/project_shift.php") {
		//set button to the page.
		$("div").append('<div style="margin:0 5%"><div align="left"><button>Googleカレンダーに追加</button></div></div>');
		$("button").click(function(){
			getLinks();
		});
	}
});

function getLinks() {
	let size = 0;
	$("table:eq(1) tr:gt(1)").find("td:eq(2) > a").each(function(){
		let shiftId = $(this).attr("href").substring(23, 57);
		getData(shiftId);
		size++;
	});
	compareSize.size = size;
}

function getData(link) {
	$.ajax({
		type: "GET",
		url : link,
		timeout: 10000
	}).done(function(data){
		getJobDescription(data);
	}).fail(function(){
		alert("error");
	});
}

function getJobDescription(data) {
	let date = data.match(/\d{4}\/\d{2}\/\d{2}/g);
	date = date.toString().replace(/\//g, "-");
	let timeAry = data.match(/\d{2}:\d{2}/g);
	let startTime = timeAry[0];
	let endTime   = timeAry[1];

	let request = {
		"summary" : "IT-A勤務",
		"start"   : {
			"dateTime" : date + "T" + startTime + ":00+09:00",
			"timeZone" : "Asia/Tokyo",
		},
		"end"     : {
			"dateTime" : date + "T" + endTime + ":00+09:00",
			"timeZone" : "Asia/Tokyo",
		}
	}
	chrome.runtime.sendMessage(JSON.stringify(request));
}

let compareSize = {
	size: 0,
	count: 0,
	compare: function() {
		if (this.count == this.size) {
			return true;
		} else {
			return false;
		}
	}
};

function showAlert(message) {
	if( message === 'success' ) {
		message = 'カレンダーに登録しました';
	} else {
		message = 'ERROR : ' + message;
	}
	alert(message);
}

chrome.extension.onRequest.addListener(function(response){
	response = JSON.parse(response);
	compareSize.count++;
	if(compareSize.compare()) {
		showAlert(response.message);
	}
})
