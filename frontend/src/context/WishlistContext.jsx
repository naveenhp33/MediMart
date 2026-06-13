import { createContext, useState, useEffect, useContext } from "react";
import API from "../api/api";
import { AuthContext } from "./AuthContext";

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem("wishlist");
    return saved ? JSON.parse(saved) : [];
  });

  /* FETCH FROM BACKEND ON LOGIN */
  useEffect(() => {
    if (user) {
      API.get("/user/wishlist")
        .then((res) => {
          if (res.data && res.data.length > 0) {
            setWishlist(res.data);
          }
        })
        .catch((err) => console.error("Error fetching wishlist:", err));
    }
  }, [user]);

  /* SYNC TO BACKEND & LOCAL STORAGE */
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    if (user) {
      API.put("/user/wishlist", { wishlist })
        .catch((err) => console.error("Error syncing wishlist:", err));
    }
  }, [wishlist, user]);

  /* ADD */
  const addToWishlist = (product) => {
    const exists = wishlist.find((item) => item._id === product._id);
    if (!exists) {
      setWishlist([...wishlist, product]);
    }
  };

  /* REMOVE */
  const removeFromWishlist = (id) => {
    setWishlist(wishlist.filter((item) => item._id !== id));
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