const express = require('express');
const bodyParser = require('body-parser');
const connection = require('./database/database');
const Pergunta = require('./database/Pergunta');
const Resposta = require('./database/Resposta');

const app = express();

//Database
connection
  .authenticate()
  .then(() => {
    console.log("Conexão feita com sucesso!");
  })
  .catch((err) => {
    console.log(err);
  });

// Estou dizendo para o Express usar o EJS como View Engine
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Body-Parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Rotas
app.get("/", (req, res) => {
  Pergunta.findAll({raw: true, order: [ ['id', 'DESC' ] ]}).then(perguntas => {
    res.render("index", {
      perguntas: perguntas
    });
  });
});

app.get("/perguntar", (req, res) => {
  res.render("perguntar");
});

app.get("/pergunta/:id", (req, res) => {
  var id = req.params.id;
  Pergunta.findOne({raw: true, where: { id }}).then(pergunta => { 
    if(pergunta) {

      Resposta.findAll({raw: true, where: { perguntaId: pergunta.id }, order: [ ['id', 'DESC'] ]}).then(respostas => {
        res.render("pergunta", {pergunta: pergunta, respostas: respostas});
      })

    }
    else {
      res.redirect("/");
    }
  });
});

app.post("/salvarpergunta", (req, res) => {
    var titulo = req.body.titulo;
    var descricao = req.body.descricao;
    Pergunta.create({
      titulo,
      descricao
    }).then(() => {
      res.redirect("/")
    });
});

app.post("/salvarresposta", (req, res) => {
  var corpo = req.body.corpo;
  var perguntaId = req.body.id;
  Resposta.create({
    corpo: corpo,
    perguntaId
  }).then(() => {
    res.redirect("/pergunta/"+perguntaId);
  })
})

app.listen(8080, () => console.log("O servidor está rodando na porta 8080"));