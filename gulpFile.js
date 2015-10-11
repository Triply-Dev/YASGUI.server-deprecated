var gulp = require('gulp'),
    git = require('gulp-git'),
    bump = require('gulp-bump'),
    tag_version = require('gulp-tag-version'),
    nodemon = require('gulp-nodemon'),
  	runSequence = require('run-sequence').use(gulp),
  	spawn = require('child_process').spawn;

var srcDir = './src';
var yasguiDir = './node_modules/yasgui';

function inc(importance) {
    // get all the files to bump version in
    return gulp.src(['./package.json', './bower.json'])
        // bump the version number in those files
        .pipe(bump({type: importance}))
        // save it back to filesystem
        .pipe(gulp.dest('./'));
}

gulp.task('publish', function (done) {
  spawn('npm', ['publish'], { stdio: 'inherit' }).on('close', done);
});

gulp.task('push', function (done) {
  git.push('origin', 'master', {args: " --tags"}, function (err) {
    if (err) throw err;
  });
});


gulp.task('tag', function() {
	return gulp.src(['./package.json'])
    .pipe(git.commit('version bump'))
	.pipe(tag_version());
});


gulp.task('bumpPatch', function() { return inc('patch'); })
gulp.task('bumpMinor', function() { return inc('minor'); })
gulp.task('bumpMajor', function() { return inc('major'); })

gulp.task('patch', function() {
	runSequence('bumpPatch', 'tag', 'publish', 'push');
});
gulp.task('minor', function() {
	runSequence('bumpMinor', 'tag', 'publish', 'push');
});
gulp.task('major', function() {
	runSequence('bumpMajor', 'tag', 'publish', 'push');
});


gulp.task('serve', function() {
	process.env.yasguiDev = 1;
	nodemon({ script: './src/index.js', watch: './src' })
});

gulp.task('default', function() {
  require('./src/index');
});
