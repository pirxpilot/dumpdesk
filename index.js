var dumpdesk = require('./lib/dumpdesk');

var argv = require('yargs')
  .demand('user')
  .demand('password')
  .demand('host')
  .default({
    database: 'mongodb://localhost:27017/desk_com'
  })
  .argv;

argv.db = require('mniam').db(argv.database);

dumpdesk(argv, function(err) {
  if (err) {
    console.err('Error: %s', err);
  }
});
