let project_folder = './dist';
let source_folder = './src';


let paths = {
    build: {
        html: "./index.html",
        css: project_folder + "/css/",
        js: project_folder + "/js/",
        img: project_folder + "/img/",
        fonts: project_folder + "/fonts/",
    },
    src: {
        html: "./index.html",
        scss: source_folder + "/**/*.scss",
        js: source_folder + "/**/*.js",
        img: source_folder + "/**/*.{jpg,png,svg,gif,ico,webp}",
        fonts: source_folder + "/fonts/**/*.{ttf,eot,svg,woff,woff2}",
    },
    watch: {
        html: "./index.html",
        scss: source_folder + "/**/*.scss",
        js: source_folder + "/**/*.js",
        img: source_folder + "/**/*.{jpg,png,svg,gif,ico,webp}",
    },
    clean: project_folder
}

let { src, dest  } = require('gulp'),
gulp = require('gulp'),
    concat = require("gulp-concat"),

    browsersync = require("browser-sync").create(),
fileinclude = require('gulp-file-include'),
del = require('del'),
scss = require('gulp-sass'),
autoprefixer = require('gulp-autoprefixer'),
// group_media = require('gulp-group-css-media-queries'),
// cleancss = require('gulp-clean-css'),
uglify = require('gulp-uglify'),
imagemin = require('gulp-imagemin')
webp = require('gulp-webp'),
webphtml = require('gulp-webp-html'),
webpcss = require('gulp-webp-css')

/*** FUNCTIONS ***/

function browserSync() {
    browsersync.init({
        server:{
            baseDir: "./" + project_folder + "/"
        },
        port: 3000,
        notify: false
    })
}

function html(){
    return src(paths.src.html)
    .pipe(fileinclude())
    .pipe(webphtml())
    .pipe(dest(paths.build.html))
    .pipe(browsersync.stream())
}
function css() {
    return src(paths.src.scss, { allowEmpty: true })
    .pipe(
        scss({
            outputStyle: "expanded"
        })
    )
        .pipe(scss().on("error", scss.logError))
        .pipe(concat("style.min.css"))
    .pipe(
        autoprefixer({
            overrideBrowserslist: ["last 5 versions"],
            cascade: true
        })
    )
        // .pipe(
    //     group_media()
    // )
    // .pipe(webpcss())
    // .pipe(cleancss())
    .pipe(dest(paths.build.css))
    .pipe(browsersync.stream())
}

function js(){
    return src(paths.src.js, { allowEmpty: true })
    .pipe(fileinclude())
    // .pipe(
    //     uglify()
    // )
        // .pipe(minifyJs())
        .pipe(concat("script.min.js"))
    .pipe(dest(paths.build.js))
    .pipe(browsersync.stream())
}

function images(){
    return src(paths.src.img)
    // .pipe(
    //     webp({
    //         quality: 70
    //     })
    // )
    // .pipe(dest(paths.build.img))
    .pipe(src(paths.src.img))
    .pipe(
        imagemin({
            interlaced: true,
            progressive: true,
            optimizationLevel: 5,
            svgoPlugins: [
                {
                    removeViewBox: true
                }
            ]
        })
    )
    .pipe(dest(paths.build.img))
    .pipe(browsersync.stream())
}


function watchFiles(){
    gulp.watch([paths.watch.html], html);
    gulp.watch([paths.watch.css], css);
    gulp.watch([paths.watch.js], js);
    gulp.watch([paths.watch.img], images);

}

function clean(){
    return del(paths.clean);
}


let build = gulp.series(clean, gulp.parallel(js,css,html, images));
let watch = gulp.parallel(build, watchFiles, browserSync);


exports.images = images;
exports.js = js;
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;