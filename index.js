var dumpdesk = require('./lib/dumpdesk');

var argv = require('yargs')
  .usage('$0 [options]')
  .env('DUMPDESK')
  .config()
  .describe('user', 'desk.com username')
  .describe('password', 'desk.com password')
  .describe('host', '<yoursite>.desk.com')
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
