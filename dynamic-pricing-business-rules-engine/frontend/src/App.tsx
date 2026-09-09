import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminLayout from "./layouts/AdminLayout";
import Categories from "./pages/Categories";
import Products from "./pages/Products";
import Customers from "./pages/Customers";
import PricingRules from "./pages/PricingRules";
import Promotions from "./pages/Promotions";
import PricingCalculator from "./pages/PricingCalculator";
import PricingHistory from "./pages/PricingHistory";
import RuleTesting from "./pages/RuleTesting";



function App() {

  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/login"
          element={<Login />}
        />


        <Route element={<ProtectedRoute />}>

          <Route element={<AdminLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/categories" element={<Categories />} />
            <Route
              path="/customers"
              element={<Customers />}
            />
            <Route
              path="/pricing-rules"
              element={<PricingRules />}
            />
            <Route
              path="/promotions"
              element={<Promotions />}
            />
          </Route>

        </Route>


        <Route
          path="/"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />


        <Route
          path="*"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />
        <Route
          path="/pricing-calculator"
          element={<PricingCalculator />}
        />

        <Route
          path="/pricing-history"
          element={<PricingHistory />}
        />
        <Route
          path="/rule-testing"
          element={<RuleTesting />}
        />

      </Routes>

    </BrowserRouter>
  );
}


export default App;
