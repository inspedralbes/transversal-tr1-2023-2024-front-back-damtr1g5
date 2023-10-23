<template>
    <title>Gestió de comandes</title>
    <v-layout class="rounded rounded-md">
            <v-app-bar title="Gestió de comandes">
                <v-btn @click="irPanell">Panell de control</v-btn> 
                <v-btn @click="irProductes">Productes</v-btn>
            </v-app-bar>
            <v-main class="d-flex align-center justify-center" style="min-height: 300px;">
                
                
            </v-main>
        </v-layout>
  </template>
  
  <script>
  export default {
    data() {
      return {
        msg: 'Hello comandes!'
      }
    },
    methods: {
        irPanell() {
            this.$router.push("/")
        },
        irProductes() {
            this.$router.push("/gestioproductes")
        }

    }
  }
  </script>
