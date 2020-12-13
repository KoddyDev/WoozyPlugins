require('dotenv').config();
//BOT

const discord = require("discord.js")
const bot = new discord.Client()
bot.cor = "#eda41c"
bot.commands = new discord.Collection();
bot.aliases = new discord.Collection();

module.exports = bot

const { loadCommands, loadEvents } = require("./bot/utils/handler")
loadCommands()
loadEvents()

bot.login("Nzc2MjA4ODE3MTY3NDAwOTgw.X6xiyw.z3VbeKIQLmwOZWz3mepklflR_do")

const express = require('express');
const session = require('express-session');
const path = require('path')
const Licencas = require('./db/Licenças')
const Users = require('./db/Usuarios');
const Plugins = require('./db/Plugins');
let Noticias = require('./db/Noticias')

const app = express()
app.set('view-engine', 'ejs')

app.use(express.urlencoded({ extended: false }))

app.use('/', express.static('./public'))
app.use('/remove', express.static('./public'))
app.use('/editar', express.static('./public'))
app.use('/admin', express.static('./public'))

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.get('/', naoAutenticado , async (req, res) => {
    if(req.session.admin) {
        res.redirect('/admin')
    } else {
        res.redirect('/index')
    }
})

app.get('/login', Autenticado , (req, res) => {
    res.render('login.ejs', {message: null})
})

app.get('/index', naoAutenticado , async (req, res) => {


    let findL = await Noticias.findAll()

    console.log(findL)


    let mapa = findL.map(f => {

        let dados = f._previousDataValues
        //console.log(dados)
        let json = {
            id: dados.id,
            email: dados.email,
            plugin: dados.plugin, 
            licenca: dados.licenca,
            ip: dados.ip
        }
        return json

    })


    //console.log(mapa)
    
    res.render('index.ejs', {nome: req.session.name, dados: findL})
})

app.get('/contratar', naoAutenticado , async (req, res) => {

        let findL = await Plugins.findAll()
    
    
        
        let mapa = findL.map(f => {
    
            let dados = f.dataValues
            //console.log(dados)
            let json = {
                nome: dados.nome,
                valor: dados.valor,
                tipo: dados.tipo
            }
            return json
        })
    
        //console.log(mapa)
        
        res.render('plugins.ejs', {nome: req.session.name, dados: mapa})

    

})
app.post('/contratar', naoAutenticado , async (req, res) => {

    let findL = await Plugins.findAll()
    
    
        
    let mapa = findL.map(f => {

        let dados = f.dataValues
        //console.log(dados)
        let json = {
            nome: dados.nome,
            valor: dados.valor,
            tipo: dados.tipo
        }
        return json
    })

    const token = req.body.token;
const payment_method_id = req.body.payment_method_id;
const installments = req.body.installments;
const issuer_id = req.body.issuer_id;
const payment = req.params.payment
console.log(payment)

var mercadopago = require('mercadopago');
mercadopago.configurations.setAccessToken("TEST-cacfd5d9-21b1-4339-84d2-1c86159000c6");

var payment_data = {
  transaction_amount: mapa.valor,
  token: token,
  description: 'Teste',
  installments: installments,
  payment_method_id: payment_method_id,
  issuer_id: issuer_id
};

// Armazena e envia o pagamento
mercadopago.payment.save(payment_data).then(async function (data) {
  // ...    
  // Imprime o status do pagamento
  console.log(data)

}).catch(function (error) {
  console.error("Ocorreu um erro: " + error)
});


})
app.get('/clientarea', naoAutenticado , async (req, res) => {
    let findE = await Users.findOne({where:{
        email: req.session.email
    }})
    if(findE.gasto >= 50) {
        await Users.update({

            rank: 'Iniciante'
        }, { where:{
            email: req.session.email
        }})
    }
    if(findE.gasto >= 100) {
        await Users.update({

            rank: 'Bronze'
        }, { where:{
            email: req.session.email
        }})
    }
    if(findE.gasto >= 150) {
        await Users.update({

            rank: 'Ferro'}, { where:{
                email: req.session.email
            }})
    }
    if(findE.gasto >= 200) {
        await Users.update({

            rank: 'Ouro'}, { where:{
                email: req.session.email
            }})
    }
    if(findE.gasto >= 250) {
        await Users.update({

            rank: 'Esmeralda'}, { where:{
                email: req.session.email
            }})
    }
    if(findE.gasto >= 300) {
        await Users.update({

                        rank: 'Diamante'}, { where:{
                            email: req.session.email
                        }
                        })
    }
   res.render('clientarea.ejs', {nome: req.session.name, plugins: findE.plugins, gastos: findE.gasto, rank: findE.rank})
    
})

