const {Schema, model} = require("mongoose")


const candidateSchema = new Schema({
    fullName:{
        type: String,
        required: true,
    },
    party:{
        type: String,
        required: true,
    },
    age:{
        type: Number,
        required: true,
    },
    votes: [
    {
        
        user:{
            type: Schema.Types.ObjectId,
            ref:"user",
            required: true,
        },
        votedAt:{
            type: Date,
            default: Date.now()
        }
    
    }
    ],
    voteCount :{
        type: Number,
        default:0,
    }
});


const Candidate = model("candidate", candidateSchema);
module.exports = Candidate;

