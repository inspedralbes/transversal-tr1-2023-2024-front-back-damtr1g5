<template>
    <title>Panell de control</title>
    <div class="panell_principal" >
        <v-layout class="rounded rounded-md">
            <v-app-bar title="Panell de control"></v-app-bar>
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

    
</template>
  
<script>
export default {
    data() {
        return {
            

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
