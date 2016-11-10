'use strict';

$('#btnAdd').on('click', function() {
  let options = {
    image: 'http://placehold.it/64x64',
    alt: 'image',
    href: '#',
    text: 'Lorem ipsum and something bullshit',
    userName: 'New Guy',
  };
  $('.media-list').prepend(createElement(options));
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
