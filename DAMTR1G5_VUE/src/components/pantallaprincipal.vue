<template>
    <title>Panell de control</title>
    <div class="panell_principal" >
        <v-layout class="rounded rounded-md">
            <v-app-bar title="Panell de control" style="background-color: #800; color: white; "></v-app-bar>
            <v-main class="d-flex align-center justify-center" style="min-height: 300px;">
                <v-card >
                    <v-card-title>Gestió Productes</v-card-title>
                    <img :src="imatgeProductes" style="height: 250px; width: 250px;">
                    <v-card-actions>
                        <v-btn @click="irProductes">Productes <img src="http://takeawayg5.dam.inspedralbes.cat:3968/imatges_productes/productes.png"></v-btn>
                    </v-card-actions>
                </v-card>
                <v-card>
                    <v-card-title>Gestió Comandes</v-card-title>
                    <img :src="imatgeComandes" style="height: 250px; width: 250px;">
                    <v-card-actions>
                        <v-btn @click="irComandes">Comandes <img src="http://takeawayg5.dam.inspedralbes.cat:3968/imatges_productes/comanda.png"></v-btn>
                    </v-card-actions>
                </v-card>
            </v-main>
        </v-layout>
    </div>

</template>
  
<script>
export default {
    data() {
        return {
            imatgeProductes: 'http://takeawayg5.dam.inspedralbes.cat:3968/imatges_productes/imatge_productes.jpg',
            imatgeComandes: 'http://takeawayg5.dam.inspedralbes.cat:3968/imatges_productes/imatge_comandes.jpg'
        }
    },
    methods: {
        irComandes() {
            this.$router.push("/gestiocomandes")
        },
        irProductes() {
            this.$router.push("/gestioproductes")
        },
        

    }
}
</script>
