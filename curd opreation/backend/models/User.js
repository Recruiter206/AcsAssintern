const mongoose=require("mongoose")

const userShema=new mongoose.Schema({
    name:{
        type:String,
        require:true
    }
},{timestamps:true})

module.exports=mongoose.model("User",userShema)