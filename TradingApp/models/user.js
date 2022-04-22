const mongoose=require('mongoose');
const bcrypt=require('bcrypt');
const Schema=mongoose.Schema;

const userSchema=new Schema({
firstName:{type: String,required:[true,'Can not be empty']},
lastName:{type: String,required:[true,'Can not be empty']},
email:{type: String,required:[true,'Can not be empty'],unique:true},
password:{type: String,required:[true,'Can not be empty']},
});


//replace pw with hashed pw before saving doc in db

//pre middleware

userSchema.pre('save',function(next){

    let user=this;
    if(!user.isModified('password'))
    {
        return next();
    }

    else
    {
       bcrypt.hash(user.password,10)
       .then(hash=>{
           user.password=hash;
           next();
       })
       .catch(err=>next(err));
    }
})



// implement a method to compare login password and the hash stored in the database

userSchema.methods.comparePassword=function(loginpassword){

  return  bcrypt.compare(loginpassword,this.password);
  
}

module.exports=mongoose.model('User',userSchema);