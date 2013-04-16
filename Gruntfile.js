module.exports = function(grunt) {

  'use strict';

  grunt.initConfig({

    /**
     * Pull in the package.json file so we can read its metadata.
     */
    pkg: grunt.file.readJSON('package.json'),

    /**
     * Here's a banner with some template variables.
     * We'll be inserting it at the top of minified assets.
     */
    banner: 
      '/*                        _                                          \n' +
      '                         //\\                                         \n' +
      '                         V  \\                                        \n' +
      '                          \\  \\_                                      \n' +
      '            /$$$$$$        \\,".`.                                    \n' +
      '           /$$__  $$       |\\ `. `.                                  \n' +
      '  /$$$$$$$| $$  \\__//$$$$$$\\ \\  `. `-.                        _,.-:\\ \n' +
      ' /$$_____/| $$$$   /$$__  $$\\ \\   `.  `-._             __..--" "-";/ \n' +
      '| $$      | $$_/  | $$  | $$ \\ `.   `-.   `-..___..---"   _.--" ,"/  \n' +
      '| $$      | $$    | $$  | $$  `. `.    `-._        __..--"    ," /   \n' +
      '|  $$$$$$$| $$    | $$$$$$$/    `. `-_     ``--..""       _.-" ,"    \n' +
      ' \\_______/|__/    | $$____/       `-_ `-.___        __,--"   ,"      \n' +
      '                  | $$               `-.__  `----"""    __.-"        \n' +
      '                  | $$                    `--..____..--"             \n' +
      '                  |__/                                               \n\n' +
      '* <%= pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n\n',

    /**
     * Recess: https://github.com/sindresorhus/grunt-recess
     * 
     * Compile, concat and compress LESS files.
     * Make sure to add any other CSS libraries/files you'll be using.
     * We are excluding minified files with the final ! pattern.
     */
    recess: {
      dist: {
        src: ['<%= banner %>', 'static/css/font-awesome.css', 'static/css/<%= pkg.name %>.css', '!static/css/*.min.css'],
        dest: 'static/css/<%= pkg.name %>.min.css',
        options: {
          compile: true,
          compress: true
        }
      }
    },

    /**
     * Uglify: https://github.com/gruntjs/grunt-contrib-uglify
     * 
     * Minify JS files.
     * Make sure to add any other JS libraries/files you'll be using.
     * We are excluding minified files with the final ! pattern.
     */
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: ['static/js/jquery-1.9.1.js', 'static/js/<%= pkg.name %>.js', '!static/js/*.min.js'],
        dest: 'static/js/<%= pkg.name %>.min.js'
      }
    },

    /**
     * JSHint: https://github.com/gruntjs/grunt-contrib-jshint
     * 
     * Validate files with JSHint.
     * Below are options that conform to idiomatic.js standards.
     * Feel free to add/remove your favorites: http://www.jshint.com/docs/#options
     */
    jshint: {
      options: {
        camelcase: true,
        curly: true,
        eqeqeq: true,
        forin: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        quotmark: true,
        sub: true,
        undef: true,
        unused: true,
        boss: true,
        eqnull: true,
        browser: true,
        globals: {
          jQuery: true,
          $: true,
          Backbone: true,
          _: true,
          module: true,
          Highcharts: true
        }
      },
      all: ['static/js/<%= pkg.name %>.js']
    },

    /**
     * Jasmine: https://github.com/gruntjs/grunt-contrib-jasmine
     * 
     * Run jasmine specs headlessly through PhantomJS.
     * jQuery and Jasmine jQuery is included for your pleasure: https://github.com/velesin/jasmine-jquery
     */
    jasmine: {
      src: '<%= uglify.dist.src %>',
      options: {
        specs: 'specs/js/*.js',
        vendor: [
          'specs/js/vendor/*.js'
        ],
        helpers: [
          'specs/js/helpers/*.js'
        ]
      }
    },

    /**
     * Watch: https://github.com/gruntjs/grunt-contrib-watch
     * 
     * Run predefined tasks whenever watched file patterns are added, changed or deleted.
     * Add files to monitor below.
     */
    watch: {
      gruntfile: {
        files: ['Gruntfile.js', '<%= recess.dist.src %>', '<%= uglify.dist.src %>', '<%= jasmine.options.specs %>'],
        tasks: ['default']
      }
    }
  });

  /**
   * The above tasks are loaded here.
   */
  grunt.loadNpmTasks('grunt-recess');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-notify');

  /**
   * Create task aliases by registering new tasks
   */
  grunt.registerTask('test', ['jshint', 'jasmine']);

  /**
   * The 'default' task will run whenever `grunt` is run without specifying a task
   */
  grunt.registerTask('default', ['test', 'recess', 'uglify']);

};
