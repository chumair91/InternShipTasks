import { useContext } from "react"
import { userContext } from "../context/UserAuthContext"
import { Elements } from "@stripe/react-stripe-js";
import stripePromise from "../stripe";
import CheckoutForm from "../components/CheckoutForm";


const Checkout = () => {
    const { clientSecret } = useContext(userContext);
    console.log(clientSecret);
    if (!clientSecret) {
        return <h2>Loading payment...</h2>;
    }
    return (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm/>
        </Elements>
    )
}

export default Checkout
