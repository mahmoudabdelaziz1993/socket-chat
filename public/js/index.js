var socket = io();

socket.on('connect', function () {
  console.log('Connected to server');
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

socket.on('newMessage', function (message) {
  // console.log('newMessage', message);
  // var li = jQuery('<li></li>');
  // li.text(`${message.from}: ${message.text}`);
  // jQuery('#messages').append(li);
  var template = jQuery('#message-template').html();
  var html = Mustache.render(template,{
  	from:message.from,
  	text:message.text
  });
  jQuery('#messages').append(html);
});

jQuery('#message-form').on('submit', function (e) {
  e.preventDefault();
  var messageTextbox = jQuery('[name=message]');
  socket.emit('createMessage', {
    from: 'User',
    text: messageTextbox.val()
  }, function () {
    messageTextbox.val('')
  });
});
