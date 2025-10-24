const express = require ('express');
const cors = require('cors');
const app = express ();
app.use(cors());
app.use (express.json());

let messages = [];

// middleware section

function validateMessage (req,res, next){
  const {sender, text} = req.body;
  if(!sender || !text){
    return res.status(400).json({error: "sender and message text are required"});
  }
  next (); // it continues to the route handler
}

// error handling middleware
function errorHander(err, req, res, next){
  console.error(err.stack);
  res.status(500).json({error: "something went wrong on the server"});
}

//logging middlewwre (logs every request)
function logRequest (req, res, next){
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
}

//apppling logging to all routes
app.use(logRequest);

// route section 
//GET all the messages

app.get ('/messages', (req, res) => {
    res.json(messages);
});
// POST new messages (uses validation middleware)
app.post('/messages', (req, res) => {
  const { sender, text } = req.body;
  const id = messages.length + 1;
  const msg = { id, sender, text, time: new Date().toISOString() };
  messages.push(msg);
  res.status(201).json(msg);
});
//DELETE msg by ID
app.delete('/messages/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = messages.findIndex(m => m.id === id);
  if (index !== -1) {
    messages.splice(index, 1);
    return res.sendStatus(204);
  }
  res.status(404).json({ error: "Message not found" });
});


//starting server

app.listen (3000, () => console.log ('backend running on 3000'));