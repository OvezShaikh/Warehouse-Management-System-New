import React, { useState, useEffect } from "react";
import { Box, Grid, IconButton, Drawer, AppBar, Toolbar, useMediaQuery } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import SideBarComponent from "../../SideBarComponent";
import { 
  ReceiptOutlined, 
  InventoryOutlined, 
  LocalShippingOutlined, 
  CheckCircleOutline 
} from '@mui/icons-material';

// import UilReceipt from "@iconscout/react-unicons/uil-receipt";
// import UilBox from "@iconscout/react-unicons/uil-box";
// import UilTruck from "@iconscout/react-unicons/uil-truck";
// import UilCheckCircle from "@iconscout/react-unicons/uil-check-circle";

import InfoCard from "../../subComponents/InfoCard";
import TotalSales from "./TotalSales";
import SalesByCity from "./SalesByCity";
import Channels from "./Channels";
import TopSellingProduct from "./TopSellingProduct";
import axios from "axios";

const Home = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cardData, setCardData] = useState(null);
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const [grnData, setGrnData] = useState([]);

  // const cardComponent = [
  //   {
  //     icon: <InventoryOutlined sx={{ fontSize: 30  }} />,
  //     title: "Picked",
  //     subTitle: "1256",
  //     mx: 2,
  //     my: 0,
  //   },
  //   {
  //     icon: <LocalShippingOutlined sx={{ fontSize: 30  }} />,
  //     title: "Shipped",
  //     subTitle: "12",
  //     mx: 2,
  //     my: 0,
  //   },
  //   {
  //     icon: <CheckCircleOutline sx={{ fontSize: 30  }} />,
  //     title: "Delivered",
  //     subTitle: "15",
  //     mx: 3,
  //     my: 0,
  //   },
  //   {
  //     icon: <ReceiptOutlined sx={{ fontSize: 30  }} />,
  //     title: "Invoice",
  //     subTitle: "07",
  //     mx: 3,
  //     my: 0,
  //   },
  // ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/grn`);
        const grns = response.data.grns;
        setGrnData(response.data.grns);
        // Calculate metrics for cards
        const picked = grns.reduce((sum, grn) => {
          return sum + grn.items.filter((item) => item.status === "OK").length;
        }, 0);

        const shipped = grns.filter((grn) => grn.status === "Pending").length;

        const delivered = grns.reduce((sum, grn) => {
          return sum + grn.items.filter((item) => item.status === "OK").length;
        }, 0);

        const uniqueInvoices = new Set(
          grns.flatMap((grn) => grn.items.map((item) => item.invoiceNo))
        ).size;

        setCardData([
          { icon: <InventoryOutlined sx={{ fontSize: 30, mx:2, my:0 }} />, title: "Picked", subTitle: picked },
          { icon: <LocalShippingOutlined sx={{ fontSize: 30,mx:2, my:0 }} />, title: "Shipped", subTitle: shipped },
          { icon: <CheckCircleOutline sx={{ fontSize: 30,mx:2, my:0 }} />, title: "Delivered", subTitle: delivered },
          { icon: <ReceiptOutlined sx={{ fontSize: 30,mx:2, my:0 }} />, title: "Invoice", subTitle: uniqueInvoices },
        ]);
      } catch (error) {
        console.error("Error fetching GRNs:", error);
      }
    };

    fetchData();
  }, []);

  if (!cardData) {
    return <div className="text-slate-500 justify-center">Loading...</div>;
  }

  return (
    <Box sx={{ display: 'flex', margin: 0, padding: 8, height: '100vh' }}>
      {/* AppBar for smaller screens */}
      {isSmallScreen && (
        <AppBar position="fixed">
          <Toolbar sx={{height: '80px'}}>
            <IconButton edge="start" color="inherit" onClick={() => setDrawerOpen(true)}>
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
      )}

      {/* Drawer for the sidebar, only for small screens */}
      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 250 }}>
          <IconButton onClick={() => setDrawerOpen(false)}>
            <CloseIcon />
          </IconButton>
          <SideBarComponent />
        </Box>
      </Drawer>

      {/* Static Sidebar for larger screens */}
      {!isSmallScreen && (
        <Grid item md={2} sm={2} xs={1} sx={{ flexShrink: 0 }}>
          <SideBarComponent />
        </Grid>
      )}

      {/* Main Content */}
      <Grid item md={10} sm={9} xs={11}  sx={{ width: '100%' }}>
        <Grid
          container
          sx={{
            display: "flex",
            justifyContent: "space-evenly",
            // marginX: 4,
            borderRadius: 2,
            padding: 0,
          }}
        >
          {cardData.map((card, index) => (
            <Grid item md={2.6} key={index}  sx={{ marginY: 3,}}>
              <InfoCard card={card} />
            </Grid>
          ))}
        </Grid>

        <Grid container sx={{ margin: 3 }}>
          <Grid item md={6} xs={12} sx={{ marginY: 3 }}>
            <TotalSales data={{}} />
          </Grid>
          <Grid item md={6} xs={12} sx={{ marginY: 3 }}>
            <SalesByCity data={{}} />
          </Grid>
        </Grid>

        <Grid container sx={{ margin: 3 }}>
          <Grid item md={6} xs={12}>
            <Channels grnData={grnData} setGrnData={setGrnData} grnItems={grnData}/>
          </Grid>
          <Grid item md={6} xs={12}>
            <TopSellingProduct />
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home;
