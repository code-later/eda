(function($) {

  Backbone.sync = function(method, model, options) {
    var response_id = method + "-" + window.socket.socket.sessionid + "-" + Math.random().toString();
    window.response_callbacks[response_id] = options.success;
    window.socket.emit(method, {header: {response_id: response_id}, payload: {id: model.id}});
  }

  window.Issue = Backbone.Model.extend({});

  window.Issues = Backbone.Collection.extend({
    model: Issue,
    url: "/issues",

    selectIssue: function(issue_id) {
      App.navigate("issues/" + issue_id, true);
      
      this.trigger('selectCurrentIssue', issue_id);
    }
  });

  $(function() {

    window.IssueView = Backbone.View.extend({
      template: _.template($("#issue-template").html()),
      tag: "div",
      className: "conversation",

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
      className: "entry",

      events: {
        'click': "selectIssue"
      },

      initialize: function() {
        _.bindAll(this, 'render',
                        'selectIssue');
      },

      render: function() {
        $(this.el).html(this.template(this.model.toJSON()));
        $(this.el).data("id", this.model.id);
        return this;
      },

      selectIssue: function() {
        this.collection.selectIssue($(this.el).data("id"));
      }
    });

    window.IssueListView = Backbone.View.extend({
      template: _.template($("#issue-list-template").html()),
      tag: "div",
      className: "",

      initialize: function() {
        _.bindAll(this, 'render',
                        'renderIssue',
                        'selectCurrentIssue');

        this.collection.bind("reset", this.render);
        this.collection.bind("selectCurrentIssue", this.selectCurrentIssue);
      },

      render: function() {
        $(".issue.list").html(this.el);
        this.collection.each(this.renderIssue);

        return this;
      },

      renderIssue: function(issue) {
        var view = new IssueListEntryView({
          model: issue,
          collection: this.collection
        });
        $(this.el).append(view.render().el);
      },

      selectCurrentIssue: function(issue_id) {
        this.$(".entry").each(function(index, el) {
          $(el).toggleClass("selected", $(el).data("id") == issue_id);
        });
      }
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
        $(".issue.list").empty();
        this.issueListView.render();
      },

      issues: function(issue_id) {
        issue = new Issue({id: issue_id});
        issue.fetch({success: function(model) {
          this.issueView = new IssueView({
            model: model
          });

          $(".span11").html(this.issueView.render().el);
        }});
      }
    });

    window.App = new Eda();
    Backbone.history.start({pushState: true});

  });
})(jQuery);
