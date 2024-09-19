import express, { Express, Response, Request } from "express";

const app: Express = express();
const port: number = 3000;

app.set("views", "./views");
app.set("view engine", "pug");

app.get("/topics", (req: Request, res: Response) => {
  res.render("client/pages/topics/index.pug");
});

app.listen(port, () => {
  console.log(`App listen on port ${port}`);
});
