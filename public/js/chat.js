var socket = io();

socket.on('connect', function () {
  console.log('Connected to server');
  var params = jQuery.deparam(window.location.search);
  socket.emit('join',params,function(err){
  	if (err) {
  		alert(err);
  		window.location.href ='/';
  	}
  		else{console.log('no err');}
  });
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});
//----------------------------------------- new user joined the room mesaage from admin ----------
socket.on('new',function(message){
  var li = jQuery('<li></li>');
  li.text(`${message.from}: ${message.text}`);
  jQuery('#messages').append(li);

});
//----------------------------------------- new user joined the room  ----------
socket.on('userlistupdate',function(users){
	var ol = jQuery('<ul></ul>');
	users.forEach(function(user){
		ol.append(jQuery('<li></li').text(user));
	});
	jQuery('#users').html(ol);

})



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
