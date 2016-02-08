var express = require('express');
var router = express.Router();
var path = require('path');

var raml2html = require('raml2html');
var raml2obj = require('raml2obj');

var nunjucks = require('nunjucks');
var env = new nunjucks.Environment();

env.addFilter('marked', function(str) {
  return "MARKED";
});

var file = './raml/accounts_usa.raml';

router.get('/obj/:filename', function(request, response, next) {
  var ramlFile = './raml/' + request.params.filename
  //console.log('obj')
  raml2obj.parse(ramlFile).then(function(ramlObj) {
    //console.log(ramlObj)
    response.end(JSON.stringify(ramlObj,null,2))
  }, function(error) {
    console.log('error:', error);
    response.end(ramlObj)
  });

});

router.get('/api_market/:filename', function(request, response, next) {
  var ramlFile = './raml/' + request.params.filename
  var config = raml2html.getDefaultConfig('./templates/api_market/documentation.nunjucks', __dirname+'/..');
  console.log('template ',ramlFile)

  var customConfig = {
    processRamlObj: function(ramlObj) {
      /**
       * Custom raml obj process
       */


      return config.processRamlObj(ramlObj);
    },
    postProcessHtml: config.postProcessHtml
  };

  raml2html.render(ramlFile, customConfig).then(function(result) {
    response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    response.end(result)
  }, function(error) {
    response.end(error)
  });

});
router.get('/:filename', function(request, response, next) {
  var ramlFile = './raml/' + request.params.filename
  var config = raml2html.getDefaultConfig();

  console.log('parse ',ramlFile)
  raml2html.render(ramlFile, config).then(function(result) {
    response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    response.end(result)
  }, function(error) {
    response.end(error)
  });

});


module.exports = router;
