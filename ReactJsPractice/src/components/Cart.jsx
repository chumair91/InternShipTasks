import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

const products = [
    {
        id: 1,
        name: "Premium Wireless Headphones",
        price: 2999,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
        quantity: 2
    },
    {
        id: 2,
        name: "Smart Fitness Watch",
        price: 4499,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop",
        quantity: 1
    },
    {
        id: 3,
        name: "Organic Cotton T-Shirt",
        price: 899,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop",
        quantity: 1
    },
    {
        id: 4,
        name: "Stainless Steel Water Bottle",
        price: 549,
        image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&h=500&fit=crop",
        quantity: 1
    },
    {
        id: 5,
        name: "Leather Wallet",
        price: 1299,
        image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&h=500&fit=crop",
        quantity: 1
    }
];
const Cart = () => {
    const [product, setProduct] = useState(products);
    // const [cartQuantity, setCartQuantity] = useState(0);
    // const [cartPrice, setCartPrice] = useState(0);


    const increaseQuantity = (id) => {
        setProduct(product.map(p => {
            if (id === p.id) {
                return { ...p, quantity: p.quantity + 1 }
            }
            return p
        }))

    }
    const decreaseQuantity = (id) => {
        setProduct(
            product.map((p) =>
                p.id === id
                    ? {
                        ...p,
                        quantity: Math.max(0, p.quantity - 1),
                    }
                    : p
            )
        );
    };

    const cartQuantity = product.reduce(
        (sum, p) => sum + p.quantity,
        0
    );

    const cartPrice = product.reduce(
        (sum, p) => sum + p.price * p.quantity,
        0
    );


    const clearCart = () => {
        setProduct(
            product.map((p) => ({
                ...p,
                quantity: 0,
            }))
        )

    }
    return (
        <div className="h-screen w-screen bg-gray-200 px-3 flex flex-col items-center gap-4">
            <header className="flex justify-between bg-white w-full py-4 rounded-md px-3 ">
                <h1 className="text-2xl font-bold text-blue-400">Shopping Cart</h1>
                <span className="text-2xl font-bold">⋮</span>
            </header>
            {/* total cart  */}
            <div className="flex flex-col bg-white w-[65%] shadow-2xl py-4 px-2 rounded-md ">
                <div className="flex justify-between  ">
                    <div className="flex flex-col gap-3">
                        <p>Current Selection</p>
                        <p className="text-gray-500"><span className="text-blue-500 text-lg font-semibold ">{cartQuantity}</span> items</p>
                    </div>
                    <div className="flex flex-col gap-3 ">
                        <h2>Estimated Total</h2>
                        <span className="text-lg font-semibold">{cartPrice}</span>
                    </div>
                </div>

                <div className="bg-black px-2 py-2 text-white ">
                    <button onClick={clearCart} className="text-2xl font-semibold active:scale-95 w-full">Clear Cart</button>
                </div>
            </div>

            {product.map((p, i) => (
                <ProductCard key={i} {...p} increaseQuantity={increaseQuantity} decreaseQuantity={decreaseQuantity} />
            ))}

        </div>
    )
}

export default Cart