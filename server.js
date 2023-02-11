require('dotenv').config();
const PORT = 4001;

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

const DB = process.env.DATABASE;

app.use(express.json());
app.use(cors());

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

  .then(() => {
    console.log('DB connected!!');
  })
  .catch(console.error);

// import todo Schema
const Todo = require('./models/todo');

app.get('/todos', async (req, res) => {
  const todo = await Todo.find();
  res.json(todo);
});

//adding new todo post method
app.post('/todo/new', (req, res) => {
  const todo = new Todo({
    text: req.body.text,
  });
  todo.save();
  res.json(todo);
});

app.delete('/todos/delete/:id', async (req, res) => {
  const result = await Todo.findByIdAndDelete(req.params.id);
  res.json(result);
});

app.get('/todos/complete/:id', async (req, res) => {
  const todo = await Todo.findById(req.params.id);
  todo.complete = !todo.complete;

  todo.save();
  res.json(todo);
});

app.put('/todo/update/:id', async (req, res) => {
  const todo = await Todo.findById(req.params.id);

  todo.text = req.body.text;

  todo.save();

  res.json(todo);
});

app.listen(PORT, () => {
  console.log(`server up and running on port ${PORT}`);
});
