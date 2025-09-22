import { useDispatch } from "react-redux";
import CartList from "../../../components/Cart/CartList";
import "./Cart.scss";
import {Link, useNavigate} from "react-router-dom";
import { Button, ConfigProvider } from "antd";
import { createStyles } from 'antd-style';
import { useEffect, useState } from 'react';
import { delCart, getCart } from "../../../services/cartService";
import Cookies from "js-cookie";
import { getBookById } from "../../../services/bookService";
import { deleteAllItem, setCart } from "../../../actions/cart";

const useStyle = createStyles(({ prefixCls, css }) => ({
  linearGradientButton: css`
    &.${prefixCls}-btn-primary:not([disabled]):not(.${prefixCls}-btn-dangerous) {
      position: relative;
      overflow: hidden;
      border: none;
      border-radius: 8px;
      font-weight: bold;
      font-size: 24px;
      padding: 30px 50px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      transition: all 0.3s;

      > span {
        position: relative;
        z-index: 1;
      }

      &::before {
        content: '';
        background: linear-gradient(135deg, #43cea2, #185a9d);
        position: absolute;
        inset: 0;
        z-index: 0;
        transition: all 0.3s;
        border-radius: inherit;
      }

      &:hover::before {
        opacity: 0.85;
        filter: brightness(1.1);
      }

      &:active {
        transform: scale(0.97);
      }
    }
  `,
}));

function Cart() {
    const { styles } = useStyle();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // const location = useLocation();

    const [data, setData] = useState([]);
        
    useEffect(() => {
        const fetchCart = async () => {
            const cartId = Cookies.get("cart");
            const cartData = await getCart(cartId);
            
            if (cartData) {
                const newData = await Promise.all(
                    cartData.cartItems.map(async (item) => {
                        const bookInfo = await getBookById(item.bookId);
                        return {
                            id: item.bookId,
                            info: bookInfo,
                            quantity: item.quantity
                        };
                    })
                );

                const options = newData.map((itemCart) => {
                    return {
                        id: itemCart.id,
                        quantity: itemCart.quantity
                    }
                })      
                
                setData(newData);

                dispatch(setCart(options));
            }   
            
        };
        fetchCart();
    }, [dispatch]);

    const cartId = Cookies.get("cart");

    const total = data.reduce((sum, item) => {
        const priceNew = ((item.info.price*(1 - (item.info.discount/100 || 0))));
        return sum + priceNew*item.quantity;        
    }, 0)

    const handleClick = async () => {
        if(cartId){
            await delCart(cartId);
            Cookies.remove("cart");
            setData([]);
        }
        dispatch(deleteAllItem());
    }

    console.log(data);
    

    return (
        <>
            <div className="cart__title">
                <h2>Giỏ hàng</h2>
                <button 
                    className="cart__delete-button" 
                    onClick={() => handleClick()}
                >
                    Xóa tất cả
                </button>
            </div>

            <div>
                {data.length > 0 ? (
                    <>
                        <CartList data={data}/>
                        <div className="cart__total">
                            Tổng tiền: <span>{total.toFixed(2)}đ</span>
                        </div>
                        <ConfigProvider
                            button={{
                                className: styles.linearGradientButton,
                            }}
                        >
                            <div className="cart__order">
                                <Button type="primary" size="large" onClick={() => {
                                    navigate("/orders")
                                }}>
                                    Đặt hàng
                                </Button>
                            </div>
                        </ConfigProvider>
                        
                    </>
                ) : (
                    <>
                        <div className="cart__empty">
                            Giỏ hàng trống
                        </div>
                            <Button size="large">
                                <Link to="/">Quay lại trang chủ</Link>
                            </Button>
                    </>
                )}
            </div>
        </>
    )
}

export default Cart;