var request = require('superagent');
var async = require('async');
var rateLimit = require('rate-limit');
var debug = require('debug')('dumpdesk');

module.exports = dumpdesk;


// 60 per second is the default rate limit for desk.com API
var queue = rateLimit.createQueue({ interval: 1001 });

function api(path, opts, fn) {
  if (!path.startsWith('/api/v2/')) {
    path = '/api/v2/' + path;
  }
  request
    .get('https://' + opts.host + path)
    .set('Accept', 'application/json')
    .auth(opts.user, opts.password)
    .query({
      page: opts.page,
      per_page: 100
    })
    .end(function(err, res) {
      fn(err, res.body);
    });
}

function slowApi() {
  var a = arguments;
  queue.add(function() {
    api.apply(null, a);
  });
}

function iterate(url, opts, fnOnItem, fn) {
  var page = 1;

  async.doUntil(function(fn) {
    slowApi(url, {
      page: page,
      host: opts.host,
      user: opts.user,
      password: opts.password,
    }, function(err, r) {
      if (err) { return fn(err); }
      var next = r._links.next;
      debug('Next is %j', next);
      debug('Fetched %d items.', r._embedded.entries.length);
      page += 1;
      async.each(r._embedded.entries, fnOnItem, function(err) {
        fn(err, next);
      });
    });
  }, function(next) {
    return !next;
  }, fn);
}

function save(collection, item, fn) {
  item._id = item.id;
  delete item.id;
  collection.save(item, fn);
}


function fetchEmbedded(opts, type, item, fn) {
  var link = item._links[type];
  if (!link || !link.count) {
    return async.nextTick(fn);
  }
  item._embedded = item._embedded || {};
  debug('Fetching %d %s', link.count, type);
  var fetched = item._embedded[type] = [];
  iterate(link.href, opts, function(thing, fn) {
    fetched.push(thing);
    fn();
  }, function(err) {
    fn(err, item);
  });
}

function dumpdesk(opts, fn) {

  async.series([
    function(fn) {
      var customers = opts.db.collection({ name: 'customers' });

      iterate('customers', opts, save.bind(null, customers), function(err) {
        customers.close();
        console.error('Finished customers...');
        fn(err);
      });
    },
    function(fn) {
      var cases = opts.db.collection({ name: 'cases' });

      iterate('cases', opts, function(item, fn) {
        async.series([
          async.apply(fetchEmbedded, opts, 'labels', item),
          async.apply(fetchEmbedded, opts, 'notes', item),
          async.apply(fetchEmbedded, opts, 'replies', item),
          async.apply(save, cases, item)
        ], fn);

      }, function(err) {
        cases.close();
        console.error('Finished cases...');
        fn(err);
      });
    }

  ], fn);

}
