const express = require('express');
const mysql = require('mysql2');

const app = express();

app.set('view engine', 'pug')
app.use(express.json()); //Used to parse JSON bodies

const con = mysql.createConnection({    
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'sakila'
});

app.get('/', function (req, res) {
  res.render('index', { title: 'Hey', message: 'Hello there!' })
})

app.post('/customer', async (req,res)=>{
  const id = req.body.id
  const query = `SELECT first_name, last_name, email, active FROM CUSTOMER WHERE first_name LIKE '%${id}%' LIMIT 10`;

  console.log(query)

  con.query(query, function(err, results, fields) {
    if(err){
      res.status(200).send({
        msg : "failed to retrieve data",
        err
      });
      return;
    }
    
    res.status(200).send({
      msg : "customer retrieved",
      data : results
    })
  });
});

app.post('/customer-prepared', async (req,res)=>{
  const id = req.body.id

  con.execute(
    `SELECT first_name, last_name, email, active FROM CUSTOMER WHERE first_name LIKE CONCAT('%',?,'%') LIMIT 10`,
    [id],
    function(err, results, fields) {
      if(err){
        res.status(200).send({
          msg : "failed to retrieve data",
          err
        });
        return;
      }
      
      res.status(200).send({
        msg : "customer retrieved",
        data : results
      })
    });
});

app.listen(3000, ()=>{
  console.log("Listening at 3000");
});