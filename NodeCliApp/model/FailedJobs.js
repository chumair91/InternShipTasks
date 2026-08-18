const { default: mongoose } = require("mongoose");

const failedJobs=mongoose.Schema({
    queue: {
      type: String,
      required: true,
    },

    jobId: {
      type: String,
      required: true,
    },

    jobName: {
      type: String,
      required: true,
    },
    data:{
        type:Object,
        default:{}
    },

    error:{
        type:String,
        required:true,
    },
    stack:{type:String},
       
    failedAt:{
        type:Date,
        default:Date.now,
    }
},{
    timestamps:true,
})

module.exports=mongoose.model("failedJobs",failedJobs);