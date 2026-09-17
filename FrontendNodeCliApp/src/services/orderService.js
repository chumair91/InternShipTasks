import api from "../api/axios";

export const createCartOrder = async (items) => {
  const payload = {
    items: items.map((item) => ({
      product: item.productId,
      quantity: item.quantity,
    })),
  };

  console.log("CART ITEMS:", items);
  console.log("ORDER PAYLOAD:", payload);

  const res = await api.post("/orders", payload);

  return res.data;
};

export const waitForCheckout = (orderId) => {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    const maxAttempts = 15;
    const poll = async () => {
      attempts++;
      try {
        console.log('attempting again');
        
        const res = await api.get(`/orders/payment-status/${orderId}`);
        const checkoutUrl = res.data?.checkoutUrl;
        if (checkoutUrl) {
          resolve(checkoutUrl);
          return;
        }

        if (attempts >= maxAttempts) {
          reject(new Error("Checkout timeout"));
          return;
        }
        setTimeout(poll, 1000);
      } catch (error) {
        reject(error);
      }
    };
    poll();
  });
};
