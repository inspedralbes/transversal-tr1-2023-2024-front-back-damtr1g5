<template>
    <title>Gestió de comandes</title>

    <div class="panell_recepcio" v-if="verComandes">
        <v-layout class="rounded rounded-md">
            <v-app-bar title="Recepció de comandes" style="background-color: #800; color: white; ">
                <v-btn @click="irPanell">Panell de control</v-btn>
                <v-btn @click="irProductes">Productes</v-btn>
                <p>|</p>
                <v-btn @click="veurePreparacio">En Preparació</v-btn>
                <v-btn @click="veureResum">Resúm</v-btn>
            </v-app-bar>
            <v-main class="d-flex align-center justify-center" style="min-height: 300px;">
                <v-container class="grid-list-md">
                    <v-text-field v-model="searchQuery" label="Cercar..." outlined dense clearable
                        prepend-inner-icon="mdi-magnify"></v-text-field>
                    <v-row>
                        <v-col v-for="comanda in filteredComandasPendent" :key="comanda.id" cols="3">
                            <v-card>
                                <v-img :src="imatgeComandes" height="300"></v-img>
                                <v-card-title>Comanda: {{ comanda.id }} </v-card-title>
                                <v-card-actions><v-btn @click="verInfo(comanda)">Más info</v-btn></v-card-actions>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-container>
                <v-dialog v-model="ver_info" max-width="600">
                    <v-card>
                        <v-card-title>Informació de la comanda: </v-card-title>
                        <v-card-text>
                            <h4>Data Creació: </h4>
                            <v-text>{{ formatDateTime(selected_comanda.datacomanda) || 'No especificada' }}</v-text>
                            <h4>Productes:</h4>
                            <ul>
                                <li v-for="producte in selected_comanda.productes" :key="producte.id"
                                    style="margin-left: 25px;">
                                    X{{producte.quantitat}} - {{ producte.nom }} - {{ producte.preu }}€
                                </li>
                            </ul>
                            <h4>Preu Total:</h4>
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
            <v-app-bar title="Estadistiques" style="background-color: #800; color: white; ">
                <v-btn @click="irPanell">Panell de control</v-btn>
                <v-btn @click="irProductes">Productes</v-btn>
                <p>|</p>
                <v-btn @click="veureComandes">Recepció de comandes</v-btn>
                <v-btn @click="veurePreparacio">En Preparació</v-btn>
                <v-btn @click="veureResum">Resúm</v-btn>
            </v-app-bar>
            <v-main class="d-flex align-center justify-center" style="min-height: 300px">
                <img v-if="isLoading" src="http://takeawayg5.dam.inspedralbes.cat:3968/imatges_productes/gif_carrega.gif">
                <div v-else-if="imatgeGrafic1 && imatgeGrafic2 && imatgeGrafic3">
                    <img :src="imatgeGrafic1" alt="Estadísticas comandes per producto" />
                    <img :src="imatgeGrafic2" alt="Estadísticas comandes per horas" />
                    <img :src="imatgeGrafic3" alt="Estadísticas recaudación per horas" />
                </div>
            </v-main>

        </v-layout>
    </div>
    <div class="panell_enpreparacio" v-if="verPreparacio">
        <v-layout class="rounded rounded-md">
            <v-app-bar title="En Preparació" style="background-color: #800; color: white; ">
                <v-btn @click="irPanell">Panell de control</v-btn>
                <v-btn @click="irProductes">Productes</v-btn>
                <p>|</p>
                <v-btn @click="veureComandes">Recepció de comandes</v-btn>
                <v-btn @click="veureResum">Resúm</v-btn>
            </v-app-bar>
            <v-main class="d-flex align-center justify-center" style="min-height: 300px;">
                <v-container class="grid-list-md">
                    <v-text-field v-model="searchQueryPreparacio" label="Cercar..." outlined dense clearable
                        prepend-inner-icon="mdi-magnify"></v-text-field>
                    <v-row>
                        <v-col v-for="comanda in filteredComandasPreparacio" :key="comanda.id" cols="3">
                            <v-card :style="{ 'background-color': comanda.backgroundColor, 'color': comanda.color }">
                                <v-img :src="imatgeComandes" height="300"></v-img>
                                <v-card-title>Comanda: {{ comanda.id }}</v-card-title>
                            <v-card-actions><v-btn @click="verInfo(comanda)">Más info</v-btn></v-card-actions> 
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
                            <v-text>{{ formatDateTime(selected_comanda.entrega) || 'No especificada' }}</v-text>
                            <h4>Data creacio: </h4>
                            <v-text>{{ formatDateTime(selected_comanda.datacomanda) }}</v-text>
                            <h4>Productes:</h4>
                            <ul>
                                <li v-for="producte in selected_comanda.productes" :key="producte.id"
                                    style="margin-left: 25px;">
                                    X{{producte.quantitat}} - {{ producte.nom }} - {{ producte.preu }}€
                                </li>
                            </ul>
                            <h4>Preu Total:</h4>
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
            <v-app-bar title="Resúm de comandes" style="background-color: #800; color: white; ">
                <v-btn @click="irPanell">Panell de control</v-btn>
                <v-btn @click="irProductes">Productes</v-btn>
                <p>|</p>
                <v-btn @click="veureComandes">Recepció de comandes</v-btn>
                <v-btn @click="veureStats">Mostrar Estadístiques</v-btn>
                <v-btn @click="veurePreparacio">En Preparació</v-btn>
            </v-app-bar>
            <v-main class="d-flex align-center justify-center" style="min-height: 300px;">
                <v-container class="grid-list-md">
                    <v-text-field v-model="searchQueryResum" label="Cercar..." outlined dense clearable
                        prepend-inner-icon="mdi-magnify"></v-text-field>
                    <v-row>
                        <v-col v-for="comanda in filteredComandasResum" :key="comanda.id" cols="3">
                            <v-card>
                                <v-img :src="imatgeComandes" height="300"></v-img>
                                <v-card-title>Comanda: {{ comanda.id }}</v-card-title>
                                <v-card-actions><v-btn @click="verInfo(comanda)">Más info</v-btn></v-card-actions>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-container>
                <v-dialog v-model="ver_info" max-width="600">
                    <v-card>
                        <v-card-title>Informació de la comanda: </v-card-title>
                        <v-card-text>
                            <h1>Estat: {{ selected_comanda.estat }}</h1><br>
                            <h4>Data Crreació: </h4>
                            <v-text>{{ formatDateTime(selected_comanda.datacomanda) }}</v-text>
                            <h4>Entrega: </h4>
                            <v-text>{{ formatDateTime(selected_comanda.entrega) || 'No especificada' }}</v-text>
                            <h4>Productes:</h4>
                            <ul>
                                <li v-for="producte in selected_comanda.productes" :key="producte.id"
                                    style="margin-left: 25px;">
                                    X{{producte.quantitat}} - {{ producte.nom }} - {{ producte.preu }}€
                                </li>
                            </ul>
                            <h4>Preu Total:</h4>
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
</template>
  
