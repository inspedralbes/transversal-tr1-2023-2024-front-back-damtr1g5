export async function getProductes() {
    console.log("Fetching productes...")
    const response = await fetch('http://localhost:3001/getProductes')
    const productes = await response.json()
    console.log(productes)
    return productes
}

export async function addProducte(dadesProducte) {
    console.log("datos recibidos: " + dadesProducte)

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

export async function updateProducte(dadesEdicio) {
    console.log("datos recibidos: " + dadesEdicio)

    const response = await fetch(`http://localhost:3001/actualizarProducto`,
        {
            method: 'POST', headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dadesEdicio)
        },);
}

export async function getComandes() {
    console.log("Fetching comandes...")
    const response = await fetch('http://localhost:3001/getComandes')
    const comandes = await response.json()
    console.log(comandes)
    return comandes
}

export async function estatComanda(comandaId, nuevoEstado) {
    try {
        const response = await fetch('http://localhost:3001/estatComanda', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ comandaId, nuevoEstado }),
        });

        if (response.status === 200) {
            console.log('Comanda aprobada con éxito.');
        }
    } catch (error) {
        console.error('Error en la solicitud para editar la comanda:', error);
    }
}

