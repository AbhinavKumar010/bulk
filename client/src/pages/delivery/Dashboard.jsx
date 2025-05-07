import { useState, useEffect } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  Container,
  Avatar,
  Menu,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  ListItemButton,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  LocalShipping as DeliveryIcon,
  History as HistoryIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  LocationOn as LocationIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  DirectionsBike as BikeIcon,
  Map as MapIcon,
  Edit as EditIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const drawerWidth = 280;

const DeliveryDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTab, setSelectedTab] = useState('dashboard');
  const [profileDialog, setProfileDialog] = useState(false);
  const [settingsDialog, setSettingsDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [profileData, setProfileData] = useState({
    name: 'Delivery Boy',
    email: 'delivery@ziply.com',
    phone: '+1234567890',
    address: '123 Delivery St',
    vehicleNumber: 'DL-1234'
  });
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    autoAccept: false,
    deliveryRadius: 10
  });

  useEffect(() => {
    // Set active tab based on current route, default to dashboard if no path
    const path = location.pathname.split('/').pop();
    setSelectedTab(path || 'dashboard');
    
    // If we're at the root delivery path, ensure we show the dashboard
    if (location.pathname === '/delivery' || location.pathname === '/delivery/') {
      setSelectedTab('dashboard');
    }
  }, [location]);

  const handleDrawerToggle = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    navigate('/login');
  };

  const handleNavigation = (path) => {
    navigate(`/delivery/${path}`);
    setSelectedTab(path);
    if (isMobile) {
      setIsDrawerOpen(false);
    }
  };

  const handleProfileUpdate = () => {
    // TODO: Implement profile update logic
    setSnackbar({
      open: true,
      message: 'Profile updated successfully',
      severity: 'success'
    });
    setProfileDialog(false);
  };

  const handleSettingsUpdate = () => {
    // TODO: Implement settings update logic
    setSnackbar({
      open: true,
      message: 'Settings updated successfully',
      severity: 'success'
    });
    setSettingsDialog(false);
  };

  const handleNavigateToDelivery = (address) => {
    // Open Google Maps with the delivery address
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: 'dashboard' },
    { text: 'Active Deliveries', icon: <DeliveryIcon />, path: 'active' },
    { text: 'Delivery History', icon: <HistoryIcon />, path: 'history' },
    { text: 'Profile', icon: <PersonIcon />, path: 'profile' },
    { text: 'Settings', icon: <SettingsIcon />, path: 'settings' }
  ];

  // Mock data for active deliveries
  const activeDeliveries = [
    {
      id: 1,
      orderNumber: 'ORD-001',
      customer: 'Mahendra',
      address: '123 Main St, City',
      status: 'Picked Up',
      time: '10 mins ago',
      image: '/images/delivery-boy-1.jpg'
    },
    {
      id: 2,
      orderNumber: 'ORD-002',
      customer: 'Vishnu',
      address: '456 Oak Ave, Town',
      status: 'On the way',
      time: '5 mins ago',
      image: '/images/delivery-boy-2.jpg'
    }
  ];

  const stats = [
    { title: 'Today\'s Deliveries', value: '8', color: 'primary.main', icon: <DeliveryIcon /> },
    { title: 'Completed', value: '6', color: 'success.main', icon: <CheckCircleIcon /> },
    { title: 'In Progress', value: '2', color: 'warning.main', icon: <PendingIcon /> },
    { title: 'Earnings', value: '₹450', color: 'info.main', icon: <BikeIcon /> }
  ];

  const drawer = (
    <Box sx={{ 
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      bgcolor: 'background.paper',
      borderRight: '1px solid',
      borderColor: 'divider'
    }}>
      {/* Logo and Brand Section */}
      <Box sx={{ 
        p: 2, 
        display: 'flex', 
        alignItems: 'center', 
        gap: 2,
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}>
        <BikeIcon sx={{ fontSize: 40, color: 'primary.main' }} />
        <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
          ZIPLY Delivery
        </Typography>
      </Box>

      {/* Navigation Menu */}
      <List sx={{ flexGrow: 1, px: 2 }}>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.text}
            onClick={() => handleNavigation(item.path)}
            sx={{
              borderRadius: 2,
              mb: 1,
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
          >
            <ListItemIcon sx={{ color: 'primary.main' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>

      {/* Logout Section */}
      <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
        <ListItemButton 
          onClick={handleLogout}
          sx={{
            borderRadius: 2,
            '&:hover': {
              bgcolor: 'error.lighter',
            },
          }}
        >
          <ListItemIcon sx={{ color: 'error.main' }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </Box>
    </Box>
  );

  const renderFooter = () => (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: '#1a1a1a',
        color: 'white',
        borderRadius: 2,
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }} gutterBottom>
              About ZIPLY
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Your trusted delivery partner. We ensure fast and reliable delivery services across the city.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }} gutterBottom>
              Quick Links
            </Typography>
            <List dense sx={{ color: 'white' }}>
              <ListItem>
                <ListItemText 
                  primary="Help Center" 
                  primaryTypographyProps={{ color: 'rgba(255, 255, 255, 0.7)' }}
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Terms of Service" 
                  primaryTypographyProps={{ color: 'rgba(255, 255, 255, 0.7)' }}
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Privacy Policy" 
                  primaryTypographyProps={{ color: 'rgba(255, 255, 255, 0.7)' }}
                />
              </ListItem>
            </List>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }} gutterBottom>
              Contact Us
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Email: support@ziply.com
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Phone: +1 234 567 890
            </Typography>
          </Grid>
        </Grid>
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            © {new Date().getFullYear()} ZIPLY Delivery. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );

  const renderProfileDialog = () => (
    <Dialog open={profileDialog} onClose={() => setProfileDialog(false)} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Profile</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                value={profileData.address}
                onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Vehicle Number"
                value={profileData.vehicleNumber}
                onChange={(e) => setProfileData({ ...profileData, vehicleNumber: e.target.value })}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setProfileDialog(false)}>Cancel</Button>
        <Button onClick={handleProfileUpdate} variant="contained" startIcon={<SaveIcon />}>
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );

  const renderSettingsDialog = () => (
    <Dialog open={settingsDialog} onClose={() => setSettingsDialog(false)} maxWidth="sm" fullWidth>
      <DialogTitle>Settings</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="number"
                label="Delivery Radius (km)"
                value={settings.deliveryRadius}
                onChange={(e) => setSettings({ ...settings, deliveryRadius: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => setSettings({ ...settings, notifications: !settings.notifications })}
              >
                {settings.notifications ? 'Disable' : 'Enable'} Notifications
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => setSettings({ ...settings, autoAccept: !settings.autoAccept })}
              >
                {settings.autoAccept ? 'Disable' : 'Enable'} Auto-Accept Deliveries
              </Button>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setSettingsDialog(false)}>Cancel</Button>
        <Button onClick={handleSettingsUpdate} variant="contained" startIcon={<SaveIcon />}>
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={isDrawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: drawerWidth 
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="persistent"
        open={isDrawerOpen}
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: drawerWidth,
            transition: 'transform 0.3s ease-in-out',
            transform: isDrawerOpen ? 'translateX(0)' : 'translateX(-100%)'
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${isDrawerOpen ? drawerWidth : 0}px)` },
          display: 'flex',
          flexDirection: 'column',
          transition: theme => theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          ml: { sm: isDrawerOpen ? `${drawerWidth}px` : 0 },
          overflow: 'auto'
        }}
      >
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 3,
            p: 2,
            bgcolor: 'white',
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton
                color="inherit"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ 
                  '&:hover': {
                    backgroundColor: 'rgba(0,0,0,0.04)'
                  }
                }}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Delivery Dashboard
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton
                onClick={handleProfileMenuOpen}
                size="small"
              >
                <Avatar 
                  sx={{ 
                    width: 32, 
                    height: 32,
                    bgcolor: 'primary.main'
                  }}
                >
                  D
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleProfileMenuClose}
              >
                <MenuItem onClick={() => navigate('/delivery/profile')}>
                  <ListItemIcon>
                    <PersonIcon fontSize="small" />
                  </ListItemIcon>
                  Profile
                </MenuItem>
                <MenuItem onClick={() => navigate('/delivery/settings')}>
                  <ListItemIcon>
                    <SettingsIcon fontSize="small" />
                  </ListItemIcon>
                  Settings
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          </Box>
        </motion.div>

        {/* Main Content Area */}
        <Box sx={{ flexGrow: 1, mb: 3 }}>
          <Container maxWidth="lg">
            {selectedTab === 'dashboard' && (
              <>
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  {stats.map((stat, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card sx={{ 
                          height: '100%',
                          borderRadius: 2,
                          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                        }}>
                          <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                              <Box sx={{ 
                                p: 1, 
                                borderRadius: 2,
                                bgcolor: `${stat.color}15`,
                                color: stat.color,
                                mr: 2
                              }}>
                                {stat.icon}
                              </Box>
                              <Typography color="textSecondary">
                                {stat.title}
                              </Typography>
                            </Box>
                            <Typography variant="h4" component="div" sx={{ color: stat.color }}>
                              {stat.value}
                            </Typography>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>

                <Typography variant="h5" sx={{ mb: 2 }}>
                  Active Deliveries
                </Typography>

                <Grid container spacing={2}>
                  {activeDeliveries.map((delivery, index) => (
                    <Grid item xs={12} key={delivery.id}>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card sx={{ 
                          borderRadius: 2,
                          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                        }}>
                          <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar
                                  src={delivery.image}
                                  sx={{ width: 50, height: 50 }}
                                />
                                <Box>
                                  <Typography variant="h6">
                                    {delivery.orderNumber}
                                  </Typography>
                                  <Typography color="textSecondary">
                                    {delivery.customer}
                                  </Typography>
                                </Box>
                              </Box>
                              <Chip
                                label={delivery.status}
                                color={delivery.status === 'Picked Up' ? 'success' : 'warning'}
                                icon={delivery.status === 'Picked Up' ? <CheckCircleIcon /> : <PendingIcon />}
                              />
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                              <LocationIcon sx={{ mr: 1, color: 'text.secondary' }} />
                              <Typography color="textSecondary">
                                {delivery.address}
                              </Typography>
                            </Box>
                            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                              {delivery.time}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                onClick={() => handleNavigation(`delivery/${delivery.id}`)}
                              >
                                View Details
                              </Button>
                              <Button
                                variant="outlined"
                                color="primary"
                                fullWidth
                                startIcon={<MapIcon />}
                                onClick={() => handleNavigateToDelivery(delivery.address)}
                              >
                                Navigate
                              </Button>
                            </Box>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>
              </>
            )}

            {selectedTab === 'profile' && (
              <Card sx={{ p: 3 }}>
                <Typography variant="h5" sx={{ mb: 3 }}>Profile</Typography>
                <Button
                  variant="contained"
                  startIcon={<EditIcon />}
                  onClick={() => setProfileDialog(true)}
                >
                  Edit Profile
                </Button>
              </Card>
            )}

            {selectedTab === 'settings' && (
              <Card sx={{ p: 3 }}>
                <Typography variant="h5" sx={{ mb: 3 }}>Settings</Typography>
                <Button
                  variant="contained"
                  startIcon={<EditIcon />}
                  onClick={() => setSettingsDialog(true)}
                >
                  Edit Settings
                </Button>
              </Card>
            )}
          </Container>
        </Box>

        {/* Footer */}
        {renderFooter()}

        {/* Dialogs */}
        {renderProfileDialog()}
        {renderSettingsDialog()}

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default DeliveryDashboard; 