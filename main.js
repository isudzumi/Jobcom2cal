class StatusAlert {
	constructor() {
		this.count = 0;
	}
	counter(){
		this.count++;
	}
	success(){
		this.counter();
		this.message = 'カレンダーに登録しました';
	}
	fail(text){
		this.counter();
		this.message = 'ERROR : ' + text;
	}
}

let count = new StatusAlert();

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
	count.size = size;
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

chrome.extension.onRequest.addListener(function(response){
	response = JSON.parse(response);
	if(response.message === 'success') {
		count.success();
	} else {
		count.fail(response.message);
	}
	if(count.count == count.size){
		alert( count.message );
	}
})
