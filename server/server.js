// node --watch ./server.js

const express = require('express')
const cors = require('cors')
// const dotenv = require('dotenv').config()
const port = process.env.PORT || 5000;
// const mongoose = require("mongoose")

///////////////////////////////////////////////////////////////////////////////////

const spotifyController = require('./controllers/spotifyController')

// const nodejsspotify = require('./controllers/nodejsspotify')

const app = express()
  
app.use(express.static('public'));
app.use("/css", express.static(__dirname + '/public/css'));
app.use("/js", express.static(__dirname + '/public/js'));
  
app.set("views", "./views");
app.set("view engine", "ejs"); 
  
///////////////////////////////////////////////////////////////////////////////////


app.use(cors())


app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/images', express.static('public/images'))

app.use('/', spotifyController)
// app.use('/', nodejsspotify)

app.get('/*splat',(req,res) =>{
  res.send('404 page not found');
} );



app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
//   console.log(`Login URL: http://localhost:${port}/login`);
});

