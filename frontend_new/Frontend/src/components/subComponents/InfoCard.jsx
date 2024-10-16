import { Card, Box, CardContent, Typography } from "@mui/material";
import { lighten } from '@mui/system';

export default function InfoCard({ card }) {
  const lightPrimary = lighten('#32aef1', 0.2);
  return (
    //do the routing here
    <>
      <Card elevation={6} sx={{ mx: card.mx, my: card.my, borderRadius: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center" }} pl={1}>
          <Box
            p={1}
            m={2}
            sx={{
              display: "flex",
              bgcolor: lightPrimary,
              borderRadius: 2,
              alignItems: "center",
            }}
          >
            {card.icon}
          </Box>
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "left",
              justifyContent: "center",
            }}
          >
            <Typography variant="h6" color="text.secondary" component="div">
              {card.title}
            </Typography>
            <Typography
              variant="h5"
              fontWeight={"bolder"}
              color="text.secondary"
              component="div"
            >
              {card.subTitle}
            </Typography>
          </CardContent>
        </Box>
      </Card>
    </>
  );
}
