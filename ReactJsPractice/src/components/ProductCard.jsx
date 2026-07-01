import PropTypes from "prop-types";
import { RiDeleteBin4Line } from "react-icons/ri";

const ProductCard = ({ name, image, price, id, quantity ,increaseQuantity,decreaseQuantity}) => {
  return (
    <div className=" w-full max-w-3xl mx-auto" >
      <div className="rounded-lg shadow-md  bg-white flex items-center  justify-between p-4 ">

        <div className="flex flex-1 items-center ">
          <div className="shrink-0">
            <img className="w-30 h-30 rounded-md  object-cover" src={image} alt="product" />
          </div>

          <div className="ml-4 flex-1">
            <h2 className="text-xl font-bold line-clamp-2">{name}</h2>
            <p className="text-gray-500">Rs. {price}</p>
            {quantity > 0 && <span className="font-extralight text-red-500 mt-2 "><RiDeleteBin4Line size={40} /></span>}
          </div>
        </div>

        <div className="flex flex-col gap-2 bg-gray-300 justify-center py-3 px-5 w-20 rounded-full items-center">
          <button onClick={()=>increaseQuantity(id)}className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <span className="text-blue-400 text-3xl">+</span>
          </button>
          <span className="">{quantity}</span>
          <button onClick={()=>decreaseQuantity(id)} className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <span className="text-blue-400 text-3xl">-</span>
          </button>

        </div>
      </div>
    </div>
  )
}


ProductCard.propTypes = {
  name: PropTypes.string,
  price: PropTypes.number,
  image: PropTypes.string
}
export default ProductCard