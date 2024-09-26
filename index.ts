import express, { Express } from "express";
import * as database from "./config/database";
import dotenv from "dotenv";

import adminRoutes from "./routes/admin/index.route";
import clientRoutes from "./routes/client/index.route";
import { systemConfig } from "./config/config";
import path from "path";
// import bodyParser from "body-parser";

dotenv.config();

database.connect();

const app: Express = express();
const port: number | string = process.env.PORT || 3000;

app.use(express.json());
// app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static("public"));

app.set("views", "./views");
app.set("view engine", "pug");

// Tiny MCE
app.use(
  "/tinymce",
  express.static(path.join(__dirname, "node_modules", "tinymce"))
);

// App Local Variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;

// Client Routes
clientRoutes(app);

// Admin Routes
adminRoutes(app);

app.listen(port, () => {
  console.log(`App listen on port ${port}`);
});
