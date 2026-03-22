import { Link } from "react-router-dom";
import "./success.css";

function Success(){

return(

<div className="success-page">

<h1> Order Placed Successfully!</h1>

<p>Your medicines will be delivered soon.</p>

<Link to="/">
<button>Continue Shopping</button>
</Link>

<Link to="/orders">
<button className="view-orders">
View My Orders
</button>
</Link>

</div>

)

}

export default Success;