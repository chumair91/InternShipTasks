import api from "./axios";

export const createOrder = async (items) => {
  const res = await api.post("/orders", {
    items,
  });
  return res.data;
};
