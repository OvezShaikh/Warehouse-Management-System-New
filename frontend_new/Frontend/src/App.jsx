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
import { AuthProvider } from "./AuthContext";
import Home from "./components/bodyComponents/Home/Home";
import Inventory from "./components/bodyComponents/inventory/Inventory";
import Customer from "./components/bodyComponents/customer/Customer";
import Revenue from "./components/bodyComponents/revenue/Revenue";
import Growth from "./components/bodyComponents/growth/Growth";
// import Report from "./components/bodyComponents/report/Report";
import Login from "./components/Login";
import Register from "./components/Register";
import ProfilePage from "./components/ProfilePage";
import ContactSection from "./components/Contact";
import AboutUs from "./components/AboutUs";
import GRNComponent from "./components/bodyComponents/grn_component/GRNPage";
import QualityCheck from "./components/bodyComponents/Qualitycomponent/QualityCheckPage";
// import Careers from "./components/Carrers";
import AddDockLocation from "./components/bodyComponents/DockLoc/Doclocation";
import GRNReport from "./components/bodyComponents/grn_component/GRNReport";
import LocationManager from "./components/bodyComponents/PutawayLocations/Putawaylocation";
// import SettingsPage from "./components/bodyComponents/Settings/Setting";
// import InplantLogistics from "./components/bodyComponents/staticpages/InplantLogistics";
import Report2Component from "./components/bodyComponents/grn_component/Report2";
// import GRNForm from "./components/bodyComponents/grn_component/GRNForm";
import useFetchGrnData from "./hooks/useFetchGrnData";
import Returntosupplier from "./components/bodyComponents/Returntosupplier/Returntosupplier";
import MasterListUpload from "./components/bodyComponents/MasterList/MasterListUpload";

// ProtectedRoute Component
const ProtectedRoute = ({ token, userRole, allowedRoles, children }) => {
  if (!token && !userRole) {
    return <Navigate to="/login" replace />;
  }
  // console.log("allowedRoles:", allowedRoles);
  if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

function App() {
  // const [grnData, setGrnData] = useState([]);
  // const [loading, setLoading] = useState(true); // New state to handle loading
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");

  // useEffect(() => {
  //   if (token) {
  //   const fetchGrnData = async () => {
  //     try {
  //       const response = await fetch(`${import.meta.env.VITE_API_URL}/api/grn`);
  //       const result = await response.json();
  //       // console.log("Fetched GRN Data:", result);
  //       setGrnData(result.grns);
  //     } catch (error) {
  //       console.error("Error fetching GRN data:", error);
  //     }
  //     finally {
  //       setLoading(false); // Once the data is fetched, stop loading
  //     }
  //   };

  //   fetchGrnData();
  // } else {
  //   setLoading(false); // Stop loading if no token is found
  // }
  // }, [token]);

  const { grnData, setGrnData, loading, error } = useFetchGrnData(token);

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
        {/* <Route path="/grnform" element={<GRNForm />} /> */}
        {/* <Route path="/careers" element={<Careers />} /> */}
        {/* <Route path="/in-plant-logistics" element={<InplantLogistics />} /> */}

        {/* Protected Routes */}
        <Route
          path="/home"
          element={
            <ProtectedRoute token={token} userRole={userRole} allowedRoles={["user", "admin"]}>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/grn"
          element={
            <ProtectedRoute token={token} userRole={userRole} allowedRoles={["admin", "user"]}>
              <GRNComponent grnData={grnData} setGrnData={setGrnData} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/qualitycheck"
          element={
            <ProtectedRoute token={token} userRole={userRole} allowedRoles={["admin"]}>
              <QualityCheck grnData={grnData} setGrnData={setGrnData} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/inventory"
          element={
            <ProtectedRoute token={token} userRole={userRole} allowedRoles={["admin"]}>
              <Inventory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customers"
          element={
            <ProtectedRoute token={token} userRole={userRole} allowedRoles={["user", "admin"]}>
              <Customer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/revenue"
          element={
            <ProtectedRoute token={token} userRole={userRole} allowedRoles={["admin"]}>
              <Revenue />
            </ProtectedRoute>
          }
        />
        <Route
          path="/growth"
          element={
            <ProtectedRoute token={token} userRole={userRole} allowedRoles={["admin"]}>
              <Growth />
            </ProtectedRoute>
          }
        />
        <Route
          path="/report2"
          element={
            <ProtectedRoute token={token} userRole={userRole} allowedRoles={["user", "admin"]}>
              <Report2Component />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Returntosupplier"
          element={
            <ProtectedRoute token={token} userRole={userRole} allowedRoles={["user", "admin"]}>
              <Returntosupplier grnData={grnData} setGrnData={setGrnData} />
            </ProtectedRoute>
          }
        />
        {/* <Route
          path="/settings"
          element={
            <ProtectedRoute token={token} userRole={userRole} allowedRoles={["user", "admin"]}>
              <SettingsPage />
            </ProtectedRoute>
          }
        /> */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute token={token} userRole={userRole} allowedRoles={["user", "admin"]}>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dock-locations"
          element={
            <ProtectedRoute token={token} userRole={userRole} allowedRoles={["admin"]}>
              <AddDockLocation />
            </ProtectedRoute>
          }
        />
        <Route
          path="/grnreport"
          element={
            <ProtectedRoute token={token} userRole={userRole} allowedRoles={["admin"]}>
              <GRNReport />
            </ProtectedRoute>
          }
        />
        <Route
          path="/putaway-locations"
          element={
            <ProtectedRoute token={token} userRole={userRole} allowedRoles={["admin"]}>
              <LocationManager grnData={grnData} setGrnData={setGrnData} grnItems={grnData} />
            </ProtectedRoute>
          }
        /> 
        <Route
          path="/masterlistupload"
          element={
            <ProtectedRoute token={token} userRole={userRole} allowedRoles={["admin"]}>
              <MasterListUpload grnData={grnData} setGrnData={setGrnData} grnItems={grnData} />
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