app.get('/perfil', naoAutenticado , async (req, res) => {
    
    res.render('perfil.ejs', {nome: req.session.name, erro: null})
})
app.get('/users', naoAutenticado , async (req, res) => {
   
    if(req.session.admin) {
    let findL = await Users.findAll()


    
    let mapa = findL.map(f => {

        let dados = f.dataValues
        //console.log(dados)
        let json = {
            id: dados.id,
            email: dados.email,
            nome: dados.nome, 
            senha: dados.senha
        }
        return json
    })

    //console.log(mapa)
    
    res.render('users.ejs', {nome: req.session.name, dados: mapa})
} else {
    res.render('index.ejs', {nome: req.session.name, dados: mapa})
}
})
app.get('/licences', naoAutenticado , async (req, res) => {
    let findL = await Licencas.findAll({
        where: {
email: req.session.email
        },
        attributes: ['id', 'email', 'plugin', 'licenca', 'ip']
    })

    console.log(findL)
    
    let mapa = findL.map(f => {

        let dados = f.dataValues
        //console.log(dados)
        let json = {
            id: dados.id,
            email: dados.email,
            plugin: dados.plugin, 
            licenca: dados.licenca,
            ip: dados.ip
        }
        return json

    })

    //console.log(mapa)
    
    res.render('licences.ejs', {nome: req.session.name, plugins: req.session.plugins, gastos: req.session.gastos, dados: mapa})
})
app.get('/register', Autenticado , (req, res) => {
    res.render('register.ejs', {erro: null})
})
app.get('/add', naoAutenticado , (req, res) => {
    if(req.session.admin) {
        res.render('add.ejs', {nome: req.session.name, erro: null})
    } else {
        res.redirect('/index')
    }
})
app.get('/userc', naoAutenticado , (req, res) => {

    if(req.session.admin) {
        res.render('create.ejs', {nome: req.session.name, erro: null})
    } else {
        res.redirect('/index')
    }
})
app.get('/createp', naoAutenticado , (req, res) => {

    if(req.session.admin) {
        res.render('createp.ejs', {nome: req.session.name, erro: null})
    } else {
        res.redirect('/index')
    }
})
app.get('/userd', naoAutenticado , (req, res) => {

    if(req.session.admin) {
        res.render('deleteu.ejs', {nome: req.session.name, erro: null})
    } else {
        res.redirect('/index')
    }
})
app.get('/remove', naoAutenticado , (req, res) => {
    if(req.session.admin) {
        res.render('remove.ejs', {nome: req.session.name, erro: null})
    } else {
        res.redirect('/index')
    }
})
app.get('/logout', naoAutenticado, async (req, res) => {
    req.session.destroy()
    res.redirect('/')
})
app.get('/editar/:id', naoAutenticado , async (req, res) => {
    
    let id = req.params.id

    let findI = await Licencas.findOne({where:{
        id: id
    }})
    
    

    if(findI) {
        if(req.session.email !== findI.email && req.session.admin === false) res.redirect('/')
        res.render('editar.ejs', {nome: req.session.name, plugin: findI.plugin ,erro: null, id: id})
    } else {
        res.render('editar.ejs', {nome: req.session.name, plugin: 'ERRO' ,erro: 'Não encontrei essa licença.', id: id})
    }
    
})
app.get('/notice/:id', naoAutenticado , async (req, res) => {
    
    let id = req.params.id

    let findI = await Noticias.findOne({where:{
        id: id
    }})
    
    

    if(findI) {
        res.render('noticeview.ejs', {nome: req.session.name, erro: null, id: id, title: findI.title, description: findI.description, author: findI.author})
    
        } else {
        res.render('noticeview.ejs', {nome: req.session.name, erro: 'Esta noticia não existe.', id: id})
    }
    
})
app.get('/remove/:id', naoAutenticado, async (req, res) => {
    if(req.session.admin) {

    let id = req.params.id;
    
    let findI = await Licencas.findOne({where:{
        id: id
    }})
    if(findI) {
        findI.destroy().catch(e => {
            res.render('remove.ejs', {nome: req.session.name, erro: e})
        })
        res.render('remove.ejs', {nome: req.session.name, erro: 'Deletado com sucesso.'})
    } else {
        res.render('remove.ejs', {nome: req.session.name, erro: 'Id não encontrado'})
    }
    } else {
        res.redirect('/index')
    }
})
app.get('/u/editar/:id', naoAutenticado , async (req, res) => {
    
    let id = req.params.id
    let findI = await Licencas.findOne({where:{
        id: id
    }})
    

    if(findI) {
        if(req.session.email !== findI.email && req.session.admin === false) res.redirect('/')
        res.render('editar.ejs', {nome: req.session.name, plugin: findI.plugin ,erro: null, id: id})
    } else {
        res.render('editar.ejs', {nome: req.session.name, plugin: 'ERRO' ,erro: 'Não encontrei essa licença.', id: id})
    }
    
})
app.get('/u/remove/:id', naoAutenticado, async (req, res) => {
    if(req.session.admin) {

    let id = req.params.id;
    
    let findI = await Licencas.findOne({where:{
        id: id
    }})
    if(findI) {
        findI.destroy().catch(e => {
            res.render('remove.ejs', {nome: req.session.name, erro: e})
        })
        res.render('remove.ejs', {nome: req.session.name, erro: 'Deletado com sucesso.'})
    } else {
        res.render('remove.ejs', {nome: req.session.name, erro: 'Id não encontrado'})
    }
    } else {
        res.redirect('/index')
    }
})
app.get('/admin', naoAutenticado, async (req, res) => {
    if(req.session.admin) {

    let findL = await Licencas.findAll({attributes: ['id', 'email', 'plugin', 'licenca', 'ip']})
    //console.log(findL)
    
    let mapa = findL.map(f => {

        let dados = f.dataValues
        //console.log(dados)
        let json = {
            id: dados.id, 
            email: dados.email, 
            plugin: dados.plugin, 
            licenca: dados.licenca,
            ip: dados.ip
        }
        return json

    })

        res.render('admin.ejs', {dados: mapa, nome: req.session.name, busca: null})

    } else {
        res.redirect('/index')
    }
})
app.get('/createn', naoAutenticado, async (req, res) => {
    if(req.session.admin) {
        res.render('createn.ejs', {erro: null})

    } else {
        res.redirect('/index')
    }})
