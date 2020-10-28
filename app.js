var express= require("express")
var app=express()
var bp=require("body-parser")
var m=require("mongoose")
var mo=require("method-override")

m.connect("mongodb://localhost/list")
app.use(express.static("public"))
app.use(bp.urlencoded({extended:true}))
app.use(mo("_method"))


//MONGOOSE CONFIG
var bs=new m.Schema({
	name:String,
	number:Number,
	price:Number
});

var pl=m.model("productlist",bs);

// pl.create({
// 	name:"KIDNEY",
// 	number:70,
// 	price:1200
// });


//ROUTES

app.get("/",function(req,res){
	pl.find({},function(err,products){
		if(err){
			console.log("error")
		}else{
			res.render("home.ejs", {products:products})
		}
	})
})

app.get("/new",function(req,res){
	res.render("new.ejs")
})


app.get("/billing",function(req,res){
	pl.find({},function(err,products){
		if(err){
			console.log("error")
		}else{
			res.render("billing.ejs", {products:products})
		}
	})
})


//SHOW PAGE

app.get("/:id",function(req,res){
	pl.findById(req.params.id,function(err,product){
		if(err){
			res.redirect("/")
		}else{
			res.render("show.ejs",{product:product})
		}
	});
});

//EDIT

app.get("/:id/edit",function(req,res){
	pl.findById(req.params.id,function(err,product){
		if(err){
			console.log("error")
		}else{
			res.render("edit.ejs",{product:product})
		}
	});
});

//UPDATE

app.put("/:id",function(req,res){
	// res.send("UPDATE")
	pl.findByIdAndUpdate(req.params.id,req.body.products,function(err,product){
		if(err){
			console.log("error")
			res.redirect("/")
		}else{
			res.redirect("/"+req.params.id)
		}
	})
});

//DELETE
app.delete("/:id",function(req,res){
	pl.findByIdAndRemove(req.params.id,function(err){
		if(err){
			console.log("error")
			res.redirect("/")
		}else{
			res.redirect("/")
		}
	})
})



app.post("/",function(req,res){
	//create product
	pl.create(req.body.products,function(err,products){
		if(err){
			console.log("error")
			res.render("new.ejs")
		}else{
			//redirect home page w new product
			res.redirect("/")
		}
	})
	
})



app.listen(process.env.PORT||2000,function(){
	console.log("server started")
})