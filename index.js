'use strict';

var Controller = function (options) {

  var controller = this;

  var Context = function (request, response, action) {
    this.request = request;
    this.response = response;
    this.action = action;
    this.options = options;
  };

  this.create = function (request, response, next) {
    var context = new Context(request, response, 'create');
    return Promise.resolve()
      .then(controller.creator.bind(context))
      .then(function (resource) { context.resource = resource; })
      .then(controller.updater.bind(context, context.resource))
      .then(controller.writer.bind(context, context.resource))
      .then(controller.responder.bind(context, context.resource))
      .catch(next);  
  };

  this.read = function (request, response, next) {
    var context = new Context(request, response, 'read');
    return Promise.resolve()
      .then(controller.reader.bind(context))
      .then(function (resource) { context.resource = resource; })
      .then(controller.responder.bind(context, context.resource))
      .catch(next);
  };

  this.update = function (request, response, next) {
    var context = new Context(request, response, 'update');
    return Promise.resolve()
      .then(controller.reader.bind(context))
      .then(function (resource) { context.resource = resource; })
      .then(controller.updater.bind(context, context.resource))
      .then(controller.writer.bind(context, context.resource))
      .then(controller.responder.bind(context, context.resource))
      .catch(next);
  };

  this.delete = function (request, reponse, next) {
    var context = new Context(request, response, 'delete');
    return Promise.resolve()
      .then(controller.reader.bind(context))
      .then(function (resource) { context.resource = resource; })
      .then(controller.deleter.bind(context, context.resource))
      .then(controller.responder.bind(context))
      .catch(next);    
  };

};

Controller.prototype.responder = function (resource) {
  if (this.action === 'create') {
    this.response.send(201, resource);
  } else {
    this.response.send(200, resource);
  }
};

Controller.prototype.creator = function () {};
Controller.prototype.updater = function () {};
Controller.prototype.reader = function () {};
Controller.prototype.writer = function () {};
Controller.prototype.deleter = function () {};

module.exports = Controller;
