const express = require("express")
const cookieParser = require("cookie-parser")
const mongoose = require("mongoose")
const Candidate = require("./model/candidate")

const app = express();
const PORT = 9000;

const userRoute = require("./routes/user");
const candidateRoute = require("./routes/candidate")
const checkAuthViaTokenSetPaylaod = require("./middleware/auth");

mongoose.connect("mongodb://localhost:27017/voter-db").then(()=> console.log("MongoDb Connected"))

app.use(express.json());
app.use(cookieParser())
app.use(checkAuthViaTokenSetPaylaod("token"))

app.use("/user", userRoute);
app.use("/candidate", candidateRoute);

app.get("/candidates", async(req, res)=>{
    const allCandidates = await Candidate.find({})

    return res.json(allCandidates);
})
app.get("/candidates/count", async(req, res)=>{
    const allCandidates = await Candidate.find({}).sort({voteCount: 'desc'});

    const voteRecord = allCandidates.map((record)=>{
        return {
            party: record.party,
            voteCount: record.voteCount,
        }
    })

    return res.status(200).json(voteRecord);
})

app.get("/", (req, res)=>{
    res.json({
        msg:"Started Home Page",
    })
})

app.listen(PORT, console.log(`Server Started at PORT: ${PORT}`));