chrome.runtime.onMessage.addListener(function(request){
    chrome.identity.getAuthToken({ 'interactive' : true }, function(token){

      if(chrome.runtime.lastError){
        showStatus(chrome.runtime.lastError);
      } else {
        insertToCalendar(token, request);
      }
    });
});

function insertToCalendar(token, request){
  const URL = 'https://www.googleapis.com/calendar/v3/calendars/primary/events';
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
  }).done(function(){
    showStatus('success');
  }).fail(function(xhr){
    if(xhr.status === 401) {
      chrome.identity.removeCachedAuthToken(
        {'token' : token}
      );
    }
    showStatus(xhr.status);
  });
}

function showStatus(status){
  let response = {
    message : status
  };
  chrome.tabs.getSelected(null, function(tab) {
    chrome.tabs.sendRequest(tab.id, JSON.stringify(response));
  })
}
