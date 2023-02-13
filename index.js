require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");

const app = express();

// middleware definitions
app.use(cors());
app.use(express.static("build"));
app.use(express.json());

// api url
const API_URL = "/api/persons";

// create custom config morgan middleware
morgan.token("body", (request) => JSON.stringify(request.body));
app.use(
  morgan(":method :url :status :response-time ms - :res[content-length] :body")
);

let persons = [];

app.get("/", (request, response) => {
  response.send("<h1>Persons list</h1>");
});

app.get(API_URL, (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

app.get("/info", (request, response) => {
  const date = new Date();
  response.send(
    `
    <div>Phonebook has info for ${persons.length} people</div>
    <p>${date}</p>
    `
  );
});

app.get(`${API_URL}/:id`, (request, response) => {
  Person.findById(request.params.id).then((person) => {
    response.json(person);
  });
});

app.delete(`${API_URL}/:id`, (request, response) => {
  const id = Number(request.params.id);

  // create copy of persons array without deleted person
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

app.post(API_URL, (request, response) => {
  const body = request.body;

  // check if name or number is missing
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "name or number is missing",
    });
  }

  // check if there is person with the same name
  /*
  if (persons.some((person) => person.name === body.name)) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }
  */

  /*
  const person = {
    id: uuidv4(),
    name: body.name,
    number: body.number,
  };
  */
  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((savedPerson) => {
    response.json(savedPerson);
  });
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
