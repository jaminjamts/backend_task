import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import fs from "fs";
import { error } from "console";

const PORT = 8888;
const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get("/", (request, response) => {
  response.send("hellossdsd");
});
app.post("/", (request, response) => {
  const { username, password } = request.body;

  fs.readFile("./data/users.json", "utf-8", (readError, data) => {
    if (readError) {
      response.json({
        success: false,
        error: error,
      });
    }

    let savedData = data ? JSON.parse(data) : [];

    const registeredUser = savedData.filter(
      (user) => user.name === username && user.password === password
    );

    if (registeredUser.length > 0) {
      response.json({
        success: true,
        user: registeredUser[0],
      });
    } else {
      response.json({
        success: false,
      });
    }
  });
});

app.post("/signup", (request, response) => {
  const { username, email, password } = request.body;
  fs.readFile("./data/users.json", "utf-8", (readError, data) => {
    let savedData = data ? JSON.parse(data) : [];

    if (readError) {
      response.json({
        success: false,
        error: error,
      });
    }

    const newUser = {
      id: Date.now().toString(),
      name: username,
      email: email,
      password: password,
    };
    savedData.push(newUser);

    fs.writeFile("./data/users.json", JSON.stringify(savedData), (error) => {
      if (error) {
        response.json({
          success: false,
          error: error,
        });
      } else {
        response.json({
          success: true,
          user: newUser,
        });
      }
    });
  });
});

app.listen(PORT, () => {
  console.log("Server is runnig on http://localhost:" + PORT);
});
