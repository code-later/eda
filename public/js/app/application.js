$(function() {
  var socket = window.socket = io.connect('http://localhost:3000/issues');

  window.response_callbacks = {};

  socket.on("response", function(data) {
    var callback = response_callbacks[data.header.response_id]

    if (callback && typeof callback === "function") {
      callback(data.payload, data.header)
      delete response_callbacks[data.header.response_id]
    }
  });

  $('a[data-backbone_link="true"]').live('click', function (e) {
    App.navigate($(this).attr('href'), true);
    return false;
  });
})
