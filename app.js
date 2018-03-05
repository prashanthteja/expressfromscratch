var express = require("express");
var http = require('http');
var path = require('path');
var mongoose = require("mongoose");

var app = express();
var favicon = require('serve-favicon');

app.use(favicon(path.join(__dirname, 'public', 'favicon_.ico')));
// app.use('/favicon.ico', express.static('images/favicon.ico'));

var cookieParser = require('cookie-parser')
app.use(cookieParser())

app.use(function(req, res, next) {
  console.log('Cookies: ', req.cookies);
  next();
})


var logger = require('morgan');
app.use(logger('dev'));

mongoose.connect("mongodb://localhost:27017/test");

mongoose.connection.on("error", function(err){
  console.log(err);
  process.exit();

});


var restaurantSchema = new mongoose.Schema({
  name: {type:String, required:true},
  description: {type:String, default:"wtf"},
  phone: String,
  address:String,
  // menu : [],
  // images : []
});


var Restaurant = mongoose.model("Restaurant" , restaurantSchema);



var port = 3000
app.set('port', port);

var server = http.createServer(app);

server.listen(port);



app.use(express.static(path.join(__dirname, 'public')));


app.use(function(req, res, next) {
  // console.log(next.toString());
  res.locals.creator = "kamal"
  next();
});


var router = express.Router();

var router2 = express.Router();

router.get('/', function(req, res, next) {


  console.log("someone accessing website");
  res.render("x", {t:1});

});



router2.post('/createres', function(req, res, next) {

  // console.log(req.body);

  var res1 = new Restaurant({
    name: req.body.name
  })


  res1.save(function(err){
    if(err){
      console.log(err);
      res.json({"status":err})
    }else{
      res.json({"status":"success"});
    }


  });

});


router2.get('/listrestaurants', function(req, res, next) {

  Restaurant.find({}, function(err, restaurants) {

    if(err){
      res.json({err:err});
    }else{
      res.json({restaurants: restaurants});
    }
  });


});

router2.post('/deleterestaurant/:id', function(req, res, next) {


  console.log(req.params);

  Restaurant.remove({ _id: req.params.id}, function(err) {
    if (err) {
      res.json({err:err});
    }
    else {
      res.json({
        status:"success"
      })
    }
  });


});

router2.post('/updaterestaurant/:id', function(req, res, next) {


  console.log(req.params);

  Restaurant.update({ _id: req.params.id}, function(err) {
    if (err) {
      res.json({err:err});
    }
    else {
      res.json({
        status:"success"
      })
    }
  });


});



app.use(router)


var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(router2)


app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'jade');



app.use(function(req,res,next){ //errfunction


  var err = new Error("Not found");
  err.status =404;
  next(err);

});


app.use(function(err, req,res, next){ //errrenderfucntion

  if(err){

    res.locals.message = err.message;


    console.log(err);

    res.render("error", {err:err, common:"common"});
  }

})


// console.log(process)
// process.exit();

//morgan, bodyparser, creator router, router2 , errfunction, errrenderfunction






