<template>
    <title>Gestió de productes</title>
   
        <v-layout class="rounded rounded-md">
            <v-app-bar title="Gestió de productes">
                <v-btn @click="irPanell">Panell de control</v-btn> 
                <v-btn @click="irComandes">Comandes</v-btn>
            </v-app-bar>
            <v-main class="d-flex align-center justify-center" style="min-height: 300px;">
                
                
            </v-main>
        </v-layout>
  
    
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
        irPanell() {
            this.$router.push("/")
        }

    }
  }
  </script>
