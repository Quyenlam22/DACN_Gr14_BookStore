import { useDispatch } from "react-redux";
import { deleteItem, updateQuantity } from "../../actions/cart";
import { useState } from "react";
import Cookies from "js-cookie";
import { getCart, updatePatch } from "../../services/cartService";

function CartItem(props) {
    const { item, updateLocalData } = props;
    const dispatch = useDispatch();
    const [quantity, setQuantity] = useState(item.quantity);

    const cartId = Cookies.get("cart");

    const handleChangeQuantity = async (change) => {
        const newQuantity = quantity + change;
        if (newQuantity >= 1) {
            setQuantity(newQuantity);

            const cartData = await getCart(cartId);
            if(cartData) {
                const index = cartData.cartItems.findIndex(cartItem => cartItem.bookId === item.id);
                if(index >= 0) {
                    cartData.cartItems[index].quantity += change; 
                }

                const options = {
                    cartItems: cartData.cartItems
                };

                updateLocalData(item.id, newQuantity);

                await updatePatch(options, cartId);
            }
            dispatch(updateQuantity(item.id, change));

        }
    };

    const handleClick = async () => {
        const cartData = await getCart(cartId);
        if(cartData) {
            const newcartItems = cartData.cartItems.filter(cartItem => cartItem.bookId !== item.id);
            
            const options = {
                cartItems: newcartItems
            };
            updateLocalData(item.id, 0);
            await updatePatch(options, cartId);
        }
        dispatch(deleteItem(item.id));
    }

    const formatCurrency = (number) => {
        // 1. Dùng Math.round() để làm tròn về số nguyên gần nhất
        const integerNumber = Math.round(Number(number)); 
        // 2. Định dạng số nguyên đã làm tròn (sẽ không còn dấu phẩy thập phân)
        return integerNumber.toLocaleString('vi-VN');
    };

    return (
        <div className="cart__item">
            <div className="cart__image"> 
                <img  src={item.info.thumbnail} alt={item.info.title} />
            </div>
            <div className="cart__content">
                <h3>{item.info.title}</h3>
                <div className="cart__price-new">
                    {formatCurrency((item.info.price * (1 - item.info.discount/100)) || item.info.price)}đ
                </div>
                <div className="cart__price-old">{formatCurrency(item.info.price)}đ</div>
            </div>
            <div className="cart__quantity">
                <button onClick={() => handleChangeQuantity(-1)}>-</button>
                <input
                    min={1}
                    value={quantity}
                    readOnly
                />
                <button onClick={() => handleChangeQuantity(1)}>+</button>
            </div>
            <button
                className="cart__delete-button"
                onClick={handleClick}
            >
                Xóa
            </button>
        </div>
    );
}

export default CartItem;
