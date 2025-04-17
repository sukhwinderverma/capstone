import React from "react";
import { 
  Box, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia,
  Container,
  Stack
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const jobs = [
  {
    title: "Software Engineer",
    description: "Develop and maintain software applications. Join a dynamic team working with the latest technologies.",
    image: "https://images.unsplash.com/photo-1551033406-611cf9a28f67?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
  },
  {
    title: "Data Scientist",
    description: "Analyze complex data sets and extract actionable insights to help business growth.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
  },
  {
    title: "Product Manager",
    description: "Oversee product development from concept to launch. Work with cross-functional teams.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1815&q=80",
  },
  {
    title: "UX/UI Designer",
    description: "Create engaging user interfaces and experiences for web and mobile apps.",
    image: "https://images.unsplash.com/photo-1541462608143-67571c6738dd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
  },
];

export default function Home() {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('user'); 

  return (
    <Box sx={{ backgroundColor: "#f8fafc" }}>
      <Box
        sx={{
          position: 'relative',
          height: { xs: '60vh', md: '80vh' },
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5))',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          color: 'white',
          mb: 6,
          backgroundImage: 'url("https://images.unsplash.com/photo-1521791055366-0d553872125f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80")',
        }}
      >
        <Box sx={{ zIndex: 1, px: 3 }}>
          <Typography 
            variant="h2" 
            component="h1" 
            sx={{ 
              fontWeight: 'bold', 
              mb: 3,
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              color: 'black' 
            }}
          >
            Find Your Dream Job Today
          </Typography>
          <Typography 
            variant="h5" 
            component="p" 
            sx={{ 
              mb: 4,
              fontSize: { xs: '1.2rem', md: '1.5rem' },
              color: 'black' 
            }}
          >
            Join thousands of professionals who found their perfect match
          </Typography>
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={2} 
            justifyContent="center"
          >
            {!isLoggedIn && (
              <Button 
                variant="contained" 
                size="large" 
                sx={{ 
                  bgcolor: '#0277bd',
                  '&:hover': { bgcolor: '#01579b' },
                  px: 4,
                  py: 1.5
                }}
                onClick={() => navigate('/signup')}
              >
                Get Started
              </Button>
            )}
            {isLoggedIn && (
              <Button 
                variant="contained" 
                size="large" 
                sx={{ 
                  bgcolor: '#0277bd',
                  '&:hover': { bgcolor: '#01579b' },
                  px: 4,
                  py: 1.5
                }}
                onClick={() => navigate('/job-seeker-dashboard')}
              >
                Go to Dashboard
              </Button>
            )}
          </Stack>
        </Box>
      </Box>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography 
          variant="h3" 
          component="h2" 
          sx={{ 
            fontWeight: 'bold', 
            textAlign: 'center', 
            mb: 6,
            color: 'text.primary'
          }}
        >
          Featured Jobs
        </Typography>
        
        <Grid container spacing={4}>
          {jobs.map((job, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 6
                  }
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={job.image}
                  alt={job.title}
                  sx={{
                    objectFit: 'cover',
                  }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography 
                    gutterBottom 
                    variant="h5" 
                    component="h3"
                    sx={{ fontWeight: 'bold' }}
                  >
                    {job.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {job.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {isLoggedIn && (
          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Button 
              variant="outlined" 
              size="large"
              sx={{ 
                color: '#0277bd',
                borderColor: '#0277bd',
                '&:hover': { 
                  bgcolor: '#0277bd',
                  color: 'white'
                },
                px: 6,
                py: 1.5
              }}
              onClick={() => navigate('/job-listings')}
            >
              View All Jobs
            </Button>
          </Box>
        )}
      </Container>

      <Box sx={{ bgcolor: '#0277bd', color: 'white', py: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={6} sm={3} textAlign="center">
              <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                10K+
              </Typography>
              <Typography variant="h6">
                Jobs Available
              </Typography>
            </Grid>
            <Grid item xs={6} sm={3} textAlign="center">
              <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                5K+
              </Typography>
              <Typography variant="h6">
                Companies Hiring
              </Typography>
            </Grid>
            <Grid item xs={6} sm={3} textAlign="center">
              <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                50K+
              </Typography>
              <Typography variant="h6">
                Successful Hires
              </Typography>
            </Grid>
            <Grid item xs={6} sm={3} textAlign="center">
              <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                100+
              </Typography>
              <Typography variant="h6">
                Career Resources
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
