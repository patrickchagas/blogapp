//Carregando módulos
    const express = require("express")
    const handlebars = require("express-handlebars")
    const bodyParser = require("body-parser")
    const app = express()
    const admin = require("./routes/admin")
    const path = require("path")
    const mongoose = require("mongoose")

//Configurações
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


    