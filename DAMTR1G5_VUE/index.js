//Definim totes les constants que necessita el servidor per operar
var history = require('connect-history-api-fallback');
const express = require('express');
var session = require('express-session');
const cors = require("cors");
const fs = require('fs').promises;
const app = express();
const { createServer } = require('http');
const { Server } = require('socket.io');
const server = createServer(app);
const multer = require('multer')

const PORT = 3968;
var spawn = require("child_process").spawn;

var mysql = require('mysql2');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './imatges_productes');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });




var conexion = null; //Se usa en el método de getEstadístiques

const io = new Server(server);
/*const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  }
});*/

io.on('connection', (socket) => {
  socket.on('comandaAprovada', (msg) => {
    console.log("rebut");
    console.log(msg);
    io.emit('comandaAprovada', msg);
  });
  socket.on('comandaRebutjada', (msg) => {
    console.log("rebut");
    console.log(msg);
    io.emit('comandaRebutjada', msg);
  });
});

/*app.listen(PORT, function () {
  console.log("SERVER RUNNNIG AT PORT " + PORT);
});*/

server.listen(PORT, () => {
  console.log('Server running');
});

app.use('/imatges_productes', express.static('imatges_productes'));
app.use('/imatges_stats', express.static('imatges_stats'));
app.use(express.static('./dist'))

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
    comanda_oberta: null,
    usuariID: null,
    nick: null
  }
}

app.use(session(sess));

app.use(express.json());

//Utilizem el mòdul "cors" per poder realitzar les operacions 
/*app.use(cors({
  origin: function (origin, callback) {
    return callback(null, true);
  }
}));*/

//app.use(cors());

/*app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
})*/

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
            //reject("Error en la consulta a la base de dades");
            reject(err);
          } else {
            console.log("Desconnexió amb èxit de la base de dades");
            resolve(result);
          }
        });
      }
    });
  });
}

app.get('/', (req, res) => {
  res.sendFile(new URL('./dist/index.html').pathname);
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

      req.session.nick = usuari.nick;
      req.session.usuariID = usuari.id;
      console.log(req.session.usuariID);
      req.session.comanda_oberta = usuari.comanda_oberta;

      res.json({ "mensaje": "Inicio de sesión exitoso" });
      console.log(req.session.usuariID);
      //console.log(nomUsuari);
      //console.log(contrasenya);
    } else {
      console.log(nomUsuari);
      console.log(contrasenya);
      res.status(401).json({ "error": "Credenciales incorrectas. Inténtalo de nuevo." });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
});

app.get('/dadesUsuari', async (req, res) => {
  const userId = req.session.usuariID; // Obtén el ID del usuario de la sesión
  console.log("la id es" + userId);

  if (userId) {
    // Consulta la base de datos para obtener los datos del usuario por su ID
    const sql = 'SELECT nom, cognoms, nick, dades_targeta FROM usuaris WHERE id = ?';

    try {
      const results = await executeQuery(sql, [userId]);
      if (results.length === 0) {
        res.status(404).json({ error: "Usuario no encontrado" });
      } else {
        const userData = results[0];
        res.json(userData);
        console.log(userData);
      }
    } catch (error) {
      res.status(500).json({ error: "Error al obtener los datos del usuario" });
    }
  } else {
    res.status(401).json({ error: "No has iniciado sesión" });
  }
});



// Ruta per obtenir la informació dels productes
app.get("/getProductesVUE", async (req, res) => {
  try {
    const result = await executeQuery("SELECT * FROM productes ORDER BY categoria");
    console.log("Productes obtinguts amb èxit");
    res.json({ result });
  } catch (error) {
    res.status(500).json({ error });
  }
});

// Ruta per obtenir la informació dels productes
app.get("/getProductesAndroid", async (req, res) => {
  try {
    //const result = await executeQuery("SELECT * FROM productes WHERE estado_producte = ? ORDER BY categoria", "activado");
    const result = await executeQuery("SELECT * FROM productes ORDER BY categoria");
    console.log("Productes obtinguts amb èxit");
    //console.log(result);
    for (producte of result) {
      const imagePath = 'imatges_productes/' + producte.url_imatge;
      const imageBuffer = await fs.readFile(imagePath); // Lee la imagen en forma de búfer
      //const imageBuffer = base64_encode(imagePath);
      //const imageBuffer = await fs.promises.readFile(imagePath); // Lee la imagen en forma de búfer

      // Convierte el búfer en Base64
      producte.url_imatge = imageBuffer.toString('base64');
      //console.log(producte.url_imatge);
    }

    // Usar Promise.all para cargar y codificar todas las imágenes en paralelo
    //await Promise.all(result.map(loadImageAndEncode));

    //console.log(result);
    res.json({ result });
  } catch (error) {
    res.status(500).json({ error });
  }
});

