$(function() {
  $('a[data-backbone_link="true"]').click(function (e) {
    App.navigate($(this).attr('href'), true);
    return false;
  });
})
