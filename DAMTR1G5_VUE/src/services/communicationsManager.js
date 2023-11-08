export async function getProductes() {
    console.log("Fetching productes...")
    const response = await fetch('http://takeawayg5.dam.inspedralbes.cat:3968/getProductes')
    const productes = await response.json()
    console.log(productes)
    return productes
}

export async function addProducte(dadesProducte) {
    console.log("datos recibidos: " + dadesProducte)

    const response = await fetch(`http://takeawayg5.dam.inspedralbes.cat:3968/insertarProducto`,
        {
            method: 'POST',
            body: dadesProducte
        },);
    const data = await response.json();
    console.log("respuesta del servidor: " + data);

    return data;
}

export async function deleteProducte(id) {
    console.log("Eliminando producto con ID: " + id);
    const response = await fetch(`http://takeawayg5.dam.inspedralbes.cat:3968/eliminarProducto`, {
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

    const response = await fetch(`http://takeawayg5.dam.inspedralbes.cat:3968/actualizarProducto`,
        {
            method: 'POST',
            body: dadesEdicio,
        },);
    const data = await response.json();
    console.log("respuesta del servidor: " + data);

    return data;
}

export async function getComandes() {
    console.log("Fetching comandes...")
    const response = await fetch('http://takeawayg5.dam.inspedralbes.cat:3968/getComandes')
    const comandes = await response.json()
    console.log(comandes)
    return comandes
}

export async function estatComanda(comandaId, nuevoEstado) {
    try {
        const response = await fetch('http://takeawayg5.dam.inspedralbes.cat:3968/estatComanda', {
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

export function getEstadistiques() {
    try {
        fetch('http://takeawayg5.dam.inspedralbes.cat:3968/getEstadistiques', {
            method: 'GET'
        })
        .then((response) => {
            if (response.ok) {
                console.log('Solicitud de estadísticas completada con éxito');
            } else {
                throw new Error(`Error al obtener estadísticas: ${response.status} - ${response.statusText}`);
            }
        })
        .catch((error) => {
            console.error('Error en getEstadistiques:', error);
            throw error;
        });
    } catch (error) {
        console.error('Error en getEstadistiques:', error);
        throw error;
    }
}





