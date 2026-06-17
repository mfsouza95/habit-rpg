const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());

app.get('/health', (req, res) =>{
    res.send({ok: true})
});

app.listen(port, () => {
    console.log(`Test app listening on port ${port}`)
});