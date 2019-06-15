const mongoose = require("mongoose")
const Schema = mongoose.Schema

const Usuario = new Schema({
    Nome:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    senha:{
        type: String,
        required: true
    }
})

mongoose.model("usuarios", Usuario)