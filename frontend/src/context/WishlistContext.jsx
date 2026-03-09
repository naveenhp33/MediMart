import { createContext, useState, useEffect } from "react";

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {

const [wishlist,setWishlist] = useState(() => {
const saved = localStorage.getItem("wishlist");
return saved ? JSON.parse(saved) : [];
});


/* SAVE TO LOCAL STORAGE */

useEffect(()=>{
localStorage.setItem("wishlist",JSON.stringify(wishlist));
},[wishlist]);


/* ADD */

const addToWishlist = (product)=>{

const exists = wishlist.find(item=>item._id === product._id);

if(!exists){
setWishlist([...wishlist,product]);
}

};


/* REMOVE */

const removeFromWishlist = (id)=>{
setWishlist(wishlist.filter(item=>item._id !== id));
};


return(

<WishlistContext.Provider
value={{
wishlist,
addToWishlist,
removeFromWishlist
}}
>

{children}

</WishlistContext.Provider>

);

};