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
      .then(function (resource) {
        context.resource = resource;
      })
      .then(function () { 
        controller.updater.call(context, context.resource); 
      })
      .then(function () {
        controller.writer.call(context, context.resource);
      })
      .then(function () {
        controller.responder.call(context, context.resource);
      })
      .catch(next);  
  };

  this.read = function (request, response, next) {
    var context = new Context(request, response, 'read');
    return Promise.resolve()
      .then(controller.reader.bind(context))
      .then(function (resource) {
        context.resource = resource;
      })
      .then(function () {
        controller.responder.call(context, context.resource);
      })
      .catch(next);
  };

  this.update = function (request, response, next) {
    var context = new Context(request, response, 'update');
    return Promise.resolve()
      .then(controller.reader.bind(context))
      .then(function (resource) {
        context.resource = resource;
      })
      .then(function () { 
        controller.updater.call(context, context.resource);
      })
      .then(function () {
        controller.writer.call(context, context.resource);
      })
      .then(function () {
        controller.responder.call(context, context.resource);
      })
      .catch(next);
  };

  this.delete = function (request, reponse, next) {
    var context = new Context(request, response, 'delete');
    return Promise.resolve()
      .then(controller.reader.bind(context))
      .then(function (resource) {
        context.resource = resource; 
      })
      .then(function () {
        controller.deleter.call(context, context.resource);
      })
      .then(controller.responder.bind(context))
      .catch(next);    
  };

};

Controller.prototype.responder = function (resource) {
  if (this.action === 'create') {
    this.response.status(201);
  } else {
    this.response.status(200);
  }
  if (this.action === 'delete') {
    this.response.send();
  } else {
    this.response.send(resource);
  }
};

Controller.prototype.creator = function () {};
Controller.prototype.updater = function () {};
Controller.prototype.reader = function () {};
Controller.prototype.writer = function () {};
Controller.prototype.deleter = function () {};

module.exports.Controller = Controller;
