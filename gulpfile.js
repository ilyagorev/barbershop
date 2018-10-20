"use strict";

// gulp таск-раннер
var gulp = require("gulp");

// SASS препроцессор
var sass = require("gulp-sass");

// Сообщает об ошибках, не прерывая сборку
var plumber = require("gulp-plumber");

// POSTCSS с плагинов для автопрефикса
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");

// Локальный сервер
var server = require("browser-sync").create();
var reload = server.reload;

// Минификация CSS 
var minify = require("gulp-csso");

// Минификация графики 
var imagemin = require("gulp-imagemin");

// Плагин для переименования файлов 
var rename = require("gulp-rename");

// Плагин конвертации изображений в Webp для blink браузеров
var webp = require("gulp-webp");

// Сборка SVG спрайта
var svgstore = require("gulp-svgstore");

// PostHTML с плагином для вставки SVG в HTML через <include src=""></include> 
var posthtml = require("gulp-posthtml");
var include = require("posthtml-include");

// Библиотека для удаления файлов 
var del = require("del");

// Плагин для последовательного запуска задач, в 4й версии Gulp встроено
var run = require("run-sequence");

// Плагин минификация HTML 
var htmlmin = require("gulp-htmlmin");

gulp.task("style", function () {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest("build/css"))
    .pipe(minify())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream()); //перерисовка страницы 
});

// Минификация графики
gulp.task("images", function() {
  return gulp.src("source/img/**/*.{png,jpg,svg}")
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}), // 3 == безопасное сжатие
      imagemin.jpegtran({progressive: true}), //progressive == изображение постепенно прорисовывается при загрузке
      imagemin.svgo() // убрать лишние теги из svg
      ]))
    .pipe(gulp.dest("build/img"));
});

// Конвертация в webp
gulp.task("webp", function() {
  return gulp.src("source/img/**/*.{png,jpg}")
    .pipe(webp({quality: 90}))
    .pipe(gulp.dest("build/img"));
});

// Сборка спрайта из SVG-файлов
gulp.task("sprite", function() {
  return gulp.src("source/img/icon-*.svg")
    .pipe(svgstore({
      inLineSvg: true
    }))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img"));
});

// Подключение SVG в HTML через <include>
gulp.task("html", function() {
  return gulp.src("source/*.html")
    .pipe(posthtml([
      include()
    ]))
    .pipe(htmlmin({                  // Минификация HTML
      collapseWhitespace: true,
      ignoreCustomFragments: [ /<br>\s/gi ]  // Не убираем пробел после <br>
    }))
    .pipe(gulp.dest("build"))
    .pipe(server.stream());
});

// Удаление build перед новой сборкой
gulp.task("clean", function() {
  return del("build");
});

gulp.task("copy", function() {
  return gulp.src([
  "source/fonts/**/*.{woff,woff2}",
  "source/img/**",
  "source/js/**"
  ], {
    base: "source" // чтобы не потерять директории, т.к. копирует только содержимое
  })
  .pipe(gulp.dest("build"));
});

// "Живой сервер". Перед  serve  должен быть запущен build 
gulp.task("serve", function () {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
});

// Вочеры, следящие за изменениями  файлов
gulp.watch("source/sass/**/*.{scss,sass}", ["style"]);
gulp.watch("source/*.html", ["html"]);
gulp.watch("source/img/**/*.{png,jpg,svg,webp}", ["images-watch"]);
});

// Сборка всего проекта(npm run build) 
gulp.task("build", function(done) {
  run(
    "clean",
    "copy",
    "style",
    "images",
    "webp",
    "sprite",
    "html",
    done
  );
});