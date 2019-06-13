//Carregando módulos
    const express = require("express")
    const handlebars = require("express-handlebars")
    const bodyParser = require("body-parser")
    const app = express()
    const admin = require("./routes/admin")
    const path = require("path")
    const mongoose = require("mongoose")
    const session = require("express-session")
    const flash = require("connect-flash")

//Configurações
    //Sessão
        //Tudo que tiver app.use é um middleware
        app.use(session({
            secret: "cursodenode",
            resave: true,
            saveUninitialized: true 
        }))

        //flash
        app.use(flash())

    //Middleware
        app.use((req, res, next) => {
            //para criar variáves globais
            res.locals.success_msg = req.flash("success_msg"),
            res.locals.error_msg = req.flash("error_msg")
            next()
        })

    //Body Parser
        app.use(bodyParser.urlencoded({extended: true}))
        app.use(bodyParser.json())
    //Handlebars
        app.engine('handlebars', handlebars({defaultLayout: 'main'}));
        app.set('view engine', 'handlebars');    
    // Mongoose
        mongoose.connect("mongodb://localhost/blogapp", {useNewUrlParser: true}).then(() => {
            console.log("Conectado ao MongoDB")
        }).catch((error) => {
            console.log("Erro ao se conectar: "+ error)
        }) 
    //

    //Public 
        app.use(express.static(path.join(__dirname, "public")))
        


//Rotas
    app.use('/admin', admin)


//Outros
const PORT = 8081;
app.listen(PORT, () =>{
    console.log("Servidor rodando!");
});


    