[![NPM version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Dependency Status][gemnasium-image]][gemnasium-url]

# dumpdesk

Dump/backup cases from desk.com to mongo DB

## Install

```sh
$ npm install --global dumpdesk
```

## Usage

```
dumpdesk [options]

Options:
  --config    Path to JSON config file
  --user      desk.com username                                       [required]
  --password  desk.com password                                       [required]
  --host      <yoursite>.desk.com                                     [required]
  --database                     [default: "mongodb://localhost:27017/desk_com"]

```

## License

MIT © [Damian Krzeminski](https://code42day.com)

[npm-image]: https://img.shields.io/npm/v/dumpdesk.svg
[npm-url]: https://npmjs.org/package/dumpdesk

[travis-url]: https://travis-ci.org/code42day/dumpdesk
[travis-image]: https://img.shields.io/travis/code42day/dumpdesk.svg

[gemnasium-image]: https://img.shields.io/gemnasium/code42day/dumpdesk.svg
[gemnasium-url]: https://gemnasium.com/code42day/dumpdesk
