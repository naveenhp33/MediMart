import { createContext, useState } from "react";

export const ToastContext = createContext();

export const ToastProvider = ({ children }) => {

const [toast,setToast] = useState("");

const showToast = (message) => {

setToast(message);

setTimeout(()=>{
setToast("");
},3000);

};

return(

<ToastContext.Provider value={{showToast}}>

{children}

{toast && (
<div className="toast-box">
{toast}
</div>
)}

</ToastContext.Provider>

);

};