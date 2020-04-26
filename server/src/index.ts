import sourceMapSupport from "source-map-support";

import express from "express";
import bodyParser from "body-parser";

sourceMapSupport.install();

const PORT = 8080;

const app = express();

app.use(bodyParser.raw());

app.get("/", (req, res) => {
  console.log("handling get");
  return res.send("Hello World!");
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}.`));
