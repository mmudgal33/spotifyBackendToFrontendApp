// node --watch ./server.js

const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv').config()
const port = process.env.PORT;


const spotifyController = require('./controllers/spotifyController')
// const spotifyBackend = require('./controllers/spotifyBackend')


const app = express()
  
app.use(express.static('public'));
app.use("/css", express.static(__dirname + '/public/css'));
app.use("/js", express.static(__dirname + '/public/js'));
  
app.set("views", "./views");
app.set("view engine", "ejs"); 
  
app.use(cors())

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/images', express.static('public/images'))


app.use('/', spotifyController)
// app.use('/', spotifyBackend)



app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
//   console.log(`Login URL: http://localhost:${port}/login`);
});

