if(process.env.NODE_ENV == "production"){
    module.exports = {
        mongoURI: "mongodb+srv://patrick:<Patrick@Chagas21>@cluster0-qayvt.mongodb.net/test?retryWrites=true&w=majority"
    }
}else{
    module.exports = {
        mongoURI: "mongodb://localhost/blogapp"
    }
}