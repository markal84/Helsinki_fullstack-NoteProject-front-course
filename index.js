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

// wrong endpoint
const unknownEndpoint = (response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

// error handler
const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  next(error);
};

/*
app.get("/", (request, response) => {
  response.send("<h1>Persons list</h1>");
});
*/

app.get(API_URL, (request, response, next) => {
  Person.find({})
    .then((persons) => {
      response.json(persons);
    })
    .catch((error) => next(error));
});

app.get("/info", (request, response, next) => {
  const date = new Date();

  Person.find({})
    .then((persons) => {
      response.send(`
        <div>Phonebook has info for ${persons.length} people</div>
        <p>${date}</p>
        `);
    })
    .catch((error) => next(error));
});

/*

*/

app.get(`${API_URL}/:id`, (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => {
      next(error);
    });
});

app.delete(`${API_URL}/:id`, (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => next(error));
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

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((savedPerson) => {
    response.json(savedPerson);
  });
});

app.put(`${API_URL}/:id`, (request, response, next) => {
  const body = request.body;

  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => {
      next(error);
    });
});

app.use(unknownEndpoint);
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
