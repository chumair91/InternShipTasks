import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js"
import { useState } from "react";



const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const result = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: "http://localhost:5173/payment-success"
                }
            })

            if (result.error) {
                console.log(result.error.message);
            }
        } catch (error) {
            console.error(error)
            setLoading(false)
        } finally {
            setLoading(false)
        }

    }

    return (
        <form onSubmit={handleSubmit}>
            <PaymentElement />
            <button disabled={loading || !stripe || !elements} className={`mt-8 w-full rounded-lg py-3 font-semibold transition ${loading || !stripe || !elements
                ? "cursor-not-allowed bg-gray-300 text-gray-600"
                : "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-900"
                }`} >pay</button>
        </form>
    )
}

export default CheckoutForm
