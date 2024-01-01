import bcrypt from "bcryptjs";
import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/UserModel.js";
import genToken from "../utils/genToken.js";


const createUser = asyncHandler(async (req, res) => {
   const { username, email, password } = req.body;
    if(!username || !email || !password){
        res.status(400).json({ message: "Please fill all fields" });
    }
    if(password.length < 6){
        res.status(400).json({ message: "Password should be at least 6 characters" });
    }


    const userExists = await User.findOne({ email });
    if(userExists){
        res.status(400).json({ message: "User already exists" });
    }


   const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({ username,email,password:hashedPassword})

    try{
        await newUser.save();

        genToken(res,newUser._id);

        res.status(201).json({_id: newUser._id,username:newUser.username, email:newUser.email,isAdmin:newUser.isAdmin});
    } catch(error){
        res.status(400).json({ message: error.message });
    }
})


const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if(!email || !password){
        res.status(400).json({ message: "Please fill all fields" });
    }

    const user = await User.findOne({ email });
    if(!user){
        res.status(400).json({ message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        res.status(400).json({ message: "Invalid credentials" });
    }

    genToken(res,user._id);

    res.status(200).json({_id: user._id,username:user.username, email:user.email,isAdmin:user.isAdmin});
})

const logoutUser = asyncHandler(async (req, res) => {
    
    res.cookie('jwt','',{
        httpOnly:true,
        expires:new Date(0)
    })
    res.status(200).json({ message: "Logged out successfully" });
})

const getAllUsers= asyncHandler(async(req,res)=>{
    const users=await User.find({});
    res.json(users);
})

const getUserProfile= asyncHandler(async(req,res)=>{
    const user=await User.findById(req.user._id);

    if(user){
        res.json({
            _id:user._id,
            username:user.username,
            email:user.email,
            isAdmin:user.isAdmin
        })
    }
    else{
        res.status(404).json({message:'User not found'});
    }

})

const updateCurrUserProfile= asyncHandler(async(req,res)=>{
    const user=await User.findById(req.user._id);

    if(user){
        user.username=req.body.username || user.username;
        user.email=req.body.email || user.email;
        if(req.body.password){
            const salt=await bcrypt.genSalt(10);
            user.password=await bcrypt.hash(req.body.password,salt);
        }
        const updatedUser=await user.save();

        genToken(res,updatedUser._id);

        res.json({
            _id:updatedUser._id,
            username:updatedUser.username,
            email:updatedUser.email,
            isAdmin:updatedUser.isAdmin
        })
    }
    else{
        res.status(404).json({message:'User not found'});
    }

})

const deleteUserById= asyncHandler(async(req,res)=>{
    const user=await User.findById(req.params.id);

    if(user){
       if(user.isAdmin){
           res.status(400).json({message:'Cannot delete admin user'});
       }

         await User.deleteOne({_id:user._id});
        res.json({message:'User deleted successfully'})
    }
    else{
        res.status(404).json({message:'User not found'});
    }

})

const getUserById= asyncHandler(async(req,res)=>{
    const user=await User.findById(req.params.id).select('-password');

    if(user){
        res.json(user);
    }
    else{
        res.status(404).json({message:'User not found'});
    }

})

const updateUserById= asyncHandler(async(req,res)=>{
    const user=await User.findById(req.params.id);

    if(user){
        user.username=req.body.username || user.username;
        user.email=req.body.email || user.email;
        user.isAdmin=req.body.isAdmin;
        const updatedUser=await user.save();
        res.json({
            _id:updatedUser._id,
            username:updatedUser.username,
            email:updatedUser.email,
            isAdmin:updatedUser.isAdmin
        })
    }
    else{
        res.status(404).json({message:'User not found'});
    }
})

export { createUser, loginUser, logoutUser,getAllUsers,getUserProfile,updateCurrUserProfile, deleteUserById, getUserById,updateUserById}