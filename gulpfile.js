"use strict";

// gulp таск-раннер
var gulp = require("gulp");

//SASS препроцессор
var sass = require("gulp-sass");

//Сообщает об ошибках, не прерывая сборку
var plumber = require("gulp-plumber");

//POSTCSS с плагинов для автопрефикса
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");

// Локальный сервер
var server = require("browser-sync").create();
var reload = server.reload;

gulp.task("style", function () {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest("source/css"))
    .pipe(server.stream()); //перерисовка страницы 
});

// Вочеры, следящие за изменениями  файлов
// Перед  serve  должен быть запущен build 
gulp.task("serve", ["style"], function () {
  server.init({
    server: "source/",
    notify: false,
    open: true,
    cors: true,
    ui: false
});

  gulp.watch("source/sass/**/*.{scss,sass}", ["style"]);
  gulp.watch("source/*.html")
    .on("change", server.reload);
});
