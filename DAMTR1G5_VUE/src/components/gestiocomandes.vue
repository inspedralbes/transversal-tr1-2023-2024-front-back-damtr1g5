<template>
    <title>Gestió de comandes</title>

    <div class="panell_recepcio" v-if="verComandes">
        <v-layout class="rounded rounded-md">
            <v-app-bar title="Gestió de comandes">
                <v-btn @click="irPanell">Panell de control</v-btn>
                <v-btn @click="irProductes">Productes</v-btn>
                <p>|</p>
                <v-btn @click="veurePreparacio">En Preparació</v-btn>
                <v-btn @click="veureResum">Resúm</v-btn>
            </v-app-bar>
            <v-main class="d-flex align-center justify-center" style="min-height: 300px;">
                <v-container class="grid-list-md">
                    <v-row>
                        <v-col v-for="comanda in comandesrecepcio.comandes" :key="comanda.id" cols="3">
                            <v-card v-if="comanda.estat === 'pendent'">
                                <v-img :src="imatgeComandes" height="300"></v-img>
                                Comanda: <v-text>{{ comanda.id }}</v-text><br>
                                <v-btn @click="verInfo(comanda)">Más info</v-btn>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-container>
                <v-dialog v-model="ver_info" max-width="600">
                    <v-card>
                        <v-card-title>Informació de la comanda: </v-card-title>
                        <v-card-text>
                            <h4>Entrega: </h4>
                            <v-text>{{ selected_comanda.entrega || 'No especificada' }}</v-text>
                            <h4>Productos:</h4>
                            <ul>
                                <li v-for="producte in selected_comanda.productes" :key="producte.id"
                                    style="margin-left: 25px;">
                                    {{ producte.nom }} - {{ producte.preu }}€
                                </li>
                            </ul>
                            <h4>Preu Total</h4>
                            <v-text>{{ calcularTotal(selected_comanda.productes) }}€</v-text>
                        </v-card-text>
                        <v-card-actions>
                            <v-btn @click="ver_info = false">Tancar</v-btn>
                            <v-btn @click="aceptarComanda" style="color: green;">Aceptar Comanda</v-btn>
                            <v-btn @click="eliminarComanda" style="color: red;">Eliminar Comanda</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-main>
        </v-layout>
    </div>

    <div class="panell_estadistiques" v-if="verStats">
        <v-layout class="rounded rounded-md">
            <v-app-bar title="Estadistiques">
                <v-btn @click="irPanell">Panell de control</v-btn>
                <v-btn @click="irProductes">Productes</v-btn>
                <p>|</p>
                <v-btn @click="veureComandes">Gestió de comandes</v-btn>
                <v-btn @click="veurePreparacio">En Preparació</v-btn>
                <v-btn @click="veureResum">Resúm</v-btn>
            </v-app-bar>
            <v-main class="d-flex align-center justify-center" style="min-height: 300px;">
            </v-main>
        </v-layout>
    </div>
    <div class="panell_enpreparacio" v-if="verPreparacio">
        <v-layout class="rounded rounded-md">
            <v-app-bar title="En Preparació">
                <v-btn @click="irPanell">Panell de control</v-btn>
                <v-btn @click="irProductes">Productes</v-btn>
                <p>|</p>
                <v-btn @click="veureComandes">Gestió de comandes</v-btn>
                <v-btn @click="veureResum">Resúm</v-btn>
            </v-app-bar>
            <v-main class="d-flex align-center justify-center" style="min-height: 300px;">
                <v-container class="grid-list-md">
                    <v-row>
                        <v-col v-for="comanda in comandesrecepcio.comandes" :key="comanda.id" cols="3">
                            <v-card v-if="comanda.estat === 'aprovada'">
                                <v-img :src="imatgeComandes" height="300"></v-img>
                                Comanda: <v-text>{{ comanda.id }}</v-text><br>
                                <v-btn @click="verInfo(comanda)">Más info</v-btn>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-container>
                <v-dialog v-model="ver_info" max-width="600">
                    <v-card>
                        <v-card-title>Informació de la comanda: </v-card-title>
                        <v-card-text>
                            <h1>En preparació</h1>
                            <h4>Entrega: </h4>
                            <v-text>{{ selected_comanda.entrega || 'No especificada' }}</v-text>
                            <h4>Productos:</h4>
                            <ul>
                                <li v-for="producte in selected_comanda.productes" :key="producte.id"
                                    style="margin-left: 25px;">
                                    {{ producte.nom }} - {{ producte.preu }}€
                                </li>
                            </ul>
                            <h4>Preu Total</h4>
                            <v-text>{{ calcularTotal(selected_comanda.productes) }}€</v-text>
                        </v-card-text>
                        <v-card-actions>
                            <v-btn @click="ver_info = false">Tancar</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-main>
        </v-layout>
    </div>
    <div class="panell_resum" v-if="verResum">
        <v-layout class="rounded rounded-md">
            <v-app-bar title="Resúm de comandes">
                <v-btn @click="irPanell">Panell de control</v-btn>
                <v-btn @click="irProductes">Productes</v-btn>
                <p>|</p>
                <v-btn @click="veureComandes">Gestió de comandes</v-btn>
                <v-btn @click="veureStats">Mostrar Estadístiques</v-btn>
                <v-btn @click="veurePreparacio">En Preparació</v-btn>
            </v-app-bar>
            <v-main class="d-flex align-center justify-center" style="min-height: 300px;">
            </v-main>
        </v-layout>
    </div>
