import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
const JWT_SECRET = "medfix_secret_key";

/* -------------------- DATABASE -------------------- */

mongoose.connect("mongodb+srv://nicky2603:naveen2603@cluster03.atbl7to.mongodb.net/MedFix")
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log(err));


/* -------------------- MODELS -------------------- */

/* USER MODEL */

const userSchema = new mongoose.Schema({

name:{type:String,required:true},
email:{type:String,required:true,unique:true},
password:{type:String,required:true},

role:{
type:String,
enum:["customer","seller","admin"],
default:"customer"
}

},{timestamps:true})

const User = mongoose.model("User",userSchema)



/* PRODUCT MODEL */

const productSchema = new mongoose.Schema({

name:{type:String,required:true},
category:String,
price:{type:Number,required:true},
description:String,
shortDesc:String,
imageUrl:String,
stock:Number,

sellerId:{
type:mongoose.Schema.Types.ObjectId,
ref:"User"
}

},{timestamps:true})

const Product = mongoose.model("Product",productSchema)



/* ORDER MODEL */

const orderSchema = new mongoose.Schema({

userId:String,

customerName:String,
phone:String,
address:String,

paymentMethod:String,

items:[
{
productId:String,
name:String,
qty:Number,
price:Number,
image:String
}
],

total:Number,

status:{
type:String,
default:"Pending"
}

},{timestamps:true})

const Order = mongoose.model("Order",orderSchema)



/* CART MODEL */

const cartSchema = new mongoose.Schema({

userId:String,

items:[
{
productId:String,
name:String,
price:Number,
qty:Number,
image:String
}
]

},{timestamps:true})

const Cart = mongoose.model("Cart",cartSchema)



/* -------------------- AUTH MIDDLEWARE -------------------- */

const verifyToken = (req,res,next)=>{

const token = req.headers.authorization

if(!token){
return res.status(401).json({message:"Access denied"})
}

try{

const verified = jwt.verify(token,JWT_SECRET)

req.user = verified

next()

}catch(err){

res.status(400).json({message:"Invalid token"})

}

}



/* -------------------- AUTH APIs -------------------- */


/* REGISTER */

app.post("/api/auth/register", async(req,res)=>{

try{

const {name,email,password,role} = req.body

const existingUser = await User.findOne({email})

if(existingUser){
return res.status(400).json({message:"User already exists"})
}

const hashedPassword = await bcrypt.hash(password,10)

const user = new User({
name,
email,
password:hashedPassword,
role
})

await user.save()

res.json({
message:"User registered successfully"
})

}catch(err){

res.status(500).json(err)

}

})



/* LOGIN */

app.post("/api/auth/login", async(req,res)=>{

try{

const {email,password} = req.body

const user = await User.findOne({email})

if(!user){
return res.status(400).json({message:"User not found"})
}

const isMatch = await bcrypt.compare(password,user.password)

if(!isMatch){
return res.status(400).json({message:"Invalid credentials"})
}

/* CREATE TOKEN */

const token = jwt.sign(
{ id:user._id, role:user.role },
JWT_SECRET,
{ expiresIn:"7d" }
)

res.json({
message:"Login successful",
token,
user
})

}catch(err){

res.status(500).json(err)

}

})



/* -------------------- PRODUCT APIs -------------------- */


/* GET ALL PRODUCTS */

app.get("/api/products", async(req,res)=>{

try{

const {category,search} = req.query

let query = {}

if(category && category !== "All"){
query.category = category
}

if(search){
query.name = {$regex:search,$options:"i"}
}

const products = await Product.find(query)

res.json(products)

}catch(err){

res.status(500).json(err)

}

})



/* GET SINGLE PRODUCT */

app.get("/api/products/:id", async(req,res)=>{

try{

const product = await Product.findById(req.params.id)

res.json(product)

}catch(err){

res.status(500).json(err)

}

})



/* ADD PRODUCT (SELLER ONLY) */

app.post("/api/products",verifyToken, async(req,res)=>{

try{

const product = new Product({
...req.body,
sellerId:req.user.id
})

await product.save()

res.json(product)

}catch(err){

res.status(500).json(err)

}

})

// delete a product//
app.delete("/api/products/:id", async(req,res)=>{

try{

await Product.findByIdAndDelete(req.params.id);

res.json({message:"Product deleted"});

}catch(err){

res.status(500).json(err);

}

});



/* GET SELLER PRODUCTS */

app.get("/api/seller/products/:sellerId", async(req,res)=>{

try{

const products = await Product.find({sellerId:req.params.sellerId})

res.json(products)

}catch(err){

res.status(500).json(err)

}

})



/* -------------------- ORDER APIs -------------------- */


/* CREATE ORDER */

app.post("/api/orders", async(req,res)=>{

try{

const order = new Order(req.body)

await order.save()

res.json(order)

}catch(err){

res.status(500).json(err)

}

})



/* GET ALL ORDERS */

app.get("/api/orders", async (req, res) => {

try {

const orders = await Order.find();

res.json(orders);

} catch (err) {

res.status(500).json(err);

}

});

/* SELLER ORDERS */

app.get("/api/seller/orders/:sellerId", async(req,res)=>{

try{

const sellerId = req.params.sellerId

/* find products of seller */

const products = await Product.find({sellerId})

const productIds = products.map(p=>p._id.toString())

/* find orders containing those products */

const orders = await Order.find({
"items.productId":{$in:productIds}
})

res.json(orders)

}catch(err){

res.status(500).json(err)

}

})



/* -------------------- CART APIs -------------------- */


/* SAVE CART */

app.post("/api/cart/save", async(req,res)=>{

try{

const {userId,items} = req.body

let cart = await Cart.findOne({userId})

if(cart){

cart.items = items
await cart.save()

}else{

cart = new Cart({
userId,
items
})

await cart.save()

}

res.json({message:"Cart saved successfully"})

}catch(err){

res.status(500).json(err)

}

})



/* GET USER CART */

app.get("/api/cart/:userId", async(req,res)=>{

try{

const cart = await Cart.findOne({userId:req.params.userId})

res.json(cart)

}catch(err){

res.status(500).json(err)

}

})

/* UPDATE ORDER STATUS */

app.put("/api/orders/:id/status", async (req,res)=>{

try{

const { status } = req.body;

const order = await Order.findByIdAndUpdate(
req.params.id,
{ status },
{ new:true }
);

res.json(order);

}catch(err){

res.status(500).json(err);

}

});



/* -------------------- ROOT -------------------- */

app.get("/",(req,res)=>{

res.send("MedFix API Running")

})



/* -------------------- SERVER -------------------- */

const PORT = 5000

app.listen(PORT,()=>{

console.log(`Server running on port ${PORT}`)

})