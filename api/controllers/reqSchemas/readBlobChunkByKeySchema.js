module.exports =
{
  "type": "object",
  "properties": {
    "key": {
      "type": "string"
    },
    "attr": {
      "type": "string",
      "pattern": "(html|links|resources)$"
    }
  },
  "required": [
    "key",
    "attr"
  ]
};