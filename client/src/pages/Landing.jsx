import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  Paper,
  Stack,
} from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import InventoryIcon from '@mui/icons-material/Inventory';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import StorefrontIcon from '@mui/icons-material/Storefront';

const Landing = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const features = [
    {
      title: 'For Restaurants',
      description: 'Streamline your supply chain with bulk food delivery and inventory management.',
      icon: <RestaurantIcon sx={{ fontSize: { xs: 30, sm: 40 } }} />,
      action: () => navigate('/register?role=restaurant')
    },
    {
      title: 'For Suppliers',
      description: 'Connect with restaurants and expand your distribution network.',
      icon: <StorefrontIcon sx={{ fontSize: { xs: 30, sm: 40 } }} />,
      action: () => navigate('/register?role=supplier')
    },
    {
      title: 'For Delivery Partners',
      description: 'Join our specialized B2B delivery network for bulk food transportation.',
      icon: <LocalShippingIcon sx={{ fontSize: { xs: 30, sm: 40 } }} />,
      action: () => navigate('/register?role=delivery')
    }
  ];

  const benefits = [
    {
      title: 'Bulk Delivery Solutions',
      description: 'Specialized logistics for large-scale food supply and delivery.',
      icon: <InventoryIcon sx={{ fontSize: { xs: 30, sm: 40 } }} />
    },
    {
      title: 'Quality Assurance',
      description: 'Temperature-controlled delivery and quality monitoring systems.',
      icon: <SecurityIcon sx={{ fontSize: { xs: 30, sm: 40 } }} />
    },
    {
      title: 'Inventory Management',
      description: 'Real-time tracking and automated reordering systems.',
      icon: <RestaurantMenuIcon sx={{ fontSize: { xs: 30, sm: 40 } }} />
    }
  ];

  return (
    <Box sx={{ overflow: 'hidden' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
            animation: 'pulse 4s infinite',
          },
          '@keyframes pulse': {
            '0%': { transform: 'scale(1)' },
            '50%': { transform: 'scale(1.1)' },
            '100%': { transform: 'scale(1)' },
          }
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              minHeight: { xs: '70vh', md: '90vh' },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              position: 'relative',
              zIndex: 1,
              py: { xs: 4, md: 0 },
            }}
          >
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2rem', sm: '3rem', md: '4rem' },
                fontWeight: 900,
                mb: { xs: 1, md: 2 },
                background: 'linear-gradient(45deg, #fff 30%, #ffcdd2 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textAlign: 'center',
              }}
            >
              ZIPLY
            </Typography>
            <Typography
              variant="h4"
              sx={{
                mb: { xs: 2, md: 4 },
                textAlign: 'center',
                opacity: 0.9,
                fontSize: { xs: '1.2rem', sm: '1.5rem', md: '2rem' },
              }}
            >
              B2B Food Supply & Delivery Platform
            </Typography>
            <Typography
              variant="h6"
              sx={{
                mb: { xs: 2, md: 4 },
                textAlign: 'center',
                opacity: 0.8,
                maxWidth: '800px',
                mx: 'auto',
                px: { xs: 2, md: 0 },
                fontSize: { xs: '0.9rem', sm: '1rem' },
              }}
            >
              Connecting restaurants with suppliers through efficient bulk delivery solutions
            </Typography>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              justifyContent="center"
              sx={{ mt: { xs: 2, md: 4 } }}
            >
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/login')}
                sx={{
                  backgroundColor: 'white',
                  color: '#d32f2f',
                  px: { xs: 3, md: 4 },
                  py: { xs: 1, md: 1.5 },
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Get Started
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/register')}
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  px: { xs: 3, md: 4 },
                  py: { xs: 1, md: 1.5 },
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Learn More
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
        <Typography
          variant="h3"
          align="center"
          sx={{ 
            mb: { xs: 3, md: 6 }, 
            fontWeight: 700, 
            color: '#d32f2f',
            fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' }
          }}
        >
          Business Solutions
        </Typography>
        <Grid container spacing={{ xs: 2, md: 4 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 24px rgba(211,47,47,0.1)',
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: { xs: 2, md: 4 } }}>
                  <Box
                    sx={{
                      color: '#d32f2f',
                      mb: 2,
                      display: 'inline-block',
                      p: 2,
                      borderRadius: '50%',
                      backgroundColor: 'rgba(211,47,47,0.1)',
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography 
                    variant="h5" 
                    component="h2" 
                    gutterBottom 
                    sx={{ 
                      fontWeight: 600,
                      fontSize: { xs: '1.2rem', sm: '1.5rem' }
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography 
                    sx={{ 
                      mb: 3, 
                      color: 'text.secondary',
                      fontSize: { xs: '0.9rem', sm: '1rem' }
                    }}
                  >
                    {feature.description}
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={feature.action}
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      backgroundColor: '#d32f2f',
                      '&:hover': {
                        backgroundColor: '#b71c1c',
                      },
                    }}
                  >
                    Join Now
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Benefits Section */}
      <Box sx={{ backgroundColor: '#fafafa', py: { xs: 4, md: 8 } }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            align="center"
            sx={{ 
              mb: { xs: 3, md: 6 }, 
              fontWeight: 700, 
              color: '#d32f2f',
              fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' }
            }}
          >
            Why Choose ZIPLY?
          </Typography>
          <Grid container spacing={{ xs: 2, md: 4 }}>
            {benefits.map((benefit, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 2, md: 4 },
                    height: '100%',
                    textAlign: 'center',
                    backgroundColor: 'transparent',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.02)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      color: '#d32f2f',
                      mb: 2,
                      display: 'inline-block',
                      p: 2,
                      borderRadius: '50%',
                      backgroundColor: 'rgba(211,47,47,0.1)',
                    }}
                  >
                    {benefit.icon}
                  </Box>
                  <Typography 
                    variant="h5" 
                    component="h3" 
                    gutterBottom 
                    sx={{ 
                      fontWeight: 600,
                      fontSize: { xs: '1.2rem', sm: '1.5rem' }
                    }}
                  >
                    {benefit.title}
                  </Typography>
                  <Typography 
                    color="text.secondary"
                    sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
                  >
                    {benefit.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%)',
          color: 'white',
          py: { xs: 4, md: 8 },
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center' }}>
            <Typography 
              variant="h3" 
              gutterBottom 
              sx={{ 
                fontWeight: 700,
                fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' }
              }}
            >
              Ready to Transform Your Business?
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                mb: { xs: 2, md: 4 }, 
                opacity: 0.9,
                fontSize: { xs: '1rem', sm: '1.2rem' }
              }}
            >
              Join the leading B2B food supply and delivery network
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/register')}
              sx={{
                backgroundColor: 'white',
                color: '#d32f2f',
                px: { xs: 4, md: 6 },
                py: { xs: 1.5, md: 2 },
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Get Started
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Landing; 