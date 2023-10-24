//Definim totes les constants que necessita el servidor per operar
const express = require('express');
const cors = require("cors");
const fs = require('fs');
const app = express();
const { createServer } = require('http');
const { Server } = require('socket.io');
const server = createServer(app);
const io = new Server(server);
const PORT = 3001;

app.listen(PORT, function () {
  console.log("SERVER RUNNNIG");
});

var mysql = require('mysql2');
var conexion = mysql.createConnection({
  host: "dam.inspedralbes.cat",
  user: "a22jonorevel_usuario",
  password: "Dam2023+++",
  database: "a22jonorevel_DatosP1"
});


app.use(express.json());

//Utilizem el mòdul "cors" per poder realitzar les operacions 
app.use(cors({
  origin: function (origin, callback) {
    return callback(null, true);
  }
}));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
})

//POST per consultar els usuaris. És POST i no GET per la encriptació de la Password
app.post("/postUsuaris", (req, res) => {



})

//Accedim a la BBDD per obtenir la informació de productes

//Fem el camí pel GET
app.get("/getProductes", (req, res) => {

  //Llamo a la conexión
  conexion.connect(function (error) { //Creo la conexión
    if (error) throw error;
    else {
      console.log("Conexión realizada con éxito!");
      conexion.query("SELECT * FROM productes", function (err, result) {
        if (err) throw err;
        if (result) {
          console.log("Se han encontrado ", result.length, " resultados");
          console.log({result});
          res.json({result});
          
          conexion.end(function (error) { //Cierro la conexión
            if (error) {
              return console.log("Error" + error.message);
            }
            console.log("Se cierra la conexión con la base de datos");
          });       
          
          /*for(var i=0; i< result.length; i++){
              var row = result[i];
              console.log("ID: ", row.id, ", categoria: ", row.categoria, " nom: ", row.nom, " descripcio: ", row.descripció, " preu: ", row.preu, " url imagen ", row.url_imatge);
          }*/
        } else {
          console.log("No se han encontrado resultados");
        }
        
      

      });
      
    }
  });
  
})

app.post("/postProductes", (req, res) => {

  

})

app.get("/getComandes", (req, res) => {

  res.json(respostes_JSON);

})

app.post("/postComandes", (req, res) => {



})