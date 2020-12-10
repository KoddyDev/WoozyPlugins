const Discord = require("discord.js")
const bot = require("../../index")
const db = require('../../db/database')
const Licencas = require('../../db/Licenças')
const Users = require('../../db/Usuarios')
let Plugins = require("../../db/Plugins")

bot.on("ready", () => {
    console.log(`[BOT] ${bot.user.username} está agora online!`)
    bot.user.setActivity("fiquei online!");

    setTimeout(()=>{
        bot.user.setActivity('desenvolvido pelo KoddyDev');
    }, 10000)
    
    db.authenticate().then(() => {
        console.log("[DB] Conectado à base de dados!")
        Licencas.init(db)
        Users.init(db)
        Plugins.init(db)
        Licencas.sync({force: false})
        Users.sync({force: false})
        Plugins.sync({force: false})
    }).catch(function(err){console.log("\n\n[DB] Ocorreu um erro ao conectar na base de dados!\n" + err)})
})