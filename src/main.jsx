import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import App from "./App";

const savedTheme = localStorage.getItem("theme") || "light";
document.documentElement.dataset.theme = savedTheme;

const rootEl = document.getElementById("root");
const root = ReactDOM.createRoot(rootEl);

try {
  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
  // #region agent log
  fetch('http://127.0.0.1:7268/ingest/9f08fb21-85d1-4c0c-a422-2023756f2730',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'a440ae'},body:JSON.stringify({sessionId:'a440ae',location:'main.jsx:render',message:'root_render_called',data:{},timestamp:Date.now(),hypothesisId:'B',runId:'pre-fix'})}).catch(()=>{});
  // #endregion
} catch (err) {
  // #region agent log
  fetch('http://127.0.0.1:7268/ingest/9f08fb21-85d1-4c0c-a422-2023756f2730',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'a440ae'},body:JSON.stringify({sessionId:'a440ae',location:'main.jsx:render',message:'root_render_threw',data:{error:String(err&&err.message||err),stack:String(err&&err.stack||'').slice(0,500)},timestamp:Date.now(),hypothesisId:'B',runId:'pre-fix'})}).catch(()=>{});
  // #endregion
  throw err;
}