<template>
    <title>Gestió de productes</title>

    <v-layout class="rounded rounded-md" v-if="mostrar_productes">
        <v-app-bar title="Gestió de productes">
            <v-btn @click="irPanell">Panell de control</v-btn>
            <v-btn @click="irComandes">Comandes</v-btn>
            <p>|</p>
            <v-btn @click="verFormulari">Insertar Producto</v-btn>
        </v-app-bar>
        <v-main class="d-flex align-center justify-center" style="min-height: 300px;">
            <v-container class="grid-list-md">
                <v-row>
                    <v-col v-for="producte in productes.result" :key="producte.id" cols="3">
                        <v-card>
                            <v-img :src="getImageSource(producte)" height="300"></v-img>
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
                        <v-btn @click="verEditar(selected_productes)">Editar Producte</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <v-dialog v-model="verAfegirProducte" max-width="400">
                <v-card>
                    <v-card-title>Afegir Producte</v-card-title>
                    <v-card-text>
                        <v-select v-model="nuevo_producte.categoria" :items="categories" label="Categoria"></v-select>
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
            <v-dialog v-model="vereditarProducte" max-width="400">
                <v-card>
                    <v-card-title>Editar Producte</v-card-title>
                    <v-card-text>
                        <v-select v-model="producte_editado.categoria" :items="categories" label="Categoria"></v-select>
                        <v-text-field v-model="producte_editado.nom" label="Nom"></v-text-field>
                        <v-text-field v-model="producte_editado.descripció" label="Descripció"></v-text-field>
                        <v-text-field v-model="producte_editado.preu" label="Preu"></v-text-field>
                        <v-text-field v-model="producte_editado.url_imatge" label="URL de la imatge"></v-text-field>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn style="color: green;" @click="actualizarProducte(producte_editado)">Editar Producte</v-btn>
                        <v-btn style="color: red;" @click="vereditarProducte = false">Cancelar</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-main>
    </v-layout>
</template>
  
<script>
import axios from 'axios'
import { getProductes, addProducte, deleteProducte, updateProducte } from '@/services/communicationsManager'
export default {
    data() {
        return {
            productes: null,
            mostrar_productes: null,
            ver_info: null,
            verAfegirProducte: false,
            vereditarProducte: false,
            categories: ["Postres", "Begudes", "Pastes", "Pizzes"],
            selected_productes: {},
            nuevo_producte: {
                "id": null,
                "categoria": null,
                "nom": null,
                "descripció": null,
                "preu": null,
                "url_imatge": null,
            },
            producte_editado: {
                "id": null,
                "categoria": null,
                "nom": null,
                "descripció": null,
                "preu": null,
                "url_imatge": null,
            },

        }
    },
    created() {
        getProductes().then(response => {
            this.productes = response;
            this.mostrar_productes = true;
        })
    },
    methods: {
        getImageSource(producte) {
            if (producte.url_imatge && !producte.url_imatge.startsWith('http')) {
                return `http://localhost:3001/${producte.url_imatge}`;
            }
            return producte.url_imatge;
        },
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
        verEditar(producte) {
            this.vereditarProducte = true;
            
            this.producte_editado = {
                id: producte.id,
                categoria: producte.categoria,
                nom: producte.nom,
                descripció: producte.descripció,
                preu: producte.preu,
                url_imatge: producte.url_imatge,
            };
        },
        addProductes() {
            addProducte(this.nuevo_producte)
                .then(() => {
                    return getProductes();
                })
                .then((response) => {
                    this.productes = response;
                })
                .catch((error) => {
                    console.error('Error al agregar producto:', error);
                });

            this.nuevo_producte = {
                "id": null,
                "categoria": null,
                "nom": null,
                "descripció": null,
                "preu": null,
                "url_imatge": null,
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

        },
        actualizarProducte() {
            updateProducte(this.producte_editado)
                .then(() => {
                    return getProductes();
                })
                .then((response) => {
                    this.productes = response;
                })
                .catch((error) => {
                    console.error('Error al editar producte:', error);
                });
            
            this.vereditarProducte = false;
            this.ver_info = false;
        },


    }
}
</script>