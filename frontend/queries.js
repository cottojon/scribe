var promise = require('bluebird');

var options = {
  // Initialization Options
  promiseLib: promise
};

// Load and initialize pg-promise:
var pgp = require('pg-promise')(options);

// Database connection parameters:
const config = {
  host: 'db',
  //host: 'localhost',
  port: 5432,
  database: 'scribeDB',
  user: 'postgres',
  password: 'p455w0rd'
};
// Create database instance:
var db = pgp(config);

// add query functions
function getClips(req, res, next) {
  var query = 'SELECT clips.*, channel.name as channel_name FROM clips ' +
    'INNER JOIN channel on clips.channel_id = channel.id ' +
    'WHERE LOWER(text) LIKE LOWER(\'%' + req.query.text + '%\') ' +
    (req.query.channel_id === '' ? '' : 'and channel_id = ' + req.query.channel_id + ' ') +
    'and LOWER(speaker) LIKE LOWER(\'%' + req.query.speaker + '%\') ' +
    'and LOWER(channel.name) LIKE LOWER(\'%' + req.query.channel_name + '%\') ' +
    'and created_at >= (TO_TIMESTAMP(\'' + req.query.start_date + '\', \'yyy-mm-ddThh24:mi:ss.ffZ\') at time zone \'EST\') at time zone \'UTC\'' +
    'and created_at <= (TO_TIMESTAMP(\'' + req.query.end_date + '\', \'yyy-mm-ddThh24:mi:ss.ffZ\') at time zone \'EST\') at time zone \'UTC\';';

  db.any(query)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ' + data.length + ' clips'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}
function createClip(req, res, next) {
  req.body.channel_id = parseInt(req.body.channel_id);
  db.none('insert into clips(channel_id, text, revised, path_to_file)' +
    'values(${channel_id}, ${text}, ${time}, ${revised}), ${path_to_file}',
    req.body)
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Inserted one clip'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}
function updateClip(req, res, next) {
  console.log("Text: " + req.body.text + " - ID: " + req.body.id);
  db.none('update clips set text=$1, revised=true where id=$2',
    [req.body.text, parseInt(req.body.id)])
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Updated Clip'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function removeClip(req, res, next) {
  var clipID = parseInt(req.params.id);
  db.result('delete from clips where id = $1', clipID)
    .then(function (result) {
      /* jshint ignore:start */
      res.status(200)
        .json({
          status: 'success',
          message: `Removed ${result.rowCount} clip`
        });
      /* jshint ignore:end */
    })
    .catch(function (err) {
      return next(err);
    });
}

function getChannels(req, res, next) {
  console.log(db.host);
  var query = "SELECT * FROM channel "
    + "WHERE LOWER(name) LIKE LOWER('%" + req.query.name + "%')";

  db.any(query)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ' + data.length + ' channels'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

module.exports = {
  getClips: getClips,
  createClip: createClip,
  updateClip: updateClip,
  removeClip: removeClip,

  getChannels: getChannels
};
