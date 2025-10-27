$(document).ready(function () {
  let socket = io();

  $('form').submit(function () {
      var messageToSend = $('#m').val();
      $('#m').val('');
      return false;
  });
});