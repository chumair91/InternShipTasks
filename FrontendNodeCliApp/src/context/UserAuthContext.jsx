
import { createContext, useEffect, useState } from 'react'
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import socket from '../socket';



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
                setUser(null);
                setLoading(false);
                return;
            }

            const res = await api.get('/auth/me');
            console.log(res.data.data);
            
            setUser(res.data.data);
        } catch (error) {
            console.log(error);
            if (error.response?.status === 401) {
                try {
                    const refreshRes = await api.post("/auth/refresh");
                    const accessToken = refreshRes.data.token;
                    localStorage.setItem("token", accessToken);
                    const userRes = await api.get("/auth/me");
                    setUser(userRes.data.data);
                    return;
                } catch (refreshError) {
                    console.log("Refresh failed:", refreshError);
                }
            } else {
                localStorage.removeItem('token');
                setUser(null);
            }

        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchUser();
    }, [])



    useEffect(() => {
        if (!user) {
            if (socket.connected) socket.disconnect();
            return;
        }
        const token = localStorage.getItem('token');
        if (!token) {
            return;
        }
        socket.auth = { token };
        if (!socket.connected) {
            socket.connect();
        }
        const handleConnect = () => {
            console.log("Socket connected:", socket.id);
        };

        const handleError = (error) => {
            console.error("Socket connection error:", error.message);
        };
        const handleOrderEvent = (data) => {
            toast.info(data.message)
        }

        socket.on("connect", handleConnect);
        socket.on("connect_error", handleError);
        socket.on('order:created', handleOrderEvent)
        return () => {
            socket.off("connect", handleConnect);
            socket.off("connect_error", handleError);
            socket.off('order:created', handleOrderEvent);
        };
    }, [user])

    // useEffect(() => {
    //     if (!user) {
    //         return;
    //     }
    //     const token = localStorage.getItem('token');
    //     if (!token) {
    //         return;
    //     }
    //     const adminSocket = io(`${config.socketUrl}/admin`, {
    //         autoConnect: false,
    //         auth: {
    //             token
    //         }
    //     })

    //     // Explicitly connect so we can observe connect/connect_error events reliably
    //     adminSocket.connect();

    //     const handleConnect = () => {
    //         console.log("Admin socket connected:", adminSocket.id);
    //     }
    //     const handleError = (error) => {
    //         console.log('Admin socket connection error', error.message);
    //         toast.error(error.message);
    //     }
    //     adminSocket.on('connect', handleConnect);
    //     adminSocket.on('connect_error', handleError);
    //     adminSocket.on('support:rooms', (rooms) => {
    //         console.log('Active support rooms:', rooms);
    //     });
    //     return () => {
    //         adminSocket.off("connect", handleConnect);
    //         adminSocket.off("connect_error", handleError);
    //         adminSocket.disconnect();
    //     };

    // }, [user])

    const register = async (formData) => {
        try {
            const res = await api.post("/auth/register", formData);
            // localStorage.setItem("token", res.data.token);
            await fetchUser();
            toast.success(res.data.message);
            navigate("/login");
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

    const logout = async () => {

        try {
            const res = await api.post("/auth/logout");
            toast.success(res.data.message)
        } catch (err) {
            console.error("Logout failed:", err);
            toast.error(err.message)
        } finally {

            localStorage.removeItem('token');
            setUser(null);
            setLoading(false);
            navigate('/login');
        }

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