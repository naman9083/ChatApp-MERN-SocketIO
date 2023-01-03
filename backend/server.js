const express = require("express");
const app = express();

require('dotenv').config();

app.get("/", (req, res) => {
    res.send("Hello World!");
    console.log("Cheers to Dawn to Disco!!");
});
app.get('/api/chat',()=>)


const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
