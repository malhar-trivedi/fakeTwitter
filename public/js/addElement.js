'use strict';

$('#btnAdd').on('click', function() {
  let options = {
    img: 'http://placehold.it/64x64',
    alt: 'image',
    href: '#',
    text: 'Lorem ipsum and something bullshit',
    title: 'New Guy',
  };
  $('.media-list').prepend(createElement(options));
});

/**
 * Create new element
 * options.img
 * options.alt
 * options.href
 * options.message
 * options.title
 */
function createElement(options) {
  let newElement = '<li class="media"><div class="media-left"><a href="' +
      options.href +'">';
  newElement += '<img class="media-object" src="' + options.img + '" alt="' +
      options.alt+'"></a>';
  newElement += '</div><div class="media-body"><h4 class="media-heading">' +
      options.title + '</h4>'+ options.message +'</div></li>';
  return newElement;
}
