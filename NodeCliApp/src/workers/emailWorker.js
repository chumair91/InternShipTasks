const { Worker } = require("bullmq");

const connection=require('../../config/bullRedis');
const Order = require("../../model/Order");
const failedjobQueue = require("../queues/failedjobQueue");

const emailWorker=new Worker("email",async(job)=>{
console.log('<---sending confirmation email--->');


const order = await Order.findById(job.data.orderId);

if (!order) {
  throw new Error("Order not found");
}

console.log("email sent");
return{
    success:true
}
},{connection,concurrency:5});


emailWorker.on("completed",(job)=>{
    console.log(`job ${job.id} completed`);
})

emailWorker.on("failed", async (job, error) => {
    if (error?.message?.startsWith("child bull:")) {
        return;
    }
    console.log(`email job ${job?.id} failed: ${error.message}`);
    await failedjobQueue.add("save-failed-job", {
      queue: "email",
      jobId: job.id,
      jobName: job.name,
      data: job.data,
      error: error.message,
      stack: error.stack
    });
})


module.exports=emailWorker;