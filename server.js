const express = require("express");
const mongoose = require("mongoose");
// creates an express application
const app = express();

async function connectDb() {
  await mongoose.connect("mongodb://127.0.0.1:27017/tutorial");

  console.log("mongodb connected");
}
connectDb();

const todoSchema = new mongoose.Schema({
  job: {
    type: String,
    required: true,
    maxlength: 255,
  },
  description: {
    type: String,
    maxlength: 1050,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

const Todo = mongoose.model("Todo", todoSchema);

// crud operations

const createJob = async (req, res) => {
  try {
    const { job, description, completed } = req.body;

    const newJob = new Todo({
      job,
      description,
      completed,
    });

    const response = await newJob.save();

    return res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json("server error");
  }
};
// http://localhost:5000/todo/:1
const getJob = async (req, res) => {
  const param = req.params.id;

  try {
    const todo = await Todo.findById({ _id: param });

    return res.status(200).json(todo);
  } catch (error) {
    return res.status(500).json("server error");
  }
};

const updateTodo = async (req, res) => {
  const todoId = req.params.id;
  try {
    Todo.findByIdAndUpdate(
      { _id: todoId },
      { $set: req.body },
      { new: true },
      (err, data) => {
        if (err || !data) return res.status(404).json("todo was not found");

        return res.status(200).json("todo updated");
      }
    );
  } catch (error) {
    return res.status(500).json("server error");
  }
};

const DeleteTodo = async (req, res) => {
  const todoId = req.params.id;
  try {
    await Todo.findByIdAndRemove({ _id: todoId });

    return res.status(200).json("todo was deleted");
  } catch (error) {
    return res.status(500).json("server error");
  }
};

const getTodos = async (req, res) => {
  try {
    const response = await Todo.find();

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json("server error");
  }
};
app.use(express.json());

app.post("/todo", createJob);
app.delete("/todo/delete/:id", DeleteTodo);
app.get("/todo/:id", getJob);
app.put("/todo/update/:id", updateTodo);
app.get("/todos", getTodos);

app.get("*", () => console.log("running"));
const port = 5000;

app.listen(port, () => {
  console.log(`server started on port ${port}`);
});
