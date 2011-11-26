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

    window.IssueListEntryView = Backbone.View.extend({
      template: _.template($("#issue-list-entry-template").html()),
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
      template: _.template($("#issue-list-template").html()),
      tag: "div",
      className: "issue list",

      initialize: function() {
        _.bindAll(this, 'render',
                  'renderIssue');
      },

      render: function() {
        this.collection.each(this.renderIssue);

        return this;
      },

      renderIssue: function(issue) {
        console.log("render an issue in the list", issue);
        console.log(this);
        var view = new IssueListEntryView({
          model: issue
        });
        $(this.el).append(view.render().el);
      },
    });

  });
})(jQuery);
