<template>
    <title>Gestió de productes</title>

    <v-layout class="rounded rounded-md" v-if="mostrar_productes">
        <v-app-bar title="Gestió de productes">

            <v-btn @click="irPanell">Panell de control</v-btn>
            <v-btn @click="irComandes">Comandes</v-btn>
            <p>|</p>
            <v-btn @click="verFormulari">Insertar Producte</v-btn>
        </v-app-bar>
        <v-main class="d-flex align-center justify-center" style="min-height: 300px;">
            <v-container class="grid-list-md">
                <v-text-field v-model="searchQuery" label="Cercar..." outlined dense clearable
                    prepend-inner-icon="mdi-magnify"></v-text-field>
                <v-row>
                    <v-col v-for="producte in filteredProducts" :key="producte.id" cols="3">
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
                        <v-btn @click="activardesactivar(selected_productes)"> {{ selected_productes.estado_producte ===
                            'activado' ? 'Desactivar' : 'Activar' }}</v-btn> </v-card-actions>
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
                        <!-- <v-text-field v-model="nuevo_producte.url_imatge" label="URL de la imatge"></v-text-field> -->
                        <v-file-input v-model="nuevo_producte.url_imatge" label="Arxiu imatge" accept="image/*"
                            type="file"></v-file-input>
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
                        <v-file-input v-model="producte_editado.url_imatge" label="Arxiu imatge" accept="image/*"
                            type="file"></v-file-input>
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
            imatgeedicio: null,
            searchQuery: "",

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
                return `http://localhost:3968/imatges_productes/${producte.url_imatge}`;
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
            };
            this.imatgeedicio = producte.url_imatge;
        },
        addProductes() {
            this.imatge = this.nuevo_producte.url_imatge[0]

            const formData = new FormData();
            formData.append('categoria', this.nuevo_producte.categoria);
            formData.append('nom', this.nuevo_producte.nom);
            formData.append('descripcio', this.nuevo_producte.descripció);
            formData.append('preu', this.nuevo_producte.preu);
            formData.append('imatge', this.imatge);
            formData.append('url_imatge', this.imatge.name);

            addProducte(formData)
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

        },
        actualizarProducte() {
            const formDataEdit = new FormData();
            formDataEdit.append('id', this.producte_editado.id);
            formDataEdit.append('categoria', this.producte_editado.categoria);
            formDataEdit.append('nom', this.producte_editado.nom);
            formDataEdit.append('descripcio', this.producte_editado.descripció);
            formDataEdit.append('preu', this.producte_editado.preu);

            // Verifica si se ha seleccionado un nuevo archivo de imagen
            if (this.producte_editado.url_imatge && this.producte_editado.url_imatge[0]) {
                // Se ha seleccionado un nuevo archivo, utiliza ese archivo
                this.imatge = this.producte_editado.url_imatge[0];
                formDataEdit.append('imatgeEdit', this.imatge);
                formDataEdit.append('url_imatge', this.imatge.name);
            } else {
                // No se ha seleccionado un nuevo archivo, utiliza la imagen existente
                formDataEdit.append('url_imatge', this.imatgeedicio);
            }

            updateProducte(formDataEdit)
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
        async activardesactivar(product) {
            const nuevoEstado = product.estado_producte === 'activado' ? 'desactivado' : 'activado';

            const formData = new FormData();
            formData.append('id', product.id);
            formData.append('categoria', product.categoria);
            formData.append('nom', product.nom);
            formData.append('descripcio', product.descripció);
            formData.append('preu', product.preu);
            formData.append('url_imatge', product.url_imatge);
            formData.append('estado_producte', nuevoEstado);

            try {
                const response = await updateProducte(formData);

                // Verifica si la actualización en el servidor fue exitosa
                if (response.message === 'Actualització exitosa') {
                    // Actualiza el estado localmente
                    product.estado_producte = nuevoEstado;
                } else {
                    // Si hubo un problema en el servidor, puedes manejarlo aquí
                    console.error('Error en la actualización del estado del producto');
                }
            } catch (error) {
                // Maneja errores en la solicitud, como problemas de red
                console.error('Error en la solicitud de actualización', error);
            }
            this.ver_info = false;
        }

    },
    computed: {
        filteredProducts() {
            const query = this.searchQuery.toLowerCase().trim();
            if (query === "") {
                return this.productes.result;
            } else {
                return this.productes.result.filter((producte) => {
                    return producte.nom.toLowerCase().startsWith(query);
                });
            }
        },
    }
}
</script>   