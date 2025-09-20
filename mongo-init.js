// MongoDB initialization script
db = db.getSiblingDB('project-management');

// Create a user for the application
db.createUser({
  user: 'appuser',
  pwd: 'apppassword',
  roles: [
    {
      role: 'readWrite',
      db: 'project-management'
    }
  ]
});

// Create collections with validation
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['name', 'email', 'password'],
      properties: {
        name: {
          bsonType: 'string',
          minLength: 1
        },
        email: {
          bsonType: 'string',
          pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        },
        password: {
          bsonType: 'string',
          minLength: 6
        }
      }
    }
  }
});

db.createCollection('projects', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['title', 'owner'],
      properties: {
        title: {
          bsonType: 'string',
          minLength: 1
        },
        description: {
          bsonType: 'string'
        },
        owner: {
          bsonType: 'objectId'
        }
      }
    }
  }
});

db.createCollection('tasks', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['title', 'project'],
      properties: {
        title: {
          bsonType: 'string',
          minLength: 1
        },
        description: {
          bsonType: 'string'
        },
        project: {
          bsonType: 'objectId'
        },
        status: {
          bsonType: 'string',
          enum: ['ToDo', 'InProgress', 'Done']
        },
        priority: {
          bsonType: 'string',
          enum: ['Low', 'Medium', 'High']
        }
      }
    }
  }
});

db.createCollection('notifications', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['user', 'type', 'message'],
      properties: {
        user: {
          bsonType: 'objectId'
        },
        type: {
          bsonType: 'string',
          enum: ['invitation', 'task_assigned', 'task_updated', 'project_updated']
        },
        message: {
          bsonType: 'string',
          minLength: 1
        },
        read: {
          bsonType: 'bool'
        }
      }
    }
  }
});

print('Database initialized successfully!');