<script>
import { getComandes, estatComanda, getEstadistiques } from '@/services/communicationsManager'
import { socket, state } from "@/services/socket"
export default {
    data() {
        return {
            imatgeComandes: 'http://takeawayg5.dam.inspedralbes.cat:3968/imatges_productes/imatge_comanda.png',
            verComandes: false,
            verStats: false,
            verPreparacio: false,
            verResum: false,
            comandesrecepcio: [],
            comandesPreparacio: [],
            selected_comanda: [],
            comandaspendent: [],
            comandasResum: [],
            ver_info: false,
            imatgeGrafic1: null,
            imatgeGrafic2: null,
            imatgeGrafic3: null,
            searchQuery: "",
            searchQueryPreparacio: "",
            searchQueryResum: "",
            isLoading: false,

        }
    },
    created() {
        this.veureComandes();
        socket.on("novaComanda", (comandas) => {
            console.log("Nueva comanda recibida:", comandas);

            // Actualiza la lista de comandas en tiempo real
            this.comandesrecepcio = comandas;

        });
    },

    methods: {

        async veureComandes() {
            // Realiza la obtención de comandas en este método
            try {
                const response = await getComandes();
                this.comandesrecepcio = response;

                // Filtra las comandas una vez que se han cargado
                this.comandaspendent = this.comandesrecepcio.comandes.filter(comanda => comanda.estat === 'pendent');

                this.verComandes = true;
                this.verPreparacio = false;
                this.verResum = false;
                this.verStats = false;
            } catch (error) {
                console.log('Error al obtener comandas: ', error);
            }
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
            this.verComandes = false;
            this.verPreparacio = false;
            this.verResum = false;
            this.verStats = true;
            this.isLoading = true;

                try {
                    getEstadistiques();
                    this.imatgeGrafic1 = 'http://takeawayg5.dam.inspedralbes.cat:3968/imatges_stats/comandes_per_producte.png';
                    this.imatgeGrafic2 = 'http://takeawayg5.dam.inspedralbes.cat:3968/imatges_stats/comandes_por_horas.png';
                    this.imatgeGrafic3 = 'http://takeawayg5.dam.inspedralbes.cat:3968/imatges_stats/recaudacio_per_hores.png';
                } catch (error) {
                    console.error('Error al obtener estadísticas:', error);
                }
                this.isLoading = false;
        },

        veurePreparacio() {
            this.verComandes = false;
            this.verPreparacio = true;
            this.verResum = false;
            this.verStats = false;

            this.comandesPreparacio = this.comandesrecepcio.comandes
                .filter(comanda => comanda.estat === 'aprovada')
                .sort((a, b) => new Date(b.datacomanda) - new Date(a.datacomanda));

            const ahora = new Date();
            this.comandesPreparacio.forEach(comanda => {
                const tiempoTranscurrido = (ahora - new Date(comanda.datacomanda)) / (1000 * 60); // Tiempo en minutos
                console.log(`Tiempo transcurrido para comanda ${comanda.id}: ${tiempoTranscurrido} minutos`);

                if (tiempoTranscurrido >= 60) {
                    comanda.backgroundColor = 'black';
                    comanda.color = 'white';
                } else if (tiempoTranscurrido >= 45) {
                    comanda.backgroundColor = 'red';
                } else if (tiempoTranscurrido >= 30) {
                    comanda.backgroundColor = 'yellow';
                } else {
                    comanda.backgroundColor = 'green';
                }
            });
        },
        veureResum() {
            this.verComandes = false
            this.verPreparacio = false
            this.verResum = true
            this.verStats = false
            this.comandasResum = this.comandesrecepcio.comandes;
        },
        calcularTotal() {
            if (this.selected_comanda && this.selected_comanda.productes) {
                let total = 0;

                for (const producte of this.selected_comanda.productes) {
                    total += parseFloat(producte.preu)*producte.quantitat;
                }

                return total.toFixed(2);
            } else {
                return 'No se encontraron productos';
            }
        },
        aceptarComanda() {
            if (this.selected_comanda) {
                const comandaId = this.selected_comanda.id;
                const nuevoEstado = 'aprovada';

                estatComanda(comandaId, nuevoEstado)
                    .then(() => {
                        return getComandes();
                    })
                    .then((response) => {
                        this.comandasrecepcio = response;
                        socket.emit('comandaAprovada', comandaId);
                        console.log("enviat");
                        this.comandaspendent = this.comandasrecepcio.comandes.filter(
                            (comanda) => comanda.estat === 'pendent' || comanda.estat === 'oberta'
                        );
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
            if (this.selected_comanda) {
                const comandaId = this.selected_comanda.id;
                const nuevoEstado = 'rebutjada';

                estatComanda(comandaId, nuevoEstado)
                    .then(() => getComandes())
                    .then((response) => {
                        this.comandasrecepcio = response;
                        socket.emit('comandaRebutjada', comandaId);
                        console.log("comanda rechazada");
                        this.comandaspendent = this.comandasrecepcio.comandes.filter(
                            (comanda) => comanda.estat === 'pendent' || comanda.estat === 'oberta'
                        );  
                    })
                    .catch((error) => {
                        console.error("Error al rechazar la comanda:", error);
                    });
            } else {
                console.error("No se ha seleccionado una comanda.");
            }
            this.ver_info = false;
        },
        formatDateTime(dateTime) {
            if (dateTime) {
                const formattedDate = new Date(dateTime).toLocaleString();
                return formattedDate;
            }
            return 'No especificada';
        },
    },
    computed: {
        filteredComandasPendent() {
            const query = this.searchQuery.toLowerCase().trim();
            if (query === "") {
                return this.comandaspendent;
            } else {
                return this.comandaspendent.filter((comanda) => {
                    return comanda.id.toString().includes(query);
                });
            }
        },
        filteredComandasPreparacio() {
            const query = this.searchQueryPreparacio.toLowerCase().trim();
            if (query === "") {
                return this.comandesPreparacio;
            } else {
                return this.comandesPreparacio.filter((comanda) => {
                    return comanda.id.toString().includes(query);
                });
            }
        },
        filteredComandasResum() {
            const query = this.searchQueryResum.toLowerCase().trim();
            if (query === "") {
                return this.comandasResum
            } else {
                return this.comandasResum.filter((comanda) => {
                    return comanda.id.toString().includes(query);
                });
            }
        },
    },

}
</script>
