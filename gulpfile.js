var gulp = require('gulp');
var project = require('./package.json')
var plugins = require('gulp-load-plugins')();
var del = require('del');
var globby = require('globby');
var runSequence = require('run-sequence');
var merge = require('merge-stream');
var es = require('event-stream');
var exec = require('child_process').exec;
var browserSync = require('browser-sync').create();
var history = require('connect-history-api-fallback');

require('./gulp-tasks/deploy.js');
require('./gulp-tasks/environment.js');

var project = require('./package.json')
var paths = require('./build.config.js');
var environment = require('./gulp-tasks/environment.js');


function getPreprocessContext() {
	return {
		context: {
			ENV: environment.getEnv(),
			VERSION: project.version,
			TARGET: environment.getTarget()
		}
	};
}

function getTemplateProperties(dir) {

	var result = {
		styles: [],
		scripts: []
	};

	var vendorScripts = [];
	var scripts = [];

	var globs = {};

	globs[paths.build_dir] = [
		'components/**/*.mainmodule.js',
		'components/**/*.module.js',
		'components/**/*.js',
		'src/app.js',
		'src/**/*.js',
		'!vendor/*.js'
	];
	globs[paths.compile_dir] = ['*.js'];


	if (dir == paths.build_dir) {
		var vendors = paths.vendor.js;
		vendorScripts = vendors.map(function(item) {
			return 'vendor' + item.substring(item.lastIndexOf('/'));
		});
	}

	scripts = globby.sync(globs[dir], {cwd: dir});

	scripts = scripts.map(function(item) {
		return item.replace(dir, '');
	});
	result.scripts = [].concat(vendorScripts, scripts);

	// styles
	result.styles = globby.sync('**/*.css', {cwd: dir});
	result.styles = result.styles.map(function(item) {
		return item.replace('build_jw/', '');
	});

	return result;
}

function filterJs(files) {
	return files.filter(function(file) {
		return file.match(/\.js$/);
	});
}

function filterCss(files) {
	return files.filter(function(file) {
		return file.match(/\.css$/);
	});
}



gulp.task('clean', function() {
  return del([paths.build_dir, paths.compile_dir]);
});

gulp.task('lint', function() {
	return gulp.src(paths.components.concat(paths[environment.getEnv()].js))
		.pipe(plugins.cached('linting'))
		// .pipe(plugins.changed(paths.build_dir))
		.pipe(plugins.jshint())
		.pipe(plugins.jshint.reporter('jshint-stylish'))
		.pipe(plugins.jshint.reporter('fail'));
});

gulp.task('scripts', ['lint'], function() {
	var streams = {};
	streams.js = gulp.src(paths[environment.getEnv()].js)
		.pipe(plugins.cached('scripts'))
		.pipe(plugins.preprocess(getPreprocessContext()))
		.pipe(plugins.babel())
		.pipe(gulp.dest(paths.build_dir + 'src'));

	streams.components = gulp.src(paths.components)
		.pipe(plugins.cached('components'))
		.pipe(plugins.babel())
		.pipe(gulp.dest(paths.build_dir + 'components'));

	return merge(streams.js, streams.components);
});

gulp.task('compile-scripts', function() {
	var src = paths.vendor.js.concat([
		paths.build_dir + 'src/app.js',
		paths.build_dir + 'src/**/*.js'
	]);
	return gulp.src(src)
		.pipe(plugins.concat(project.name + '-' + project.version + '.js'))
		.pipe(plugins.ngAnnotate())
		.pipe(plugins.uglify())
		.pipe(gulp.dest(paths.compile_dir));
});

// TODO gylphicons need to be on root - should be on S3 anyway
gulp.task('compile-assets', function() {
	return gulp.src(paths.vendor.assets.concat(paths.assets))
		.pipe(gulp.dest(paths.compile_dir + 'assets/'));
});

gulp.task('styles', [], function() {
	var streams = {};

	streams.less = gulp.src(paths[environment.getEnv()].less)
		.pipe(plugins.preprocess(getPreprocessContext()))
		.pipe(plugins.less())
		.pipe(plugins.concat(project.name + '-' + project.version + '.css'))
		.pipe(plugins.autoprefixer(['> 1%','last 3 versions']))
		// .pipe(plugins.purifycss(paths[environment.getEnv()].js.concat(paths[environment.getEnv()].atpl))) // not fully working
		.pipe(gulp.dest(paths.build_dir));

	streams.sass = gulp.src(paths[environment.getEnv()].sass)
		.pipe(plugins.sass())
		.pipe(gulp.dest(paths.build_dir));

	return merge(streams.less, streams.sass);
});

