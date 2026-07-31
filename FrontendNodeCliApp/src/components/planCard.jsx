import { useContext, useState } from "react";
import { userContext } from "../context/UserAuthContext";
import ConfirmModal from "./ConfirmModal";


const PlanCard = ({ plan, currentPlan }) => {
    const isCurrentPlan = plan.name.toLowerCase() === (currentPlan ?? "").toLowerCase();
    const [showModal, setShowModal] = useState(false);
    const { buySubscription, buyingPlan, cancelPlanLoading, cancelSubscription } = useContext(userContext);
    const isProcessing = buyingPlan === plan.name;

    const handleCancel = async () => {
        await cancelSubscription();
        setShowModal(false);
    }

    return (
        <div
            className={`relative rounded-2xl border p-6 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${isCurrentPlan
                ? "border-blue-600 bg-blue-50"
                : "border-gray-200 bg-white"
                }`}
        >
            {isCurrentPlan && (
                <span className="absolute top-4 right-4 rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
                    Current Plan
                </span>
            )}

            <h2 className="text-2xl font-bold text-gray-800">{plan.name}</h2>

            <div className="mt-4">
                <span className="text-4xl font-bold text-gray-900">
                    ${plan.price}
                </span>
                <span className="text-gray-500">/month</span>
            </div>

            <ul className="mt-6 space-y-3">
                {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-gray-700">
                        <span className="text-green-500">✔</span>
                        <span>{feature}</span>
                    </li>
                ))}
            </ul>



            {(isCurrentPlan && currentPlan.toLowerCase() !== 'free') ? <button onClick={() => setShowModal(true)} className={`mt-8 w-full rounded-lg py-3 font-semibold transition ${cancelPlanLoading
                ? "cursor-not-allowed bg-gray-300 text-gray-600"
                : "bg-red-600 text-white hover:bg-red-700 active:bg-red-900"
                }`}>Cancel Subscription</button> : <button
                    disabled={isCurrentPlan || isProcessing}
                    onClick={() => buySubscription(plan.name)}
                    className={`mt-8 w-full rounded-lg py-3 font-semibold transition ${isCurrentPlan || isProcessing
                        ? "cursor-not-allowed bg-gray-300 text-gray-600"
                        : "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-900"
                        }`}
                >
                {isProcessing ? 'Redirecting..' : "Choose Plan"}
            </button>}
            <ConfirmModal
                open={showModal}
                title="Cancel Subscription"
                message="Are you sure you want to cancel your subscription? You'll continue to have access until the end of your current billing period."
                confirmText="Yes, Cancel"
                cancelText="Keep Subscription"
                loading={cancelPlanLoading}
                onConfirm={handleCancel}
                onClose={() => setShowModal(false)}
            />
        </div>
    );
};

export default PlanCard;