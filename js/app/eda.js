(function($) {

  window.Issue = Backbone.Model.extend({});

  window.Issues = Backbone.Collection.extend({
    model: Issue,
    url: "/issues"
  });

  $(function() {

    window.IssueView = Backbone.View.extend({
      template: _.template($("#issue-template").html()),
      tag: "div",
      className: "issue",

      initialize: function() {
        _.bindAll(this, 'render');
      },

      render: function() {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
      }
    });

    window.IssueListView = Backbone.View.extend({
    });

  });
})(jQuery);
