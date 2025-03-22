import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CustomerList from "./pages/customerList"; // Import CustomerList
import AddCustomer from "./pages/addCustomer.js";
import EditCustomer from "./pages/editCustomer.js";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CustomerList />} />
        <Route path="/addCustomer" element={<AddCustomer />} />
        <Route path="/editCustomer/:id" element={<EditCustomer />} />
      </Routes>
    </Router>
  );
}
