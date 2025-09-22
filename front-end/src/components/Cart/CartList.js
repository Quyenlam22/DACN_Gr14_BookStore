import CartItem from "./CartItem";

function CartList(props) {
    const { data } = props;

    return (
        <>
            <div className="cart">
                {data.map(item => (
                    <CartItem item={item} key={item.info.id}/>
                ))}
            </div>
        </>
    )
}

export default CartList;