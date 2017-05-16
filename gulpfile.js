'use strict'; // node engine will run file in strict interpreptation of javascript

var gulp      = require('gulp'),
    concat    = require('gulp-concat'),
    uglify    = require ('gulp-uglify'),
    rename    = require ('gulp-rename'),
    maps      = require ('gulp-sourcemaps'),
    uglifycss = require ('gulp-uglifycss'),
    imagemin  = require ('gulp-imagemin'),
    htmlmin   = require ('gulp-htmlmin'),
    gulpif    = require ('gulp-if'),
    sprity    = require('sprity')

    ;



// ****************CONCAT JAVASCRIPT*****************

gulp.task("concatScripts", function () {
  // src() method can take a string or an array of files; if an array list in the order we want to concatenate them
  // explicity return the gulp.src files before minifyScripts runs..Return lets other tasks know this one is finished running
  return gulp.src(["js/jquery.js",
            "js/fastclick.js",
            "js/foundation.js",
            "js/foundation.equalizer.js",
            "js/foundation.reveal.js"])
      // source map the JS...makes it easier to find error location in browser console inspector
      .pipe(maps.init())
      //concat() task takes a string parameter , the name of the file we create...app.js
      .pipe(concat("app.js"))
      //take concat result and pipe to the map write method to create the file path/folder.below makes the new file a sibling in same directory as orginal file
      .pipe(maps.write('./'))
      //this file created is now "piped" to its destination/the folder we want app.js to be in ..the "js" folder
      .pipe(gulp.dest("js"));
});



// *****************MINIFY JAVASCRIPT********************

//"gulp-uglify will minify the file....removing all extra blank spacing..makes file smaller in size/weight"
// ["concatScripts"] is a dependency of minfyScripts...so minfyScripts won't run til concatScripts is finished
gulp.task("minifyScripts",["concatScripts"], function () {

  return gulp.src("js/app.js")
      .pipe(uglify())
      // the rename module and method below creates a new file for minified file so we can keep original for review in console during development
      .pipe(rename('app.min.js'))
      .pipe(gulp.dest('js'));
});

/*********************SPRITE MAP FOR IMGS/AVATARS***************/

// generate sprite.jpg and _sprite.css
gulp.task('sprites', function () {
  return sprity.src({
    src: 'img/avatars/*.jpg',
    out: 'img',
    cssPath: 'img',
    style: './sprite.css',
    format: 'jpg',
    // ... other optional options

    // processor: 'css'
  })
  .pipe(gulpif('*.jpg', gulp.dest('img'), gulp.dest('css')))
});


// ****************CONCAT CSS FILES*****************

gulp.task("concatCSS", ['sprites'], function () {
  // src() method can take a string or an array of files; if an array list in the order we want to concatenate them
  // explicity return the gulp.src files before minifyScripts runs..Return lets other tasks know this one is finished running
  return gulp.src([
            "css/arvo.css",
            "css/basics.css",
            "css/footer.css",
            "css/foundation.css",
            "css/foundation.min.css",
            "css/hero.css",
            "css/menu.css",
            "css/modals.css",
            "css/normalize.css",
            "css/photo-grid.css",
            "css/ubuntu.css",
            "css/sprite.css"
          ])
      // source map the CSS...makes it easier to find error location in browser console inspector
      .pipe(maps.init())
      //concat() task takes a string parameter , the name of the file we create...application.css
      .pipe(concat("application.css"))
      //take concat result and pipe to the map write method to create the file path/folder.below makes the new file a sibling in same directory as orginal file
      .pipe(maps.write('./'))
      //this file created is now "piped" to its destination/the folder we want application.css to be in ..the "css" folder
      .pipe(gulp.dest("css"));
});



// ***************MINIFY CSS******************

//"gulp-uglify will minify the file....removing all extra blank spacing..makes file smaller in size/weight"
// ["concatCSS"] is a dependency of minfyCSS...so minfyCSS won't run til concatCSS is finished
gulp.task("minifyCSS",["concatCSS"], function () {

  return gulp.src("css/application.css")
      .pipe(uglifycss())
      // the rename module and method below creates a new file for minified file so we can keep original for review in console during development
      .pipe(rename('application.min.css'))
      .pipe(gulp.dest('css'));
});


// *******************IMAGE RESIZING / COMPRESSION ***********

gulp.task('image', ['minifyCSS'], function () {
  return  gulp.src('img/*/*')
      .pipe(imagemin())
      .pipe(gulp.dest('img'));

});



//********************HTML MINIFY *****************************//

gulp.task('minifyHTML', function() {
  return gulp.src('src/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('dist'));
});







// *******************BUILD ALL TASKS TO RUN AUTO*********************

// gulp build task will auto mate the running of all our tasks; only have to run gulp in console

gulp.task("build", ['concatScripts', 'minifyScripts', 'concatCSS', 'minifyCSS', 'image', 'minifyHTML', 'sprites'], function () {

    return gulp.src(["css/application.min.css", "js/app.min.js", "css/Arvo/**","css/Ubuntu/**", "img/**"],
          // base keeps structure of directories same as we have them...the parameter is the current working directory in this case
          {base: './'})
          .pipe(gulp.dest('dist'));
});

// "default" followed by an array of dependencies..which will run BEFORE our default task
gulp.task("default", ['build']);
