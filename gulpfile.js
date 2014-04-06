var gulp = require( 'gulp' ),
	browserify = require( 'gulp-browserify' ),
	jshint = require( 'gulp-jshint' ),
	jshintReporter = require( "jshint-stylish" ),
	rename = require( 'gulp-rename' ),
	shell = require( 'gulp-shell' ),
	uglify = require( 'gulp-uglify' );

gulp.task( 'compressScripts', [ 'scripts' ], function () {
	return gulp.src( [ './dist/moldy.js' ] )
		.pipe( uglify() )
		.pipe( rename( 'moldy.min.js' ) )
		.pipe( gulp.dest( './dist/' ) );
} );

gulp.task( "jshint", function () {
	return gulp.src( [ "./src/scripts/**/*.js", "test/**/*.js" ] )
		.pipe( jshint() )
		.pipe( jshint.reporter( jshintReporter ) );
} );

gulp.task( 'scriptSrc', function () {
	return gulp.src( [ './src/index.js' ] )
		.pipe( browserify( {
			debug: true,
			standalone: 'moldy'
		} ) )
		.pipe( rename( 'moldy.js' ) )
		.pipe( gulp.dest( './dist/' ) );
} );

gulp.task( 'test', [ 'jshint' ], function () {
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