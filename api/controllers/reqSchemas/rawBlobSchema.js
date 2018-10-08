module.exports = {
  "definitions": {},
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "http://example.com/root.json",
  "type": "object",
  "title": "The Root Schema",
  "required": [
    "html",
    "links",
    "resources"
  ],
  "properties": {
    "html": {
      "$id": "#/properties/html",
      "type": "string",
      "title": "The Html Schema",
      "default": "",
      "examples": [
        "htmlcode"
      ],
      "pattern": "^(.*)$"
    },
    "links": {
      "$id": "#/properties/links",
      "type": "array",
      "title": "The Links Schema",
      "items": {
        "$id": "#/properties/links/items",
        "type": "object",
        "title": "The Items Schema",
        "required": [
          "id",
          "title",
          "uri"
        ],
        "properties": {
          "id": {
            "$id": "#/properties/links/items/properties/id",
            "type": "integer",
            "title": "The Id Schema",
            "default": 0,
            "examples": [
              1
            ]
          },
          "title": {
            "$id": "#/properties/links/items/properties/title",
            "type": "string",
            "title": "The Title Schema",
            "default": "",
            "examples": [
              "link title"
            ],
            "pattern": "^(.*)$"
          },
          "uri": {
            "$id": "#/properties/links/items/properties/uri",
            "type": "string",
            "title": "The Uri Schema",
            "default": "",
            "examples": [
              "link url"
            ],
            "pattern": "^(.*)$"
          }
        }
      }
    },
    "resources": {
      "$id": "#/properties/resources",
      "type": "array",
      "title": "The Resources Schema",
      "items": {
        "$id": "#/properties/resources/items",
        "type": "object",
        "title": "The Items Schema",
        "required": [
          "anchor",
          "position",
          "link"
        ],
        "properties": {
          "anchor": {
            "$id": "#/properties/resources/items/properties/anchor",
            "type": "string",
            "title": "The Anchor Schema",
            "default": "",
            "examples": [
              "anchor"
            ],
            "pattern": "^(.*)$"
          },
          "position": {
            "$id": "#/properties/resources/items/properties/position",
            "type": "string",
            "title": "The Position Schema",
            "default": "",
            "examples": [
              "position"
            ],
            "pattern": "^(.*)$"
          },
          "link": {
            "$id": "#/properties/resources/items/properties/link",
            "type": "integer",
            "title": "The Link Schema",
            "default": 0,
            "examples": [
              1
            ]
          }
        }
      }
    }
  }
}