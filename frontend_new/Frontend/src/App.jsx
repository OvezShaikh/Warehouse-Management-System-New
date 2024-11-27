import React, { useState, useEffect } from "react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Inter from "../public/static/fonts/static/Inter.ttf";
import { ThemeProvider, CssBaseline, createTheme } from "@mui/material";
import RootComponent from "./components/RootComponent";
import RootPage from "./components/RootPage";
import "../app.css";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from './AuthContext';
import Home from "./components/bodyComponents/Home/Home";
import Inventory from "./components/bodyComponents/inventory/Inventory";
import Customer from "./components/bodyComponents/customer/Customer";
import Revenue from "./components/bodyComponents/revenue/Revenue";
import Growth from "./components/bodyComponents/growth/Growth";
import Report from "./components/bodyComponents/report/Report";
import Login from "./components/Login";
import Register from "./components/Register";
import ProfilePage from "./components/ProfilePage";
import ContactSection from "./components/Contact";
import AboutUs from "./components/AboutUs";
import GRNComponent from "./components/bodyComponents/grn_component/GRNPage";
import QualityCheck from "./components/bodyComponents/Qualitycomponent/QualityCheckPage";
import Careers from "./components/Carrers";
import AddDockLocation from "./components/bodyComponents/DockLoc/Doclocation";
import GRNReport from "./components/bodyComponents/grn_component/GRNReport";
import LocationManager from "./components/bodyComponents/PutawayLocations/Putawaylocation";
import SettingsPage from "./components/bodyComponents/Settings/Setting";
import InplantLogistics from "./components/bodyComponents/staticpages/InplantLogistics";

// ProtectedRoute Component
const ProtectedRoute = ({ isAuthenticated, children }) => {
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  const [grnData, setGrnData] = useState([]);
  const isAuthenticated = !!localStorage.getItem("token"); // Example: check if the user is logged in

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
        {/* Public Routes */}
        <Route index element={<RootPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/contact-us" element={<ContactSection />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/in-plant-logistics" element={<InplantLogistics />} />

        {/* Protected Routes */}
        <Route
          path="/home"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/grn"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <GRNComponent grnData={grnData} setGrnData={setGrnData} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/qualitycheck"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <QualityCheck grnData={grnData} setGrnData={setGrnData} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/inventory"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Inventory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customers"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Customer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/revenue"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Revenue />
            </ProtectedRoute>
          }
        />
        <Route
          path="/growth"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Growth />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Report />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <SettingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dock-locations"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <AddDockLocation />
            </ProtectedRoute>
          }
        />
        <Route
          path="/grnreport"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <GRNReport />
            </ProtectedRoute>
          }
        />
        <Route
          path="/putaway-locations"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <LocationManager grnData={grnData} setGrnData={setGrnData} grnItems={grnData} />
            </ProtectedRoute>
          }
        />
        
      </Route>
    )
  );

  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RouterProvider router={router} />
        <ToastContainer />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
