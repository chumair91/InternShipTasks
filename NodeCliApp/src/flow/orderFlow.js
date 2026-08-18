const { FlowProducer } = require('bullmq')
const connection=require('../../config/bullRedis')
const flowProducer=new FlowProducer({connection});
module.exports=flowProducer


