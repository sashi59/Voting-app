const express = require("express")
const User = require("../model/user")
const router = express.Router();
const {createHmac, randomBytes} = require("crypto")

router.post("/signup", async(req, res)=>{
    const {fullName, email, mobile, password, age, role, aadharNo} = req.body;

    const userCreated = await User.create({
        fullName,
        email,
        mobile,
        password,
        age,
        role,
        aadharNo,
        
    });
    console.log("nuwn ", userCreated)

    res.status(200).json(userCreated);
})

router.post("/login", async (req, res)=>{
    const {aadharNo, password} = req.body;

    try{
        const token =  await User.matchAadharPassword(aadharNo, password);
        return res.status(200).cookie("token", token).json({
            msg:"Login Success",
            token: req.cookies.token,
    
        })
    }catch(Error){
        res.status(404).json({
            error: "Invalid aadharNo or Password"
        })
    }

})

router.get("/profile", async(req, res)=>{
    
    const userInfo = await  req.user;
    if(!userInfo) return res.json({
        msg :"You have to logged in first"
    })
    const userData = await User.findById(userInfo.id)

    res.json(userData)
})

router.put("/profile/password",  async(req, res)=>{
    const {oldPassword, newPassword} = req.body;
    
    const userInfo = await  req.user;
    if(!userInfo) return res.json({
        msg :"You have to logged in first"
        
    })
    const userData = await User.findById(userInfo.id)

    //correct oldpass

    const userGivenPass = createHmac("sha256", userData.salt).update(oldPassword).digest("hex");
    if(userData.password !== userGivenPass) return res.json({
        error:"Ivalid password"
    })
    console.log("same ");

    userData.password = newPassword;
    await userData.save();

    res.json({
        oldPassword:oldPassword,
        newPassword: userData.password,
    })
})




module.exports = router;

// {
    
//     "oldPassword":"sashi123",
//     "newPassword":"sashi1234"

// }