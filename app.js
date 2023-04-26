require('dotenv').config();
require('express-async-errors');
const connectDB = require('./db/connect');
const express = require('express');
const app = express();

//Swagger
const SwaggerUI = require('swagger-ui-express');
const YAML = require('yamljs')
const swaggerDocument = YAML.load('./swagger.yaml');


//extra security packages
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit')

//Routers
const jobsRouter = require('./routes/jobs');
const authRouter = require('./routes/auth');
const authenticateUser = require('./middleware/authentication')

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(express.json());
app.use('/', SwaggerUI.serve, SwaggerUI.setup(swaggerDocument))
// extra packages
app.set('trust proxy',1)
app.use(rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes time
  max: 100 // Max requests in 15 minute time window
}))
app.use(helmet());
app.use(cors());
app.use(xss());
// routes
app.use('/api/v1/auth',authRouter)
app.use('/api/v1/jobs',authenticateUser, jobsRouter)

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
