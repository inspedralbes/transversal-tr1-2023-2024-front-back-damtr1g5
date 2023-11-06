import { reactive } from "vue";
import { io } from "socket.io-client";

export const state = reactive({
    connected: false,
    comanda: []
})

<<<<<<< HEAD
const URL = process.env.NODE_ENV === "production" ? undefined : "http://localhost:3001"
=======
const URL = process.env.NODE_ENV === "production" ? undefined : "http://192.168.56.1:3969"
>>>>>>> 70f4a622418c5de60b70009b07b1049bcfacf8d1

export const socket = io(URL)

socket.on("connect", () =>{
    state.connected = true
    pingTimeout: 60000;
})

socket.on("disconnect", () => {
    state.connected = false;
  });

socket.on("novaComanda", (...args)=>{
    state.comanda.push(args)
})