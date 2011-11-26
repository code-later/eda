$(function() {
  $('a[data-backbone_link="true"]').live('click', function (e) {
    App.navigate($(this).attr('href'), true);
    return false;
  });
})
