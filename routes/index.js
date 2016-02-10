var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var values = {
    title: 'documentationRaml',
    ramls: [
      {
        name: 'Account USA',
        file:'accounts_usa.raml'
      },
      {
        name: 'Github',
        file:'github.raml'
      },
      {
        name: 'Example',
        file:'example.raml'
      }
    ],
    options: [
      {
        path: '',
        name: 'Default raml2html Template'
      },
      {
        path: '/api_market',
        name: 'API_Market Template'
      },
      {
        path: '/obj',
        name: 'Object'
      }
    ]
  }
  res.render('index', values);
});

module.exports = router;
