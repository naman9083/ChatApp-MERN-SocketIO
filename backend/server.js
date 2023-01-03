const express = require("express");
const Chats = require('./data/data');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

require("dotenv").config();

app.get("/", (req, res) => {
  res.send("Hello World!");
  console.log("Cheers to Dawn to Disco!!");
});
app.get("/api/chat", (req, res) => {
  res.send(Chats);
});


app.get('/api/chat/:id',(req,res)=>{
    console.log(req);
    res.send(chats.find((c)=>c._id===req.params.id));
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
