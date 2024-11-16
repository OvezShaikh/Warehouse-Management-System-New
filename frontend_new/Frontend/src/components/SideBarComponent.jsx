import React, { useState } from "react";
import "../../public/styles/links.css";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Box,
} from "@mui/material";
import {
  HomeOutlined,
  Inventory2Outlined,
  SettingsOutlined,
  DescriptionOutlined,
  MonetizationOnOutlined,
  CardTravelOutlined,
  TrendingUpOutlined,
  PeopleAltOutlined,
  ThumbUpOffAltOutlined,
  AddLocationAltOutlined,
  LocationOnOutlined,
} from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";

const SideBarComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPage = location.pathname;

  const sideBarComponent = [
    { title: "Home", component: <HomeOutlined fontSize="medium" color="primary" /> },
    { title: "Inventory", component: <Inventory2Outlined fontSize="medium" color="primary" /> },
    { title: "Dock-Locations", component: <AddLocationAltOutlined fontSize="medium" color="primary" /> },
    { title: "Putaway-locations", component: <LocationOnOutlined fontSize="medium" color="primary" /> },
    { title: "GRN", component: <DescriptionOutlined fontSize="medium" color="primary" /> },
    { title: "QualityCheck", component: <ThumbUpOffAltOutlined fontSize="medium" color="primary" /> },
    { title: "GrnReport", component: <DescriptionOutlined fontSize="medium" color="primary" /> },
    { title: "Orders", component: <CardTravelOutlined fontSize="medium" color="primary" /> },
    { title: "Customers", component: <PeopleAltOutlined fontSize="medium" color="primary" /> },
    { title: "Revenue", component: <MonetizationOnOutlined fontSize="medium" color="primary" /> },
    { title: "Growth", component: <TrendingUpOutlined fontSize="medium" color="primary" /> },
    // { title: "Reports", component: <DescriptionOutlined fontSize="medium" color="primary" /> },
    { title: "Settings", component: <SettingsOutlined fontSize="medium" color="primary" /> },
    
    



    // Add the GRN entry here
     // You can change the icon as needed
  ];

  const [selected, setSelected] = useState(currentPage);

  const handleNavigation = (title) => {
    const path = `/${title.toLowerCase()}`;
    if (currentPage !== path) {
      setSelected(path);
      navigate(path);
    }
  };

  return (
    <List>
      {sideBarComponent.map((comp, index) => (
        <ListItem disablePadding dense key={index}>
          <Box width="100%">
            <ListItemButton
              onClick={() => handleNavigation(comp.title)}
              selected={currentPage === `/${comp.title.toLowerCase()}`}
              sx={{ mb: 3, borderLeft: 0, borderColor: "primary.main", ml: 1 }}
            >
              <ListItemIcon>
                <Box>{comp.component}</Box>
              </ListItemIcon>
              <ListItemText
                primary={comp.title}
                primaryTypographyProps={{
                  fontSize: "medium",
                  fontWeight: currentPage === `/${comp.title.toLowerCase()}` ? "bold" : "normal",
                  color: currentPage === `/${comp.title.toLowerCase()}` ? "primary.main" : "inherit",
                }}
              />
            </ListItemButton>
          </Box>
        </ListItem>
      ))}
    </List>
  );
};

export default SideBarComponent;
