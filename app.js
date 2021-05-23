const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/Postdb",{ useNewUrlParser: true,useUnifiedTopology: true});

const postschema = new mongoose.Schema({
  title: String,
  content: String
});

const post = new mongoose.model("post",postschema);




const homeStartingContent = "This is a website for adding blogs which you like this website also has mongodb database so that you can store your blogs and they will not dissapear once you reload your site";
const aboutContent = "this is the about page here the info about the creator is written ";
const contactContent = "this page  is suppose to provide the contact info of the user so that if something goes wrong you can contact him over here";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
let posts = [];


//for root route
app.get("/",function(req,res){
  post.find({},function(err,list){
    if(err){
      console.log(err);
    }else{
      res.render("home",{startingtext:homeStartingContent,text:list});
    }
  });
});




//for about route
app.get("/about",function(req,res){
  res.render("about",{abouttext:aboutContent});
});





//for contact route
app.get("/contact",function(req,res){
  res.render("contact",{contacttext:contactContent});
});





//for compose
app.get("/compose",function(req,res){
  res.render("compose");
});

app.post("/compose",function(req,res){
  const newpost = new post(
  {
    title:req.body.title,
    content:req.body.content
  });
  newpost.save(function(err){
    if(err){
      console.log(err);
    }else{
      res.redirect("/");
    }
  });
})


//dynamic routes
app.get("/posts/:postid",function(req,res){
  const Postid = req.params.postid;
  post.findOne({_id:Postid},function(err,post){
    if(err){
      console.log(err);
    }else{
      res.render("post",
      {
        heading:post.title,
        content:post.content
      });
    }
  });
});


app.listen(3000 || process.env.PORT, function() {
  console.log("Server started on port 3000");
});
