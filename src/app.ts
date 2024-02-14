import e from 'express';
import topicRouter from './api/topic.routes';
import candidateRouter from './api/candidate.routes';
import votedRouter from './api/voted.routes';
import db from './models';

import swaggerUi from 'swagger-ui-express';
import { specs } from './swagger.options';
import { startScheduler } from './utils/scheduler';
import { updateViewInDatabase } from './utils/redis/save-database';

const { sequelize } = db;

const app = e();
app.use(e.json());
app.use(e.urlencoded({ extended: true }));

app.use('/', topicRouter);
app.use('/', candidateRouter);
app.use('/', votedRouter);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));

startScheduler({
    cronExpression: '*/10 * * * *', // every 10minutes
    scheduledFn: updateViewInDatabase,
    options: { scheduled: true, timezone: 'Asia/Seoul' },
});

sequelize
    .sync({
        alter: true,
        // force: true,
    })
    .then(() => {
        console.log('Database synced');
    });

export default app;
