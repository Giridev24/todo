const express = require("express");
require('dotenv').config()
const app = express();
const mongoose = require("mongoose");
const SampleModel = require("./sample");
const port = process.env.PORT;
const uri = process.env.MONGO_URL
const cors = require("cors");

app.use(express.json());
app.use(cors(
  {
  origin: frontendURL, // Allow requests from this origin
  methods: ['GET', 'POST', 'DELETE'], // Allow these HTTP methods
  allowedHeaders: ['Content-Type'], // Allow these headers
}
));

mongoose.connect(uri)
.then(() => console.log('Connected to MongoDB Atlas'))
.catch(err => console.error('Error connecting to MongoDB Atlas', err));



app.get("/home", async (req, res) => {
  try {
    const todos = await SampleModel.find();
    return res.status(200).json(todos);
    console.log("backend data collected successfully")
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error fetching data" });
  }
});

app.post("/home", async (req, res) => {
  try {
    const todo = req.body.todo;
    await SampleModel.create({
      todo: todo,
    });
    res.status(201).json({ message: "Order placed successfully!" });
  } catch (error) {
    console.error("Error uploading order details:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.put('/home/:id', async (req, res) => {
  const { id } = req.params;
  const { todo } = req.body;
  try {
    const updatedTodo = await SampleModel.findByIdAndUpdate(id, { todo }, { new: true });
    if (!updatedTodo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    res.json(updatedTodo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});
app.delete("/home/:id", async (req,res) => {
  try {
    const del = req.params.id;
    await SampleModel.findByIdAndDelete(del);
    const result = await SampleModel.find();
    res.json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error deleting data" });
  }
});

app.listen(port, () => {
  console.log("Server is running on port", port);
});
