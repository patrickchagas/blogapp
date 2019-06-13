const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
require("../models/Categoria")
const Categoria = mongoose.model("categorias")

router.get("/", (req, res) => {
    res.render("admin/index")
})

router.get("/posts", (req, res) => {
    res.send("Página de posts")
})

router.get("/categorias", (req, res) => {
    res.render("admin/categorias")
})

router.get("/categorias/add", (req, res) => {
    res.render("admin/addcategorias")
})

//Salvar Categoria no banco
router.post("/categorias/nova", (req, res) => {

    var erros = []

    //Validação do formulário
    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "Nome inválido"})
    }

    if(!req.body.slug || typeof req.body.slug == undefined || req.body.nome == null){
        erros.push({texto: "Slug inválido"})
    }

    if(req.body.nome.length < 2){
        erros.push({texto: "O nome da categoria é muito pequeno."})
    }

    if(erros.length > 0){
        res.render("admin/addcategorias", {erros: erros})
    } else{

        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }

        new Categoria(novaCategoria).save().then(() => {
            req.flash("success_msg", "Categoria criada com sucesso!")
            res.redirect("/admin/categorias")
        }).catch((error) => {
            req.flash("error_msg", "Houve um erro ao salvar a categoria, tenta novamente!")
            res.redirect("/admin")
        })
    }
})


module.exports = router;