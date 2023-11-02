//Definim totes les constants que necessita el servidor per operar
const express = require('express');
var session = require('express-session');
const multer = require('multer')
const cors = require("cors");
const fs = require('fs');
const app = express();
const { createServer } = require('http');
const { Server } = require('socket.io');
const server = createServer(app);
const io = new Server(server);
const PORT = 3001;
var spawn = require("child_process").spawn;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './imatges_productes');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

io.on("connection", (socket) => {
  console.log("Nuevo cliente conectado");

  // Escucha eventos de Socket.io aquí
  socket.on("nuevaComanda", (comanda) => {
    // Emitir la nueva comanda a todos los clientes conectados
    io.emit("nuevaComanda", comanda);
  });

});

var conexion = null; //Se usa en el método de getEstadístiques

app.listen(PORT, function () {
  console.log("SERVER RUNNNIG AT PORT " + PORT);
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

var sess = { //app.use és el intermediari, middleware
  secret: 'paraula secreta',
  resave: false, //Obsolet
  saveUninitialized: true,
  data: {
    comanda_oberta: false
  }
}

app.use(session(sess));

app.use(express.json());

//Utilizem el mòdul "cors" per poder realitzar les operacions 
app.use(cors({
  origin: ['http://192.168.56.1:3000', 'http://localhost:3000'], //Es la dirección URL del VUE de PABLO
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
}));

// Funció que executa una consulta SQL a la base de dades i manipula la conexió. ES FA AMB UNA PROMISE
function executeQuery(query, params = []) {
  return new Promise((resolve, reject) => {
    const connection = mysql.createConnection(dbConfig);
    connection.connect((error) => {
      if (error) {
        connection.end();
        reject("Error de connexió amb la base de dades");
      } else {
        console.log("Connexió amb èxit a la base de dades");
        connection.query(query, params, (err, result) => {
          connection.end();
          if (err) {
            reject("Error en la consulta a la base de dades");
          } else {
            console.log("Desconnexió amb èxit de la base de dades");
            resolve(result);
          }
        });
      }
    });
  });
}

// Ruta per obtenir la informació dels productes
app.get("/getProductes", async (req, res) => {
  try {
    const result = await executeQuery("SELECT * FROM productes");
    console.log("Productes obtinguts amb èxit");
    res.json({ result });
  } catch (error) {
    res.status(500).json({ error });
  }
});

// Ruta per inserir un producte a la base de dades
app.post("/insertarProducto", upload.single('imatge'),async (req, res) => {
  const { categoria, nom, descripcio, preu, url_imatge } = req.body;
  console.log(req.body)

  if (!categoria || !nom || !descripcio || !preu || !url_imatge) {
    return res.status(400).json({ error: "Faltan datos obligatorios" });
  }

  try {
    const result = await executeQuery(
      "INSERT INTO productes (categoria, nom, descripció, preu, url_imatge) VALUES (?, ?, ?, ?, ?)",
      [categoria, nom, descripcio, preu, url_imatge]
    );
    console.log("Inserción exitosa");
    res.json({ message: "Inserción exitosa" });
  } catch (error) {
    res.status(500).json({ error });
  }
});

// Ruta per eliminar un producte de la base de dades
app.delete("/eliminarProducto", async (req, res) => {
  const productoId = req.body.productoId;

  if (!productoId) {
    return res.status(400).json({ error: "Falta l'ID del producte" });
  }

  try {
    const result = await executeQuery("DELETE FROM productes WHERE id = ?", [productoId]);
    console.log("Eliminació exitosa");
    res.json({ message: "Eliminació exitosa" });
  } catch (error) {
    res.status(500).json({ error });
  }
});

// Ruta per actualitzar un producte de la base de dades
app.post("/actualizarProducto", upload.single('imatgeEdit'), async (req, res) => {
  const productoId = req.body.id;
  const nuevaCategoria = req.body.categoria;
  const nuevoNombre = req.body.nom;
  const nuevaDescripcion = req.body.descripcio;
  const nuevoPrecio = req.body.preu;
  const nuevaUrlImagen = req.body.url_imatge;

  if (!productoId) {
    return res.status(400).json({ error: "Falta l'ID del producte" });
  }

  try {
    const result = await executeQuery(
      "UPDATE productes SET categoria = ?, nom = ?, descripció = ?, preu = ?, url_imatge = ? WHERE id = ?",
      [nuevaCategoria, nuevoNombre, nuevaDescripcion, nuevoPrecio, nuevaUrlImagen, productoId]
    );
    console.log("Actualització exitosa");
    res.json({ message: "Actualització exitosa" });
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

  //Estableixo la conexió
  conexion.connect(function (error) {
    //Creo la conexió
    if (error) throw error;
    else {
      console.log("Conexió realitzada amb èxit!");
      conexion.query("SELECT * FROM comanda_productes JOIN productes ON (comanda_productes.producte_id=productes.id) ", function (err, result) {
        if (err) throw err;
        if (result) {
          console.log("S'han trobat ", result.length, " resultats");
          console.log({ result });

          var process = spawn('py', ["./estadistiques.py", JSON.stringify({ result })]);
          let imageData = Buffer.from([]);

          process.stdout.on('data', function (data) {
            // Concatenar los datos de salida para obtener la imagen completa
            imageData = Buffer.concat([imageData, data]);
          });

          process.on('close', (code) => {
            if (code === 0) {
              // Enviar la imatge como resposta
              res.setHeader('Content-Type', 'image/png'); // Ajusta el tipo de contenido según el tipo de imagen
              res.send(imageData);
            } else {
              res.status(500).send('Error en el procés Python');
            }
          });
        } else {
          console.log("No s'han trobat resultats");
        }
        conexion.end(function (error) { //Tanco la conexió
          if (error) {
            return console.log("Error" + error.message);
          }
          console.log("Es tanca la conexió amb la base de dades");
        });
      });
    }
  });
});

// Ruta per obtenir la llista de comandes
app.get("/getComandes", async (req, res) => {
  try {
    // Consulta la base de dades per obtenir les comandes
    const comandes = await executeQuery("SELECT * FROM comanda");

    // Per a cada comanda, consulta els productes associats
    for (const comanda of comandes) {
      comanda.productes = await executeQuery(
        "SELECT cp.quantitat, p.* FROM productes p " +
        "INNER JOIN comanda_productes cp ON p.id = cp.producte_id " +
        "WHERE cp.comanda_id = ?",
        [comanda.id]
      );
    }

    // Emitre les comandes al client en temps real
    io.emit("novaComanda", { comandes });

    console.log("Comandes enviades al client amb èxit");
    res.json({ comandes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Alguna cosa ha fallat en obtenir les comandes" });
  }
});


// Ruta para crear comandas
app.post("/crearComanda", async (req, res) => {
  const { id_usuari, entrega, productes } = req.body;

  if (!id_usuari || !entrega || !productes) {
    return res.status(400).json({ error: "Faltan datos obligatorios" });
  }

  try {
    const nuevaComanda = {
      id_usuari,
      entrega,
      estat: "pendent", // S'estableix la comanda inicialment com pendent
    };

    const result = await executeQuery("INSERT INTO comanda SET ?", nuevaComanda);
    const comandaId = result.insertId;

    const comandaProductos = productes.map((producto) => {
      return [comandaId, producto.producte_id, producto.quantitat];
    });

    await executeQuery("INSERT INTO comanda_productes (comanda_id, producte_id, quantitat) VALUES ?", [comandaProductos]);

    // Emitre la nova comanda al client en temps real
    io.emit("novaComanda", nuevaComanda);

    console.log("Comanda acceptada, ens posem en marxa");
    res.json({ message: "Comanda acceptada, ens posem en marxa" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Alguna cosa ha fallat, el restaurant ha rebutjat la teva comanda" });
  }
});

//Ruta per aprovat comandes un cop el restaurant les hagi visualitzat y les hagi acceptades
app.put("/estatComanda", async (req, res) => {
  const { comandaId, nuevoEstado } = req.body;

  if (!comandaId || !nuevoEstado) {
    return res.status(400).json({ error: "Falten dades obligatòries" });
  }

  try {
    // Verifica si la comanda con el ID proporcionado existe en la base de datos
    const comandaExistente = await executeQuery("SELECT * FROM comanda WHERE id = ?", [comandaId]);

    if (!comandaExistente.length) {
      return res.status(404).json({ error: "Comanda no trobada" });
    }

    // Actualiza el estado de la comanda al nuevo estado proporcionado en el cuerpo
    await executeQuery("UPDATE comanda SET estat = ? WHERE id = ?", [nuevoEstado, comandaId]);

    io.emit("comandaActualitzada", { comandaId, nuevoEstado });

    res.json({ message: "Comanda aprovada amb èxit" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en aprovar la comanda" });
  }
});

//Login per comprovar que un usuari existeix a la base de dades
app.post('/login', async (req, res) => {
  try {
    const result = await executeQuery("SELECT id,nick,contrasenya,comanda_oberta FROM usuaris");
    console.log("Usuaris obtinguts amb èxit");

    const { nomUsuari, contrasenya } = req.body;
    const usuari = result.find(user => user.nick === nomUsuari && user.contrasenya === contrasenya);

    if (usuari) {
      // Almacena el ID de usuario en la sesión
      req.session.nick = usuari.nick; // Almacena el nick del usuario
      req.session.usuariID = usuari.id; // Almacena el ID del usuario
      req.session.comanda_oberta = usuari.comanda_oberta; // Almacena el estado de comanda
      res.json({"mensaje": "Inicio de sesión exitoso"});
      console.log(nomUsuari);
      console.log(contrasenya);
    } else {
      console.log(nomUsuari);
      console.log(contrasenya);
      res.status(401).json({"error": "Credenciales incorrectas. Inténtalo de nuevo."});
    }
  } catch (error) {
    res.status(500).json({ error });
  }
});
