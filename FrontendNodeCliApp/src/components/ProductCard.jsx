import { useState } from "react";
import { Star, PackageCheck, PackageX, Boxes, Cpu } from "lucide-react";



const defaultProduct = {
  _id: "6a5f83d25ebdf5b58ffd290b",
  name: "MacBook",
  price: 2500,
  discountedPrice: 2250,
  category: "electronics",
  inStock: true,
  createdAt: "2026-07-21T14:36:02.485Z",
  updatedAt: "2026-07-24T13:16:34.330Z",
  __v: 0,
  averageRating: 0,
  reviewCount: 0,
  quantity: 9,
};

// Simplified getters since data now comes as direct strings
const getOid = (id) => id || "";
const getDate = (d) => d || null;

function formatPrice(price) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: price % 1 === 0 ? 0 : 2,
  }).format(price);
}

function StarRow({ rating, count }) {
  const rounded = Math.round(rating);
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={13}
            strokeWidth={1.5}
            className={i < rounded ? "fill-cyan-400 text-cyan-400" : "text-slate-700"}
          />
        ))}
      </div>
      <span className="font-mono text-[11px] text-slate-500">
        {count > 0 ? `${rating.toFixed(1)} · ${count}` : "no reviews yet"}
      </span>
    </div>
  );
}

export default function ProductCard({ product = defaultProduct }) {
  const [hovered, setHovered] = useState(false);
  const oid = getOid(product._id);
  const created = getDate(product.createdAt);
  const low = product.inStock && product.quantity > 0 && product.quantity <= 5;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative w-full max-w-xs overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-[0_1px_0_0_rgba(255,255,255,0.04)_inset] transition-transform duration-300"
      style={{ transform: hovered ? "translateY(-3px)" : "translateY(0)" }}
    >
      {/* faint circuit-trace watermark, nods to the record's origin */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.06]"
        viewBox="0 0 320 260"
        fill="none"
      >
        <path
          d="M0 40H90V10H320M0 120H60V220H180V260M320 90H210V180H120"
          stroke="#22d3ee"
          strokeWidth="1"
        />
        <circle cx="90" cy="10" r="3" fill="#22d3ee" />
        <circle cx="60" cy="220" r="3" fill="#22d3ee" />
        <circle cx="210" cy="90" r="3" fill="#22d3ee" />
      </svg>

      {/* top strip: category + stock */}
      <div className="relative flex items-center justify-between px-4 pt-4">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-900/80 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-cyan-400">
          <Cpu size={11} strokeWidth={2} />
          {product.category}
        </span>

        {product.inStock ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-medium text-emerald-400">
            <PackageCheck size={12} /> In stock
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-2.5 py-1 text-[10px] font-medium text-rose-400">
            <PackageX size={12} /> Out of stock
          </span>
        )}
      </div>

      {/* body */}
      <div className="relative px-5 pb-5 pt-4">
        <h3 className="text-lg font-semibold tracking-tight text-slate-50">
          {product.name}
        </h3>

        <div className="mt-1">
          <StarRow rating={product.averageRating} count={product.reviewCount} />
        </div>

        <div className="mt-4 flex items-end justify-between">
          <div className="flex flex-col">
            {product.discountedPrice ? (
              <>
                <span className="font-mono text-sm text-slate-400 line-through">
                  {formatPrice(product.price)}
                </span>
                <span className="font-mono text-2xl font-semibold text-white">
                  {formatPrice(product.discountedPrice)}
                </span>
              </>
            ) : (
              <span className="font-mono text-2xl font-semibold text-white">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-slate-500">
            <Boxes size={13} />
            <span className={`font-mono text-xs ${low ? "text-amber-400" : ""}`}>
              {product.quantity} left
            </span>
          </div>
        </div>

        <button
          disabled={!product.inStock}
          className="mt-4 w-full rounded-xl bg-cyan-500 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-cyan-400 disabled:cursor-not-allowed disabled:bg-slate-800 disabled:text-slate-500"
        >
          {product.inStock ? "Add to cart" : "Notify me"}
        </button>

        {/* document metadata, styled like a spec footer */}
        <div className="mt-4 flex items-center justify-between border-t border-slate-900 pt-3 font-mono text-[10px] text-slate-600">
          <span title={oid}>#{oid.slice(-6)}</span>
          {created && (
            <span>
              {new Date(created).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
