import { ArrowLeft, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

import { createCartOrder, waitForCheckout } from "../services/orderService";
import socket from "../socket";





const Cart = () => {
    const [cart, setCart] = useState([]);
    const [shippingFee, setShippingFee] = useState(0);
    const [popup, setpopup] = useState(false)
    const [itemToRemove, setItemToRemove] = useState(null);
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        const savedCart = JSON.parse(
            localStorage.getItem("cart") || "[]"
        );

        console.log(savedCart);

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCart(savedCart);
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token && !socket.connected) {
            socket.auth = { token };
            socket.connect();
        }

        const handlePaymentReady = (data) => {
            console.log('payment ready', data);
            if (data.checkoutUrl) {
                window.location.href = data.checkoutUrl;
            }
        }

        socket.on('payment:ready', handlePaymentReady);

        return () => {
            socket.off("payment:ready", handlePaymentReady);
        };
    }, [])

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart])

    // You will make this work later
    const removeItem = () => { };

    const subtotal = () =>
        cart.reduce(
            (total, item) => total + item.price * item.quantity,
            0
        );

    const increaseQuantity = (id) => {

        // const item = cart.find(item => item.productId === id);
        const updatedCart = cart.map(item => {
            if (item.productId === id) {
                if (item.quantity >= item.stock) {
                    toast.error(`Only ${item.stock} available`);
                    return item;
                }
                item.quantity += 1;

            }
            return item;
        })


        // const updatedCart = { ...item, cart }
        // console.log(updatedCart);
        setCart(updatedCart)
    }

    const decreaseQuantity = (id) => {

        const item = cart.find(item => item.productId === id);

        if (item.quantity === 1) {
            setItemToRemove(item.productId);
            setpopup(true);
            return;
        }

        const updatedCart = cart.map(item => {
            if (item.productId === id) {
                return {
                    ...item,
                    quantity: item.quantity - 1
                };
            }

            return item;
        });

        setCart(updatedCart);
    };




    const handleDelete = () => {
        const updatedCart = cart.filter(item => item.productId !== itemToRemove);
        console.log(updatedCart);
        setpopup(false)
        setCart(updatedCart)

    }

    const handleCheckout = async () => {
        setLoading(true);
        try {
            const result = await createCartOrder(cart);
            console.log("Order created:", result);

            const orderId = result.orderId;
            const checkoutUrl = await waitForCheckout(orderId);
            window.location.href = checkoutUrl;
        } catch (error) {
            console.error(error);

            toast.error(
                error.response?.data?.message ||
                "Failed to create order"
            );
            setLoading(false)
        }
    }

    if (cart.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
                <h1 className="text-3xl font-bold text-gray-900 text-center">
                    Your cart is empty
                </h1>

                <p className="mt-2 text-gray-500 text-center">
                    Add some products to your cart first.
                </p>

                <Link
                    to="/products"
                    className="mt-6 rounded-lg bg-blue-600 px-6 py-3 text-white"
                >
                    Continue Shopping
                </Link>
            </div>
        );
    }

    return (
        <>
            <div className="min-h-screen bg-[#F8F9FF] px-4 py-8 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-6xl">
                    <Link
                        to="/products"
                        className="flex items-center gap-2  text-gray-500 border rounded-xl px-4 py-2  hover:text-gray-800 max-w-50 active:bg-gray-800 active:text-white"
                    >
                        <ArrowLeft size={18} />
                        Back to Products
                    </Link>
                    <h1 className="mb-8 text-3xl font-bold text-gray-900">
                        Shopping Cart
                    </h1>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">

                        {/* LEFT - CART ITEMS */}
                        <div className="space-y-4">
                            {cart.map((item) => (
                                <div
                                    key={item.productId}
                                    className="grid grid-cols-[96px_1fr_auto] gap-4 rounded-xl bg-white p-4 shadow-sm sm:grid-cols-[112px_1fr_auto] sm:gap-5 sm:p-5"
                                >
                                    {/* IMAGE */}
                                    <img
                                        src={item?.image}
                                        alt={item?.name}
                                        className="h-24 w-24 rounded-lg bg-gray-100 object-contain sm:h-28 sm:w-28"
                                    />

                                    {/* PRODUCT INFO */}
                                    <div className="min-w-0 flex flex-col justify-between">
                                        <div>
                                            <p className="truncate text-lg font-semibold text-gray-900 sm:text-xl">
                                                {item.name}
                                            </p>

                                            <span className="text-sm text-[#434655]">
                                                {item.category}
                                            </span>
                                        </div>

                                        <p className="mt-4 text-lg font-semibold text-gray-900 sm:text-xl">
                                            ${item.price}
                                        </p>
                                    </div>

                                    {/* ACTIONS */}
                                    <div className="flex flex-col items-end justify-between">
                                        <button
                                            onClick={() =>
                                                removeItem(item.productId)
                                            }
                                            className="text-gray-400 hover:text-red-500"
                                        >
                                            <Trash2 size={19} />
                                        </button>

                                        <div className="mt-4 flex items-center gap-3 rounded-md bg-[#E5EEFF] px-3 py-1 sm:gap-4 sm:px-4">
                                            <button onClick={() => increaseQuantity(item.productId)} className="text-lg font-medium sm:text-xl">
                                                +
                                            </button>

                                            <span className="text-lg font-medium sm:text-xl">
                                                {item.quantity}
                                            </span>

                                            <button onClick={() => decreaseQuantity(item.productId)} className="text-lg font-medium sm:text-xl">
                                                -
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* RIGHT - ORDER SUMMARY */}
                        <div className="h-fit rounded-xl bg-white p-5 shadow-sm sm:p-6 lg:sticky lg:top-6">
                            <h3 className="text-2xl font-semibold">
                                Order Summary
                            </h3>

                            <div className="mt-5 flex justify-between gap-4">
                                <p className="text-sm text-[#434655] sm:text-base">
                                    Subtotal ({cart.length} items)
                                </p>

                                <span className="font-medium">
                                    ${subtotal().toFixed(2)}
                                </span>
                            </div>

                            <div className="mt-4 flex justify-between">
                                <p className="text-sm text-[#434655] sm:text-base">
                                    Shipping
                                </p>

                                <span className="text-red-400">
                                    Free
                                </span>
                            </div>

                            <hr className="my-6 border-gray-300" />

                            <div className="flex items-center justify-between gap-4">
                                <h1 className="text-xl font-semibold text-[#434655] sm:text-2xl">
                                    Total
                                </h1>

                                <span className="text-2xl font-bold text-[#2563EB] sm:text-3xl">
                                    ${(subtotal() + Number(shippingFee)).toFixed(2)}
                                </span>
                            </div>

                            <button disabled={loading || cart.length === 0} onClick={handleCheckout} className="mt-6 w-full rounded-md bg-[#2563EB] px-2 py-3 text-white">
                                {loading ? 'Processing' : 'Proceed To Checkout'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {popup && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-96">
                        <h2 className="text-xl font-semibold">
                            Remove Item?
                        </h2>
                        <p className="mt-2 text-gray-600">
                            Do you really want to remove this item?
                        </p>
                        <div className="flex justify-end gap-3 mt-6">
                            <button onClick={() => {
                                setpopup(false)
                            }} className="px-4 py-2 rounded border" > Cancel </button>
                            <button onClick={handleDelete} className="px-4 py-2 rounded bg-red-500 text-white" > Yes, Remove </button>
                        </div>
                    </div>
                </div>
            )}
        </>

    );
};

export default Cart;