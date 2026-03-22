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
import UserRoute from "./routes/UserRoute"; // Added import for UserRoute
import Orders from "./pages/Orders";
import { WishlistProvider } from "./context/WishlistContext";

function App(){

return(

<AuthProvider>
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
<Route path="/order" element={<Order/>} />
<Route path="/success" element={<Success/>} />
<Route path="/orders" element={<Orders/>}/>
<Route path="/invoice/:id" element={<UserRoute><Invoice/></UserRoute>} /> {/* Added Invoice route with UserRoute protection */}
<Route path="/auth" element={<Auth/>} />

{/* Seller routes */}

<Route path="/seller" element={<SellerDashboard/>}/>
<Route path="/seller/orders" element={<SellerOrders/>}/>
<Route path="/seller/add-product" element={<AddProduct/>}/>
<Route path="/seller/products" element={<SellerProducts/>}/>

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
</AuthProvider>

)

}

export default App;