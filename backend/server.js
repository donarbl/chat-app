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
  const { sender, text } = req.body;
  // If sender or text is missing, send an error response
  if (!sender || !text) {
    return res.status(400).json({ error: "Sender and message text are required." });
  }
  const id = messages.length + 1;
  const msg = { id, sender, text, time: new Date().toISOString() };
  messages.push(msg);
  res.status(201).json(msg);
});

app.delete('/messages/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = messages.findIndex(m => m.id === id);
  if (index !== -1) {
    messages.splice(index, 1);
    return res.sendStatus(204);
  }
  res.status(404).json({ error: "Message not found" });
});



app.listen (3000, () => console.log ('backend running on 3000'));