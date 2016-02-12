module.exports = {

	build_dir: 'build_jw/',
	compile_dir: 'compile_jw/',

	web: {
		js: [
			'src/app/*.js',
			'src/app/**/*.js',
			'!src/**/*.spec.js',
			'!src/assets/**/*.js'
		],
		jsunit: ['src/**/*.spec.js'],
		atpl: [
			'src/app/**/*.tpl.html',
			'!src/app/platform/mobile/**/*.tpl.html'
		],
		less: 'src/less/app.less',
		sass: '',
		assets: ''
	},

	index: 'src/index.html',
	less_files: 'src/**/*.less',
	assets: 'src/assets/**',
	components: [],

	vendor: {
		js: [
			'node_modules/angular/angular.js',
			'node_modules/angular-animate/angular-animate.js',
			'node_modules/angular-resource/angular-resource.min.js',
			'node_modules/angular-sanitize/angular-sanitize.js',
			'node_modules/angular-scroll/angular-scroll.min.js',
			'node_modules/angular-toarrayfilter/toArrayFilter.js',
			'node_modules/angular-translate/dist/angular-translate.js',
			'node_modules/angular-ui-router/release/angular-ui-router.js',
			'node_modules/fastclick/lib/fastclick.js',
			'node_modules/angular-aria/angular-aria.js',
			'node_modules/angular-material/angular-material.js',
			'node_modules/angular-cookies/angular-cookies.js',
			'node_modules/query-string/index.js',
			'node_modules/angular-oauth2/dist/angular-oauth2.js'
		],
		assets: [
			'node_modules/bootstrap/fonts/glyphicons-halflings-regular.eot',
			'node_modules/bootstrap/fonts/glyphicons-halflings-regular.svg',
			'node_modules/bootstrap/fonts/glyphicons-halflings-regular.ttf',
			'node_modules/bootstrap/fonts/glyphicons-halflings-regular.woff',
			'node_modules/bootstrap/fonts/glyphicons-halflings-regular.woff2'
		],
		css: []
	},

	/**
	* needs to be adjusted to every project.
	*
	* examples:
	* 		api.stage: 'push-api.internal.moviecycle.com'
	* 		api.prod: 'push-api.internal.justwatch.com'
	* 		port: 8103
	*/
	deploy: {
		api: {
			stage: 'xxx.internal.moviecycle.com',
			prod: 'xxx.internal.justwatch.com'
		},
		port: 3000
		// bucket: 'mc-static-assets',		// leave empty for default 'jw-static-assets'
		// path: 'compile_jw/assets'		// leave empty for default '{project-name}/docroot'
	}
};
