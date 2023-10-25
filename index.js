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

app.use(express.static("imatges_productes"))

var mysql = require('mysql2');
var conexion = null;

const dbConfig = {
  host: "dam.inspedralbes.cat",
  user: "a22jonorevel_usuario",
  password: "Dam2023+++",
  database: "a22jonorevel_DatosP1",
};


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

  conexion = mysql.createConnection({
    host: "dam.inspedralbes.cat",
    user: "a22jonorevel_usuario",
    password: "Dam2023+++",
    database: "a22jonorevel_DatosP1"
  });

  //Llamo a la conexión
  conexion.connect(function (error) { 
   //Creo la conexión
    if (error) throw error;
    else {
      console.log("Conexión realizada con éxito!");
      conexion.query("SELECT * FROM productes", function (err, result) {
        if (err) throw err;
        if (result) {
          console.log("Se han encontrado ", result.length, " resultados");
          console.log({ result });
          res.json({ result });
          /*for(var i=0; i< result.length; i++){
              var row = result[i];
              console.log("ID: ", row.id, ", categoria: ", row.categoria, " nom: ", row.nom, " descripcio: ", row.descripció, " preu: ", row.preu, " url imagen ", row.url_imatge);
          }*/
        } else {
          console.log("No se han encontrado resultados");
        }
        conexion.end(function (error) { //Cierro la conexión
          if (error) {
            return console.log("Error" + error.message);
          }
          console.log("Se cierra la conexión con la base de datos");
        });
      });
    }
  });
});

// app.post("/insertarProducto", (req, res) => {
//   const { categoria, nom, descripció, preu, url_imatge } = req.body;

//   if (!categoria || !nom || !descripció || !preu || !url_imatge) {
//     return res.status(400).json({ error: "Faltan datos obligatorios" });
//   }

//   const conexion = mysql.createConnection(dbConfig);

//   conexion.connect(function (error) {
//     if (error) {
//       console.error("Error de conexión:", error);
//       res.status(500).json({ error: "Error de conexión a la base de datos" });
//     } else {
//       console.log("Conexión realizada con éxito!");

//       const insertQuery = `INSERT INTO productes (categoria, nom, descripció, preu, url_imatge) VALUES ("${categoria}", "${nom}", "${descripció}", "${preu}", "${url_imatge}")`;

//       conexion.query(insertQuery, [categoria, nom, descripció, preu, url_imatge], function (err, result) {
//         if (err) {
//           console.error("Error al insertar en la base de datos:", err);
//           res.status(500).json({ error: "Error al insertar en la base de datos" });
//         } else {
//           console.log("Inserción exitosa!");
//           res.json({ message: "Inserción exitosa" });
//         }

//         conexion.end();
//       });
//     }
//   });
// });

// Función que devuelve una Promesa para la inserción
function insertarProducto(categoria, nom, descripció, preu, url_imatge) {
  return new Promise((resolve, reject) => {
    const conexion = mysql.createConnection(dbConfig);

    conexion.connect(function (error) {
      if (error) {
        console.error("Error de conexión:", error);
        conexion.end();
        reject("Error de conexión a la base de datos");
      } else {
        console.log("Conexión realizada con éxito!");

        // Construye la consulta SQL con los valores
        const insertQuery = `INSERT INTO productes (categoria, nom, descripció, preu, url_imatge) VALUES ("${categoria}", "${nom}", "${descripció}", "${preu}", "${url_imatge}")`;

        conexion.query(insertQuery, [categoria, nom, descripció, preu, url_imatge], function (err, result) {
          if (err) {
            console.error("Error al insertar en la base de datos:", err);
            conexion.end();
            reject("Error al insertar en la base de datos");
          } else {
            console.log("Inserción exitosa!");
            conexion.end();
            resolve("Inserción exitosa");
          }
        });
      }
    });
  });
};

// Ruta para la inserción de datos
app.post("/insertarProducto", (req, res) => {
  const { categoria, nom, descripció, preu, url_imatge } = req.body;

  if (!categoria || !nom || !descripció || !preu || !url_imatge) {
    return res.status(400).json({ error: "Faltan datos obligatorios" });
  }

  insertarProducto(categoria, nom, descripció, preu, url_imatge)
    .then((message) => {
      res.json({ message });
    })
    .catch((error) => {
      conexion.end();
      res.status(500).json({ error });
    });
});

app.post("/eliminarProducto", (req, res) => { //SIN PROMISE
  const productoId = req.body.productoId;

  if (!productoId) {
    return res.status(400).json({ error: "Falta el ID del producto" });
  }

  conexion = mysql.createConnection(dbConfig);

  conexion.connect(function (error) {
    if (error) {
      console.error("Error de conexión:", error);
      res.status(500).json({ error: "Error de conexión a la base de datos" });
    } else {
      console.log("Conexión realizada con éxito!");

      const deleteQuery = `DELETE FROM productes WHERE id = ${productoId}`;

      conexion.query(deleteQuery, [productoId], function (err, result) {
        if (err) {
          console.error("Error al eliminar el producto:", err);
          res.status(500).json({ error: "Error al eliminar el producto" });
        } else {
          console.log("Eliminación exitosa!");
          res.json({ message: "Eliminación exitosa" });
        }

        conexion.end();
      });
    }
  });
});

function eliminarProducto(productoId) { //CON PROMISE
  return new Promise((resolve, reject) => {
    const conexion = mysql.createConnection(dbConfig);

    conexion.connect(function (error) {
      if (error) {
        console.error("Error de conexión:", error);
        conexion.end();
        reject("Error de conexión a la base de datos");
      } else {
        console.log("Conexión realizada con éxito!");

        // Construye la consulta SQL con el valor del ID del producto
        const deleteQuery = `DELETE FROM productes WHERE id = ${productoId}`;

        conexion.query(deleteQuery, function (err, result) {
          if (err) {
            console.error("Error al eliminar el producto:", err);
            conexion.end();
            reject("Error al eliminar el producto");
          } else {
            console.log("Eliminación exitosa!");
            conexion.end();
            resolve("Eliminación exitosa");
          }
        });
      }
    });
  });
}

app.delete("/eliminarProducto", (req, res) => { //CON PROMISE
  const productoId = req.body.productoId;

  if (!productoId) {
    return res.status(400).json({ error: "Falta el ID del producto" });
  }

  eliminarProducto(productoId)
    .then((message) => {
      res.json({ message });
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
});



app.get("/getComandes", (req, res) => {

  res.json(respostes_JSON);

});

app.post("/postComandes", (req, res) => {



});