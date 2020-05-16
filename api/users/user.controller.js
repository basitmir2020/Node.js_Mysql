require("dotenv").config();
const {create,getUserById,getUsers,updateUser,deleteUser,getUserByUserEmail} = require("./user.service");
const {genSaltSync,hashSync,compareSync} = require('bcrypt');
const {sign} = require('jsonwebtoken');

module.exports = {
    createUser:(req,res)=>{
        const body = req.body;
        const salt = genSaltSync(10);
        body.password = hashSync(body.password,salt);
        create(body,(err,results)=>{
            if(err){
                console.log(err);
                return res.status(500).json({
                    success:0,
                    message:"Database Connection Error"
                });
            }
            return res.status(200).json({
                success:1,
                data:results
            });
        });
    },
    getUserByUserId:(req,res)=>{
        const id = req.params.id;
        getUserById(id,(err,results)=>{
            if(err){
                console.log(err);
                return;
            }
            if(!results){
                return res.json({
                    success:0,
                    message:"Record Not Found!"
                });
            }
            return res.json({
                success:1,
                data:results
            });
        });
    },
    getUsers:(req,res)=>{
        getUsers((err,results)=>{
            if(err){
                console.log(err);
                return;
            }
            return res.json({
                success:1,
                data:results
            });
        });
    },
    updateUsers:(req,res)=>{
        const body = req.body;
        const salt = genSaltSync(10);
        body.password = hashSync(body.password,salt);
        updateUser(body,(err,results)=>{
            if(err){
                console.log(err);
                return;
            }
            if(!results){
                return res.json({
                    success:0,
                    message:"Failed To Update Record!"
                });  
            }
            return res.json({
                success:1,
                message:"Record Updated Successfully!"
            });
        });
    },
    deleteUsers:(req,res)=>{
        const data = req.body;
        deleteUser(data,(err,results)=>{
            if(err){
                console.log(err);
                return;
            }
            if(!results){
                return res.json({
                    success:0,
                    message:"Record Not Found!"
                });
            }
            return res.json({
                success:1,
                message:"Record Deleted Successfully!"
            });
        });
    },
    login:(req,res)=>{
        const body = req.body;
        getUserByUserEmail(body.email,(err,results)=>{
            if(err){
                console.log(err);
                return;
            }
            if(!results){
                return res.json({
                    success: 0,
                    data: "Invalid Username Or Password!"
                });
            }
            const result = compareSync(body.password,results.password);
            if(result){
                results.password = undefined;
                const jsontoken = sign({result:results},process.env.JSON_TOKEN_KEY,{
                    expiresIn: "1h"
                });
                return res.json({
                    success:1,
                    message:"Login Successfully",
                    token: jsontoken
                });
            }else{
                return res.json({
                    success:0,
                    message:"Invalid Email Or Password"
                });
            }
        });
    }
};