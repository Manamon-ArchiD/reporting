import express from 'express';
import setupSwagger from './config/swagger'
import reportingRoutes from './routes/reporting.routes';

const app = express();
const port = 3000;


app.use(express.json());


app.use('/report', reportingRoutes);


setupSwagger(app);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  console.log(`Swagger documentation available at http://localhost:${port}/api-docs`);
});

export default app;
