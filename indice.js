var mysql = require('mysql2');
var conexion = mysql.createConnection({
    host: "dam.inspedralbes.cat",
    user: "a22jonorevel_usuario",
    password: "Dam2023+++",
    database: "a22jonorevel_DatosP1"
});

//Llamo a la conexión
conexion.connect(function (error) { //Creo la conexión
    if (error) throw error;
    else {
        console.log("Conexión realizada con éxito!");
        conexion.query("SELECT * FROM productes", function (err, result) {
            if (err) throw err;
            if(result){
                console.log("Se han encontrado ", result.length, " resultados");
                for(var i=0; i< result.length; i++){
                    var row = result[i];
                    console.log("ID: ", row.id, ", categoria: ", row.categoria, ", nom: ", row.nom, ", descripcio: ", row.descripció, ", preu: ", row.preu, ", url imagen: ", row.url_imatge);
                }
            }else{
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