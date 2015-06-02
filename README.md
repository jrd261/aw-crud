# Aw, Crud!

Kitchy, yes. Useful, yes.

## Example

```javascript

// Example with Mongoose models.

var MyModel = require('./MyModel');
var Controller = require('aw-crud').Controller;

var controller = new Controller({option1: true);

// Specify how to retrieve a resource.
controller.reader = function () {
  return MyModel.find(this.request.body.myResourceId).then(function (myDoc) {
    if (!myDoc) throw new Error('dagnabit.');
  });
};

// Specify how to create the resource.
controller.creator = function () {
  return MyModel.create();
};

// Specify how to update the resource.
controller.updater = function (resource) {
  resource.unsanitizedParameter = req.body.xss_attack;
};

// Specify how to save the resource.
controller.writer = function (resource) {
  return resource.save();
};

// Delete?
controller.deleter = function (resource) {
  return resource.remove();
};

// You can override the way a response is created.
controller.responder = function (resource) {
  if (this.action === 'delete' && this.options.option1) {
    console.log('Hey. Someone deleted something and option1 is truthy.');   
  } 
  this.response.status(223); // Because you feel like making up new status codes.
  this.response.send(resource); 
};



app.post('/my-resources', controller.create);
app.get('/my-resource/:myResourceId', controller.read);
app.post('/my-resource/:myResourceId', controller.update);
app.del('/my-resource/:myResourceId', controller.delete);


```



