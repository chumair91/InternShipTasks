
import { createContext, useEffect, useState } from 'react'
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';


// eslint-disable-next-line react-refresh/only-export-components
export const userContext = createContext();
const UserAuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [clientSecret, setClientSecret] = useState('');
    const [buyingPlan, setBuyingPlan] = useState(null);
    const [cancelPlanLoading, setCancelPlanLoading] = useState(false);
    const [paymentHistory, setPaymentHistory] = useState(null);
    const [historyLoader, setHistoryLoader] = useState(false);
    const fetchUser = async () => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                setLoading(false);
                return;
            }
            const res = await api.get('/auth/me');

            // console.log('USer is ', res);
            setUser(res.data.data)
        } catch (error) {
            console.log(error);

        }

    }
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            fetchUser()
        }

    }, [])

    const register = async (formData) => {
        try {
            const res = await api.post("/auth/register", formData);
            localStorage.setItem("token", res.data.token);
            await fetchUser();
            toast.success("Account created successfully");
            navigate("/products");
            return true;
        } catch (err) {
            toast.error(err.response?.data?.message);
            return false;
        }
    }

    const login = async (token) => {
        // console.log(token);

        localStorage.setItem("token", token);
        await fetchUser();
    }
    const logout = () => {
        console.log('User logged out');
        localStorage.removeItem('token');
        navigate('/login');
    }

    const buySubscription = async (plan) => {
        try {
            setBuyingPlan(plan);
            const res = await api.post('/subscriptions/create', { plan });
            console.log(res);
            setClientSecret(res.data.clientSecret);
            navigate('/plan/checkout');
            toast.success(res.data.message)
        } catch (error) {
            console.log(error);
            setBuyingPlan(null);
            toast.error(error.response?.data?.message)
        } finally {
            setBuyingPlan(null);
        }
    }

    const cancelSubscription = async () => {
        try {
            setCancelPlanLoading(true);
            const res = await api.post('/subscriptions/cancel');
            console.log(res);
            toast.success(res.data.message);

        } catch (error) {
            console.error(error);
            setCancelPlanLoading(false);
        } finally {
            setCancelPlanLoading(false);
        }


    }

    const getPaymentHistory = async () => {
        setHistoryLoader(true)
        try {
            if (user?.stripeCustomerId) {
                const res = await api.get('/subscriptions/payments/history');
                setPaymentHistory(res.data.data);
            } else {
                setPaymentHistory(null);
            }

            // console.log(res.data.data);
            // console.log(typeof res.data);
            // console.log(Array.isArray(res.data.data));
        } catch (error) {
            toast.error(error.message)
            console.log(error);
            setHistoryLoader(false)
        } finally {
            setHistoryLoader(false);
        }
    }
    return (
        <userContext.Provider value={{ user, login, logout, register, loading, setLoading, buySubscription, clientSecret, buyingPlan, cancelSubscription, cancelPlanLoading, paymentHistory, getPaymentHistory, historyLoader }}>
            {children}
        </userContext.Provider>
    )
}

export default UserAuthProvider;