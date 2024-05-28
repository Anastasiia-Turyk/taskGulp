import gulp from 'gulp';
const { series, parallel} = gulp;
import pug from 'gulp-pug';
import gulpSass from "gulp-sass";
import nodeSass from "node-sass";
const sass = gulpSass(nodeSass);
import autoprefixer from 'gulp-autoprefixer';
import cssnano from 'gulp-cssnano';
import babel from 'gulp-babel';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';
import rename from 'gulp-rename';
import imagemin from 'gulp-imagemin';
import {deleteAsync as del} from "del";
import browserSync from 'browser-sync';




// const gulp = require('gulp');
// const { series, parallel } = require('gulp');
// const pug = require('gulp-pug');

//ці файли необхідні для компіляції з scss=> css


// const sass = require('gulp-sass');
// const autoprefixer = require('gulp-autoprefixer');
// const cssnano = require('gulp-cssnano');
// const rename = require("gulp-rename");
// const babel = require('gulp-babel');
// const uglify = require('gulp-uglify');
// const concat = require('gulp-concat');
// const imagemin = require('gulp-imagemin');
// const browserSync = require('browser-sync').create();
// const del = require('del');



//відповідає за html збірку
export const html=()=>{
  return  gulp
    .src('src/pug/*.pug')
    .pipe(pug({pretty:true}))
    .pipe(gulp.dest('build'))
}

export const styles=()=>{
  return gulp
  .src('src/styles/*.scss')
  .pipe(sass().on('error', sass.logError)) // відслідковує помилки
  .pipe(autoprefixer())
//   .pipe(postcss([autoprefixer()]))
  .pipe(cssnano())
  .pipe(rename({suffix: '.min'}))
  .pipe(gulp.dest('build/css')) //куди будуть йти скомпільойовані файли
}

export const scripts=()=>{
  return  gulp
      .src('src/scripts/*.js')
      .pipe(babel({
        presets: ['@babel/env']
    }))
    .pipe(uglify())
    .pipe(concat('main.min.js'),  { rebaseUrls: false })
    .pipe(gulp.dest('build/js'))
}

export const images=()=>{
  return  gulp
    .src('src/images/*.*')//любий файл з любим розширенням
    .pipe(imagemin())
		.pipe(gulp.dest('build/images'))
}

export const server=()=>{
  browserSync.init({
    server:{
      baseDir:'./build'
    }, 
    notify:false
  });
  browserSync.watch('build', browserSync.reload)
}

export const deleteBuild =(cb) =>{
  return del('build/**/*.*').then(() => { cb() })// з любої папки і підпапки
}

export const watch=() =>{
   gulp.watch('src/pug/**/*.pug', html)
   gulp.watch('src/styles/**/*.scss',styles);
   gulp.watch('src/scripts/**/*.js', scripts);
   gulp.watch('src/images/**/*.*', images);
}

export default gulp.series(deleteBuild,parallel(html,scripts,images,styles),parallel(server, watch))