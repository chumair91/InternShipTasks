import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { userContext } from '../context/UserAuthContext';
import { toast } from 'sonner';
import api from '../api/axios';

const Login = () => {
    const { login, register } = useContext(userContext);
    const navigate = useNavigate();

    const [mode, setMode] = useState("login"); // "login" | "signup"

    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [signupData, setSignupData] = useState({ name: '', email: '', password: '' });

    const loginSubmitHandler = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/auth/login", loginData);
            login(res.data.token);
            setLoginData({ email: "", password: "" });
            navigate("/");
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message);
        }
    };

    const signupSubmitHandler = async (e) => {
        e.preventDefault();
        const success = await register(signupData);
        if (success) {
            setSignupData({ name: "", email: "", password: "" });
        }
    };

    return (
        <div className="h-screen w-full flex justify-center items-center bg-[url('/images/bkg1.png')] bg-cover bg-center">
            <div className="bg-white/10 backdrop:blur-md shadow-lg border border-white/20 flex flex-col px-8 py-10 rounded-xl items-center gap-4 w-100">

                {/* Toggle switch */}
                <div className="relative w-full h-11 rounded-full bg-white/10 border border-white/30 flex mb-2">
                    <div
                        className={`absolute top-0 left-0 h-full w-1/2 rounded-full bg-white transition-transform duration-300 ease-in-out ${mode === "signup" ? "translate-x-full" : "translate-x-0"
                            }`}
                    />
                    <button
                        type="button"
                        onClick={() => setMode("login")}
                        className={`relative z-10 w-1/2 font-semibold transition-colors duration-300 ${mode === "login" ? "text-black" : "text-white/80"
                            }`}
                    >
                        Login
                    </button>
                    <button
                        type="button"
                        onClick={() => setMode("signup")}
                        className={`relative z-10 w-1/2 font-semibold transition-colors duration-300 ${mode === "signup" ? "text-black" : "text-white/80"
                            }`}
                    >
                        Sign Up
                    </button>
                </div>

                {/* Sliding forms container */}
                <div className="w-full overflow-hidden">
                    <div
                        className="flex w-[200%] transition-transform duration-300 ease-in-out"
                        style={{ transform: mode === "signup" ? "translateX(-50%)" : "translateX(0%)" }}
                    >
                        {/* Login form */}
                        <form onSubmit={loginSubmitHandler} className="w-1/2 shrink-0 flex flex-col gap-4 px-1">
                            <input
                                className="w-full px-4 py-2 placeholder-white/80 text-white rounded-full border border-white/30 bg-transparent outline-none focus:border-white"
                                name="email"
                                type="email"
                                placeholder="Email"
                                value={loginData.email}
                                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                                required
                            />
                            <input
                                className="w-full px-4 py-2 placeholder-white/80 text-white rounded-full border border-white/30 bg-transparent outline-none focus:border-white"
                                name="password"
                                type="password"
                                placeholder="Password"
                                value={loginData.password}
                                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                required
                            />
                            <button className="text-black bg-white border-none outline-none px-2 py-1.5 w-full rounded-full active:scale-95 transition-all duration-150">
                                Login
                            </button>
                        </form>

                        {/* Signup form */}
                        <form onSubmit={signupSubmitHandler} className="w-1/2 shrink-0 flex flex-col gap-4 px-1">
                            <input
                                className="w-full px-4 py-2 placeholder-white/80 text-white rounded-full border border-white/30 bg-transparent outline-none focus:border-white"
                                name="name"
                                type="text"
                                placeholder="Name"
                                value={signupData.name}
                                onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                                required
                            />
                            <input
                                className="w-full px-4 py-2 placeholder-white/80 text-white rounded-full border border-white/30 bg-transparent outline-none focus:border-white"
                                name="email"
                                type="email"
                                placeholder="Email"
                                value={signupData.email}
                                onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                                required
                            />
                            <input
                                className="w-full px-4 py-2 placeholder-white/80 text-white rounded-full border border-white/30 bg-transparent outline-none focus:border-white"
                                name="password"
                                type="password"
                                placeholder="Password"
                                value={signupData.password}
                                onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                                required
                            />
                            <button className="text-black bg-white border-none outline-none px-2 py-1.5 w-full rounded-full active:scale-95 transition-all duration-150">
                                Sign Up
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login