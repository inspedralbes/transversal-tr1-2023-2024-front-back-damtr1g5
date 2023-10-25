<template>
    <title>Gestió de productes</title>

    <v-layout class="rounded rounded-md" v-if="mostrar_productes">
        <v-app-bar title="Gestió de productes">
            <v-btn @click="irPanell">Panell de control</v-btn>
            <v-btn @click="irComandes">Comandes</v-btn>
            <v-btn @click="verFormulari">Insertar Producto</v-btn>
        </v-app-bar>
        <v-main class="d-flex align-center justify-center" style="min-height: 300px;">
            <v-container class="grid-list-md">
                <v-row>
                    <v-col v-for="producte in productes.result" :key="producte.id" cols="3">
                        <v-card>
                            <v-img :src="`http://localhost:3001/${producte.url_imatge}`" height="300"></v-img>
                            <v-text>{{ producte.nom }}</v-text><br>
                            <v-btn @click="verInfo(producte)">Más info</v-btn>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
            <v-dialog v-model="ver_info" max-width="600">
                <v-card>
                    <v-card-title>Informació del producte: </v-card-title>
                    <v-card-text>
                        <h4>Nom:</h4><v-text>{{ selected_productes.nom }}</v-text><br>
                        <h4>Categoria:</h4><v-text>{{ selected_productes.categoria }}</v-text><br>
                        <h4>Descripció:</h4><v-text>{{ selected_productes.descripció }}</v-text><br>
                        <h4>Preu:</h4><v-text>{{ selected_productes.preu }}</v-text>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn @click="ver_info = false">Tancar</v-btn>
                        <v-btn @click="deleteProductes(selected_productes.id), ver_info = false"
                            style="color: red;">Esborrar producte</v-btn>
                        <v-btn>Editar Producte</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <v-dialog v-model="verAfegirProducte" max-width="400">
                <v-card>
                    <v-card-title>Afegir Producte</v-card-title>
                    <v-card-text>
                        <v-text-field v-model="nuevo_producte.categoria" label="Categoria"></v-text-field>
                        <v-text-field v-model="nuevo_producte.nom" label="Nom"></v-text-field>
                        <v-text-field v-model="nuevo_producte.descripció" label="Descripció"></v-text-field>
                        <v-text-field v-model="nuevo_producte.preu" label="Preu"></v-text-field>
                        <v-text-field v-model="nuevo_producte.url_imatge" label="URL de la imatge"></v-text-field>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn style="color: green;" @click="addProductes">Afegir Producte</v-btn>
                        <v-btn style="color: red;" @click="verAfegirProducte = false">Cancelar</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-main>
    </v-layout>
</template>
  
<script>
import axios from 'axios'
import { getProductes, addProducte, deleteProducte } from '@/services/communicationsManager'
export default {
    data() {
        return {
            productes: null,
            mostrar_productes: null,
            ver_info: null,
            verAfegirProducte: false,
            selected_productes: {},
            nuevo_producte: {
                "id": null,
                "categoria": null,
                "nom": null,
                "descripció": null,
                "preu": null,
                "url_imatge": null,
            }

        }
    },
    created() {
        getProductes().then(response => {
            this.productes = response;
            this.mostrar_productes = true;
        })
    },
    methods: {
        irComandes() {
            this.$router.push("/gestiocomandes")
        },
        irPanell() {
            this.$router.push("/")
        },
        verInfo(producte) {
            this.selected_productes = producte;
            console.log('selected_productes:', this.selected_productes);
            this.ver_info = true;
        },
        verFormulari() {
            this.verAfegirProducte = true;
        },
        addProductes() {
            // Verifica si la URL de la imagen es válida
            if (!this.nuevo_producte.url_imatge) {
                console.error('URL de imagen no válida');
                return;
            }

            axios.post('http://localhost:3001/descargarImagen', {
                url: this.nuevo_producte.url_imatge,
                nombreProducto: this.nuevo_producte.nom,
            })
                .then(response => {
                    console.log(response.data.message);

                })
                .catch(error => {
                    console.error('Error al descargar la imagen:', error);
                });

            // Limpia el campo de URL y cierra el diálogo
            this.nuevo_producte.url_imatge = '';
            this.nuevo_producte = {
                id: null,
                categoria: null,
                nom: null,
                descripció: null,
                preu: null,
                url_imatge: null,
            };
            this.verAfegirProducte = false;
        },
        deleteProductes(id) {
            deleteProducte(id)
                .then(() => {
                    return getProductes();
                })
                .then((response) => {
                    this.productes = response;
                })
                .catch((error) => {
                    console.error('Error al agregar producto:', error);
                });

            //location.reload();

        }


    }
}
</script>
