const express = require('express');

const app = express()

const port = process.env.PORT || 3000;


app.get('/shelf/:shelf', (req , res) => {
    res.send('Hello world');
})
app.get('/', (req , res) => {
    res.send('Welcome to GLB Library.');
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});