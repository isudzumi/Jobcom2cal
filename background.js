chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
  const URL = 'https://www.googleapis.com/calendar/v3/calendars/primary/events?sendNotifications=true';
	chrome.identity.getAuthToken({ 'interactive' : true }, function(token){

    if(chrome.runtime.lastError){
      console.log(chrome.runtime.lastError);
      return;
    }

		$.ajax({
			type: 'POST',
			url : URL,
			timeout: 10000,
			data: request,
      dataType: 'json',
      headers: {
        "Authorization": "Bearer " + token
      },
      contentType: 'application/json'
		}).done(function(data){
			console.log(data);
		}).fail(function(xhr, status){
      if(xhr.status === 401) {
        chrome.identity.removeCachedAuthToken(
          {'token' : token}
        );
      }
			console.log(xhr);
			console.log(status);
		});
	});
  }
);
