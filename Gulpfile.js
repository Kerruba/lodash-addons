// Gulp
var gulp = require('gulp');

// Plugins
var concat = require('gulp-concat');
var eslint = require('gulp-eslint');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var umd = require('gulp-umd');

var jsPaths = [
    'src/**/*.js',
    'test/**/*',
    '*.js'
];

gulp.task('lint-js', function() {
    return gulp.src(jsPaths)
    .pipe(eslint())
    .pipe(eslint.format());
});

gulp.task('concat', function() {
    return gulp.src('src/**/*.js')
    .pipe(concat('lodash-addons.js'))
    .pipe(gulp.dest('build'));
});

gulp.task('umd', function() {
    return gulp.src('build/lodash-addons.js')
    .pipe(umd({
        dependencies: function() {
            return [{
                name: 'lodash',
                amd: 'lodash',
                cjs: 'lodash',
                global: '_',
                param: '_'
            }];
        },
        exports: function() {
            return '_';
        },
        namespace: function() {
            return '_';
        }
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('compress', function() {
    return gulp.src('dist/lodash-addons.js')
    .pipe(uglify())
    .pipe(rename('lodash-addons.min.js'))
    .pipe(gulp.dest('dist'));
});

// Copy git hooks
gulp.task('copy:hooks', function() {
    return gulp.src('hooks/*').pipe(gulp.dest('.git/hooks'));
});

// Task aliases
gulp.task('default', ['lint-js']);
gulp.task('deploy', ['concat', 'umd', 'compress']);
gulp.task('setup', ['copy:hooks']);
gulp.task('pre-commit', ['default', 'deploy']);