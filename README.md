# Aw, Crud!

Kitchy, yes. Useful, yes.

## Example

```javascript

// Example with Mongoose models.

var MyModel = require('./MyModel');
var ctl = require('aw-crud')();

// Specify how to retrieve a resource.
ctl.reader = function (ctx) {
  return MyModel.find(ctx.req.body.myResourceId).then(function (myDoc) {
    if (!myDoc) throw new Error('dagnabit.');
    return myDoc;
  });
};

// Specify how to create the resource.
ctl.creator = function () {
  return new MyModel();
};

// Specify how to update the resource.
ctl.updater = function (ctx, rsc) {
  rsc.unsanitizedParameter = ctx.req.body.xss_attack;
};

// Specify how to save the resource.
ctl.writer = function (ctx, rsc) {
  return rsc.save();
};

// Specify how to delete a resource.
ctl.deleter = function (ctx, rsc) {
  return rsc.remove();
};

// Specify how to get collection
ctl.list = function (ctx) {
  return MyModel.find().then(function (col) {
    return {results: col};
  });
};

// You can override the way a response is created.
ctl.responder = function (ctx, rsc) {
  if (ctx.act === 'delete') {
    console.log('Deleted!');
  } 
  ctx.res.status(223); // Because you feel like making up new status codes.
  ctx.res.send(rsc); 
};


// Assume express app is in scope.
app.post('/my-resources', ctl.create);
app.get('/my-resource/:myResourceId', ctl.read);
app.post('/my-resource/:myResourceId', ctl.update);
app.del('/my-resource/:myResourceId', ctl.delete);
app.get('/my-resource', ctl.list);


```



