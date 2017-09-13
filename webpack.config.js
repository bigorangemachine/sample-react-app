var argv = require('yargs').argv,
    _ = require('underscore'),
    webpack = require('webpack'),//not needed?
    path = require('path'),
    ExtractTextPlugin = require('extract-text-webpack-plugin');

var PROCESS_BIN = _.last(argv['$0'].split(/(\/|\\)/)).toLowerCase(),//if you don't want to use yargs you can use process.argv[1] - but test for yourself :)
    RUNNING_TEST = (isTestMode()?true:false),
    BUILD_DIR = path.resolve(__dirname, './www-assets/'),
    APP_DIR = path.resolve(__dirname, './pkg/'),
    CSS_OPTS = [{
            'loader':'style-loader',
            'options':{
                'outputStyle': 'expanded',
                'sourceMap': true,
                'sourceMapContents': true
            }
        },
        {
            'loader':'css-loader',
            'options':{
                'outputStyle': 'expanded',
                'sourceMap': true,
                'sourceMapContents': true
            }
        }];

var config = {
        'devtool': "source-map", // source-map|inline-source-map -> not needed?
        'entry': APP_DIR + '/jsxpkg/index.jsx', // this can be a hastable  with arrays {'something': [ ... ], 'soemthing-else': [ ... ] }
        'output': {
            'path': BUILD_DIR,
            'publicPath': '../', // needs this to make images 'copy' over correctly
            'filename': 'js/bundle.js'
        },
        'resolve': {
          'extensions': ['.js', '.jsx']
        },
        'module': {
            'rules': [{
                'test': /\.jsx?/,// makes it so webpack will run jsx through babel
                'include': APP_DIR,
                'use': [{
                  'loader': 'babel-loader',
                  'options': { 'presets': ['es2015'] },
                }],
            },
            {
                'test': /\.css$/,//allow nodejs to use css without a prefix - otherwise require('css!./../css/app.css');
                'use': CSS_OPTS
            },
            {
                'test': /(\.scss|\.sass)$/,//allow nodejs to use sass without a prefix?
                'use': CSS_OPTS.concat([{
                    'loader':'sass-loader',
                    'options':{
                        'outputStyle': 'expanded',
                        'sourceMap': true,
                        'sourceMapContents': true
                    }
                }])
            },
            {
                'test': /\.(jpe?g|png|gif|svg)$/,
                'use': [{
                    'loader': 'file-loader',
                    'options': {
                        'name': "img/[name].[ext]"
                    }
                  }
                ]
            },
            {
                'test': /\.(eot|svg|ttf|woff|woff2)$/,
                'use': [{
                    'loader': 'file-loader',
                    'options': {
                        'name': "fonts/[name].[ext]"
                    }
                  }
                ]
            }]
        },
        'plugins': [
            new ExtractTextPlugin('css/css.css')//where to put all the css
        ]
    };

//test mode!
if(RUNNING_TEST){//we've been executed through the npm run test (of some sort)
    //var IstanbulPlugin = require('babel-istanbul-instrumenter-loader');
    config.target = 'node';// in order to ignore built-in modules like path, fs, etc.
    if(typeof(config.externals)!=='object'){config.externals=[];}
    config.externals.push(require('webpack-node-externals')());// in order to ignore all modules in node_modules folder
    config.output=Object.assign({}, config.output, {// use absolute paths in sourcemaps (important for debugging via IDE)
        'devtoolModuleFilenameTemplate': '[absolute-resource-path]',
        'devtoolFallbackModuleFilenameTemplate': '[absolute-resource-path]?[hash]'
    });
    config.devtool=process.env.NODE_ENV==='test-debug'?'inline-cheap-module-source-map':'inline-source-map';
    // config.devtool=process.env.NODE_ENV==='test-debug'?'cheap-module-source-map':'inline-source-map';
}

module.exports = config;


function isTestMode(){
    var result=false;
    if(['mocha','istanbul','nyc'].filter(function(item){return PROCESS_BIN.indexOf(item)===0}).length>0){
        result=true;
    }else if(process.env.NODE_ENV && process.env.NODE_ENV.startsWith('test')){
        result=true;
    }
    return result;
}
