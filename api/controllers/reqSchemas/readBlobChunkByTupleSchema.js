module.exports =
{
  "type": "object",
  "properties": {
    "key": {
      "type": "string"
    },
    "id": {
      "type": "string"
    },
    "attr": {
      "type": "string",
      "pattern": "(html|links|resources)$"
    }
  },
  "required": [
    "key",
    "id",
    "attr"
  ]
};