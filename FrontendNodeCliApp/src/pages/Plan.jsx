import { useContext, useEffect } from "react"
import PlanCard from "../components/planCard"
import { userContext } from "../context/UserAuthContext"

const plans = [
    {
        name: "Free",
        price: 0,
        features: [
            "Basic access",
            "Community support"
        ]
    },
    {
        name: "Basic",
        price: 9.99,
        features: [
            "Priority support",
            "Unlimited products"
        ]
    },
    {
        name: "Pro",
        price: 29.99,
        features: [
            "Everything in Basic",
            "Premium support"
        ]
    }
]

const Plan = () => {
    const { user, paymentHistory, getPaymentHistory, historyLoader } = useContext(userContext);

    useEffect(() => {
        getPaymentHistory();
    }, [])


    return (
        <>
            <div className="max-w-[1240px] mx-auto gap-x-3 mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                {plans.map(plan => (
                    <PlanCard key={plan.name} plan={plan} currentPlan={user?.plan} />
                ))}

            </div>


            {historyLoader ? <div className="mt-10 overflow-x-auto rounded-xl border shadow-sm text-center"> <p className="text-center">loading...</p> </div> : paymentHistory ? <div className="mt-10 overflow-x-auto rounded-xl border shadow-sm">
                <h1 className="text-center text-blue-500 text-xl font-bold">Your Payment's history</h1>

                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                Date
                            </th>

                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                Description
                            </th>

                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                Amount
                            </th>

                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                Status
                            </th>

                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                Invoice
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                        {paymentHistory.map(payment => (
                            <tr
                                key={payment.id}
                                className="hover:bg-gray-50 transition"
                            >
                                <td className="px-6 py-4 text-sm text-gray-700">
                                    {new Date(payment.date).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                    })}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-700">
                                    {payment.description}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-700">
                                    {payment.amount}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-700">
                                    <span
                                        className={`rounded-full px-3 py-1 text-sm font-medium ${payment.status === "paid"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-yellow-100 text-yellow-700"
                                            }`}
                                    >
                                        {payment.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-700">
                                    <a
                                        href={payment.invoicePdf}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline"
                                    >
                                        View PDF
                                    </a>
                                </td>


                            </tr>
                        ))}



                    </tbody>

                </table>
            </div> : <div className="mt-10 overflow-x-auto rounded-xl border shadow-sm text-center"> <p className="text-center p-3">Your Stripe's payment history would be shown here</p> </div>}



        </>

    )
}

export default Plan
