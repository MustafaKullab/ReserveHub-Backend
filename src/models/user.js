const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const {isEmail} = require("validator");
const bcrypt = require("bcrypt");


const userSchema = new Schema({
    name: {
        type: String,
        required: [true , "User name is required."],
        trim: true,
    },
    email:{
        type: String,
        required: [true , "Email is required."],
        validate: [isEmail , "Please Enter a Valid Email."],
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true , "Password is required."],
        minlength: [6 , "Password must be at least 6 characters"],

    },
    role: {
        type: String,
        default: "user",
        enum: ["user" , "admin"],
    },
    verificationCode: {
        type: String,
        default: null,
    },
    verificationCodeSentAt: {
        type: Date,
        default: null,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    resetPasswordCode: {
        type: String,
        default: null,
    },
    resetPasswordCodeSentAt: {
        type: Date,
        default: null,
    },
    passwordChangedAt: {
        type: Date,
        default: null,
    },
    avatar: {
        type: String,
        default: null,
    }
}, 
{timestamps: true});


userSchema.pre("save" , async function(){
    if(!this.isModified("password")) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password , salt);

});




const User = mongoose.model("User" , userSchema);

module.exports = User;