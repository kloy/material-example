var gulp = require('gulp');
var exec = require('exec');
var runSequence = require('run-sequence');
var connect = require('gulp-connect');

function createExecCallback (cb) {

  return function (err, out) {

    process.stderr.write(err);
    process.stdout.write(out);

    if (err instanceof Error) {
      cb(err);
    } else {
      cb();
    }
  };
}

gulp.task('material-bower', function (cb) {

  exec(
    ['bower', 'install'],
    {
      cwd: './bower_components/angular-material-internal'
    },
    createExecCallback(cb)
  );
});

gulp.task('material-npm', function (cb) {

  exec(
    ['npm', 'install'],
    {
      cwd: './bower_components/angular-material-internal'
    },
    createExecCallback(cb)
  );
});

gulp.task('material-setup', ['material-bower', 'material-npm']);

gulp.task('material-themes', ['material-setup'], function (cb) {

  exec(
    ['gulp', 'build-themes'],
    {
      cwd: './bower_components/angular-material-internal'
    },
    createExecCallback(cb)
  );
});

gulp.task('themes', function (cb) {

  gulp.src('themes/*').
    pipe(gulp.dest('bower_components/angular-material-internal/themes')).
    on('end', function () {

      runSequence('material-themes', function () {
        cb();
      });
    });
});

gulp.task('serve', function () {

  connect.server({
    port: 8088
  });
});

gulp.task('default', ['themes', 'serve']);
