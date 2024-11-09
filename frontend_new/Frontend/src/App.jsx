import React, { useState, useEffect } from "react"; // Import useState and useEffect
import Inter from "../public/static/fonts/static/Inter.ttf";
import { ThemeProvider, CssBaseline, createTheme, Box } from "@mui/material";
import RootComponent from "./components/RootComponent";
import RootPage from "./components/RootPage";
import "../app.css";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import { AuthProvider } from './AuthContext';
import Home from "./components/bodyComponents/home/Home";
import Inventory from "./components/bodyComponents/inventory/Inventory";
import Customer from "./components/bodyComponents/customer/Customer";
import Revenue from "./components/bodyComponents/revenue/Revenue";
import Growth from "./components/bodyComponents/growth/Growth";
import Report from "./components/bodyComponents/report/Report";
import Setting from "./components/bodyComponents/Settings/Setting";
import Order from "./components/bodyComponents/order/Order";
import OrderModal from "./components/bodyComponents/order/OrderModal";
import Login from "./components/Login";
import Register from "./components/Register";
import ProfilePage from "./components/ProfilePage";
import ContactSection from "./components/Contact";
import AboutUs from "./components/AboutUs";
import GRNComponent from "./components/bodyComponents/grn_component/GRNPage";
import QualityCheck from "./components/bodyComponents/Qualitycomponent/QualityCheckPage";
import Careers from "./components/Carrers";
import AddDockLocation from "./components/bodyComponents/DockLoc/Doclocation";
import { ToastContainer } from 'react-toastify'; // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import ToastContainer CSS

function App() {
  const [grnData, setGrnData] = useState([]);
  const [loading, setLoading] = useState(true);  // Loading state
  const [error, setError] = useState(null);      // Error state

  useEffect(() => {
    const fetchGrnData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/grn`);
        const result = await response.json();
        console.log("Fetched GRN Data:", result);
        setGrnData(result.grns); // Pass the 'grns' array to your component
      } catch (error) {
        console.error("Error fetching GRN data:", error);
      }
    };
  
    fetchGrnData();
  }, []);

  const theme = createTheme({
    spacing: 4,
    palette: {
      mode: "light",
    },
    typography: {
      fontFamily: "Roboto, Inter, Arial, sans-serif",
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: `
          @font-face {
            font-family: 'Inter';
            font-style: normal;
            font-display: swap;
            font-weight: 300;
            src: local('Raleway'), local('Raleway-Regular'), url(${Inter}) format('truetype');
            unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
          }
        `,
      },
    },
  });

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootComponent />}>
        <Route index element={<RootPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/grn" element={<GRNComponent grnData={grnData} setGrnData={setGrnData} />} />
        <Route path="/qualitycheck" element={<QualityCheck grnData={grnData} setGrnData={setGrnData} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/orders" element={<Order />} />
        <Route path="/customers" element={<Customer />} />
        <Route path="/revenue" element={<Revenue />} />
        <Route path="/growth" element={<Growth />} />
        <Route path="/reports" element={<Report />} />
        <Route path="/settings" element={<Setting />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/contact-us" element={<ContactSection />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/dock-locations" element={<AddDockLocation />} />
      </Route>
    )
  );

  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RouterProvider router={router} />
        <ToastContainer /> {/* Place ToastContainer here */}
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
