$(document).ready(function () {
  let socket = io();

  socket.on('user count', (data) =>{
    console.log(data);
  });

  $('form').submit(function () {
      var messageToSend = $('#m').val();
      $('#m').val('');
      return false;
  });
});