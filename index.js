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
var spawn = require("child_process").spawn;
var conexion = null; //Se usa en el método de getEstadístiques

app.listen(PORT, function () {
  console.log("SERVER RUNNNIG");
});

app.use(express.static("imatges_productes"))

var mysql = require('mysql2');

//Datos para la conexión en la base de datos, se usa 1 vez para cada ruta
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

// Función que ejecuta una consulta SQL en la base de datos y maneja la conexión. SE HACE CON UNA PROMISE
function executeQuery(query, params = []) {
  return new Promise((resolve, reject) => {
    const connection = mysql.createConnection(dbConfig);
    connection.connect((error) => {
      if (error) {
        connection.end();
        reject("Error de conexión a la base de datos");
      } else {
        console.log("Conexión con éxito a la base de datos");
        connection.query(query, params, (err, result) => {
          connection.end();
          if (err) {
            reject("Error en la consulta a la base de datos");
          } else {
            console.log("Desconexión con la base de datos exitosa");
            resolve(result);
          }
        });
      }
    });
  });
}

// Ruta para obtener la información de productos
app.get("/getProductes", async (req, res) => {
  try {
    const result = await executeQuery("SELECT * FROM productes");
    console.log("productos obtenidos con éxito");
    res.json({ result });
  } catch (error) {
    res.status(500).json({ error });
  }
});

// Ruta para insertar un producto en la base de datos
app.post("/insertarProducto", async (req, res) => {
  const { categoria, nom, descripció, preu, url_imatge } = req.body;

  if (!categoria || !nom || !descripció || !preu || !url_imatge) {
    return res.status(400).json({ error: "Faltan datos obligatorios" });
  }

  try {
    const result = await executeQuery(
      "INSERT INTO productes (categoria, nom, descripció, preu, url_imatge) VALUES (?, ?, ?, ?, ?)",
      [categoria, nom, descripció, preu, url_imatge]
    );
    console.log("Inserción exitosa");
    res.json({ message: "Inserción exitosa" });
  } catch (error) {
    res.status(500).json({ error });
  }
});

// Ruta para eliminar un producto de la base de datos
app.delete("/eliminarProducto", async (req, res) => {
  const productoId = req.body.productoId;

  if (!productoId) {
    return res.status(400).json({ error: "Falta el ID del producto" });
  }

  try {
    const result = await executeQuery("DELETE FROM productes WHERE id = ?", [productoId]);
    console.log("Eliminación exitosa");
    res.json({ message: "Eliminación exitosa" });
  } catch (error) {
    res.status(500).json({ error });
  }
});

// Ruta para actualizar un producto en la base de datos
app.post("/actualizarProducto", async (req, res) => {
  const productoId = req.body.id;
  const nuevaCategoria = req.body.categoria;
  const nuevoNombre = req.body.nom;
  const nuevaDescripcion = req.body.descripció;
  const nuevoPrecio = req.body.preu;
  const nuevaUrlImagen = req.body.url_imatge;

  if (!productoId) {
    return res.status(400).json({ error: "Falta el ID del producto" });
  }

  try {
    const result = await executeQuery(
      "UPDATE productes SET categoria = ?, nom = ?, descripció = ?, preu = ?, url_imatge = ? WHERE id = ?",
      [nuevaCategoria, nuevoNombre, nuevaDescripcion, nuevoPrecio, nuevaUrlImagen, productoId]
    );
    console.log("Actualización exitosa");
    res.json({ message: "Actualización exitosa" });
  } catch (error) {
    res.status(500).json({ error });
  }
});

//Agafar informació per estadístiques
app.get("/getEstadistiques", (req, res) => {

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
      conexion.query("SELECT * FROM comanda_productes ", function (err, result) {
        if (err) throw err;
        if (result) {
          console.log("Se han encontrado ", result.length, " resultados");
          console.log({ result });

          var process = spawn('python', ["./estadistiques.py", JSON.stringify({ result })]);
          let dades;

          process.stdout.on('data', function (data) {
            console.log("data:", data);
            console.log(data.toString());
            dades = data.toString();
          })
          process.on('close', (code) => {
            res.send(dades);
          })

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

//POST per consultar els usuaris. És POST i no GET per la encriptació de la Password
app.post("/postUsuaris", (req, res) => {



});

app.get("/getComandes", (req, res) => {

  res.json(respostes_JSON);

});

app.post("/postComandes", (req, res) => {



});