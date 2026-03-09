import { useEffect, useState } from "react";
import API from "../api/api";
import "./orders.css";

function Orders() {

    const [orders, setOrders] = useState([]);

    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        fetchOrders();
    }, []);


    /* FETCH ORDERS */

    const fetchOrders = async () => {

        try {

            let res;

            if (user.role === "seller") {
                res = await API.get(`/seller/orders/${user._id}`);
            } else {
                res = await API.get("/orders");
            }

            setOrders(res.data);

        } catch (err) {
            console.log(err);
        }

    };


    /* UPDATE STATUS */

    const updateStatus = async (id, status) => {

        try {

            await API.put(`/orders/${id}/status`, { status });

            fetchOrders();

        } catch (err) {
            console.log(err);
        }

    };


    /* TRACKING PROGRESS */

    const getStep = (status) => {

        switch (status) {

            case "Pending":
                return 1;

            case "Processing":
                return 2;

            case "Shipped":
                return 3;

            case "Delivered":
                return 4;

            default:
                return 1;

        }

    };

    const getDeliveryDate = (order) => {

        const orderDate = new Date(order.createdAt);

        let deliveryDays = 3;

        if (order.status === "Shipped") {
            deliveryDays = 1;
        }

        if (order.status === "Delivered") {
            return `Delivered on ${orderDate.toLocaleDateString()}`;
        }

        const deliveryDate = new Date(orderDate);
        deliveryDate.setDate(orderDate.getDate() + deliveryDays);

        return `Estimated Delivery: ${deliveryDate.toDateString()}`;

    };


    return (

        <div className="orders-page">

            <h1>My Orders</h1>

            {orders.length === 0 && <p>No orders yet</p>}

            {orders.map(order => (

                <div key={order._id} className="order-card">

                    {/* HEADER */}

                    <div className="order-header">

                        <span className="order-id">
                            Order ID: {order._id.slice(-6)}
                        </span>

                        {user.role === "customer" ? (

                            <span className={`order-status ${order.status?.toLowerCase()}`}>
                                {order.status}
                            </span>

                        ) : (

                            <select
                                value={order.status}
                                onChange={(e) => updateStatus(order._id, e.target.value)}
                            >

                                <option value="Pending">Pending</option>
                                <option value="Processing">Processing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>

                            </select>

                        )}

                    </div>


                    {/* TRACKING BAR */}

                    <div className="order-tracker">
                        <p className="delivery-date">
                            {getDeliveryDate(order)}
                        </p>

                        <div className={`step ${getStep(order.status) >= 1 ? "active" : ""}`}>
                            <span>Ordered</span>
                        </div>

                        <div className={`step ${getStep(order.status) >= 2 ? "active" : ""}`}>
                            <span>Processing</span>
                        </div>

                        <div className={`step ${getStep(order.status) >= 3 ? "active" : ""}`}>
                            <span>Shipped</span>
                        </div>

                        <div className={`step ${getStep(order.status) >= 4 ? "active" : ""}`}>
                            <span>Delivered</span>
                        </div>

                    </div>


                    {/* ORDER ITEMS */}

                    <div className="order-items">

                        {order.items.map((item, index) => (

                            <div key={index} className="order-item">

                                <img
                                    src={item.image || item.imageUrl || "/placeholder.png"}
                                    alt={item.name}
                                    className="order-img"
                                />

                                <div className="order-item-info">

                                    <h4>{item.name}</h4>
                                    <p>Qty: {item.qty}</p>

                                </div>

                                <p className="order-price">₹{item.price}</p>

                            </div>

                        ))}

                    </div>


                    {/* TOTAL */}

                    <div className="order-total">

                        Total: ₹{order.total}

                    </div>

                </div>

            ))}

        </div>

    );

}

export default Orders;