$(function(){
	if(location.pathname == "/emp/project/project_shift.php") {
		//set button to the page.
		$("div").append("<div style='margin:0 5%'><div align='left'><button>Googleカレンダーに追加</button></div></div>");
		$("button").click(function(){
			getLinks();
		});
	}
});

function getLinks() {
	$("table:eq(1) tr:gt(1)").find("td:eq(2) > a").each(function(){
		let shiftId = $(this).attr("href").substring(23, 57);
		getData(shiftId);
	});
}

function getData(link) {
	$.ajax({
		type: 'GET',
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
	let timeAry = data.match(/\d{2}:\d{2}/g);
	let startTime = timeAry[0];
	let endTime   = timeAry[1];
	console.log(date + ' ' + startTime + ' ' + endTime);
}
