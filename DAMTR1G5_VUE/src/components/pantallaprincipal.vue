<template>
    <title>Panell de control</title>
    <div class="panell_principal" >
        <v-layout class="rounded rounded-md">
            <v-app-bar title="Panell de control"></v-app-bar>
            <v-main class="d-flex align-center justify-center" style="min-height: 300px;">
                <v-card text="Gestió Productes">
                    <img :src="imatgeProductes" style="height: 250px; width: 250px;">
                    <v-card-actions>
                        <v-btn @click="irProductes">Productes</v-btn>
                    </v-card-actions>
                </v-card>
                <v-card text="Gestió Comandes">
                    <img :src="imatgeComandes" style="height: 250px; width: 250px;">
                    <v-card-actions>
                        <v-btn @click="irComandes">Comandes</v-btn>
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
            imatgeProductes: 'http://localhost:3001/imatge_productes.jpg',
            imatgeComandes: 'http://localhost:3001/imatge_comandes.jpg'
            

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
