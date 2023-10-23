<template>
    <title>Panell de control</title>
    <div class="panell_principal" v-if="verPanell">
        <v-layout class="rounded rounded-md">
            <v-app-bar title="Panell de control">
                <v-btn @click="veureStats" >Mostrar Estadístiques</v-btn>
            </v-app-bar>
            <v-main class="d-flex align-center justify-center" style="min-height: 300px;">
                <v-card text="Gestió Productes">
                    <img src="https://i.pinimg.com/originals/7c/47/44/7c4744fa2d6e36bb69657845d7eb9b11.jpg" style="height: 250px; width: 250px;">
                    <v-card-actions>
                        <v-btn @click="irProductes">Productes</v-btn>
                    </v-card-actions>
                </v-card>
                <v-card text="Gestió Comandes">
                    <img src="https://static.vecteezy.com/system/resources/previews/023/597/379/non_2x/pet-restaurant-bell-icon-outline-animal-friend-vector.jpg" style="height: 250px; width: 250px;">
                    <v-card-actions>
                        <v-btn @click="irComandes">Comandes</v-btn>
                    </v-card-actions>
                </v-card>
            </v-main>
        </v-layout>
    </div>

    <div class="panell_estadistiques" v-if="verStats">
        <v-layout class="rounded rounded-md">
            <v-app-bar title="Estadistiques">
                <v-btn @click="veurePanell">Panell Control</v-btn>
            </v-app-bar>
            <v-main class="d-flex align-center justify-center" style="min-height: 300px;">
                
            </v-main>
        </v-layout>
    </div>
</template>
  
<script>
export default {
    data() {
        return {
            verPanell: true,
            verStats: false,

        }
    },
    methods: {
        irComandes() {
            this.$router.push("/gestiocomandes")
        },
        irProductes() {
            this.$router.push("/gestioproductes")
        },
        veureStats(){
            this.verPanell = false
            this.verStats = true
        },
        veurePanell(){
            this.verPanell = true
            this.verStats = false

        }

    }
}
</script>
