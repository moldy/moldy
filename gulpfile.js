var gulp = require( 'gulp' ),
	browserify = require( 'gulp-browserify' ),
	cluster = require( 'cluster' ),
	rename = require( 'gulp-rename' ),
	shell = require( 'gulp-shell' ),
	uglify = require( 'gulp-uglify' ),
	worker;

gulp.task( 'compressScripts', [ 'scripts' ], function () {
	return gulp.src( [ './dist/sgModel.js' ] )
		.pipe( uglify() )
		.pipe( rename( 'sgModel.min.js' ) )
		.pipe( gulp.dest( './dist/' ) );
} );

gulp.task( 'server', function () {
	cluster.setupMaster( {
		exec: "./server.js"
	} );
	if ( worker ) worker.kill();
	worker = cluster.fork();
} );

gulp.task( 'scriptSrc', function () {
	return gulp.src( [ './src/index.js' ] )
		.pipe( browserify( {
			debug: true,
			standalone: 'sgModel'
		} ) )
		.pipe( rename( 'sgModel.js' ) )
		.pipe( gulp.dest( './dist/' ) );
} );

gulp.task( 'test', function () {
	return gulp.src( '' ).pipe( shell( [ 'npm test' ] ) );
} );

gulp.task( 'watch', function () {
	gulp.watch( [ './src/**/*.js' ], [ 'scripts', 'test', 'compress' ] );
	gulp.watch( [ './test/**/*' ], [ 'test' ] );
	gulp.watch( [ '*.js' ], [ 'default' ] );
} );

gulp.task( 'default', [ 'build', 'test', 'compress' ] );
gulp.task( 'build', [ 'scripts' ] );
gulp.task( 'compress', [ 'compressScripts' ] );
gulp.task( 'scripts', [ 'scriptSrc' ] );
gulp.task( 'run', [ 'build', 'test', 'watch' ] );