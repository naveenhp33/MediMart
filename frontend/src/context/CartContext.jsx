import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {

const [cart, setCart] = useState(() => {
const savedCart = localStorage.getItem("cart");
return savedCart ? JSON.parse(savedCart) : [];
});


/* SAVE CART TO LOCALSTORAGE */

useEffect(() => {
localStorage.setItem("cart", JSON.stringify(cart));
}, [cart]);


/* ADD TO CART */

const addToCart = (product) => {

const existing = cart.find(item => item._id === product._id);

if(existing){

setCart(
cart.map(item =>
item._id === product._id
? { ...item, qty: item.qty + 1 }
: item
)
);

}else{

setCart([...cart,{...product, qty:1}]);

}

};


/* REMOVE ITEM */

const removeFromCart = (id) => {
setCart(cart.filter(item => item._id !== id));
};


/* INCREASE */

const increaseQty = (id) => {

setCart(
cart.map(item =>
item._id === id
? { ...item, qty:item.qty + 1 }
: item
)
);

};


/* DECREASE */

const decreaseQty = (id) => {

setCart(
cart
.map(item =>
item._id === id
? { ...item, qty:item.qty - 1 }
: item
)
.filter(item => item.qty > 0)
);

};


/* CLEAR CART AFTER ORDER */

const clearCart = () => {
setCart([]);
localStorage.removeItem("cart");
};


return(

<CartContext.Provider
value={{
cart,
addToCart,
removeFromCart,
increaseQty,
decreaseQty,
clearCart
}}
>

{children}

</CartContext.Provider>

);

};