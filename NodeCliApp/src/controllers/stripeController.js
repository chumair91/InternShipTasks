const config = require("../../config");
const stripe = require("../../config/stripe");

const checkConnection = async (req, res) => {
  const p = await stripe.products.list();
  res.json(p);
};

const createSubscription = async (req, res) => {
  const { plan } = req.body;
  const user = req.user;
  if (!user) {
    return res.status(400).json({ success: false, message: "user not found" });
  }
  if (!user.stripeCustomerId) {
    const customer = await stripe.customers.create({
      name: user.name,
      email: user.email,
    });
    user.stripeCustomerId = customer.id;
    await user.save();
  }

  const subscription = await stripe.subscriptions.list({
    customer: user.stripeCustomerId,
    status: "active",
  });

  if (subscription.data.length > 0) {
    return res.status(400).json({
      success: false,
      message: "You already have an active subscription,try to cancel that first.",
    });
  }
 
  const existingSubs = await stripe.subscriptions.list({
    customer: user.stripeCustomerId,
    status: "incomplete",
  });
  
  // Cancel stale incomplete ones before creating a new attempt
  for (const sub of existingSubs.data) {
    await stripe.subscriptions.cancel(sub.id);
  }

  const getSubscription = await stripe.subscriptions.create({
    customer: user.stripeCustomerId,
    items: [
      {
        price: plan === "basic" ? config.stripeBasicPlan : config.stripeProPlan,
      },
    ],
    payment_behavior: "default_incomplete",
    payment_settings: {
      save_default_payment_method: "on_subscription",
    },
    expand: ["latest_invoice.confirmation_secret"],
  });

  const clientSecret =
    getSubscription.latest_invoice.confirmation_secret.client_secret;

  return res
    .status(200)
    .json({ success: true, message: "Plz select a payment method", clientSecret });
};

const getUserDetails = async (req, res) => {
  const data = {
    plan: req.user.subscription.plan,
    status: req.user.subscription.status,
    endDate: new Date(req.user.subscription.currentPeriodEnd),
  };
  res.status(200).json({
    success: true,
    message: "here is user subscription details",
    data: data,
  });
};

const cancelSubscription = async (req, res) => {
  const user = req.user;
  if (
    !user.subscription?.stripeSubscriptionId ||
    user.subscription.plan === "free"
  ) {
    return res.status(400).json({
      success: false,
      message: "User does not have an active subscription",
    });
  }
  const subs = await stripe.subscriptions.update(
    user.subscription.stripeSubscriptionId,
    {
      cancel_at_period_end: true,
    },
  );
  return res.status(200).json({
    success: true,
    message: "Subscription will be cancelled at the end of billing period",
    data: {
      status: subs.status,
      cancelAtPeriodEnd: subs.cancel_at_period_end,
      currentPeriodEnd: subs.current_period_end,
    },
  });
};

const paymentHistory = async (req, res) => {
  const user = req.user;
  if (!user.stripeCustomerId) {
    return res.status(400).json({
      success: false,
      message: "User does not have a Stripe customer",
    });
  }

  const limit = Math.min(Number(req.query.limit) || 10, 100);
  const params = {
    customer: user.stripeCustomerId,
    limit,
  };
  if (req.query.starting_after) {
    params.starting_after = req.query.starting_after;
  }
  const history = await stripe.invoices.list(params);
  const planName = user.subscription?.plan
    ? user.subscription.plan.charAt(0).toUpperCase() +
      user.subscription.plan.slice(1) +
      " Plan"
    : "Subscription";
  const payments = history.data.map((invoice) => ({
    id: invoice.id,
    date: new Date(invoice.created * 1000),
    amount: invoice.amount_paid / 100,
    currency: invoice.currency.toUpperCase(),
    status: invoice.status,

    // description: invoice.lines.data[0]?.description ?? "Subscription",
    description: planName,

    invoiceUrl: invoice.hosted_invoice_url,
    invoicePdf: invoice.invoice_pdf,
  }));

  return res.status(200).json({
    success: true,
    meessage: "payment history retrieved",
    data: payments,
    pagination: {
      hasMore: history.has_more,
      nextCursor: history.has_more
        ? history.data[history.data.length - 1]?.id
        : null,
    },
  });
};

const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
      return res.status(403).json({
          success: false,
          message: "Admin access required",
      });
  }

  next();
};

module.exports = adminOnly;

module.exports = {
  createSubscription,
  checkConnection,
  getUserDetails,
  cancelSubscription,
  paymentHistory,adminOnly
};
