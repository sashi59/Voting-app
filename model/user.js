const {Schema, model} = require("mongoose")
const {createHmac, randomBytes} = require("crypto")
const {createTokenForUser} = require("../service/auth")
const secret = "@Voting123#"

const userSchema = new Schema({
    fullName:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
    },
    mobile: {
        type: Number,
        required: true,
    },
    password:{
        type: String,
        required: true,
    },
    salt:{
        type: String,
    },
    age:{
        type: Number,
        required: true,
    },
    role:{
        type:String,
        enum : ["voter", "admin"],
        default: "voter",
    },
    aadharNo:{
        type: String,
        required: true,
        unique: true,
    },
    
    isVoted :{
        type: Boolean,
        default: false,
    }

}, {timestamps:true});

userSchema.pre("save", function (next) {
    const user = this;

    if(!user.isModified) return;

    const salt = randomBytes(16).toString();
    const hashPass = createHmac("sha256", salt).update(user.password).digest("hex");

    user.salt = salt;
    user.password = hashPass;

    next();
})

userSchema.static("matchAadharPassword", async function(aadharNo, password){

    const user_params = await this.findOne({
        aadharNo: aadharNo,
    });
    if (!user_params) throw new Error("User Not Found")
    
    const salt = user_params.salt;
    const hashPass = user_params.password;

    const userGivenPass = createHmac("sha256", salt).update(password).digest("hex");

    if(userGivenPass !== hashPass) throw new Error("Invalid Password");

    const token = createTokenForUser(user_params);

    return token;

    
})

const User = model("user", userSchema);
module.exports = User;


// votes: [
//     {
//         user:{
//             type: Schema.Types.ObjectId,
//             ref:"user",
//             required: true,
//         },
//         votedAt:{
//             type: Date,
//             default: Date.now()
//         }
//     }
// ],