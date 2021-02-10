var express = require('express');
var app = express();

const PORT = process.env.PORT || 3000;;

app.get('/', (req, res)=>{
    res.send('hello world bitch');
})


app.listen(PORT, ()=>console.log(`Server started at: http://127.0.0.1:${PORT}`))