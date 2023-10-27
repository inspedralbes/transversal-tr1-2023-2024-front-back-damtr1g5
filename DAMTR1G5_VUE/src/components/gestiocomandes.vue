<template>
    <title>Gestió de comandes</title>

    <div class="panell_recepcio" v-if="verComandes">
        <v-layout class="rounded rounded-md">
            <v-app-bar title="Gestió de comandes">
                <v-btn @click="irPanell">Panell de control</v-btn>
                <v-btn @click="irProductes">Productes</v-btn>
                <p>|</p>
                <v-btn @click="veureStats">Mostrar Estadístiques</v-btn>
                <v-btn @click="veurePreparacio">En Preparació</v-btn>
                <v-btn @click="veureResum">Resúm</v-btn>
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
                <v-btn @click="veureStats">Mostrar Estadístiques</v-btn>
                <v-btn @click="veureResum">Resúm</v-btn>
            </v-app-bar>
            <v-main class="d-flex align-center justify-center" style="min-height: 300px;">
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
export default {
    data() {
        return {
            verComandes: true,
            verStats: false,
            verPreparacio: false,
            verResum: false

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
        veurePreparacio(){
            this.verComandes = false
            this.verPreparacio = true
            this.verResum = false
            this.verStats = false
        },
        veureResum(){
            this.verComandes = false
            this.verPreparacio = false
            this.verResum = true
            this.verStats = false
        }

    }
}
</script>
