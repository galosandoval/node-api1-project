const express = require("express");
const shortid = require("shortid");

console.log(shortid.generate());

const server = express();
server.use(express.json());

const schema = [
  {
    id: shortid.generate(),
    // id: 1,
    name: "Jane Doe",
    bio: "Not Tarzan's Wife, another Jane",
  },
  {
    id: shortid.generate(),
    name: "John Doe",
    bio: "Anonymous homie",
  },
];

server.get("/api/users", (req, res) => {
  try {
    res.status(200).json({ data: schema });
  } catch (error) {
    res.status(500).json({
      message:
        '{ errorMessage: "The users information could not be retrieved." }',
    });
  }
});

server.get("/api/users/:id", (req, res) => {
  const id = req.params.id;
  const getUser = schema.find((user) => user.id === id);
  try {
    if (!getUser) {
      res
        .status(404)
        .json({
          message:
            '{ message: "The user with the specified ID does not exist." }',
        });
    } else {
      res.status(200).json(getUser);
    }
  } catch(error){
    res.status(500).json({message: '{ errorMessage: "The user information could not be retrieved." }'})
  }
});

server.post("/api/users", (req, res) => {
  const body = req.body;

  schema.push(body);
  try {
    if (!body.name || !body.bio) {
      res.status(400).json({
        message:
          '{ errorMessage: "Please provide name and bio for the user." }',
      });
    } else {
      res.status(201).json({ data: schema });
    }
  } catch (error) {
    res.status(500).json({
      message:
        '{ errorMessage: "There was an error while saving the user to the database" }',
    });
  }
});

server.delete("/api/users/:id", (req, res) => {
  const id = req.params.id;

  let newData = schema.filter((data) => data.id !== id);

  try {
    if (!newData) {
      res
      .status(404)
      .json({
        message:
        '{ message: "The user with the specified ID does not exist." }',
      });
    } else {
      res.status(200).json({ newData });
    }
  } catch(error){
    res.status(500).json({message: '{ errorMessage: "The user information could not be retrieved." }'})
  }
});

server.put("/api/users/:id", (req, res) => {
  const change = req.body;
  const id = req.params.id;
  let found = schema.find((d) => d.id === id);

  try {
    if (found) {
      Object.assign(found, change);
      res.status(200).json(found);
    } else if(!change.name || !change.bio) {
      res.status(400).json({message: '{ errorMessage: "Please provide name and bio for the user." }'})
    } 
    else {
      res.status(404).json({ message: "{ message: The user with the specified ID does not exist. }" });
    }
  } catch(error){
    res.status(500).json({message: '{ errorMessage: "The user information could not be modified." }'})
  }
});

const port = 8000;
server.listen(port, () => console.log("Server is Running"));
