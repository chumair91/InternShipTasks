
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Minus, Plus } from "lucide-react";
import api from "../api/axios";
import { createOrder } from "../api/orderApi";
import { toast } from "sonner";
import { waitForCheckout } from "../services/orderService";

const ProductDetails = () => {
    const { id } = useParams();
    // const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await api.get(`/products/${id}`);

                const result = res?.data?.data ?? res?.data ?? null;
                console.log(result);

                setProduct(result);
            } catch (err) {
                console.error(err);
                setError("Could not load product.");
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <p className="text-gray-600">Loading...</p>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
                <p className="mb-4 text-red-500">
                    {error || "Product not found"}
                </p>

                <Link
                    to="/products"
                    className="flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-white hover:bg-gray-800"
                >
                    <ArrowLeft size={18} />
                    Back to Products
                </Link>
            </div>
        );
    }

    const image =
        product.image ||
        product.thumbnail ||
        product.images?.[0] ||
        "https://via.placeholder.com/600";

    const price = Number(product.discountedPrice ?? product.price ?? 0);
    const originalPrice = Number(product.price ?? 0);

    const stock = Number(product.quantity ?? 0);
    const isAvailable = product.quantity > 0;

    const increaseQuantity = () => {
        if (quantity < stock) {
            setQuantity((prev) => prev + 1);
        }
    };

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity((prev) => prev - 1);
        }
    };

    // Add product to cart
    const handleAddToCart = () => {
        const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
        const existingItem = existingCart.find((item) => item.productId === product.id);

        const currentCartQuantity = existingItem ? existingItem.quantity : 0;
        if (currentCartQuantity + quantity > stock) {
            toast.error(`Only ${stock} items available`);
            return;
        }

        if (existingItem) {

            existingItem.quantity += quantity;
        } else {
            existingCart.push({
                productId: id,
                name: product.name,
                price,
                quantity,
                image,
                category: product.category,
                stock
            })
        }

        localStorage.setItem("cart", JSON.stringify(existingCart));

        console.log("Cart:", existingCart);
        toast.success(product.name + " added to cart ")

    };

    // Go directly to checkout
    const handleBuyNow = async () => {
        try {
            const order = await createOrder([{
                product: product.id,
                quantity: quantity
            }])
            console.log("Order created", order);
            const checkoutUrl = await waitForCheckout(order.orderId);

            window.location.href = checkoutUrl;

        } catch (error) {
            console.error("Order creation failed:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-8">
            <div className="mx-auto max-w-6xl">

                {/* Back */}
                <Link
                    to="/products"
                    className="mb-6 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
                >
                    <ArrowLeft size={18} />
                    Back to Products
                </Link>

                {/* Product Card */}
                <div className="grid overflow-hidden rounded-2xl bg-white shadow-sm md:grid-cols-2">

                    {/* Image */}
                    <div className="flex items-center justify-center bg-gray-100 p-6 sm:p-10">
                        <img
                            src={image}
                            alt={product.name}
                            className="h-72 w-full object-contain sm:h-96"
                        />
                    </div>

                    {/* Details */}
                    <div className="p-6 sm:p-8 md:p-10">

                        {/* Category */}
                        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                            {product.category}
                        </p>

                        {/* Name */}
                        <h1 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
                            {product.name}
                        </h1>

                        {/* Rating */}
                        {product.reviewCount > 0 && (
                            <p className="mt-3 text-sm text-gray-500">
                                ⭐ {Number(product.averageRating).toFixed(1)}
                                {" "}
                                ({product.reviewCount} reviews)
                            </p>
                        )}

                        {/* Price */}
                        <div className="mt-6 flex items-center gap-3">
                            <span className="text-3xl font-bold text-gray-900">
                                ${price.toFixed(2)}
                            </span>

                            {price < originalPrice && (
                                <span className="text-lg text-gray-400 line-through">
                                    ${originalPrice.toFixed(2)}
                                </span>
                            )}
                        </div>

                        {/* Description */}
                        <p className="mt-5 leading-7 text-gray-600">
                            {product.description || "No description available."}
                        </p>

                        {/* Stock */}
                        <div className="mt-6">
                            {isAvailable ? (
                                <p className="text-sm font-medium text-green-600">
                                    ✓ In Stock ({stock} available)
                                </p>
                            ) : (
                                <p className="text-sm font-medium text-red-600">
                                    ✕ Out of Stock
                                </p>
                            )}
                        </div>

                        {/* Quantity */}
                        {isAvailable && (
                            <div className="mt-6">
                                <p className="mb-2 text-sm font-medium text-gray-700">
                                    Quantity
                                </p>

                                <div className="flex w-fit items-center rounded-lg border border-gray-300">

                                    <button
                                        onClick={decreaseQuantity}
                                        disabled={quantity === 1}
                                        className="p-2 hover:bg-gray-100 disabled:opacity-40"
                                    >
                                        <Minus size={18} />
                                    </button>

                                    <span className="w-12 text-center font-medium">
                                        {quantity}
                                    </span>

                                    <button
                                        onClick={increaseQuantity}
                                        disabled={quantity >= stock}
                                        className="p-2 hover:bg-gray-100 disabled:opacity-40"
                                    >
                                        <Plus size={18} />
                                    </button>

                                </div>
                            </div>
                        )}

                        {/* Buttons */}
                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">

                            {/* Add to Cart */}
                            <button
                                onClick={handleAddToCart}
                                disabled={!isAvailable}
                                className="flex-1 rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-900 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Add to Cart
                            </button>

                            {/* Buy Now */}
                            <button
                                onClick={handleBuyNow}
                                disabled={!isAvailable}
                                className="flex-1 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                            >
                                Buy Now
                            </button>

                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;

