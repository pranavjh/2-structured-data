// Copyright 2017, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the "License") 

// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http//www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

const express = require('express');
const bodyParser = require('body-parser');

function getModel () {
  return require(`./model-${require('../config').get('DATA_BACKEND')}`);
}

const router = express.Router();

// Automatically parse request body as form data
router.use(bodyParser.urlencoded({ extended: false }));

// Set Content-Type for all responses for these routes
router.use((req, res, next) => {
  res.set('Content-Type', 'text/html');
  next();
});

router.get('/products', (req, res, next) => {
  getModel().query(req.query.pageToken, (err, entities, cursor) => {
  //getModel().query(req.body.inputText, (err, entities) => {
    if (err) {
      next(err);
      return;
    }
    res.render('books/list', {
      books: JSON.stringify(entities, ['title'])
    });
  });
});

/*
router.get('/search', (req, res, next) => {
  res.render('books/search', {
    books: {},
    value: "test"
  });
});
*/

router.get('/search', (req, res, next) => {
  res.render('books/searchInit', {
    books: {}
  });
});

router.get('/search/:tags', (req, res, next) => {
  /*
  const data = req.body;
  var token = '';
  Object.keys(data).forEach((k) => {
    if (k == 'tags') {
      token = data[k];
    }
  });
  */

  getModel().filterQuery(req.params.tags, (err, entities) => {
    if (err) {
      next(err);
      return;
    }
    res.render('books/search', {
      books: JSON.stringify(entities, ['title']),
      value: req.params.tags
    });
    //res.write("<html><body><h1>Yay!! Yippee!!!</h1></body></html>");
    //res.end();
  });
});

/**
 * Errors on "/books/*" routes.
 */
router.use((err, req, res, next) => {
  // Format error and forward to generic error handler for logging and
  // responding to the request
  err.response = err.message;
  next(err);
});

module.exports = router;
