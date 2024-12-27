const express = require("express")
const Candidate = require("../model/candidate")
const User = require("../model/user")

const router = express.Router();

function  checkAdmin(userData){
    if(userData.role !== "admin") return false;
    return true;
}

router.post("/", async (req, res)=>{
    const userInfo = await  req.user;
    if(!userInfo) return res.json({
        msg :"You have to logged in first"
    })
    const userData = await User.findById(userInfo.id)

    // if(userData.role !== "admin") return res.json({
    //     msg:"Only Admin can add Candidates"
    // })

    if(!checkAdmin(userData)) return res.json({
        msg:"Only Admin can add Candidates"
    })
    
    const {fullName, party, age} = req.body;

    const candCreate = await Candidate.create({
        fullName,
        party,
        age,
    })

    res.json(candCreate);
})

router.put("/:candId", async (req, res)=>{
    const userInfo = await  req.user;
    if(!userInfo) return res.json({
        msg :"You have to logged in first"
    })
    const userData = await User.findById(userInfo.id)

    
    if(!checkAdmin(userData)) return res.json({
        msg:"Only Admin can add Candidates"
    })
    const {fullName, party, age} = req.body;

    const updateCand = await Candidate.findByIdAndUpdate(req.params.candId, {
        fullName,
        party,
        age,
    });

    return res.json(updateCand)
    
})

router.delete("/:candId", async (req, res)=>{
    const userInfo = await  req.user;
    if(!userInfo) return res.json({
        msg :"You have to logged in first"
    })
    const userData = await User.findById(userInfo.id)

    
    if(!checkAdmin(userData)) return res.json({
        msg:"Only Admin can add Candidates"
    })
    

    const updateCand = await Candidate.findByIdAndDelete(req.params.candId);

    return res.json(updateCand)
    
})

router.post("/vote/:candId", async(req, res)=>{
    const userInfo = await  req.user;
    if(!userInfo) return res.json({
        msg :"You have to logged in first"
    })
    const userData = await User.findById(userInfo.id)

    if(userData.isVoted === true) return res.json({
        msg:"You have voted already"
    })


    if(checkAdmin(userData)) return res.json({
        msg:" Admin can't Vote"
    })

    const votedCand = await Candidate.findById(req.params.candId);

    votedCand.votes.push({user:userData.id})
    votedCand.voteCount++;
    await votedCand.save();

    userData.isVoted = true;
    await userData.save();

    return res.json({votedCand});


} )





module.exports = router

// {
//     "fullName": "Rahul Gandhi",
//     "party": "Congress",
//     "age": "40"
// }