import e from 'express';
import topicRouter from './api/topic.routes';
import candidateRouter from './api/candidate.routes';
import db from './models';

const { sequelize } = db;

const app = e();
app.use(e.json());
app.use(e.urlencoded({ extended: true }));

app.use('/', topicRouter);
app.use('/', candidateRouter);

sequelize.sync({ alter: true }).then(() => {
    console.log('Database synced');
});

export default app;
