const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")

require("../models/Usuario")
const Usuario = mongoose.model("usuarios")

router.get("/cadastro", (req, res) => {
    res.render("usuarios/cadastro")
})

router.post("/cadastro", (req, res) =>{

    var erros = []


    //Validação de dados do formulário
    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "Nome inválido"})
    }

    if(!req.body.email || typeof req.body.email == undefined || req.body.email == null){
        erros.push({texto: "E-mail inválido"})
    }

    if(!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null){
        erros.push({texto: "Senha inválida"})
    }

    //Verificar se a senha tem menos que 4 caracteres
    if(req.body.senha.length < 4){
        erros.push({texto: "Senha muito curta!"})
    }

    //Verificar se a senha repetida é igual 
    if(req.body.senha != req.body.senha2){
        erros.push({texto: "As senhas são diferentes, tente novamente."})
    }

    if(erros.length > 0){

        res.render("usuarios/cadastro", {erros: erros})

    }else{
        //
    }

})



module.exports = router