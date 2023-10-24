<template>
    <title>Gestió de comandes</title>

    <div class="panell_comandes" v-if="verComandes">
        <v-layout class="rounded rounded-md">
            <v-app-bar title="Gestió de comandes">
                <v-btn @click="irPanell">Panell de control</v-btn>
                <v-btn @click="irProductes">Productes</v-btn>
                <v-btn @click="veureStats">Mostrar Estadístiques</v-btn>
            </v-app-bar>
            <v-main class="d-flex align-center justify-center" style="min-height: 300px;">
            </v-main>
        </v-layout>
    </div>

    <div class="panell_estadistiques" v-if="verStats">
        <v-layout class="rounded rounded-md">
            <v-app-bar title="Estadistiques">
                <v-btn @click="irPanell">Panell de control</v-btn>
                <v-btn @click="irProductes">Productes</v-btn>
                <v-btn @click="veureComandes">Panell de comandes</v-btn>
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
            verComandes: true,
            verStats: false,
        }
    },
    methods: {
        irPanell() {
            this.$router.push("/")
        },
        irProductes() {
            this.$router.push("/gestioproductes")
        },
        veureStats() {
            this.verComandes = false
            this.verStats = true
        },
        veureComandes() {
            this.verComandes = true
            this.verStats = false

        }

    }
}
</script>
