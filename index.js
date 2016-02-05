'use strict';
var gutil = require('gulp-util');
var through = require('through2');
var pkg = require('./package.json');

var mqpacker = require('css-mqpacker');
// var gcmq = require('group-css-media-queries');

module.exports = function (opts) {

  opts = opts || { map: false };

  return through.obj(function (file, enc, cb) {
    if (file.isNull()) {
      cb(null, file);
      return;
    }

    if (file.isStream()) {
      cb(new gutil.PluginError(pkg.name, 'Streaming not supported'));
      return;
    }

    try {
      if (opts.ext) {
        file.path = gutil.replaceExtension(file.path, opts.ext);
      }

      if (file.sourceMap) {
        opts.map = { annotation: false };
      }

      file.contents = new Buffer(mqpacker.pack(file.contents.toString(), opts).css);
      // file.contents = new Buffer(gcmq(file.contents.toString()));
      this.push(file);
    } catch (err) {
      this.emit('error', new gutil.PluginError(pkg.name, err));
    }

    cb();
  });
};
