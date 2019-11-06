const express = require("express");
const app = express();

app.use(express.static(__dirname + '/public/dist/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/task_api", { useNewUrlParser: true });

const TaskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    compleated: Boolean,
}, { timestamps: true });

const TaskApi = mongoose.model("TaskApi", TaskSchema);
const flash = require('express-flash');
app.use(flash());

app.get("/", (req, res) => {
    TaskApi.find()
        .then(d => res.json(d))
        .catch(err => res.json(err));
});

app.post("/new/:title", (req, res) => {
    const title = req.params.title;
    console.log("************", title);
    const taskApi = new TaskApi(req.body);
    taskApi.title = title;
    taskApi.compleated = false;
    TaskApi.create(taskApi)
        .then(a => res.json(a))
        .catch(err => res.json(err));
});

app.get("/:id", (req, res) => {
    const id = req.params.id;
    console.log("************", { id });
    TaskApi.findOne({ _id: id })
        .then(A => res.json(A))
        .catch(err => res.json(err));
});

app.put("/edit/:id", (req, res) => {
    const { id } = req.params;
    console.log(id);
    TaskApi.update({ _id: id }, { $set: req.body })
        .then(d => res.json({ msg: "Successfully edit", d: d }))
        .catch(err => res.json({ message: "Error", error: err }));
});

app.delete("/remove/:id", (req, res) => {
    const { id } = req.params;
    console.log(id);
    TaskApi.remove({ _id: id })
        .then(r => res.json(r))
        .catch(err => res.json(err));
});

app.listen(8000, () => console.log("listening on port 8000"));