'use strict';

const Promises = require('./utils/promises')
const RawBlobSchema = require('./reqSchemas/rawBlobSchema')
const SubmitBlobSchema = require('./reqSchemas/submitBlobSchema')
const ReadBlobByTupleSchema = require('./reqSchemas/readBlobByTupleSchema')
const ReadBlobChunkByTupleSchema = require('./reqSchemas/readBlobChunkByTupleSchema')
const ReadBlobChunkByKeySchema = require('./reqSchemas/readBlobChunkByKeySchema')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId;
const JSONMeta = mongoose.model('JSONMeta');
const JSONBlob = mongoose.model('JSONBlob');
const Link = mongoose.model('Link');
const Resource = mongoose.model('Resource');

const blobChunks = ["html", "links", "resources"]
const blobChunkModels = [JSONMeta, Link, Resource]

exports.list = (req, res) => {
  JSONBlob.find({}, function(e, blobs) {
    if (e)
      return Promises.handleError(req, res, e);
    return Promises.handleSuccess(req, res, blobs);
  });
};

exports.submitBlob = (req, res) => {
  Promises.hasValidQueryAndSchema(req, res, SubmitBlobSchema)
    .then(() => {
      Promises.hasValidBodyAndSchema(req, res, RawBlobSchema)
        .then(() => {
          saveBlob(req, res)
        })
        .catch((e) => {
          return Promises.handleError(req, res, e);
        });
    })
    .catch((e) => {
      return Promises.handleError(req, res, e);
    });
};

exports.readBlobByKey = (req, res) => {
  Promises.hasValidQueryAndSchema(req, res, SubmitBlobSchema)
    .then(() => {
      JSONBlob
        // assumption - retrieve most recent blob version when searching by key
        .find({metaKey: req.query.key}, 'content -_id').sort('-metaCreationDate').limit(1).exec((e, blob) => {
          if (e)
            return Promises.handleError(req, res, e);
          const blobContent = blob.length > 0 ? blob[0].content : {};
          return Promises.handleSuccess(req, res, blobContent); 
      });
    })
    .catch((e) => {
      return Promises.handleError(req, res, e);
    });
};

exports.readBlobByTuple = (req, res) => {
  Promises.hasValidQueryAndSchema(req, res, ReadBlobByTupleSchema)
    .then(() => {
      JSONBlob
        .find({metaId: req.query.id, metaKey:req.query.key}, 'content -_id', (e, blob) => {
          if (e)
            return Promises.handleError(req, res, e);
          const blobContent = blob.length > 0 ? blob[0].content : {};
          return Promises.handleSuccess(req, res, blobContent);
      });
    })
    .catch((e) => {
      return Promises.handleError(req, res, e);
    });
};

exports.readBlobChunkByKey = (req, res, next) => {
  Promises.hasValidQueryAndSchema(req, res, ReadBlobChunkByKeySchema)
    .then(() => {
      if(req.query.attr == 'html'){
        JSONMeta
          // assumption - retrieve most recent blob version when searching by key
          .find({key: req.query.key}).sort('-creationDate').limit(1).exec((e, blobMeta) => {
            if (e)
              return Promises.handleError(req, res, e);
            const html = blobMeta.length > 0 ? blobMeta[0].html : "";
            return Promises.handleSuccess(req, res, html);
          })
      }
      else{
        readChunk(req, res, req.query.key)
      }
    })
    .catch((e) => {
      return Promises.handleError(req, res, e);
    });
};

exports.readBlobChunkByTuple = (req, res, next) => {
  Promises.hasValidQueryAndSchema(req, res, ReadBlobChunkByTupleSchema)
    .then(() => {
      if(req.query.attr == 'html'){
        JSONMeta
          .find({_id: req.query.id, key: req.query.key}, (e, blobMeta) => {
            if (e)
              return Promises.handleError(req, res, e);
            const html = blobMeta.length > 0 ? blobMeta[0].html : "";
            return Promises.handleSuccess(req, res, html);
          })
      }
      else{
        readChunk(req, res, req.query.key, req.query.id)
      }
    })
    .catch((e) => {
      return Promises.handleError(req, res, e);
    });
};

const saveBlob = (req, res) => {
  var newJSONMeta = new JSONMeta({key: req.query.key, html: req.body.html});
  newJSONMeta.save((e, jsonMeta) => {
    if (e)
      return Promises.handleError(req, res, e);

    // save entire blob for quick retrieval
    var newJSONBlob = new JSONBlob({
      metaId: jsonMeta._id,
      metaKey: jsonMeta.key,
      metaCreationDate: jsonMeta.creationDate,
      content: req.body
    });

    newJSONBlob.save((e, jsonBlob) => {
      // save blob chunks

      let links = [];

      for(let i = 0; i < req.body.links.length; i++){
        links.push({
          metaId: jsonMeta._id,
          metaKey:jsonMeta.key,
          metaCreationDate: jsonMeta.creationDate,
          content: {
            id: req.body.links[i].id,
            title: req.body.links[i].title,
            uri: req.body.links[i].uri
          }
        });
      }
      
      Link.insertMany(links, (e, l) => {
        if (e) 
          return Promises.handleError(req, res, e);

        let resources = [];

        for(let j = 0; j < req.body.resources.length; j++){
          resources.push({
            metaId: jsonMeta._id,
            metaKey:jsonMeta.key,
            metaCreationDate: jsonMeta.creationDate,
            content: {
              anchor: req.body.resources[j].anchor,
              position: req.body.resources[j].position,
              link: req.body.resources[j].link
            }
          });
        }

        Resource.insertMany(resources, (e, r) => {
          if (e) 
            return Promises.handleError(req, res, e);
          // finished inserting blob - comply with SLA by responding with fresh blob id
          return Promises.handleSuccess(req, res, jsonMeta._id);
        })
      })
    })
  })
}

const readChunk = (req, res, key, id) => {
  if(key && id){
    blobChunkModels[blobChunks.indexOf(req.query.attr)]
      // group by date to avoid post processing of content
      .aggregate([
        {
          $match : {
            metaId: ObjectId(id),
            metaKey: key
          }
        },
        {
          $group : {
            _id: '$metaCreationDate',
            content: {$push: '$content'}
          }
        },
      ])
      .exec(
      (e, chunk) => {
        if (e)
          return Promises.handleError(req, res, e);
        const content = chunk.length > 0 ? chunk[0].content : [];
        return Promises.handleSuccess(req, res, content);
      });
  }
  else if(key && !id){
    blobChunkModels[blobChunks.indexOf(req.query.attr)]
      // assumption - retrieve most recent blob version when searching by key
      .aggregate([
        {
          $match : {metaKey: key}
        },
        {
          $group : {
            _id: '$metaCreationDate',
            content: {$push: '$content'}
          }
        },
        {
          $limit: 1
        }
      ])
      .exec((e, chunk) => {
        if (e)
          return Promises.handleError(req, res, e);
        const content = chunk.length > 0 ? chunk[0].content : [];
        return Promises.handleSuccess(req, res, content);
      });
  }
  
}