gulp.task('compile-styles', function() {
	return gulp.src(paths.build_dir + '*.css')
		.pipe(plugins.minifyCss({
			processImport: false
		}))
		.pipe(gulp.dest(paths.compile_dir));
});

gulp.task('changelog', function() {
	return gulp.src('CHANGELOG.md')
		.pipe(plugins.conventionalChangelog({
			context: 'changelog.tpl',
			preset: 'angular',
			verbose: true

		}))
		.pipe(gulp.dest('./'));
});

gulp.task('html', [], function() {
	return gulp.src(paths[environment.getEnv()].atpl)
		.pipe(plugins.preprocess(getPreprocessContext()))
		.pipe(plugins.minifyHtml({
			spare: true,            // do not remove redundant attributes
			quotes: true,
			empty: true,            // do not remove empty attributes
			comments: false,
			loose: false            // preserve one whitespace
		}))
		.pipe(plugins.ngHtml2js({
			moduleName: 'templates-app',
			prefix: ''
		}))
		.pipe(plugins.concat('templates-app.js'))
		.pipe(gulp.dest(paths.build_dir + 'src'));
});

gulp.task('index', ['styles', 'scripts', 'html', 'vendor'], function() {
	return gulp.src(paths.index)
		.pipe(plugins.preprocess(getPreprocessContext()))
		.pipe(plugins.template(getTemplateProperties(paths.build_dir)))
		.pipe(gulp.dest(paths.build_dir));
});

gulp.task('compile-index', ['compile-scripts', 'compile-styles'], function() {
	return gulp.src(paths.index)
		.pipe(plugins.preprocess(getPreprocessContext()))
		.pipe(plugins.template(getTemplateProperties(paths.compile_dir)))
		.pipe(gulp.dest(paths.compile_dir));
});

gulp.task('vendor', function() {
	var src = paths.vendor.js;

	return gulp.src(src)
		.pipe(gulp.dest(paths.build_dir + 'vendor'));
});

gulp.task('assets', function() {
	var assets = paths.vendor.assets.concat(paths.assets, paths[environment.getEnv()].assets);
	return gulp.src(assets)
		.pipe(plugins.cached('assets'))
		.pipe(gulp.dest(paths.build_dir + 'assets/'));
});

gulp.task('watch', ['default'], function(cb) {
	gulp.watch(paths[environment.getEnv()].js, ['_watch-scripts']);
	gulp.watch(paths.vendor.assets.concat(paths.assets), ['_watch-assets']);
	gulp.watch(paths.index, ['_watch-index']);
	gulp.watch(paths[environment.getEnv()].atpl, ['_watch-html']);
	gulp.watch(paths.less_files, ['_watch-styles']);
	gulp.watch(paths[environment.getEnv()].jsunit, ['test']);

	// vendor -> restart
	// gulpfile -> restart

	if (environment.getEnv() == 'web') {
		browserSync.init({
			server: {
				baseDir: paths.build_dir,
				middleware: [ history() ]
			}
		});
	}

	cb();
});

gulp.task('_watch-scripts', function(cb) {
	return runSequence(['lint', 'scripts'], ['_browser-reload'], cb);
});

gulp.task('_watch-assets', function(cb) {
	return runSequence(['assets'], ['_browser-reload'], cb);
});

gulp.task('_watch-index', function(cb) {
	return runSequence(['index'], ['_browser-reload'], cb);
});

gulp.task('_watch-html', function(cb) {
	return runSequence(['html'], ['_browser-reload'], cb);
});

gulp.task('_watch-styles', function(cb) {
	return runSequence(['styles'], ['_browser-reload'], cb);
});

gulp.task('_browser-reload', function(cb) {
	browserSync.reload();
	cb();
});


gulp.task('default', function(cb) {
	return runSequence(
		['clean'],
		['scripts', 'styles', 'html', 'vendor', 'assets', 'index'],
		cb // tell gulp task has ended
	);
});
gulp.task('build', ['default']);

gulp.task('compile', function(cb) {
	return runSequence(
		['prod'],
		['default'],
		['compile-scripts', 'compile-styles', 'compile-assets', 'compile-index'],
		cb // tell gulp task has ended
	);
});
