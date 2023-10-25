export async function getProductes() {
    console.log("Fetching productes...")
    const response = await fetch('http://localhost:3001/getProductes')
    const productes = await response.json()
    console.log(productes)
    return productes
}

export async function addProducte(dadesProducte) {
    console.log("datos recibidos: " + dadesProducte)

    const nombreProducto = dadesProducte.nom.replace(/ /g, '_');


    // Primero, guarda la imagen en el servidor
    await axios.post('http://localhost:3001/descargarImagen', {
        url: dadesProducte.url_imatge,
        nombreProducto: nombreProducto,
    })
        .then(response => {
            console.log(response.data.message);
        })
        .catch(error => {
            console.error('Error al descargar la imagen:', error);
        });

    const response = await fetch(`http://localhost:3001/insertarProducto`,
        {
            method: 'POST', headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dadesProducte)
        },);
}

export async function deleteProducte(id) {
    console.log("Eliminando producto con ID: " + id);
    const response = await fetch(`http://localhost:3001/eliminarProducto`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productoId: id })
    });

    if (response.status === 200) {
        console.log("Producto eliminado con éxito.");
    } else {
        console.error("Error al eliminar el producto.");
    }

}
