// Copyright 2017, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

const Datastore = require('@google-cloud/datastore');
const config = require('../config');

// [START config]
const ds = Datastore({
  projectId: config.get('GCLOUD_PROJECT')
});
const kind = 'Book';
// [END config]

function fromDatastore (obj) {
  obj.id = obj[Datastore.KEY].id;
  return obj;
}

// Product query added - PJ
function query (token, cb) {
  const q = ds.createQuery([kind]);

  ds.runQuery(q, (err, entities, nextQuery) => {
    if (err) {
      cb(err);
      return;
    }
    cb(null, entities.map(fromDatastore));
  });
}
// [END query]

// Product search query added - PJ
function filterQuery (token, cb) {
  const q = ds.createQuery([kind])
    .filter('title', '>=', token)
    .filter('title', '<',  token + '\ufffd');
   // .limit(100);

  ds.runQuery(q, (err, entities, nextQuery) => {
    if (err) {
      cb(err);
      return;
    }
    cb(null, entities.map(fromDatastore));
  });
}
// [END query]

// [START exports]
module.exports = {
  query,
  filterQuery
};
// [END exports]
