import express from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';

export const verifyJwt = async(req,res,next) => {
    try{
          //get the token from the cookies
          const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
          //check if there is no token
          if(!token)
          {
            return res.status(401).json({message: 'No access token found'});
          }
          // verify the token
          const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
          
          const user = await User.findById(decodedToken._id).select("-password -refreshToken");
          //check if no user of the id exists 
          if(!user)
          {
            return res.status(404).json({message:"User not found"});
          }
          req.user = user;
          next();
    }
    catch(err)
    {
        res.status(401).json({ message: 'Unauthorized' });
    }
}