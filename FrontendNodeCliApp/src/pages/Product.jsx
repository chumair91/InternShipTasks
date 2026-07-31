

import ProductCard from "../components/productCard";
import UseApi from "../hooks/useApi";

const Product = () => {
  const { error, loading, data } = UseApi('/products')

  // console.log("data:", data);
  // console.log("isArray:", Array.isArray(data));
  // console.log("typeof:", typeof data);
 

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="flex h-screen items-center justify-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="h-screen w-screen max-w-[1240px] mx-auto grid grid-cols-1 px-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {data.map((p) => (
        <ProductCard key={p._id} product={p} />
      ))}
      {/* {
console.log("printing type of data ",typeof data)
      } */}
    

    </div>
  );
};

export default Product;
