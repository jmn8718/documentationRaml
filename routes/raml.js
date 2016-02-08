var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require("fs");

var raml2html = require('raml2html');
var raml2obj = require('raml2obj');

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

function preprocessRamlObj(ramlObj, queryParams){
  var apiName = queryParams.apiName;
  var documentation = ramlObj['documentation'];
  if (documentation === undefined)
    documentation = []

  var termsIndex = -1,
      authIndex = -1,
      resourceIndex = -1;

  for(var index in documentation){
    var tempTitle = documentation[index].title;
    console.log('Index: ',index,' Title: ',tempTitle);
    if (tempTitle.toLowerCase().indexOf('terms') > -1)
      termsIndex = index;
    else if (tempTitle.toLowerCase().indexOf('resources') > -1)
      resourceIndex = index;
    else if (tempTitle.toLowerCase().indexOf('authentication') > -1)
      authIndex = index;
  }

  if(authIndex === -1){
    console.log('auth')

  }
  var quickstart = queryParams.quickstart;
  if(quickstart !== undefined){
    var quickstartText = {
      paystats: 'templates/documentation/quickstart/PAYSTATS.md',
      general: 'templates/documentation/quickstart/GENERAL.md'
    }
    var quickText = fs.readFileSync(__dirname + "/../" + quickstartText[quickstart], 'utf8')
    quickText = quickText.replace(/\"api-name\"/g, apiName)
    var quickstart = {
      title: 'Quickstart',
      content: quickText
    }
    if (termsIndex > -1) {
      documentation.splice(termsIndex, 0, quickstart)
    } else { //no terms & conds
      documentation.push(quickstart)
    }
  }
  var termsLink = queryParams.termsLink;
  if(termsLink !== undefined && termsLink.length > 0 && termsIndex === -1){
    var textTerms = fs.readFileSync(__dirname + "/../" + 'templates/documentation/TERMSANDCONDS.md', 'utf8');
    textTerms = textTerms.replace("\"api-name\"", apiName)
    textTerms = textTerms.replace("\"terms-link\"", termsLink)
    var terms = {
      title: 'Terms & Conditions',
      content: textTerms
    }
    documentation.push(terms)
  }
  if(resourceIndex === -1){
    var textResources = fs.readFileSync(__dirname + "/../" + 'templates/documentation/RESOURCES.md', 'utf8');
    var resources = {
      title: 'Related resources',
      content: textResources
    }
    documentation.push(resources)
  }

  ramlObj['documentation'] = documentation;
  return ramlObj;
}

router.get('/api_market/:filename', function(request, response, next) {
  var ramlFile = './raml/' + request.params.filename
  var config = raml2html.getDefaultConfig('./templates/api_market/documentation.nunjucks', __dirname+'/..');
  console.log('template ',ramlFile)

  var customConfig = {
    processRamlObj: function(ramlObj) {
      /**
       * Custom raml obj process
       */
      //ramlObj = preprocessRamlObj(ramlObj, request.query)
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
