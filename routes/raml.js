var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require("fs");

var raml2html = require('raml2html');
var raml2obj = require('raml2obj');

function renderHTML(raml, config, response){
  console.log('RENDER: ',raml)
  raml2html.render(raml, config).then(function(result) {
    response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    response.end(result)
  }, function(error) {
    response.end(error)
  });
}


function parseRamlFilename(request, next){
  if(request.query.url !== undefined)
    return request.query.url
  else if (request.params[0] !== undefined)
    return './raml/' + request.params[0]
  else{
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  }
}
router.get('/obj/*', function(request, response, next) {
  var ramlFile = ''
  var err = undefined
  if(request.query.url !== undefined)
    ramlFile = request.query.url
  else if (request.params[0] !== undefined)
    ramlFile = './raml/' + request.params[0]
  else{
    err = new Error('Not Found');
    err.status = 404;
    next(err);
  }

  console.log('Parse object -> ')
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

router.get('/api_market/*', function(request, response, next) {
  var ramlFile = parseRamlFilename(request, next)

  var config = raml2html.getDefaultConfig('templates/api_market/documentation.nunjucks', __dirname+'/..');

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

  renderHTML(ramlFile, customConfig, response)

});
router.get('/*', function(request, response, next) {
  var ramlFile = parseRamlFilename(request, next)

  var config = raml2html.getDefaultConfig();

  renderHTML(ramlFile, config, response)

});


module.exports = router;
