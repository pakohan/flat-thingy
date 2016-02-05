/**
 * environment.js is used for saving states accross tasks and task files.
 */

var gulp = require('gulp');


var env = 'web';
var target = 'dev';


gulp.task('web', function(cb) {
	env = 'web';
	cb();
});

gulp.task('mobile', function(cb) {
	env = 'mobile';
	cb();
})

gulp.task('dev', function(cb) {
	target = 'dev';
	cb();
});

gulp.task('prod', function(cb) {
	target = 'prod';
	cb();
});


function setEnv(value) {
	env = value;
}

function getEnv() {
	return env;
}

function setTarget(value) {
	target = value;
}

function getTarget() {
	return target;
}

module.exports = {
	setEnv,
	getEnv,
	setTarget,
	getTarget
};