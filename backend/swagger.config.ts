export default {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'My API Documentation',
        version: '1.0.0',
        description: 'Comprehensive API documentation for my Express project',
        license: {
          name: 'MIT',
          url: 'https://opensource.org/licenses/MIT',
        },
      },
      servers: [
        {
          url: 'http://localhost:9000',
          description: 'Development server',
        },
      ],
    },
    apis: ['./src/rest/*.ts'], 
  };
  