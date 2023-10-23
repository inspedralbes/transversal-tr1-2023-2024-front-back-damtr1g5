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