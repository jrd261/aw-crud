'use strict';
/* jshint node: true, esnext: true*/

const Ctl = function () {

  const ctl = this;

  const Ctx = function (req, res, act) {
    this.req = req;
    this.res = res;
    this.act = act;
    this.rsc = null;
  };

  this.prehook = () => {};
  this.posthook = () => {};
  this.creator = () => {};
  this.updater = () => {};
  this.reader = () => {};
  this.writer = () => {};
  this.deleter = () => {};
  this.lister = () => {};
  this.responder = (ctx, rsc) => {
    if (ctx.act === 'create') {
      ctx.res.status(201);
    } else {
      ctx.res.status(200);
    }
    if (ctx.act === 'delete') {
      ctx.res.send();
    } else {
      ctx.res.send(rsc);
    }
  };

  this.create = (req, res, next, ctx) => Promise.resolve()
    .then(() => ctx = new Ctx(req, res, 'create'))
    .then(() => ctl.prehook(ctx))
    .then(() => ctl.creator(ctx))
    .then(rsc => ctx.rsc = rsc)
    .then(() => ctl.updater(ctx, ctx.rsc)) 
    .then(() => ctl.writer(ctx, ctx.rsc))  
    .then(() => ctl.responder(ctx, ctx.rsc))
    .then(() => ctl.posthook(ctx))
    .catch(next);  

  this.read = (req, res, next, ctx) => Promise.resolve()
    .then(() => ctx = new Ctx(req, res, 'read'))
    .then(() => ctl.prehook(ctx))
    .then(() => ctl.reader(ctx))
    .then(rsc => ctx.rsc = rsc)
    .then(() => ctl.responder(ctx, ctx.rsc))
    .then(() => ctl.posthook(ctx))
    .catch(next);

  this.update = (req, res, next, ctx) => Promise.resolve()
    .then(() => ctx = new Ctx(req, res, 'read'))
    .then(() => ctl.prehook(ctx))
    .then(() => ctl.reader(ctx))
    .then(rsc => ctx.rsc = rsc)
    .then(() => ctl.updater(ctx, ctx.rsc))
    .then(() => ctl.responder(ctx, ctx.rsc))
    .then(() => ctl.posthook(ctx))
    .catch(next);

  this.delete = (req, res, next, ctx) => Promise.resolve() 
    .then(() => ctx = new Ctx(req, res, 'read'))
    .then(() => ctl.prehook(ctx))
    .then(() => ctl.reader(ctx))
    .then(rsc => ctx.rsc = rsc)
    .then(() => ctl.deleter(ctx, ctx.rsc))
    .then(() => ctl.responder(ctx, ctx.rsc))
    .then(() => ctl.posthook(ctx))
    .catch(next);

  this.list = (req, res, next, ctx) => Promise.resolve() 
    .then(() => ctx = new Ctx(req, res, 'list'))
    .then(() => ctl.prehook(ctx))
    .then(() => ctl.lister(ctx))
    .then(collection => ctx.rsc = collection)
    .then(() => ctl.responder(ctx, ctx.rsc))
    .then(() => ctl.posthook(ctx))
    .catch(next);

};

module.exports = () => new Ctl();
