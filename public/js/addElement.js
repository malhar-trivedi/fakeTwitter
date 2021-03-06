'use strict';

$('document').ready(function() {
  let lastTimestamp;
  function refreshTweets() {
    let url;
    if(!lastTimestamp) {
      url = '/tweets';
    } else {
      url = '/tweets/' + lastTimestamp
    }
    $.ajax({
      url: url,
      success: function(data) {
        if(data && data.length > 0) {
          lastTimestamp = getTime(data[0].date);
          let finalElements = '';
          for(let i=0; i<data.length; ++i) {
            finalElements += createElement(data[i]);
          }
          $('.media-list').prepend(finalElements);
        }
      },
      complete: function() {
        setTimeout(refreshTweets, 3000);
      },
    });
  }

  Cookies.set('details', {userId: 'myUserId'});
  $.ajax({
    url: '/tweets',
    success: function(data) {
      if(data && data.length > 0) {
        let finalElements = '';
        lastTimestamp = getTime(data[0].date);
        for(let i=0; i<data.length; ++i) {
          finalElements += createElement(data[i]);
        }
        $('.media-list').prepend(finalElements);
      }
    },
    complete: function() {
      setTimeout(refreshTweets, 3000);
    },
  });
  
  $( "#textboxbutton").click(function() {
    //it should fetch text from textbox
    let message = $('#textbox').val();
    
    //we should do checking., 
    if(!message){
      console.error('message not present');
      return;
    }
    let payload = {'message': message};
    $.ajax({
      url: '/tweet',
      type: 'POST',
      dataType: 'json',
      data: JSON.stringify(payload),
      contentType: 'application/json; charset=utf-8',
      success: function (res) {
        console.log('post was successful', res);
        $('#textbox').val('');
      },
      fail: function (err) {
        console.error('error happened', err);
      }
    });
  });

  function getTime(timeString) {
    let newDate = new Date(timeString);
    return newDate.getTime();
  }
});

/**
 * Create new element
 * options.image
 * options.href
 * options.message
 * options.userName
 */
function createElement(options) {
  let newElement = '<li class="media"><div class="media-left"><a href="' +
      options.href +'">';
  newElement += '<img class="media-object" src="' +
      options.image + '" alt="image"></a>';
  newElement += '</div><div class="media-body"><h4 class="media-heading">' +
      options.userName + '</h4>'+ options.message +'</div></li>';
  return newElement;
}
