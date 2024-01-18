const {src, dest} = require('gulp'),

gulp = require('gulp'),  // подключаем Gulp через require
include = require('gulp-include'),  // сборка HTML (header, footer..)
sass = require('gulp-sass')(require('sass')), // подключаем плагин для компиляции scss
sourceMaps = require('gulp-sourcemaps'),  // нахождение строк в dev-tools

uglify = require('gulp-uglify-es').default,  // плагин для сжатия JS файлов
concat = require('gulp-concat'),  // подключаем плагин для переименования файлов

// IMAGES
imageMin = require('gulp-imagemin'),  // сжатие картинок + в новые форматы
webp = require('gulp-webp'),
changed = require('gulp-changed'),  // чтобы плагины применялись только к новым файлам 
webhtml = require('gulp-webp-html'),
webcss = require('gulp-webp-css'),
// FONTS
fonter = require('gulp-fonter'),
ttf2woff2 = require('gulp-ttf2woff2'),

// Сервер
server = require('gulp-server-livereload'), // подключаем сервер и автообновление

clean = require('gulp-clean'),  // возмож-сть удаления папки dist, работа с файл.сист
fs = require('fs')


function images(){
    return src('app/img/**/*')
    .pipe(changed('dist/img'))
    .pipe(webp())

    .pipe(src('app/img/**/*'))
    .pipe(changed('dist/img'))
    .pipe(imageMin({verbose: true}))

    .pipe(dest('dist/img'))

}

function html(){
    return src('app/pages/*.html')
    .pipe(include({
        includePaths: 'app/components/'
    }))
    .pipe(webhtml())
    .pipe(dest('dist/pages'))
}

function styles(){
    return src('app/scss/**/*.scss')  // берём все файлы .scss методом gulp.src('')
    .pipe(sourceMaps.init())
    .pipe(sass({outputStyle: 'compressed'}))  // закидываем в 'трубу' и преобразуем Sass в CSS
    .pipe(sourceMaps.write())
    .pipe(concat('main.min.css'))
    .pipe(webcss())
    .pipe(dest('dist/css')) // Сохраняем результат в папку dist/css
}

function minjs(){
    return src('app/js/*.js')
    .pipe(uglify())
    .pipe(concat('main.min.js'))
    .pipe(dest('dist/js'))
}

function fonts(){
    return src('app/fonts/*')
    .pipe(fonter({formats: ['woff', 'ttf']}))
    .pipe(src('app/fonts/*.ttf'))
    .pipe(ttf2woff2())
    .pipe(dest('dist/fonts'))
}

function extraJS(){
    return src('app/js/js-extra-settings/*.js')
    .pipe(dest('dist//js/js-extra-settings'))
}
// function host(){
//     return src('dist/pages/index.html')
//     .pipe(server({
//         livereload: true,
//         open: true
//     }))
// }

function cleaner(done){
    if (fs.existsSync('dist/')){  // Таск для удаления папки dist
        return src('dist',{read: false}).pipe(clean())
    }
    done()
}

function watching(){   // Таск для авто-обновления всех тасков
    gulp.watch(['app/pages/*.html', 'app/components/*.html'], html)
    gulp.watch(['app/scss/*.scss'], styles)
    gulp.watch(['app/img/**/*'], images)
    gulp.watch(['app/js/**/*.js'], minjs)
    gulp.watch(['app/fonts/*'], fonts)
}

exports.html = html
exports.styles = styles
exports.minjs = minjs
exports.images = images
exports.fonts = fonts
exports.extraJS = extraJS
// exports.host = host
exports.cleaner = cleaner
exports.watching = watching

exports.default = gulp.series(
    cleaner,
    gulp.parallel(html, styles, minjs, images, fonts, extraJS), 
    gulp.parallel(watching)
)

