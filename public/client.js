$(document).ready(function () {
  let socket = io();

  socket.on('user', function (data) {
    $('#num-users').text(data.currentUsers + ' users online');
    let message = 
      data.usename +
      (data.connected ? 'hasjoined the chat.' : 'has left the chat.');
    $('#messages').append($('<li>').html('<b>' + message + '<b>'));
  });
  
  $('form').submit(function () {
      var messageToSend = $('#m').val();
      $('#m').val('');
      return false;
  });
});