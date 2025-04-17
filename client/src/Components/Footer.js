import React from "react";
import { Box, Typography, Grid, IconButton } from "@mui/material";
import { Facebook, Twitter, LinkedIn, Email, Phone } from "@mui/icons-material";

export default function Footer() {
  return (
    <Box
      sx={{
        backgroundColor: "#01579b",
        color: "white",
        padding: { xs: "20px", md: "40px" },
        marginTop: "auto",
        boxShadow: "0 -4px 10px rgba(0, 0, 0, 0.2)"
      }}
    >
      <Grid container spacing={4} justifyContent="space-around">
        <Grid item xs={12} sm={5} md={4}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
            Job Portal
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Connecting talented professionals with top companies worldwide.
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <IconButton color="inherit" aria-label="Facebook">
              <Facebook />
            </IconButton>
            <IconButton color="inherit" aria-label="Twitter">
              <Twitter />
            </IconButton>
            <IconButton color="inherit" aria-label="LinkedIn">
              <LinkedIn />
            </IconButton>
          </Box>
        </Grid>

        <Grid item xs={12} sm={5} md={4}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
            Contact Us
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <Email fontSize="small" />
            <Typography variant="body2">support@jobportal.com</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <Phone fontSize="small" />
            <Typography variant="body2">+1 (555) 123-4567</Typography>
          </Box>
          <Typography variant="body2">
            123 Business Ave, Suite 100<br />
            New York, NY 10001
          </Typography>
        </Grid>
      </Grid>

      <Box sx={{ borderTop: "1px solid rgba(255,255,255,0.1)", mt: 4, pt: 3 }}>
        <Typography variant="body2" align="center">
          &copy; {new Date().getFullYear()} Job Portal. All rights reserved.
        </Typography>
        <Typography variant="body2" align="center" sx={{ mt: 1 }}>
          Helping professionals find their dream jobs since 2023
        </Typography>
      </Box>
    </Box>
  );
}