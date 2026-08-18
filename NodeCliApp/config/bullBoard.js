const { createBullBoard } = require("@bull-board/api");
const { BullMQAdapter } = require("@bull-board/api/bullMQAdapter");
const { ExpressAdapter } = require("@bull-board/express");
const emailQueue = require("../src/queues/emailQueue");
const stockQueue = require("../src/queues/stockQueue");
const paymentQueue = require("../src/queues/paymentQueue");
const orderQueue = require("../src/queues/orderQueue");
const rollbackQueue = require("../src/queues/rollbackQueue");
const reportQueue = require("../src/queues/reportQueue");

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/admin/queues");

createBullBoard({
    queues:[
        new BullMQAdapter(emailQueue),
        new BullMQAdapter(stockQueue),
        new BullMQAdapter(paymentQueue),
        new BullMQAdapter(orderQueue),
        new BullMQAdapter(rollbackQueue),
        new BullMQAdapter(reportQueue)
    ],
    serverAdapter
})

module.exports=serverAdapter;