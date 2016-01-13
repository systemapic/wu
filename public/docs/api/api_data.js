define({ "api": [
  {
    "type": "post",
    "url": "/api/project/create",
    "title": "Create a project",
    "name": "create",
    "group": "Project",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Name of project</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>A valid access token</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "JSON",
            "optional": false,
            "field": "Project",
            "description": "<p>JSON object of the newly created project</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/routes.js",
    "groupTitle": "Project",
    "sampleRequest": [
      {
        "url": "https://dev.systemapic.com/api/project/create"
      }
    ],
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>The <code>access_token</code> is invalid. (403)</p>"
          }
        ]
      }
    }
  },
  {
    "type": "post",
    "url": "/api/project/delete",
    "title": "Delete a project",
    "name": "delete",
    "group": "Project",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "projectUuid",
            "description": "<p>Uuid of project</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>A valid access token</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "project",
            "description": "<p>ID of deleted project</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "deleted",
            "description": "<p>Boolean</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n  \"project\": \"project-o121l2m-12d12dlk-addasml\",\n  \"deleted\": true\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/routes.js",
    "groupTitle": "Project",
    "sampleRequest": [
      {
        "url": "https://dev.systemapic.com/api/project/delete"
      }
    ],
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>The <code>access_token</code> is invalid. (403)</p>"
          }
        ]
      }
    }
  },
  {
    "type": "post",
    "url": "/api/portal",
    "title": "Get portal store",
    "name": "getPortal",
    "group": "User",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "Projects",
            "description": "<p>Projects that user have access to</p>"
          },
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "Datasets",
            "description": "<p>Datasets that user owns or have access to</p>"
          },
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "Contacts",
            "description": "<p>Contacts that user has in contact list</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/routes.js",
    "groupTitle": "User",
    "sampleRequest": [
      {
        "url": "https://dev.systemapic.com/api/portal"
      }
    ],
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>The <code>access_token</code> is invalid. (403)</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>A valid access token</p>"
          }
        ]
      }
    }
  }
] });
