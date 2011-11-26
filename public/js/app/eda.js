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

  window.IssueTypes = Backbone.Model.extend({
    defaults: {
      "new_count": 0,
      "in_progress_count": 0,
      "waiting_count": 0,
      "done_count": 0
    },

    initialize: function() {
      _.bindAll(this, "updateCounts");

      newIssues.bind("add", this.updateCounts);
      newIssues.bind("remove", this.updateCounts);
      newIssues.bind("reset", this.updateCounts);
    },

    updateCounts: function() {
      this.set({"new_count": newIssues.size()});
    }
  });

  $(function() {

    window.IssueTypesView = Backbone.View.extend({
      template: _.template($("#issue-types-template").html()),
      tag: "ul",
      className: "pills",

      initialize: function() {
        _.bindAll(this, "render");

        this.model.bind("change", this.render);
      },

      render: function() {
        $("#issues_type_navigation").html(this.el);
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
      }
    });

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

    window.newIssues = new Issues();
    window.issueTypes = new IssueTypes();

    window.Eda = Backbone.Router.extend({

      routes: {
        '': 'home',
        'issues/:id' : 'issues'
      },

      initialize: function() {
        var self = this;
        self.issueListView = new IssueListView({collection: newIssues});
        self.issueTypesView = new IssueTypesView({model: issueTypes});

        (new Issues()).fetch({success: function(data) {
          newIssues.reset(data.models);
          self.issueListView = new IssueListView({
            collection: newIssues
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
