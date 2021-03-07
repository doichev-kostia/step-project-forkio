let project_folder = 'dist';
let source_folder = '#src';


let paths = {
    build: {
        html: project_folder + "/",
        css: project_folder + "/css/",
        js: project_folder + "/js/",
        img: project_folder + "/img/",
        fonts: project_folder + "/fonts/",
    },
    src: {
        html: [source_folder + "/*.html", "!" + source_folder + "/_*.html"],
        css: source_folder + "/scss/style.scss",
        js: source_folder + "/js/script.js",
        img: source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
        fonts: source_folder + "/fonts/*.ttf",
    },
    watch: {
        html: source_folder + "/**/*.html",
        css: source_folder + "/scss/**/.*scss",
        js: source_folder + "/js/**/*.js",
        img: source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
    },
    clean: "./" + project_folder + "/"
}

let { src, dest  } = require('gulp'),
gulp = require('gulp'),
browsersync = require("browser-sync").create(),
fileinclude = require('gulp-file-include'),
del = require('del'),
scss = require('gulp-sass'),
debug = require('gulp-debug'),
filter = require('gulp-filter'),
autoprefixer = require('gulp-autoprefixer'),
group_media = require('gulp-group-css-media-queries'),
cleancss = require('gulp-clean-css'),
rename = require("gulp-rename"),
uglify = require('gulp-uglify'),
imagemin = require('gulp-imagemin'),
webp = require('gulp-webp'),
webphtml = require('gulp-webp-html'),
webpcss = require('gulp-webp-css'),
svgSprite = require('gulp-svg-sprite');



/*** FUNCTIONS ***/

function browserSync(){
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
    return src(paths.src.css, { allowEmpty: true })
    .pipe(
        scss({
            outputStyle: "expanded"
        })
    )
    .pipe(
        autoprefixer({
            overrideBrowserslist: ["last 5 versions"],
            cascade: true
        })
    )
    .pipe(
        group_media()
    )
    .pipe(webpcss())
    .pipe(dest(paths.build.css))
    .pipe(cleancss())
    .pipe(rename({extname: ".min.css"}))
    .pipe(dest(paths.build.css))
    .pipe(browsersync.stream())
}

function js(){
    return src(paths.src.js, { allowEmpty: true })
    .pipe(fileinclude())
    .pipe(dest(paths.build.js))
    .pipe(
        uglify()
    )
    .pipe(
        rename({
            extname: ".min.js"
        })
    )
    .pipe(dest(paths.build.js))
    .pipe(browsersync.stream())
}

function images(){
    return src(paths.src.img)
    .pipe(
        webp({
            quality: 70
        })
    )
    .pipe(dest(paths.build.img))
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


gulp.task('svgSprite', function(){
    return gulp.src([source_folder + '/iconsprite/*.svg'])
    .pipe(svgSprite({
        mode: {
            stack: {
                sprite: "../icons/icons.svg", //sprite file name
                exmple: true
            }
        },
    }
    ))
    .pipe(dest(paths.build.img))
})



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