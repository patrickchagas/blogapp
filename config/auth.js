const localStrategy = require("passport-local")
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

//Model de Usuário
require("../models/Usuario")
const Usuario = mongoose.model("usuarios")


module.exports = function(passport){

    passport.use(new localStrategy({usernameField: 'email', passwordField: 'senha'}, (email, senha, done) => {

        Usuario.findOne({email: email}).then((usuario) => {

            if(!usuario){
                return done(null, false, {message: "Esta conta não existe"})
            }

            bcrypt.compare(senha, usuario.senha, (error, batem) => {

                if(batem){
                    return done(null, usuario)
                }else{
                    return done(null, false, {message: "Usuário ou senha incorreta"})
                }

            })

        })

    }))

    //Salvar os dados do usuário em uma sessão
    passport.serializeUser((usuario, done) => {
        done(null, usuario.id) 
    })

    passport.deserializeUser((id, done) =>{
        //Procurar um usuário pelo ID dele
        Usuario.findById(id, (error, usuario) => {
            done(error, usuario)
        })
    })

}