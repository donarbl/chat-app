const express = require ('express');
const cors = require('cors');
const app = express ();
app.use(cors());
app.use (express.json());

let messages = [
    { id: 1, sender: "Alice", text: "Hello"},
    {id: 2, sender: "Bob", text: "Hiya!"}
];

app.get ('/messages', (req, res) => {
    res.json(messages);
});

app.post('/messages', (req, res) => {
    const {sender, text} = req.body;
    const id = messages.lenth + 1;
    const msg = {id, sender, text};
    messages.push(msg);
    res.status(201).json(msg);
});

app.listen (3000, () => console.log ('backend running on 3000'));