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
