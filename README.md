# JSON Manager API

This sysyem is a key-value storage service for storage and retrieval of JSON content via REST API. It was built using Node.js and Express. The system also includes some superficial unit tests that depend on Mocha and Chai.

## SLA from 50,000ft

Service clients are allowed to post the following three chunks as the body of the request:

```
{
    "html": "<string>",
    "links": [
        {
            "id": <int>,
            "title": "<string>",
            "uri": "<string>"
        },
        // ...
    ],
    "references": [
        {
            "anchor": "<string>",
            "position": <int>,
            "link": <link-id>
        }
        // ...
    ]
}
``` 

The system exposes a list of endpoints for processing the blob and storing it whole and in chunks.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Dependencies

- Node.js
- Express
- mongoDB
- JSON Schema
- bluebird
- Mocha
- Chai

### Installing

Navigate to /api and install server dependencies

```
cd /api
npm install
```

Start your mongoDB server

```
sudo service mongod start
```

then start the api server

```
npm run start
```

You should see the following output:

```
> json-manager@0.0.0 start /local/path/to/api
> node ./bin/www
```
## Running the tests

To run the automated tests for this system run

```
npm run test
```

Test cases include:
- inserting a blob into the system expecting a response with status of 200
- retrieving whole blobs by key expecting a response with status of 200
- retrieving blob chunks by key expecting a response with status of 200
- retrieving whole blobs by id with missing parameters in the request expecting a response with status of 400
- retrieving blob chunks by id with missing parameters in the request expecting a response with status of 400

## API Endpoints

The following endpoints are supported:

| Endpoint                  | HTTP Method   | Query                         | Body                |Notes    |
| --------------------------|---------------| ------------------------------| --------------------|---------|
| /json/submit              | POST          | {key: String}                 | Refer to req.body format above|Responds with inserted blob's id and a status of 200 if successful.|
| /json/read-by-key         | GET           | {key: String}                 | n/a                 |Responds with entire blob and a status of 200 if successful. When reading blobs by key the most recent version (id) of the blob is retrieved.|
| /json/read-by-tuple          | GET           | {key: String, id: String}                  | n/a                 |Responds with entire blob and a status of 200 if successful.|
| /json/chunk/read-by-key   | GET           | {key: String, attr: String}   | n/a                 |attr must be either "html","links", or "resources". Responds with a blob's chunk selected using the attr parameter and a status of 200 if successful. When reading blob chunks by key the most recent version (id) of the blob is retrieved.|
| /json/chunk/read-by-tuple   | GET           | {key: String, id: String, attr: String}   | n/a                 |attr must be either "html","links", or "resources". Responds with a blob's chunk selected using the attr parameter and a status of 200 if successful.|

## Code discussion

This is the system's directory tree:

```
.
├── api
│   ├── bin
│   │   └── www
│   ├── controllers
│   │   ├── jsonController.js
│   │   ├── reqSchemas
│   │   │   ├── rawBlobSchema.js
│   │   │   ├── readBlobByTupleSchema.js
│   │   │   ├── readBlobChunkByKeySchema.js
│   │   │   ├── readBlobChunkByTupleSchema.js
│   │   │   └── submitBlobSchema.js
│   │   └── utils
│   │       └── promises.js
│   ├── models
│   │   ├── jsonBlobSchema.js
│   │   ├── jsonLinkSchema.js
│   │   ├── jsonMetaSchema.js
│   │   └── jsonResourceSchema.js
│   ├── package.json
│   ├── package-lock.json
│   ├── routes
│   │   └── json.js
│   ├── server.js
│   └── test
│       ├── json.js
│       └── utils
│           ├── dummyBlob.js
│           └── testCases.js
└── README.md
```

It was generated with the `tree` tool.

The executable named `www` inside the `/bin` directory starts the server. Endpoints are defined in files inside the `/api/routes` directory. The `/api/controllers` directory contains the code that actually handles requests and queries the DB. Files inside the `/api/models` directory are used to define the DB schema. Each incoming request's query and body is validated with a set of promises found inside `/api/controllers/utils`. Some of these promises are used to support response handling.

npm's `jsonschema` package is used to validate the structure and content of each incoming request's body and query objects. This makes sure stored blobs contain what was agreed on in the SLA and request are handled with the expected content. JSON schemas for each type of request can be found inside the `/api/controllers/reqSchemas` directory.

The DB is managed by npm's `mongoose` package and the following tables were created to store entire blobs and blob chunks:

| Table name                | Description |
| --------------------------|---------------|
| JSONMeta                  | Stores metadata about a json blob: unique id used as foreign key in all other tables, a key, a list of unique link ids, a list of unique resource ids, a creation date timestamp, and each blob's html content for quick retireval. Indexed by key and unique id. |
| JSONBlob                  | Stores entire blob under the `content` column. Also stores a unique id and a foreign key to the JSONMeta table in the `metaId` column. Indexed by `metaId` and unique id. Stores a duplicate of the blob's key and creation date.|
| Link                  | Stores a blob's link content (id, title, uri) for each link in a blob. Also stores a unique id and a foreign key to the JSONMeta table in the `metaId` column. Indexed by `metaId` and unique id. Stores a duplicate of the blob's key and creation date.|
| Resource                  | Stores a blob's resource content (anchor, position, link) for each resource in a blob. Also stores a unique id and a foreign key to the JSONMeta table in the `metaId` column. Indexed by `metaId` and unique id. Stores a duplicate of the blob's key and creation date.|

Blobs are stored whole in the JSONBlob table. Separate tables were created for each blob chunk to avoid reading the complete record every time a chunk was needed. Each blob's key and creation date were stored in every table once at creation time. This allowed for simpler queries.

## Assumptions

1) Blob keys are generated client-side and sent along with request body when submitting a blob.

2) Reading blobs and blob chunks by key will return the blob/chunk with the most recent timestamp.

## Author

* **Brian Landron** - *Initial work* - [juiceboxjoe](https://github.com/juiceboxjoe)    