</template>
  
<script>
import { getComandes, estatComanda } from '@/services/communicationsManager'
import { socket, state } from "@/services/socket"
export default {
    data() {
        return {
            imatgeComandes: 'http://localhost:3001/imatge_comanda.png',
            verComandes: true,
            verStats: false,
            verPreparacio: false,
            verResum: false,
            comandesrecepcio: [],
            selected_comanda: [],
            ver_info: false,
        }
    },
    created() {
        this.obtenerComandas();
        socket.on("novaComanda", (comandas) => {
            console.log("Nueva comanda recibida:", comandas);

            // Actualiza la lista de comandas en tiempo real
            this.comandesrecepcio = comandas;
        });
    },


    methods: {
        obtenerComandas() {
            getComandes().then(response => { this.comandesrecepcio = response; })
            this.verComandes = true;
        },
        irPanell() {
            this.$router.push("/")
        },
        irProductes() {
            this.$router.push("/gestioproductes")
        },
        verInfo(comandes) {
            this.selected_comanda = comandes;
            console.log('selected_comandes:', this.selected_comanda);
            this.ver_info = true;
        },
        veureStats() {
            this.verComandes = false
            this.verPreparacio = false
            this.verResum = false
            this.verStats = true
        },
        veureComandes() {
            this.verComandes = true
            this.verPreparacio = false
            this.verResum = false
            this.verStats = false
        },
        veurePreparacio() {
            this.verComandes = false
            this.verPreparacio = true
            this.verResum = false
            this.verStats = false
        },
        veureResum() {
            this.verComandes = false
            this.verPreparacio = false
            this.verResum = true
            this.verStats = false
        },
        calcularTotal() {
            if (this.selected_comanda && this.selected_comanda.productes) {
                let total = 0;

                for (const producte of this.selected_comanda.productes) {
                    total += parseFloat(producte.preu);
                }

                return total.toFixed(2);
            } else {
                return 'No se encontraron productos';
            }
        },
        aceptarComanda() {
            console.log("Función estatComanda ejecutada");
            if (this.selected_comanda) {
                const comandaId = this.selected_comanda.id;
                const nuevoEstado = 'aprovada';

                estatComanda(comandaId, nuevoEstado)
                    .then(() => getComandes())
                    .then((response) => {
                        this.comandesrecepcio = response;
                    })
                    .catch((error) => {
                        console.error("Error al aprobar la comanda:", error);
                    });
            } else {
                console.error("No se ha seleccionado una comanda.");
            }
            this.ver_info = false;
        },
        eliminarComanda() {
            console.log("Función estatComanda ejecutada");
            if (this.selected_comanda) {
                const comandaId = this.selected_comanda.id;
                const nuevoEstado = 'rebutjada';

                estatComanda(comandaId, nuevoEstado)
                    .then(() => getComandes())
                    .then((response) => {
                        this.comandesrecepcio = response;
                        console.log("comanda rechazada")
                    })
                    .catch((error) => {
                        console.error("Error al rechazar la comanda:", error);
                    });
            } else {
                console.error("No se ha seleccionado una comanda.");
            }
            this.ver_info = false;
        },
    }
}
</script>
