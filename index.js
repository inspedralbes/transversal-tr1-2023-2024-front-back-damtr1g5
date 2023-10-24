//Definim totes les constants que necessita el servidor per operar
const express = require('express');
const cors = require("cors");
const fs = require('fs');
const app = express();
const PORT = 3000;

var mysql = require('mysql2');
  var conexion = mysql.createConnection({
    host: "dam.inspedralbes.cat",
    user: "a22jonorevel_usuario",
    password: "Dam2023+++",
    database: "a22jonorevel_DatosP1"
});

app.listen(PORT, function () {
    console.log("SERVER RUNNNIG");
  });


app.use(express.json());

//Utilizem el mòdul "cors" per poder realitzar les operacions 
app.use(cors({
  origin: function (origin, callback) {
    return callback(null, true);
  }
}));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
})

//Accedim a la BBDD per obtenir la informació de productes

//Fem el camí pel GET
app.get("/getProductes", (req, res) => {

  

//Llamo a la conexión
conexion.connect(function (error) { //Creo la conexión
    if (error) throw error;
    else {
        console.log("Conexión realizada con éxito!");
        // conexion.query("SELECT * FROM pregunta WHERE enunciado = '¿Cuál de estas imágenes es un perro?' or enunciado = '¿Cuál de estas imágenes es un gato?'", function (err, result) {
        //     if (err) throw err;
        //     if(result){
        //         console.log("Se han encontrado ", result.length, " resultados");
        //         for(var i=0; i< result.length; i++){
        //             var row = result[i];
        //             console.log("ID: ", row.id, ", enunciado: ", row.enunciado, " respuesta correcta: ", row.respuesta_correcta);
        //         }
        //     }else{
        //         console.log("No se han encontrado resultados");
        //     }
        //     conexion.end(function (error) { //Cierro la conexión
        //         if (error) {
        //             return console.log("Error" + error.message);
        //         }
        //         console.log("Se cierra la conexión con la base de datos");
        //     });   
        // });
    }
});

conexion.end(function(error){
    if(error){
        return console.log("Error " + error.message);
    }
    console.log("Se cierra la conexión con la base de datos");
})

  res.json(respostes_JSON);

})

app.post("/sendProductes", (req, res) => {

  

})

app.get("/getComandes", (req, res) => {

  res.json(respostes_JSON);

})

app.post("/sendComandes", (req, res) => {

  

})