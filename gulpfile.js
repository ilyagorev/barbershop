"use strict";

var gulp = require("gulp"); // gulp таск-раннер
var sass = require("gulp-sass"); //SASS препроцессор
var plumber = require("gulp-plumber"); //Сообщает об ошибках, не прерывая сборку
/*POSTCSS с плагинов для автопрефикса*/
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");

gulp.task("style", function () {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
        autoprefixer()
    ]))
    .pipe(gulp.dest("source/css"))
});