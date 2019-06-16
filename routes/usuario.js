const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const passport = require("passport")

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

    //Verificar se a senha repetida é diferente 
    if(req.body.senha != req.body.senha2){
        erros.push({texto: "As senhas são diferentes, tente novamente."})
    }

    if(erros.length > 0){

        res.render("usuarios/cadastro", {erros: erros})

    }else{
        
        Usuario.findOne({email: req.body.email}).then((usuario) => {    
            if(usuario){
                req.flash("error_msg", "Já existe uma conta com esse e-email no nosso sistema.")
                res.redirect("/usuarios/cadastro")

            }else{
                 
                const novoUsuario = new Usuario({
                    nome: req.body.nome,
                    email: req.body.email,
                    senha: req.body.senha
                })

                //Gerar HASH de senha
                //Salt -> um valor aleatório misturado com hash
                bcrypt.genSalt(10, (erro, salt) => {
                    bcrypt.hash(novoUsuario.senha, salt, (erro, hash) => {
                        if(erro){
                            req.flash("error_msg", "Houve um erro ao cadastrar usuário.")
                            res.redirect("/")
                        } 

                        novoUsuario.senha = hash

                        novoUsuario.save().then(() =>{

                            req.flash("success_msg", "Usuário cadastrado com sucesso. ")
                            res.redirect("/")

                        }).catch((error) => {
                            req.flash("error_msg", "Houve um erro ao cadastrar usuário.")
                            res.redirect("/")
                        })

                        
                    })
                })   

            }
        }).catch((error) => {
            req.flash("error_msg", "Houve um erro interno.")
            res.redirect("/")
        })

    }
})

router.get("/login", (req, res) => {
    res.render("usuarios/login")
})

router.post("/login", (req, res, next) => {

    //Autenticar usuário
    passport.authenticate("local", {
        successRedirect: "/", // se autenticação ocorrer com sucesso
        failureRedirect: "/usuarios/login", // se ocorrer alguma falha na autenticação
        failureFlash: true
    })(req, res, next)

})

//Deslogar do sistema
router.get("/logout", (req, res) => {

    req.logout()
    req.flash("success_msg", "Deslogado com sucesso!")
    res.redirect("/")


});



module.exports = router