const Menu = require('../../models/menu')

function homeController(){
    return{
        async index(req,res){
            const burgers = await Menu.find()
            // console.log(burgers)
             res.render('home', {burgers: burgers})
            
        }
    }
}

module.exports = homeController