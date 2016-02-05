var gulp = require('gulp');
var http = require('http');
var fs = require('fs');
var process = require('process');
var runSequence = require('run-sequence');
var gutil = require('gulp-util');

var project = require('../package.json');
var paths = require('../build.config.js');
var environment = require('./environment.js');
var aws_config = JSON.parse(fs.readFileSync((process.env.HOME || process.env.USERPROFILE) + '/.aws/jw-webserver-rw.credentials'));

var s3 = require('gulp-s3-upload')(aws_config);


gulp.task('upload', function(cb) {
	return gulp.src(paths.compile_dir + project.name + '-*')
		.pipe(s3({
			Bucket: 'jw-static-assets',
			uploadNewFilesOnly: true,
			keyTransform: (relative_filename) => {
				// add the files into the right directories
				return `${project.name}/docroot/${relative_filename}`;
			}
		}));
});

/**
 * sets the webapp version to the current version, defined in package.json.
 * `dev` or `prod` task indicates which webapi to change. default `dev`.
 * 
 * usage: gulp dev setversion
 */
gulp.task('setversion', function(cb) {
	var post_req = http.request({
		host: (environment.getTarget() === 'prod') ? paths.deploy.api.prod : paths.deploy.api.stage,
		port: paths.deploy.port,
		path: '/manage/version/' + project.version,
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json'
		}
	}, function(res) {
		
		const index_req = http.request({
			host: (environment.getTarget() === 'prod') ? paths.deploy.api.prod : paths.deploy.api.stage,
			port: paths.deploy.port,
			path: '/manage/reload',
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			}
		}, function(resp) {
			cb();
			gutil.log(gutil.colors.green('[CURRENT VERSION]:', project.version));
		});
		index_req.write('');
		index_req.end();
	});
	
	post_req.write('');
	post_req.end();
});

gulp.task('release', (cb) => runSequence(['upload'], ['setversion']));