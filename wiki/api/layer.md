### Layers

Layer info APIs

#### POST /v2/layers/create
##### Parameters
|Type|Name|Description|Required|Schema|Default|
|----|----|----|----|----|----|
|BodyParameter|access_token|user access_token|true|string||
|BodyParameter|title|title of layer|false|string||
|BodyParameter|description|description of layer|false|string|''|
|BodyParameter|legend|legend of layer|false|string|''|
|BodyParameter|metadata|metadata of layer|false|string||
|BodyParameter|data|data of layer|false|object||
|BodyParameter|style|style of layer|false|string||

##### Responses
|HTTP Code|Description|Schema|
|----|----|----|
|200|successful operation|object|
|401|Unauthorized|object|

##### Consumes

* application/json

##### Produces

* application/json

##### Example Request/Response
##### Request
```
POST /v2/layers/create
BODY:
{
    "title": "test ttitle"
    "description": "test description"
    "legend": "test legend"
    "file": "test file"
    "metadata": "test metadata"
    "style": "test style"
    "access_token": "pk.VFknt4ENjxDV1GJ9qgrpwhVzoXa8YS4bZ0CfABDP"
}
```

##### Response
```
{
    "__v": 0,
    "lastUpdated": "2016-03-21T08:37:29.899Z",
    "created": "2016-03-21T08:37:29.899Z",
    "style": "test style",
    "metadata": "test metadata",
    "file": "test file",
    "legend": "test legend",
    "description": "test description",
    "title": "tes ttitle",
    "uuid": "layer-e2575932-b9dc-49c7-8961-27af766defc9",
    "_id": "56efb2c98754485e4eab86fc"
}
```

#### POST /v2/layers/update
##### Parameters
|Type|Name|Description|Required|Schema|Default|
|----|----|----|----|----|----|
|BodyParameter|access_token|user access_token|true|string||
|BodyParameter|layer|uuid of updated layer|true|string||
|BodyParameter|title|new title of updated layer|false|string||
|BodyParameter|description|New description of updated layer|false|string||
|BodyParameter|satellite_position|New satellite_position of updated layer|false|string||
|BodyParameter|copyright|copyright of layer|false|string||
|BodyParameter|tooltip|New tooltip of updated layer|false|object||
|BodyParameter|style|New style of updated layer|false|string||
|BodyParameter|filter|New filter of updated layer|false|string||
|BodyParameter|legends|New legends of updated layer|false|string||
|BodyParameter|opacity|New opacity of updated layer|false|string||
|BodyParameter|zIndex|New zIndex of updated layer|false|number||
|BodyParameter|data|New data of updated layer|false|object||

##### Responses
|HTTP Code|Description|Schema|
|----|----|----|
|200|successful operation|object|
|401|Unauthorized|object|

##### Consumes

* application/json

##### Produces

* application/json

##### Example Request/Response
##### Request

```
POST /v2/layers/update
BODY:
{
    "layer": "layer-e2575932-b9dc-49c7-8961-27af766defc9"
    "title": "new title"
    "description": "new description"
    "satellite_position": "new satellite_position"
    "copyright": "new copyright"
    "tooltip": "new tooltip"
    "style": "new style"
    "filter": "new filter"
    "legends": "new legends"
    "opacity": "new opacity"
    "zIndex": 5
    "access_token": "pk.VFknt4ENjxDV1GJ9qgrpwhVzoXa8YS4bZ0CfABDP"
}
```

##### Response
```
{
    "updated": [
        "satellite_position",
        "description",
        "copyright",
        "title",
        "tooltip",
        "style",
        "filter",
        "legends",
        "opacity",
        "zIndex",
        "data"
    ],
    "layer": {
        "_id": "56efb2c98754485e4eab86fc",
        "lastUpdated": "2016-03-21T08:37:29.899Z",
        "created": "2016-03-21T08:37:29.899Z",
        "style": "new style",
        "metadata": "test metadata",
        "file": "test file",
        "legend": "test legend",
        "description": "new description",
        "title": "new title",
        "uuid": "layer-e2575932-b9dc-49c7-8961-27af766defc9",
        "__v": 0,
        "satellite_position": "new satellite_position",
        "copyright": "new copyright",
        "tooltip": "new tooltip",
        "filter": "new filter",
        "legends": "new legends",
        "opacity": "new opacity",
        "zIndex": 5,
        "data": ""
    }
}
```