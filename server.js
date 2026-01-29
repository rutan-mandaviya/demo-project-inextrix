import express from "express";
import "dotenv/config";
import { connectDB } from "./src/db/db.js";
import agentAuth from "./src/routes/agent.routes.js"
import cookieParser from "cookie-parser";
import customerRoutes from "./src/routes/customer.routes.js";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";


const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API",
      version: "1.0.0"
    },
    servers: [{ url: "http://localhost:3000" }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer"
        }
      }
    }
  },
  apis: ["./src/routes/*.js"]
};


const swaggerSpec = swaggerJsdoc(options);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(cookieParser());
app.use("/uploads", express.static("uploads"));
app.get('/',(req,res)=>{
  res.end("heyyyy")
})

app.use('/auth/agent',agentAuth)
app.use("/customers", customerRoutes);
app.listen(PORT, () => {
  console.log(`🚀 Server started on http://localhost:${PORT}`);
});
