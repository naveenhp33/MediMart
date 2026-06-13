import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Cart from "./pages/Cart";
import ProductDetail from "./pages/ProductDetail";
import Order from "./pages/Order";
import Success from "./pages/Success";
import Auth from "./pages/auth";
import Profile from "./pages/Profile"
import Navbar from "./components/Navbar";
import Wishlist from "./pages/Wishlist";
import Invoice from "./pages/Invoice"; // Added import for Invoice
import { ToastProvider } from "./context/ToastContext";

import SellerDashboard from "./seller/SellerDashboard";
import AddProduct from "./seller/AddProduct";
import SellerProducts from "./seller/SellerProducts";
import SellerOrders from "./seller/SellerOrders";

import AdminDashboard from "./admin/AdminDashboard";
import AdminProducts from "./admin/AdminProducts";
import AdminOrders from "./admin/AdminOrders";
import AdminUsers from "./admin/AdminUsers";

import { AuthProvider } from "./context/AuthContext";
import AdminRoute from "./routes/AdminRoute";
import UserRoute from "./routes/UserRoute";
import SellerRoute from "./routes/SellerRoute";
import Orders from "./pages/Orders";
import { WishlistProvider } from "./context/WishlistContext";
import { CartProvider } from "./context/CartContext";

function App(){

return(

<AuthProvider>
  <CartProvider>
<WishlistProvider>
    <ToastProvider>
<BrowserRouter>

<Navbar />

<Routes>

<Route path="/" element={<Home/>} />
<Route path="/cart" element={<Cart/>} />
<Route path="/product/:id" element={<ProductDetail/>} />
<Route path="/profile" element={<Profile/>}/>
<Route path="/wishlist" element={<Wishlist/>}/>
<Route path="/order" element={<UserRoute><Order/></UserRoute>} />
<Route path="/success" element={<Success/>} />
<Route path="/orders" element={<UserRoute><Orders/></UserRoute>} />
<Route path="/auth" element={<Auth/>} />
<Route path="/invoice/:id" element={<Invoice/>} />

<Route path="/seller" element={<SellerRoute><SellerDashboard/></SellerRoute>}/>
<Route path="/seller/orders" element={<SellerRoute><SellerOrders/></SellerRoute>}/>
<Route path="/seller/add-product" element={<SellerRoute><AddProduct/></SellerRoute>}/>
<Route path="/seller/products" element={<SellerRoute><SellerProducts/></SellerRoute>}/>

{/* Admin protected routes */}

<Route
path="/admin"
element={
<AdminRoute>
<AdminDashboard/>
</AdminRoute>
}
/>

<Route
path="/admin/products"
element={
<AdminRoute>
<AdminProducts/>
</AdminRoute>
}
/>

<Route
path="/admin/orders"
element={
<AdminRoute>
<AdminOrders/>
</AdminRoute>
}
/>

<Route
path="/admin/users"
element={
<AdminRoute>
<AdminUsers/>
</AdminRoute>
}
/>

</Routes>

</BrowserRouter>
</ToastProvider>
</WishlistProvider>
  </CartProvider>
</AuthProvider>

)

}

export default App;