// Ruta per inserir un producte a la base de dades
app.post("/insertarProducto", upload.single('imatge'), async (req, res) => {
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
    const [product] = await executeQuery("SELECT url_imatge FROM productes WHERE id = ?", [productoId])

    const imagePath = `./imatges_productes/${product.url_imatge}`
    fs.unlink(imagePath, (err) => {
      if (err) {
        console.error("Error al eliminar el archivo de imagen", err);
      } else {
        console.log("Imagen eliminada con éxito");
      }
    });

    const result = await executeQuery("DELETE FROM productes WHERE id = ?", [productoId]);
    console.log("Eliminació exitosa");
    res.json({ message: "Eliminació exitosa" });
  } catch (error) {
    res.status(500).json({ error });
  }
});

// Ruta per actualitzar un producte de la base de dades
app.post("/actualizarProducto", upload.single('imatgeEdit'), async (req, res) => {
  console.log(req.body);
  const productoId = req.body.id;
  const nuevaCategoria = req.body.categoria;
  const nuevoNombre = req.body.nom;
  const nuevaDescripcion = req.body.descripcio;
  const nuevoPrecio = req.body.preu;
  const nuevaUrlImagen = req.body.url_imatge;
  const nuevoEstado = req.body.estado_producte;

  if (!productoId) {
    return res.status(400).json({ error: "Falta l'ID del producte" });
  }

  try {

    if (nuevoEstado != null) {
      const result = await executeQuery(
        "UPDATE productes SET categoria = ?, nom = ?, descripció = ?, preu = ?, url_imatge = ?, estado_producte = ? WHERE id = ?",
        [nuevaCategoria, nuevoNombre, nuevaDescripcion, nuevoPrecio, nuevaUrlImagen, nuevoEstado, productoId]
      );
    }
    else {
      const result = await executeQuery(
        "UPDATE productes SET categoria = ?, nom = ?, descripció = ?, preu = ?, url_imatge = ? WHERE id = ?",
        [nuevaCategoria, nuevoNombre, nuevaDescripcion, nuevoPrecio, nuevaUrlImagen, productoId]
      );
    }

    console.log("Actualització exitosa");
    res.json({ message: "Actualització exitosa" });
  } catch (error) {
    res.status(500).json({ error });
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

// Ruta para añadir productos a las comandas
app.post("/afegirProducteComanda", async (req, res) => {

  producte = req.body;
  console.log(producte);
  console.log(producte.id);

  console.log(req.session.comanda_oberta);

  if (!req.session.comanda_oberta) {
    try {
      req.session.comanda_oberta = true;
      console.log(req.session.usuariID);
      //console.log(req.session.comanda_oberta);
      await executeQuery("UPDATE usuaris SET comanda_oberta = ? WHERE id = ?", [req.session.comanda_oberta, req.session.usuariID]);

      const nuevaComanda = {
        id_usuari: req.session.usuariID,
        entrega: null,
        estat: "oberta", // S'estableix la comanda inicialment com oberta
      };

      const result = await executeQuery("INSERT INTO comanda (id_usuari, entrega, estat) VALUES (?)", [[nuevaComanda.id_usuari, nuevaComanda.entrega, nuevaComanda.estat]]);
      const comandaId = result.insertId;

      const comandaProductos = [comandaId, producte.id, producte.quantitat]

      await executeQuery("INSERT INTO comanda_productes (comanda_id, producte_id, quantitat) VALUES (?)", [comandaProductos]);

      console.log("Comanda acceptada, ens posem en marxa");
      res.json({ message: "Comanda acceptada, ens posem en marxa" });
      req.session.comanda_oberta = true;

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Alguna cosa ha fallat, el restaurant ha rebutjat la teva comanda" });
    }
  }

  else {
    try {
      var result = await executeQuery("SELECT max(id) AS id_comanda_actual FROM comanda");

      //console.log(result);
      id_comanda = result[0].id_comanda_actual;
      result = await executeQuery("SELECT * FROM comanda_productes WHERE comanda_id = ?", id_comanda);
      console.log(result);
      let producte_repetit = false;
      for (const producte_llista of result) {
        if (producte_llista.producte_id === producte.id) {
          producte_repetit = true;
        }
      }

      if (!producte_repetit) {
        const comandaProductos = [result[0].comanda_id, producte.id, producte.quantitat];
        await executeQuery("INSERT INTO comanda_productes (comanda_id, producte_id, quantitat) VALUES (?)", [comandaProductos]);
      }
      else {
        const comandaProductos = [result[0].comanda_id, producte.id, producte.quantitat]
        console.log(comandaProductos[0]);
        console.log(comandaProductos[1]);
        console.log(comandaProductos[2]);
        if (!producte.editarQuantitat) {
          await executeQuery("UPDATE comanda_productes SET quantitat = quantitat + ? WHERE comanda_id = ? AND producte_id = ?", [comandaProductos[2], comandaProductos[0], comandaProductos[1]]);
        }
        else {
          await executeQuery("UPDATE comanda_productes SET quantitat = ? WHERE comanda_id = ? AND producte_id = ?", [comandaProductos[2], comandaProductos[0], comandaProductos[1]]);
        }
      }

      console.log("Comanda acceptada, ens posem en marxa");
      res.json({ message: "Comanda acceptada, ens posem en marxa" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Alguna cosa ha fallat, el restaurant ha rebutjat la teva comanda" });
    }
  }


});

// Ruta para editar productos en las comandas
app.post("/editarComanda", async (req, res) => {

  //const { comandaId, nuevoEstado } = req.body;
  comanda = req.body;
  id = comanda.id;
  estat = 'pendent';

  if (!comanda || !estat) {
    return res.status(400).json({ error: "Falten dades obligatòries" });
  }

  try {
    // Verifica si la comanda con el ID proporcionado existe en la base de datos
    const comandaExistente = await executeQuery("SELECT * FROM comanda WHERE id = ?", [comanda]);

    if (!comandaExistente.length) {
      return res.status(404).json({ error: "Comanda no trobada" });
    }

    // Actualiza el estado de la comanda al nuevo estado proporcionado en el cuerpo
    await executeQuery("UPDATE comanda SET estat = ? WHERE id = ?", [estat, comanda]);

    io.emit("comandaActualitzada", { comanda, estat });

    res.json({ message: "Comanda aprovada amb èxit" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en aprovar la comanda" });
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

  // Establezco la conexión
  conexion.connect(function (error) {
    // Creo la conexión
    if (error) throw error;
    else {
      console.log("Conexió realitzada amb èxit!");
      conexion.query(
        "SELECT cp.comanda_id,cp.producte_id,p.categoria, c.datacomanda, HOUR(c.datacomanda) AS hora_comanda," +
        "(SELECT SUM(productes.preu * cp.quantitat) FROM productes WHERE productes.id = cp.producte_id) AS cost_total " +
        "FROM comanda_productes cp " +
        "INNER JOIN productes p ON cp.producte_id = p.id " +
        "INNER JOIN comanda c ON cp.comanda_id = c.id",
        function (err, result) {
          if (err) throw err;
          if (result) {
            console.log("S'han trobat ", result.length, " resultats");
            console.log({ result });

            var jsonData = JSON.stringify(result);
            var process = spawn('python3', ["./estadistiques.py", jsonData]);

            process.stdout.on('data', (data) => {

              res.set('Content-Type', 'image/png');
              res.send(data); // Envia los datos de la imagen como respuesta
            });
          } else {
            console.log("No s'han trobat resultats");
          }
          conexion.end(function (error) { // Tanco la conexión
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
  console.log(req.session.usuariID);
  try {
    // Consulta la base de dades per obtenir les comandes
    const comandes = await executeQuery("SELECT * FROM comanda WHERE id_usuari = ?", req.session.usuariID);

      // Per a cada comanda, consulta els productes associats
      for (const comanda of comandes) {
        comanda.productes = await executeQuery(
          "SELECT cp.quantitat, p.* FROM productes p " +
          "INNER JOIN comanda_productes cp ON p.id = cp.producte_id " +
          "WHERE cp.comanda_id = ?",
          [comanda.id]
        );
      }
    

    console.log("Comandes enviades al client amb èxit");
    res.json({ comandes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Alguna cosa ha fallat en obtenir les comandes" });
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



//Pagar
app.post("/pagar", async (req, res) => {
  const comanda = req.body;
  const id = comanda.id;
  const estat = 'pendent';
  const entrega = comanda.entrega; // Obtiene la hora de entrega del cuerpo de la solicitud

  if (!comanda || !estat || !entrega) {
    return res.status(400).json({ error: "Falten dades obligatòries" });
  }

  try {
    // Verifica si la comanda con el ID proporcionado existe en la base de datos
    const comandaExistente = await executeQuery("SELECT * FROM comanda WHERE id = ?", [id]);

    if (!comandaExistente.length) {
      return res.status(404).json({ error: "Comanda no trobada" });
    }

    // Actualiza el estado y la hora de entrega de la comanda en la base de datos
    await executeQuery("UPDATE comanda SET estat = ?, entrega = ? WHERE id = ?", [estat, entrega, id]);

    req.session.comanda_oberta = false;
    console.log(req.session.usuariID);
    console.log(comanda);
    await executeQuery("UPDATE usuaris SET comanda_oberta = ? WHERE id = ?", [req.session.comanda_oberta, req.session.usuariID]);

    res.json({ message: "Comanda aprovada amb èxit" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en aprovar la comanda" });
  }
});

const staticFileMiddleware = express.static("./dist")
app.use(staticFileMiddleware)
app.use(history({
  disableDotRule: true,
  verbose: true
}))

app.use(staticFileMiddleware)