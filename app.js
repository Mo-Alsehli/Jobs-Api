require("dotenv").config();
require("express-async-errors");
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");
const express = require("express");
const app = express();
const authRouter = require("./routes/auth");
const jobsRouter = require("./routes/jobs");
const connectDB = require("./db/connect");
const authenticateUser = require("./middleware/authentication");
const swaggerUI = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocs = YAML.load("./swagger.yaml");

app.get("/", (req, res) => {
  res.send("<h1>Jobs Api</h1><h1><a href='/api-docs'>Documentation</a></h1>");
});

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.set("trust porxy", 1);
app.use(
  rateLimiter({
    windowsMs: 15 * 60 * 1000,
    max: 100,
  })
);
app.use(express.json());
// extra packages
app.use(helmet());
app.use(cors());
app.use(xss());

// routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", authenticateUser, jobsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