app.get('/admin/:id', naoAutenticado, async (req, res) => {
    if(req.session.admin) {
        let id = req.params.id
        if(id){
        //console.log(id)

        let findU = await Users.findOne({where:{
            id: id
        }})
        if(!findU) res.redirect('/admin')
        //console.log(findU.email)
    let findL = await Licencas.findAll({where:{email: findU.email}}/*, {attributes: ['id', 'email', 'plugin', 'licenca', 'ip']}*/)
    
    let mapa = findL.map(f => {

        let dados = f.dataValues

        let json = {
            id: dados.id, 
            email: dados.email, 
            plugin: dados.plugin, 
            licenca: dados.licenca,
            ip: dados.ip
        }
        return json

    })

        res.render('admin.ejs', {dados: mapa, nome: req.session.name, busca: findU.email})

    } else {
        res.redirect('/index')
    }}
})
app.get('*', (req, res) => {
    res.status(404).render('404.ejs')
});

app.post('/userc', async (req,res) =>{
    let id = req.body.id,
        email = req.body.email,
        senha = req.body.senha
    

                if(!id || !senha || !email) {
            res.render('register.ejs', {nome: req.session.name, erro: 'Preencha todos os campos.'})
        } else {

            let findE = await Users.findOne({where:{
                email: email
            }})

            if(findE) res.render('create.ejs', {nome: req.session.name, erro: 'Esse email já está cadastrado.'})

            await Users.create({
                id: id,
                email: email,
                senha: senha
            })

            res.render('create.ejs', {nome: req.session.name, erro: 'Criado com sucesso.'})
        }
})
app.post('/createp', async (req,res) =>{
    if(req.session.admin) {
    let nome = req.body.nome,
        valor = req.body.valor,
        tipo = req.body.tipo
    

                if(!nome || !valor || !tipo) {
            res.render('createp.ejs', {nome: req.session.name, erro: 'Preencha todos os campos.'})
        } else {

            let findE = await Plugins.findOne({where:{
                nome: nome
            }})

            if(findE) res.render('createp.ejs', {nome: req.session.name, erro: 'Esse plugin já está cadastrado.'})

            await Plugins.create({
                tipo: tipo,
                nome: nome,
                valor: valor
                
            })

            res.render('createp.ejs', {nome: req.session.name, erro: 'Criado com sucesso.'})
        }
    } else {
        res.redirect('/')
    }
})
app.post('/createn', async (req,res) =>{
    if(req.session.admin) {
    let title = req.body.title,
        description = req.body.description
    

                if(!title || !description) {
            res.render('createn.ejs', {nome: req.session.name, erro: 'Preencha todos os campos.'})
        } else {

            let findE = await Noticias.findOne({where:{
                title: title
            }})

            if(findE) res.render('createn.ejs', {nome: req.session.name, erro: 'Essa noticia já foi postada.'})

            await Noticias.create({
                title: title,
                description: description,
                author: req.session.name
                
            })

            res.render('createn.ejs', {nome: req.session.name, erro: 'Criado com sucesso.'})
        }
    } else {
        res.redirect('/')
    }
})
app.post('/perfil', async (req, res) => {
    let email = req.body.email,
    senha = req.body.senha,
    nome = req.body.name
    
    if(email && senha) {


        if(email !== req.session.email) {
            await Users.update({ email: email }, { where: { id: req.session.id }});
        }
        if(nome !== req.session.name) {
            await Users.update({ nome: nome }, { where: { id: req.session.id }});
        }

    res.redirect("/logout")



        
    }
})
app.post('/register', async (req,res) =>{
    let id = req.body.id,
        email = req.body.email,
        senha = req.body.senha,
        nome = req.body.nome
    
        if(!id || !senha || !email) {
            res.render('register.ejs', {nome: req.session.name, erro: 'Preencha todos os campos.'})
        } else {
        

        let findE = await Users.findOne({where:{
            email: email
        }})
        let findI = await Users.findOne({where:{
            id: id
        }})
        

        if(findE) res.render('register.ejs', {nome: req.session.name, erro: 'Esse email já está cadastrado.'})
        if(findI) res.render('register.ejs', {nome: req.session.name, erro: 'O Usuario ' + findI.nome + ' já está registrado!'})

            await Users.create({
                id: id,
                nome: nome,
                rank: "Nenhum",
                email: email,
                senha: senha,
                plugins: 0,
                gasto: 0
            })

            res.render('login.ejs', {nome: req.session.name, message: 'Criado com sucesso.'})
        }
})
app.post('/userd', async (req,res) =>{

       let email = req.body.email
    

        

            let findE = await Users.findOne({where:{
                email: email
            }})
            if(!email) {
                res.render('register.ejs', {nome: req.session.name, erro: 'Preencha todos os campos.'})
            } else {
            if(!findE) res.render('deleteu.ejs', {nome: req.session.name, erro: 'Esse email não está cadastrado.'})

            await findE.destroy({
            })

            res.render('deleteu.ejs', {nome: req.session.name, erro: 'Deletado com sucesso.'})
            }
})
app.post('/login', async (req, res) => {
    let email = req.body.email,
        password = req.body.password

        if(email && password) {
            let findE = await Users.findOne({where:{
                email: email
            }})
            if(!findE) {
                return res.render('login.ejs', {message: 'O email não está cadastrado no site.'})
            }
            let Upass = findE.senha
            if(password !== Upass) {
                return res.render('login.ejs', {message: 'Senha incorreta.'})
            }
            req.session.loggedin = true;
            req.session.email = email;
            req.session.id = findE.id
            req.session.gasto = findE.gasto || '0'
            req.session.plugins = findE.plugins || '0'
            req.session.admin = findE.admin || false
            req.session.name = findE.nome || 'Desconhecido'

            //console.log(req.session)

            res.redirect('/');
        } else {
            res.render('login.ejs', {message: 'Preenche os campos todos.'})
        }
})
app.post('/add', async (req,res) =>{
    let preço = req.body.preco,
        plugin = req.body.plugin,
        email = req.body.email

        function lic(length) {
            var result           = '';
            var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            var charactersLength = characters.length;
            for ( var i = 0; i < length; i++ ) {
               result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
         }
    
        let gerador = lic(20)

        if(!preço || !plugin || !email) {
            res.render('add.ejs', {nome: req.session.name, erro: 'Preencha todos os campos.'})
        } else {

            let findE = await Users.findOne({where:{
                email: email
            }})

            if(!findE) res.render('add.ejs', {nome: req.session.name, erro: 'Esse email não está cadastrado.'})
            await findE.increment({ gasto: req.body.preco, plugins: 1})

            await Licencas.create({
                email: email,
                plugin: plugin,
                licenca: gerador,
                ip: '0.0.0.0'
            })

            res.render('add.ejs', {nome: req.session.name, erro: 'Criado com sucesso.'})
        }
})
app.post('/editar/:id', async (req,res) =>{
    let id = req.params.id
    let ip = req.body.ip
    let licence = req.body.licence

    if(!ip) res.render('editar.ejs', {nome: req.session.name, plugin: findI.plugin ,erro: 'Preencha os campos todos.', id: id})

    let findI = await Licencas.findOne({where:{
        id: id
    }})
    if(findI) {
        await Licencas.update({ip: ip, licenca: licence}, {where: {id: id}})
        res.redirect('/')
    } else {
        res.render('editar.ejs', {nome: req.session.name, plugin: findI.plugin ,erro: 'Licença não encontrada', id: id})
    }
})
app.post('/remove', async (req,res) =>{
    let id = req.body.id


        if(!id) {
            res.render('remove.ejs', {nome: req.session.name, erro: 'Preencha todos os campos.'})
        } else {

            let findI = await Licencas.findOne({where:{
                id: id
            }})
            if(findI) {
                findI.destroy();
                res.render('remove.ejs', {nome: req.session.name, erro: 'Deletado com sucesso.'})
            }
            else {
                res.render('remove.ejs', {nome: req.session.name, erro: 'Essa licença não existe.'})
            }
        }
})
app.post('/admin', async (req, res) => {
    let email = req.body.email
    let findE = await Users.findOne({where:{
        email: email
    }})

    if(findE) {
        let id = findE.id
        res.redirect(`/admin/${id}`)
    } else {
        res.redirect('/admin')
    }
})
app.listen(80, ()=>{
    console.log('[SITE] Conectado na porta "800" com sucesso!')
})


function naoAutenticado (req, res, next) {
    if(req.session.loggedin === true) {
        return next()
    } else {
        res.redirect('/login')
    }
}

function Autenticado (req, res, next) {
    if(req.session.loggedin === true) {
        return res.redirect('/')
    } else {
        next()
    }
}