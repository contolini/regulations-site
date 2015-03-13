'use strict';

module.exports = function(grunt) {

  grunt.initConfig({

    /**
     * Pull in the package.json file so we can read its metadata.
     */
    pkg: grunt.file.readJSON('package.json'),

    /**
     *
     *  Pull in environment-specific vars
     *
     */
    env: grunt.file.readJSON('config.json'),

    /**
     * https://github.com/gruntjs/grunt-contrib-less
     */
    less: {
        dev: {
            options: {
                paths: ['<%= env.frontEndPath %>/css/less'],
                compress: false,
                sourceMap: true,
                sourceMapFilename: '<%= env.frontEndPath %>/css/style.css.map',
                sourceMapBasepath: '<%= env.frontEndPath %>/css/less/',
                sourceMapURL: 'style.css.map'
            },
            files: {
                '<%= env.frontEndPath %>/css/style.css': '<%= env.frontEndPath %>/css/less/main.less'
            }
        },
        dist: {
          options: {
              paths: ['<%= env.frontEndPath %>/css/less'],
              compress: true,
              sourceMap: false,
              ieCompat: true
          },
          files: {
              '<%= env.frontEndPath %>/css/style.min.css': '<%= env.frontEndPath %>/css/less/main.less'
          }
      }
    },

    /**
     * ESLint: https://github.com/sindresorhus/grunt-eslint
     *
     * Validate files with ESLint.
     */
    eslint: {
        target: [
          'Gruntfile.js',
          '<%= env.frontEndPath %>/js/source/*.js',
          '<%= env.frontEndPath %>/js/source/events/**/*.js',
          '<%= env.frontEndPath %>/js/source/models/**/*.js',
          '<%= env.frontEndPath %>/js/source/views/**/*.js'
        ]
    },

    /**
    * Browserify:
    *
    * Require('modules') in the browser/bundle up dependencies.
    */
    browserify: {
      dev: {
        files: {
          '<%= env.frontEndPath %>/js/built/regulations.js': ['<%= env.frontEndPath %>/js/source/regulations.js']
        },
        options: {
          transform: ['browserify-shim', 'debowerify'],
          browserifyOptions: {
            debug: true
          }
        }
      },
      dist: {
        files: {
          '<%= env.frontEndPath %>/js/built/regulations.js': ['<%= env.frontEndPath %>/js/source/regulations.js']
        },
        options: {
          transform: ['browserify-shim', 'debowerify'],
          browserifyOptions: {
            debug: false
          }
        }
      },
      tests: {
        files: {
          '<%= env.frontEndPath %>/js/unittests/compiled_tests.js': ['<%= env.frontEndPath %>/js/unittests/specs/*.js']
        },
        options: {
          watch: true,
          debug: true
        }
      }
    },

    uglify: {
      dist: {
        files: {
          '<%= env.frontEndPath %>/js/built/regulations.min.js': ['<%= env.frontEndPath %>/js/built/regulations.js']
        }
      }
    },

    // mocha: {
    //   test: {
    //     src: ['<%= env.frontEndPath %>/js/unittests/runner.html'],
    //     options: {
    //       run: true
    //     }
    //   }
    // },

    mocha_istanbul: {
      coverage: {
        src: ['<%= env.frontEndPath %>/js/unittests/specs/*.js'],
        options: {
          harmony: true,
          coverageFolder: 'test/coverage',
          coverage: true,
          check: {
            lines: 50,
            statements: 50
          }
        }
      }
    },

    shell: {
      'build-require': {
        command: './require.sh'
      },

      'nose-chrome': {
        command: 'nosetests -s <%= env.testPath %> --tc=webdriver.browser:chrome --tc=testUrl:<%= env.testUrl %>',
        options: {
            stdout: true,
            stderr: true
        }
      },

      'nose-ie10': {
        command: 'nosetests -s <%= env.testPath %> --tc=webdriver.browser:ie10 --tc=testUrl:<%= env.testUrl %>',
        options: {
            stdout: true,
            stderr: true
        }
      }
    },

    // https://github.com/yatskevich/grunt-bower-task
    bower: {
        install: {
            options: {
                targetDir: '<%= env.frontEndPath %>/js/source/lib'
            }
        }
    },

    /**
     * Watch: https://github.com/gruntjs/grunt-contrib-watch
     *
     * Run predefined tasks whenever watched file patterns are added, changed or deleted.
     * Add files to monitor below.
     */
    watch: {
      js: {
        files: ['Gruntfile.js', '<%= env.frontEndPath %>/js/source/**/*.js'],
        tasks: ['eslint','browserify:dev']
      },
      css: {
        files: ['<%= env.frontEndPath %>/css/less/**/*.less'],
        tasks: ['less:dev']
      },
      options: {
        livereload: true
      }
    }
  });

  /**
   * The above tasks are loaded here.
   */
    require('load-grunt-tasks')(grunt);

    /**
    * Create task aliases by registering new tasks
    */
    grunt.registerTask('nose', ['shell:nose-chrome', 'shell:nose-ie10']);
    grunt.registerTask('test', ['eslint', 'nose', 'browserify:tests', 'mocha']);
    grunt.registerTask('build', ['squish', 'test']);
    grunt.registerTask('squish', ['browserify:dist', 'uglify', 'less:dist']);
};
