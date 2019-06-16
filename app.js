//Carregando módulos
    const express = require("express")
    const handlebars = require("express-handlebars")
    const bodyParser = require("body-parser")
    const moment = require('moment') // formatar datas

    const app = express()
    const path = require("path")
    const mongoose = require("mongoose")
    const session = require("express-session")
    const flash = require("connect-flash")

    require("./models/Postagem")
    const Postagem = mongoose.model("postagens")

    require("./models/Categoria")
    const Categoria = mongoose.model("categorias")

    //Grupo de Rotas
    const admin = require("./routes/admin")
    const usuarios = require("./routes/usuario")

    const passport = require("passport")
    require("./config/auth")(passport)

    const {eAdmin} = require("./helpers/eAdmin") //{eAdmin}-> significa pegar apenas esta função    

    const db = require("./config/db")

//Configurações
    //Sessão
        //Tudo que tiver app.use é um middleware
        app.use(session({
            secret: "cursodenode",
            resave: true,
            saveUninitialized: true 
        }))
        //Configuração do Passport
        app.use(passport.initialize())
        app.use(passport.session())

        //flash
        app.use(flash())

    //Middleware
        app.use((req, res, next) => {
            //para criar variáves globais
            res.locals.success_msg = req.flash("success_msg"),
            res.locals.error_msg = req.flash("error_msg")
            res.locals.error = req.flash("error")
            res.locals.user = req.user || null
            next()
        })

    //Body Parser
        app.use(bodyParser.urlencoded({extended: true}))
        app.use(bodyParser.json())
    //Handlebars
        app.engine('handlebars', handlebars({
            defaultLayout: ('main'),
            helpers: { // Helper -> usando para formatação de datas
                formatDate: (date) => {
                    return moment(date).format('DD/MM/YYYY')
                }
            }
            
        }));

        
        
        app.set('view engine', 'handlebars');    

    // Mongoose
        mongoose.connect(db.mongoURI, {useNewUrlParser: true}).then(() => {
            console.log("Conectado ao MongoDB")
        }).catch((error) => {
            console.log("Erro ao se conectar: "+ error)
        }) 
 
    //Public 
        app.use(express.static(path.join(__dirname, "public")))
        


//Rotas
    
    //Rota Principal
    app.get("/", (req, res) => {
        Postagem.find().populate("categoria").sort({data: "desc"}).then((postagens) =>{
            res.render("index", {postagens: postagens})
        }).catch((error) => {
            req.flash("error_msg", "Houve um erro interno.")
            res.redirect("/404")
        })
    }) 
    
    //Postagem - Leia Mais
    app.get("/postagem/:slug", (req, res) => {
        Postagem.findOne({slug: req.params.slug}).then((postagem) =>{

            if(postagem){
               res.render("postagem/index", {postagem: postagem}) 
            }else {
               req.flash("error_msg", "Está postagem não existe.")
               res.redirect("/")
            }

        }).catch((error) => {
            req.flash("error_msg", "Houve um erro interno.")
            res.redirect("/")
        })    
    })

    //Listagem de categorias
    app.get("/categorias", (req, res) => {
        Categoria.find().then((categorias) => {
            res.render("categorias/index", {categorias: categorias})
        }).catch((error) => {
            req.flash("error_msg", "Houve um erro interno ao listar as categorias.")
            res.redirect("/")
        }) 
    })

    //Listar postagens pertencentes a uma certa categoria
    app.get("/categorias/:slug", (req, res) =>{
        Categoria.findOne({slug: req.params.slug}).then((categoria) => {

            if(categoria){
               
                Postagem.find({categoria: categoria._id}).then((postagens) => {

                    res.render("categorias/postagens", {postagens: postagens, categoria: categoria})

                }).catch((error) => {

                    req.flash("error_msg", "Houve um erro ao listar as postagens.")
                    res.redirect("/")
                }) 

            } else {

                req.flash("error_msg", "Essa categoria não existe.")
                res.redirect("/")    

            }

        }).catch((error) => {
            req.flash("error_msg", "Houve um erro interno ao carregar a página dessa categoria.")
            res.redirect("/")
        })
    })
    
    //Rota de erro
    app.get("/404", (req, res) => {
        res.send("Error 404!")
    })
    
    //eAdmin -> Verificar se o usuário tem permissão de administrador
    app.use('/admin', eAdmin, admin)
    app.use("/usuarios", usuarios)


//Outros
const PORT = process.env.PORT || 8081;
app.listen(PORT, () =>{
    console.log("Servidor rodando!");
});


    