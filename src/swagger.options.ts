import swaggerJSDoc, { Options } from 'swagger-jsdoc';

const options: Options = {
    swaggerDefinition: {
        restapi: '3.0.0',
        info: {
            title: 'minimum-social Topic API',
            version: '1.0.0',
            description: 'topic-server: https://github.com/young1ll/minimum-social-topic',
        },
        server: [
            {
                url: `http://localhost:${process.env.PORT}`,
            },
        ],
    },
    apis: ['./src/api/*.ts', './src/api/swagger/*'],
};

export const specs = swaggerJSDoc(options);
