var express = require("express");
var bodparse = require("body-parser");
var path = require("path");
var expressValidator = require('express-validator');
var mongojs = require('mongojs');
var db = mongojs('ExpressCC', ['users']);
var app = express();




//writing custom middleware
// var logger = function(req, res, next){
//   console.log("logging...");
//   next();
// }
// app.use(logger);
// middleware ends

const PORT = process.env.PORT || 3000;
//adding a MIDDLEWARE TO USE TEMPLATE ENGINES & WITH  ejs
//having an error with ejs module try installing ejs in parent directory and run node
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));



//another middleware called body parser
app.use(bodparse.json());
app.use(bodparse.urlencoded({extended:false}));
//body parser ends here

//set static path
app.use(express.static(path.join(__dirname, 'public')));

//Global variables for error validation
app.use(function(req, res, next){
  res.locals.errors = null;
  next();
});

//middleware for expressValidator
app.use(expressValidator({
  errorFormatter: function(param, msg, value){
    var namespace = param.split('.')
    , root = namespace.shift()
    , formParam = root;

    while (namespace.length) {
      formParam += '['+ namespace.shift() +']';
    }
    return {
      param : formParam,
      msg : msg,
      value : value
    };
  }
}));


// //parsing JSON || type res.json(var name in app.get)
// var people = [{
//   name:'jeff',
//   age:30
// },
// {
//   name:'sarah',
//   age:40
// }]

//passing arrays or objects into ejs files
var users = [
  // {
  //   id: 1,
  //   first_name: 'John',
  //   last_name: 'Doe',
  //   email: 'jondoe@gmail.com'
  // },
  // {
  //   id: 2,
  //   first_name: 'Juan',
  //   last_name: 'arc',
  //   email: 'jarc@gmail.com'
  // },
  // {
  //   id: 3,
  //   first_name: 'Mikeal',
  //   last_name: 'Arch',
  //   email: 'March@gmail.com'
  // }
]




app.get("/", function(req, res){
  db.users.find((err, docs) => {
    if(err) throw err;
    console.log(docs);
    res.render('index', {
        'title':'Customers',
        users: docs
    });
  })


});

app.post('/users/add', function(req, res){
  // console.log(req.body.first_name);//access the actual value


  //adding some rules for Validation
  req.checkBody('first_name', 'firstname is Required').notEmpty();
  req.checkBody('last_name', 'lastname is Required').notEmpty();
  req.checkBody('email', 'email is Required').notEmpty();

  var errors = req.validationErrors();

  if(errors){
    // if you want to re-render the form when fields are left empty or any error happens uncomment the following urlencoded
    res.render('index', {
      'title':'Customers',
      users: users,
      errors : errors
    });
    // console.log('Errors');
    } else {
    var newUser = {
      first_name:req.body.first_name,
      last_name:req.body.last_name,
      email:req.body.email
    }
    console.log('Success');
  }


  // console.log(newUser);
})

app.listen(PORT, function(){
  console.log("server started on Port 3000");
});
