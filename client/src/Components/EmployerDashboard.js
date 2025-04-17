import React from 'react';
import { Box, Typography, Button, Grid, Paper } from '@mui/material';
import { Link } from 'react-router-dom';

export default function EmployerDashboard() {
  return (
    <Box sx={{ padding: '20px', backgroundColor: '#f1f1f1', minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', marginBottom: '20px', color: '#0277bd', textAlign: 'center' }}>
        Employer Dashboard
      </Typography>
      <Typography variant="body1" sx={{ marginBottom: '30px', color: '#555', textAlign: 'center' }}>
        Welcome to your employer dashboard. You can manage job listings, view applications, and hire candidates.
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Paper sx={{ padding: '20px', textAlign: 'center', boxShadow: 3, borderRadius: '10px', backgroundColor: '#fff', position: 'relative' }}>
            <img
              src="https://gray-wdbj-prod.gtv-cdn.com/resizer/v2/SGMRQXBASJPS7OATE2UOTHRGQA.png?auth=f5b84d3ac285293a396f62d37075b0378a02c9e4f3275da1eef667865078f05f&width=800&height=450&smart=true"
              alt="Create Job Listing"
              style={{ width: '100%', height: '250px', objectFit: 'cover', borderRadius: '10px' }}
            />
            <Typography variant="h6" sx={{ marginTop: '10px', fontWeight: 'bold', color: '#0277bd' }}>
              Create Job Listing
            </Typography>
            <Typography variant="body2" sx={{ marginBottom: '15px', color: '#555' }}>
              Post job openings to attract the right candidates. Start building your team today.
            </Typography>
            <Link to="/create-job" style={{ textDecoration: 'none' }}>
              <Button variant="contained" color="primary" sx={{ borderRadius: '20px', padding: '10px 20px', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)' }}>
                Create Job
              </Button>
            </Link>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Paper sx={{ padding: '20px', textAlign: 'center', boxShadow: 3, borderRadius: '10px', backgroundColor: '#fff', position: 'relative' }}>
            <img
              src="https://logo.com/image-cdn/images/kts928pd/production/eb99c395622e064d41666948cf486103ed4eb1f3-731x731.jpg?w=1080&q=72&fm=webp"
              alt="View Applications"
              style={{ width: '100%', height: '250px', objectFit: 'cover', borderRadius: '10px' }}
            />
            <Typography variant="h6" sx={{ marginTop: '10px', fontWeight: 'bold', color: '#0277bd' }}>
              View Applications
            </Typography>
            <Typography variant="body2" sx={{ marginBottom: '15px', color: '#555' }}>
              Review applications from candidates and manage your recruitment process.
            </Typography>
            <Button variant="contained" color="primary" href="/view-applications" sx={{ borderRadius: '20px', padding: '10px 20px', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)' }}>
              View Applications
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Paper sx={{ padding: '20px', textAlign: 'center', boxShadow: 3, borderRadius: '10px', backgroundColor: '#fff', position: 'relative' }}>
            <img
              src="https://cdn-icons-png.freepik.com/256/9101/9101945.png?semt=ais_hybrid"
              alt="Manage Profile"
              style={{ width: '100%', height: '250px', objectFit: 'contain', borderRadius: '10px' }}
            />
            <Typography variant="h6" sx={{ marginTop: '10px', fontWeight: 'bold', color: '#0277bd' }}>
              Manage Profile
            </Typography>
            <Typography variant="body2" sx={{ marginBottom: '15px', color: '#555' }}>
              Keep your company profile up to date to attract the best candidates and showcase your business.
            </Typography>
            <Button variant="contained" color="primary" href="/manage-employer-profile" sx={{ borderRadius: '20px', padding: '10px 20px', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)' }}>
              Manage Profile
            </Button>
          </Paper>
        </Grid>
      </Grid>

      
    </Box>
  );
}
