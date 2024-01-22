import e from 'express';
import topicRouter from './api/topic.routes';

const app = e();
app.use(e.json());
app.use(e.urlencoded({ extended: true }));

app.use('/', topicRouter);

export default app;
