import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, BadgeCheck, ShieldCheck, Star, Truck } from "lucide-react";
import api from "../api/axios";

const formatPrice = (value) => {
    if (value === null || value === undefined || value === "") return "--";

    const numericValue = Number(value);
    if (Number.isNaN(numericValue)) return value;

    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(numericValue);
};

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let isMounted = true;

        const fetchDetails = async () => {
            try {
                const res = await api.get(`/products/${id}`);
                console.log(res);
                
                const result = res?.data?.data ?? res?.data ?? null;
                 
                if (isMounted) {
                    setProduct(result);
                }
            } catch (err) {
                if (isMounted) {
                    setError("Product details could not be loaded right now.",err);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchDetails();

        return () => {
            isMounted = false;
        };
    }, [id]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100">
                <div className="rounded-2xl border border-slate-800 bg-slate-900 px-6 py-4 text-sm text-slate-300">
                    Loading product details...
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-center text-slate-100">
                <div className="max-w-md rounded-3xl border border-red-500/30 bg-slate-900 p-8 shadow-2xl shadow-slate-950/40">
                    <p className="text-lg font-semibold text-red-400">Oops!</p>
                    <p className="mt-3 text-sm text-slate-300">{error || "No product information found."}</p>
                    <Link
                        to="/products"
                        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
                    >
                        <ArrowLeft size={16} />
                        Back to products
                    </Link>
                </div>
            </div>
        );
    }

    const imageUrl =
        product.image ||
        product.thumbnail ||
        product.images?.[0] ||
        "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80";

    const productPrice = Number(product.discountedPrice ?? product.price ?? 0);
    const originalPrice = Number(product.price ?? product.discountedPrice ?? 0);
    const hasDiscount = product.discountedPrice && product.discountedPrice < product.price;
    const quantity = Number(product.quantity ?? 0);
    const stockStatus = quantity > 0 || Boolean(product.inStock);
    const rating = Number(product.averageRating ?? 0);
    const reviewCount = Number(product.reviewCount ?? 0);

    return (
        <div className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100">
            <div className="mx-auto max-w-6xl">
                <Link
                    to="/products"
                    className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-cyan-500 hover:text-cyan-300"
                >
                    <ArrowLeft size={16} />
                    Back to products
                </Link>

                <div className="mt-8 overflow-hidden rounded-[28px] border border-slate-800 bg-slate-900/80 shadow-[0_25px_80px_rgba(15,23,42,0.7)] backdrop-blur-sm">
                    <div className="grid gap-8 p-6 md:grid-cols-2 md:p-10">
                        <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-950">
                            <img
                                src={imageUrl}
                                alt={product.name}
                                className="h-full min-h-[420px] w-full object-cover"
                            />
                            <div className="absolute left-4 top-4 rounded-full border border-cyan-500/30 bg-slate-950/80 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-300">
                                {product.category || "Product"}
                            </div>
                        </div>

                        <div className="flex flex-col justify-center">
                            <div className="mb-4 flex items-center justify-between gap-3">
                                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
                                    <BadgeCheck size={14} />
                                    {stockStatus ? "In stock" : "Out of stock"}
                                </div>

                                <div className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-xs text-slate-300">
                                    <Truck size={14} className="text-cyan-300" />
                                    Free shipping
                                </div>
                            </div>

                            <h1 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
                                {product.name}
                            </h1>

                            <div className="mt-4 flex items-center gap-3 text-sm text-slate-300">
                                <div className="flex items-center gap-1">
                                    {Array.from({ length: 5 }).map((_, index) => (
                                        <Star
                                            key={index}
                                            size={16}
                                            className={index < Math.round(rating) ? "fill-cyan-400 text-cyan-400" : "text-slate-600"}
                                        />
                                    ))}
                                </div>
                                <span>{rating.toFixed(1)}</span>
                                <span className="text-slate-500">({reviewCount} reviews)</span>
                            </div>

                            <div className="mt-6 flex items-end gap-3">
                                <span className="text-4xl font-bold text-white">
                                    {formatPrice(productPrice || originalPrice)}
                                </span>
                                {hasDiscount && (
                                    <span className="mb-1 text-lg text-slate-400 line-through">
                                        {formatPrice(originalPrice)}
                                    </span>
                                )}
                            </div>

                            <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-300">
                                <p className="leading-7 text-slate-300">
                                    {product.description ||
                                        "A high-quality product built for performance, durability, and everyday convenience. Designed to fit your needs with a premium feel and dependable reliability."}
                                </p>
                            </div>

                            <div className="mt-6 grid gap-3 sm:grid-cols-2">
                                <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Availability</p>
                                    <p className="mt-2 text-base font-semibold text-slate-100">
                                        {stockStatus ? `${product.quantity ?? 1} items left` : "Currently unavailable"}
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Warranty</p>
                                    <p className="mt-2 text-base font-semibold text-slate-100">12 months</p>
                                </div>
                            </div>

                            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                                <button className="flex-1 rounded-2xl bg-cyan-500 px-6 py-3 text-base font-semibold text-slate-950 transition hover:bg-cyan-400">
                                    Add to cart
                                </button>
                                <button className="flex-1 rounded-2xl border border-slate-700 bg-slate-950 px-6 py-3 text-base font-semibold text-slate-100 transition hover:border-cyan-500 hover:text-cyan-300">
                                    Buy now
                                </button>
                            </div>

                            <div className="mt-8 flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-300">
                                <ShieldCheck className="text-emerald-400" size={18} />
                                Secure checkout and trusted delivery guarantee.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;