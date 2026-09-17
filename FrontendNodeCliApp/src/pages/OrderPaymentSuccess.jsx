// PaymentSuccess.jsx
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import socket from "../socket";
import { toast } from "sonner";
import api from "../api/axios";

export const OrderPaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState("verifying");

  useEffect(() => {
    if (!sessionId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStatus("failed");
      return;
    }
    let attempts = 0;
    const maxAttempts = 15;
    let cancelled = false;
    let timeoutId;
    const checkPayment = async () => {
      if (cancelled) return;

      try {
        console.log("Checking payment...", attempts + 1);
        const res = await api.get(`/orders/payment-status/${sessionId}`);
        if (cancelled) return;

        console.log("Payment status:", res.data);

        if (res.data.paymentStatus === "paid") {
          localStorage.removeItem("cart");
          setStatus("success");
          toast.success("Payment successful!");
          return;
        }
        attempts++;
        if (attempts >= maxAttempts) {
          setStatus("failed");
          return;
        }
        timeoutId = setTimeout(checkPayment, 1000);
      } catch (error) {
        if (cancelled) return;

        console.error("Payment check failed:", error);
        setStatus("failed");
      }
    };

    const handlePaymentConfirmed = (data) => {
      console.log("Payment confirmed socket event:", data);
      localStorage.removeItem("cart");
      setStatus("success");
      toast.success("Payment successful!");
    };

    socket.on("payment:confirmed", handlePaymentConfirmed);

    if (sessionId) {
      checkPayment();
    }

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
      socket.off("payment:confirmed", handlePaymentConfirmed);
    };
  }, [sessionId]);




  return (
    <div>
      <h1>Thank you for your order!</h1>
      <p>Payment Status: {status}</p>
    </div>
  );
};
