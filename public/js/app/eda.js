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

        this.collection.bind("reset", this.render);
      },

      render: function() {
        this.collection.each(this.renderIssue);

        return this;
      },

      renderIssue: function(issue) {
        var view = new IssueListEntryView({
          model: issue
        });
        $(this.el).append(view.render().el);
      },
    });

    window.Eda = Backbone.Router.extend({

      routes: {
        '': 'home',
        'issues/:id' : 'issues'
      },

      initialize: function() {
        var self = this;
        self.issues = new Issues();
        self.issueListView = new IssueListView({collection: self.issues});

        (new Issues()).fetch({success: function(data) {
          self.issues.reset(data.models);
          self.issueListView = new IssueListView({
            collection: self.issues
          });
        }});
      },

      home: function() {
        $(".span5").empty();
        $(".span5").html(this.issueListView.render().el);
      },

      issues: function(issue_id) {
        var issue = this.issues.find(function(issue) {
          if(issue.id == issue_id) { return issue }
        });

        this.issueView = new IssueView({
          model: issue
        });

        $(".span11").html(this.issueView.render().el);
      }
    });

    window.App = new Eda();
    Backbone.history.start({pushState: true});

  });
})(jQuery);
