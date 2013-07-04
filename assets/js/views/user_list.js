var UserView = Backbone.View.extend({
  initialize: function(user) {
    this.user = user;
  },

  className: 'userlist_user',

  render: function() {
    $(this.el).html(ich.userlist_user(this.user.model.attributes));
    return this;
  },

  addToIdle: function() {
    var idleTime = this.user.model.get('idle') + 1;
    if (idleTime > 60) {
      this.user.model.set({activity: '', user_status: 'idle'});
      clearInterval(this.intervalTimer);
    } else {
      this.user.model.set({
        activity: '(' + idleTime + 'm)',
        idle: idleTime,
        user_status: 'active'
      });
      if(this.intervalTimer === undefined) {
        this.setStatus();
      }
    }
    this.render();
  },

  setStatus: function() {
    // One-minute delays
    var self = this;
    var interval = 60 * 1000;
    this.intervalTimer = setInterval(function() { self.addToIdle() }, interval);
  }
});


var UserListView = Backbone.View.extend({
  initialize: function() {
    this._element = this.collection.channel.view.$('#user-list');
    this.setElement(this._element);
    angular.bootstrap(this._element);
    this.collection.bind('add', this.add, this);
  },

  render: function() {
    return this;
  },

  add: function(User) {
    $scope = angular.element(this._element).scope();
    if (!$scope.users)
      $scope.users = [];
    $scope.users.push(User.attributes);
    $scope.$digest();
  }
});
