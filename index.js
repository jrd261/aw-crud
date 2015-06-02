'use strict';

var Controller = function (options) {

  var controller = this;

  var Context = function (request, response, action) {
    this.request = request;
    this.response = response;
    this.action = action;
    this.options = options;
  };

  this.prehook = function () {};

  this.create = function (request, response, next) {
    var context = new Context(request, response, 'create');
    return Promise.resolve()
      .then(controller.prehook.bind(context))
      .then(controller.creator.bind(context))
      .then(function (resource) { context.resource = resource; })
      .then(controller.updater.bind(context)) 
      .then(controller.writer.bind(context))
      .then(controller.responder.bind(context))
      .catch(next);  
  };

  this.read = function (request, response, next) {
    var context = new Context(request, response, 'read');
    return Promise.resolve()
      .then(controller.prehook.bind(context))
      .then(controller.reader.bind(context))
      .then(function (resource) { context.resource = resource; })
      .then(controller.responder.bind(context))
      .catch(next);
  };

  this.update = function (request, response, next) {
    var context = new Context(request, response, 'update');
    return Promise.resolve()
      .then(controller.prehook.bind(context))
      .then(controller.reader.bind(context))
      .then(function (resource) { context.resource = resource; })
      .then(controller.updater.bind(context))
      .then(controller.writer.bind(context))
      .then(controller.responder.bind(context))
      .catch(next);
  };

  this.delete = function (request, response, next) {
    var context = new Context(request, response, 'delete');
    return Promise.resolve()
      .then(controller.prehook.bind(context))
      .then(controller.reader.bind(context))
      .then(function (resource) { context.resource = resource; })
      .then(controller.deleter.bind(context))
      .then(controller.responder.bind(context))
      .catch(next);    
  };

  this.list = function (request, response, next) {
    var context = new Context(request, response, 'list');
    return Promise.resolve()
      .then(controller.prehook.bind(context))
      .then(controller.lister.bind(context))
      .then(function (resource) { context.resource = resource; })
      .then(controller.responder.bind(context))
      .catch(next);
  };

};

Controller.prototype.responder = function () {
  if (this.action === 'create') {
    this.response.status(201);
  } else {
    this.response.status(200);
  }
  if (this.action === 'delete') {
    this.response.send();
  } else {
    this.response.send(this.resource);
  }
};

Controller.prototype.creator = function () {};
Controller.prototype.updater = function () {};
Controller.prototype.reader = function () {};
Controller.prototype.writer = function () {};
Controller.prototype.deleter = function () {};
Controller.prototype.lister = function () {};

module.exports.Controller = Controller;
