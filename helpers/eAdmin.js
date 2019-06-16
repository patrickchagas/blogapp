module.exports = {
    eAdmin: function(req, res, next){
        
        //Verificar se um certo usuário está logado ou não
        //Se eAdmin for == 1 é administrador
        if(req.isAuthenticated() && req.user.eAdmin == 1){
            return next()
        }

        req.flash("error_msg", "Você precisa ser um Administrador!")
        res.redirect("/")

    }
}