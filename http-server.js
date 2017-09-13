
//modules
var _ = require('underscore'),//http://underscorejs.org/
    merge = require('merge'),//allows deep merge of objects
    fs = require('fs'),
    url = require('url'),
    utils = require('bom-utils'),
    vars = require('bom-utils/vars');
//custom modules - for WIP
var genericHTTP = require('node-default-server')(),
    popular_mock=require('./tests/mocks/popular_movies.json'),
    movie_recs={
      'movie_1':require('./tests/mocks/movie_1.json'),
      'movie_2':require('./tests/mocks/movie_2.json')
    };
//varaibles
var doc_root='./',
    gen_HTTP={},
    root_params={
        'silent':false,//actual settings
        'ports':'3000',
        'config':'./config',
        'found_params':[]
    };

// root_params.config=root_params.config;/// ?????
// var config=require('./jspkg/configurator')(process, fs, root_params);
// doc_root=root_params.doc_root;
root_params.ports=(root_params.ports.trim().length===0?'80,443,3000':root_params.ports).split(',');


fs.stat(doc_root, function(err, stats){
  var http_opts={
        // 'silent':true,//tmp
        'ports':root_params.ports,
        'file_notfound':'404.html'
      };
  if((!err || err===null) && stats.isDirectory()){
    if(doc_root.indexOf('./')===0){//express won't like this
      fs.realpath(doc_root, function(err, relPath){
        if(!err || err===null){
          gen_HTTP=new genericHTTP(merge(true,http_opts,{'doc_root':relPath}));
          setRoutes();
        }
      });
    }else{
      gen_HTTP=new genericHTTP(merge(true,http_opts,{'doc_root':doc_root}));
      setRoutes();
    }
  }else{
    console.log("COULD NOT START BAD DOCROOT",err.toString());
    process.exit();//not needed ^_^
  }
});

function setRoutes(){
  var movie_regexp=new RegExp('^(api\/movie\/([0-9]+))+','gi'),
      popular_regexp=new RegExp('^(api\/popular)+','gi'),
      response_success_schema={'code':200,'success':true,'error':null},
      response_failed_schema={'code':400,'success':false,'error':"Request is not found."},
      json_response_schema={'payload':{},'status':merge(true,{},response_failed_schema)};


  gen_HTTP.add_route(popular_regexp, ['GET'],root_params.ports,function(pkg,cb){
    callMovie({popular:true},function(err, data){
        if(err){
          cb(err, null);}
        else{
          cb(null, parsePostUrls(data));
        }
    });
  },
  function(pkg){
    jsonReponse(pkg.res, jsonResponseOk(pkg.res, pkg.route_result.result));
  });
  gen_HTTP.add_route(movie_regexp, ['GET'],root_params.ports,function(pkg,cb){
    callMovie({id:pkg.uri.split(movie_regexp)[2]},function(err, data){
        if(err){
          cb(err, null);}
        else{
          cb(null, parsePostUrls(data));
        }
    });
  },
  function(pkg){
    jsonReponse(pkg.res, jsonResponseOk(pkg.res, pkg.route_result.result));
  });

  gen_HTTP.add_route(new RegExp('.+','gi'), ['POST','GET','DELETE','PUT'],root_params.ports,function(pkg,cb){
      fs.stat(gen_HTTP.doc_root + gen_HTTP.asset_path + pkg.uri, function(err, stats){
          if(err || !stats.isFile()){//for react!
              cb(null, true);}
          else{// indicate to ignore us
              cb({}, null);}
      });
    },
    function(pkg){
        pkg.res.status(200);
        pkg.res.sendFile(gen_HTTP.doc_root + gen_HTTP.asset_path + 'index.html', 'binary');
    });


    // json helpers
    function jsonResponseOk(res, data){
      res.status(200);
      return merge(json_response_schema, {'status':response_success_schema}, {'payload':data});
    }
    function jsonResponseFail(res, error){
      res.status(400);
      return merge(json_response_schema, {'error':error});
    }
    function jsonReponse(res,jsonOutput){
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(jsonOutput));
    }
}

function callMovie(dataObj,callback){
    dataObj=dataObj?dataObj:{};
    if(dataObj.popular){
        callback(null, popular_mock);
    }else if(dataObj.id){
      callback(null, movie_recs['movie_'+utils.getRandomInt(1,2)]);
    }

}

function parsePostUrls(data){
  let map_over=data.results?data.results:[data]
  return map_over.map(function(img,i){
      let image=merge(true,img),
          img_prefix='http://image.tmdb.org/t/p/',
          additional={
            backdrop: img_prefix+'original/'+utils.check_strip_first(image.backdrop_path,'/'),
            poster: img_prefix+'original/'+utils.check_strip_first(image.poster_path,'/')
          },
          size_table={
            tiny:'w92',
            small:'w154',
            medium:'w185',
            base:'w342',
            large:'w500',
            huge:'w780',
            original:'original'
          };
      for(var size in size_table){
        additional['backdrop_'+size]=img_prefix+size_table[size]+'/'+utils.check_strip_first(image.backdrop_path,'/');
        additional['poster_'+size]=img_prefix+size_table[size]+'/'+utils.check_strip_first(image.poster_path,'/');
      }
      return merge(true, image, additional)
  });

}
