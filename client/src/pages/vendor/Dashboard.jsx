import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Snackbar,
  Alert,
  Card,
  CardContent,
  Chip,
  IconButton,
  ImageList,
  ImageListItem,
  useTheme,
  useMediaQuery,
  Drawer,
  AppBar,
  Toolbar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  LinearProgress,
  Badge,
  Divider,
  Stack,
  Tooltip,
  CircularProgress,
  CardHeader,
  CardMedia,
  CardActions,
  Collapse,
  Rating,
  Fade,
  Zoom,
  Menu,
  ListItemButton,
  ListItemAvatar,
  AvatarGroup,
  ImageListItemBar,
  FormGroup,
  FormControlLabel,
  Switch,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CloudUpload as CloudUploadIcon,
  Delete as DeleteImageIcon,
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Inventory as InventoryIcon,
  ShoppingCart as CartIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AttachMoney as MoneyIcon,
  LocalShipping as ShippingIcon,
  Close as CloseIcon,
  Image as ImageIcon,
  Warning as WarningIcon,
  Logout as LogoutIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  MoreVert as MoreVertIcon,
  ArrowForward as ArrowForwardIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  PhotoCamera as PhotoCameraIcon,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { productAPI, orderAPI } from '../../services/api';
import { socketService } from '../../services/socket';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const drawerWidth = 280;
const collapsedDrawerWidth = 80;

function VendorDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    image: null,
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({
    totalOrders: 0,
    shippedOrders: 0,
    pendingOrders: 0,
    cancelledOrders: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    revenueChange: 0,
    lowStockItems: 0,
    topSellingProducts: [],
    recentOrders: [],
  });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDrawerCollapsed, setIsDrawerCollapsed] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [settings, setSettings] = useState({
    notifications: {
      newOrders: true,
      lowStock: true,
      priceUpdates: true,
      deliveryUpdates: true
    },
    delivery: {
      autoAssign: false,
      preferredCarriers: [],
      deliveryRadius: 10
    },
    store: {
      name: '',
      description: '',
      operatingHours: {
        monday: { open: '09:00', close: '18:00' },
        tuesday: { open: '09:00', close: '18:00' },
        wednesday: { open: '09:00', close: '18:00' },
        thursday: { open: '09:00', close: '18:00' },
        friday: { open: '09:00', close: '18:00' },
        saturday: { open: '09:00', close: '18:00' },
        sunday: { open: '09:00', close: '18:00' }
      }
    }
  });
  const [profileDialog, setProfileDialog] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    bio: '',
    profileImageUrl: '',
  });
  const [analyticsData, setAnalyticsData] = useState({
    salesData: [
      { name: 'Jan', sales: 4000 },
      { name: 'Feb', sales: 3000 },
      { name: 'Mar', sales: 5000 },
      { name: 'Apr', sales: 2780 },
      { name: 'May', sales: 1890 },
      { name: 'Jun', sales: 2390 },
    ],
    categoryData: [
      { name: 'Groceries', value: 400 },
      { name: 'Produce', value: 300 },
      { name: 'Dairy', value: 300 },
      { name: 'Meat', value: 200 },
    ],
    dailyOrders: [
      { name: 'Mon', orders: 4 },
      { name: 'Tue', orders: 3 },
      { name: 'Wed', orders: 5 },
      { name: 'Thu', orders: 2 },
      { name: 'Fri', orders: 6 },
      { name: 'Sat', orders: 8 },
      { name: 'Sun', orders: 7 },
    ]
  });

  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  useEffect(() => {
    loadProducts();
    fetchOrders();
    fetchDashboardStats();
    setupSocketListeners();
    
    // Set active tab based on current route
    const path = location.pathname.split('/').pop();
    setSelectedTab(path || 'dashboard');
    
    return () => {
      socketService.disconnect();
    };
  }, [location]);

  const setupSocketListeners = () => {
    socketService.connect();
    
    socketService.subscribe('newOrder', (order) => {
      setNotifications(prev => [{
        id: Date.now(),
        type: 'order',
        message: `New order #${order._id} received`,
        time: 'Just now',
        read: false
      }, ...prev]);
      fetchOrders();
      fetchDashboardStats();
    });

    socketService.subscribe('orderStatusChanged', (data) => {
      setNotifications(prev => [{
        id: Date.now(),
        type: 'delivery',
        message: `Order #${data.orderId} status updated to ${data.status}`,
        time: 'Just now',
        read: false
      }, ...prev]);
      fetchOrders();
      fetchDashboardStats();
    });

    socketService.subscribe('priceUpdate', (data) => {
      // Handle price updates
    });

    socketService.subscribe('stockUpdate', (data) => {
      // Handle stock updates
    });

    socketService.subscribe('newPromotion', (data) => {
      // Handle new promotions
    });
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getVendorProducts();
      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading products:', error);
      showSnackbar('Error loading products', 'error');
      setProducts([]);
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await orderAPI.getAllOrders();
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      showSnackbar('Error fetching orders', 'error');
    }
  };

  const fetchDashboardStats = async () => {
    try {
      // Calculate stats from orders and products
      const totalOrders = orders.length;
      const shippedOrders = orders.filter(order => order.status === 'shipped').length;
      const pendingOrders = orders.filter(order => order.status === 'pending').length;
      const cancelledOrders = orders.filter(order => order.status === 'cancelled').length;
      const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
      const lowStockItems = products.filter(product => product.stock < 10).length;

      setDashboardStats({
        totalOrders,
        shippedOrders,
        pendingOrders,
        cancelledOrders,
        totalRevenue,
        monthlyRevenue: totalRevenue * 0.3, // Example calculation
        revenueChange: 12, // Example value
        lowStockItems,
        topSellingProducts: products.slice(0, 5),
        recentOrders: orders.slice(0, 5)
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  const handleDrawerToggle = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleNavigation = (path) => {
    navigate(`/vendor/${path}`);
    setSelectedTab(path);
    if (isMobile) {
      setMobileOpen(false);
    }
    setDrawerOpen(false);
  };

  const handleOpenDialog = (product = null) => {
    if (product) {
      setSelectedProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        stock: product.stock,
        image: product.image,
      });
      setPreviewUrls(product.images || []);
    } else {
      setSelectedProduct(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        stock: '',
        image: null,
      });
      setPreviewUrls([]);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      stock: '',
      image: null,
    });
    setPreviewUrls([]);
    setImageFiles([]);
  };

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    setImageFiles(prev => [...prev, ...files]);
    
    // Create preview URLs
    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
  };

  const handleRemoveImage = (index) => {
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate required fields
      if (!formData.name || !formData.description || !formData.price || !formData.category || !formData.stock) {
        showSnackbar('Please fill in all required fields', 'error');
        return;
      }

      // Validate price and stock are positive numbers
      if (parseFloat(formData.price) <= 0 || parseInt(formData.stock) < 0) {
        showSnackbar('Price must be greater than 0 and stock must be non-negative', 'error');
        return;
      }

      // Create FormData object for multipart/form-data
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name.trim());
      formDataToSend.append('description', formData.description.trim());
      formDataToSend.append('price', parseFloat(formData.price));
      formDataToSend.append('category', formData.category.trim());
      formDataToSend.append('stock', parseInt(formData.stock));
      
      // Append each image file
      imageFiles.forEach((file, index) => {
        formDataToSend.append('images', file);
      });

      if (selectedProduct) {
        await productAPI.updateProduct(selectedProduct._id, formDataToSend);
        showSnackbar('Product updated successfully', 'success');
      } else {
        await productAPI.createProduct(formDataToSend);
        showSnackbar('Product added successfully', 'success');
      }

      handleCloseDialog();
      loadProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Error saving product';
      showSnackbar(errorMessage, 'error');
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productAPI.deleteProduct(productId);
        showSnackbar('Product deleted successfully', 'success');
        loadProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
        showSnackbar('Error deleting product', 'error');
      }
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <DashboardIcon color="primary" />,
      path: '/vendor/dashboard'
    },
    {
      id: 'products',
      label: 'Products',
      icon: <InventoryIcon color="primary" />,
      path: '/vendor/products'
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: <CartIcon color="primary" />,
      path: '/vendor/orders'
    },
    {
      id: 'delivery',
      label: 'Delivery',
      icon: <ShippingIcon color="primary" />,
      path: '/vendor/delivery'
    },
    {
      id: 'customers',
      label: 'Customers',
      icon: <PeopleIcon color="primary" />,
      path: '/vendor/customers'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: <TrendingUpIcon color="primary" />,
      path: '/vendor/analytics'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <SettingsIcon color="primary" />,
      path: '/vendor/settings'
    }
  ];

  const handleNotificationClick = (event) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  const handleNotificationRead = (notificationId) => {
    setNotifications(notifications.map(notification =>
      notification.id === notificationId
        ? { ...notification, read: true }
        : notification
    ));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value) => {
    return `${value >= 0 ? '+' : ''}${value}%`;
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(profileData).forEach(key => {
        formData.append(key, profileData[key]);
      });
      if (profileImage) {
        formData.append('profileImage', profileImage);
      }
      // Call your API to update profile
      showSnackbar('Profile updated successfully', 'success');
      setProfileDialog(false);
    } catch (error) {
      showSnackbar('Error updating profile', 'error');
    }
  };

  const handleProfileImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData(prev => ({
          ...prev,
          profileImageUrl: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const renderAnalytics = () => (
    <Box sx={{ 
      height: '100%',
      overflow: 'auto',
      pb: 3
    }}>
      <Grid container spacing={3}>
        {/* Sales Trend */}
        <Grid item xs={12} md={8}>
          <Card sx={{ 
            height: 'auto',
            minHeight: 400,
            borderRadius: 2, 
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Sales Trend</Typography>
              <Box sx={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <LineChart data={analyticsData.salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip />
                    <Legend />
                    <Line type="monotone" dataKey="sales" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Category Distribution */}
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            height: 'auto',
            minHeight: 400,
            borderRadius: 2, 
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Category Distribution</Typography>
              <Box sx={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={analyticsData.categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {analyticsData.categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Daily Orders */}
        <Grid item xs={12}>
          <Card sx={{ 
            height: 'auto',
            minHeight: 400,
            borderRadius: 2, 
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Daily Orders</Typography>
              <Box sx={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <BarChart data={analyticsData.dailyOrders}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip />
                    <Legend />
                    <Bar dataKey="orders" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  const renderFooter = () => (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        backgroundColor: '#1a1a1a',
        color: 'white',
        borderRadius: 2,
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        width: '100%'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }} gutterBottom>
              About Us
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Your trusted partner in online retail management. We help vendors grow their business with our comprehensive platform.
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
              Email: support@example.com
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Phone: +1 234 567 890
            </Typography>
          </Grid>
        </Grid>
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            © {new Date().getFullYear()} Your Company Name. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );

  const renderContent = () => {
    switch (selectedTab) {
      case 'dashboard':
        return (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {/* Hero Section */}
            <Box
              sx={{
                position: 'relative',
                height: '300px',
                mb: 4,
                borderRadius: 2,
                overflow: 'hidden',
                background: 'linear-gradient(45deg, #FF6B6B 30%, #4ECDC4 90%)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'url("/images/store-bg.jpg")',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  opacity: 0.2
                }}
              />
              <Box
                sx={{
                  position: 'relative',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: 'white',
                  textAlign: 'center',
                  p: 4
                }}
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
                    Welcome back, {user?.name || 'Vendor'}!
                  </Typography>
                </motion.div>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <Typography variant="h6">
                    Here's what's happening with your store today
                  </Typography>
                </motion.div>
              </Box>
            </Box>

            {/* Stats Cards Row 1 */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {[
                {
                  title: 'Total Orders',
                  value: dashboardStats.totalOrders,
                  icon: <CartIcon sx={{ fontSize: 40 }} />,
                  change: '+12%',
                  color: '#1b5e20',
                  image: '/images/orders-bg.jpg'
                },
                {
                  title: 'Shipped Orders',
                  value: dashboardStats.shippedOrders,
                  icon: <ShippingIcon sx={{ fontSize: 40 }} />,
                  change: '+8%',
                  color: '#1976d2',
                  image: '/images/shipping-bg.jpg'
                },
                {
                  title: 'Pending Orders',
                  value: dashboardStats.pendingOrders,
                  icon: <WarningIcon sx={{ fontSize: 40 }} />,
                  change: '-3%',
                  color: '#f57c00',
                  image: '/images/pending-bg.jpg'
                },
                {
                  title: 'Total Revenue',
                  value: formatCurrency(dashboardStats.totalRevenue),
                  icon: <MoneyIcon sx={{ fontSize: 40 }} />,
                  change: '+15%',
                  color: '#9c27b0',
                  image: '/images/revenue-bg.jpg'
                }
              ].map((stat, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <motion.div
                    variants={fadeInUp}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card sx={{ 
                      height: 200,
                      position: 'relative',
                      overflow: 'hidden',
                      borderRadius: 2,
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                    }}>
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: `url(${stat.image})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          opacity: 0.1
                        }}
                      />
                      <CardContent sx={{ 
                        position: 'relative',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Typography variant="h6" color="text.secondary">
                            {stat.title}
                          </Typography>
                          <Box sx={{ 
                            p: 1, 
                            borderRadius: 2,
                            bgcolor: `${stat.color}15`,
                            color: stat.color
                          }}>
                            {stat.icon}
                          </Box>
                        </Box>
                        <Box>
                          <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold' }}>
                            {stat.value}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {stat.change.startsWith('+') ? (
                              <TrendingUpIcon color="success" fontSize="small" />
                            ) : (
                              <TrendingDownIcon color="error" fontSize="small" />
                            )}
                            <Typography 
                              variant="body2" 
                              color={stat.change.startsWith('+') ? 'success.main' : 'error.main'}
                            >
                              {stat.change} from last month
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>

            {/* Recent Orders and Top Products */}
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <motion.div
                  variants={fadeInUp}
                  whileHover={{ scale: 1.01 }}
                >
                  <Card sx={{ 
                    borderRadius: 2,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                  }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="h6">Recent Orders</Typography>
                        <Button 
                          color="primary"
                          endIcon={<ArrowForwardIcon />}
                          onClick={() => handleNavigation('orders')}
                        >
                          View All
                        </Button>
                      </Box>
                      <TableContainer>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>Order ID</TableCell>
                              <TableCell>Customer</TableCell>
                              <TableCell>Amount</TableCell>
                              <TableCell>Status</TableCell>
                              <TableCell>Action</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {dashboardStats.recentOrders.map((order) => (
                              <motion.tr
                                key={order._id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3 }}
                              >
                                <TableCell>#{order._id}</TableCell>
                                <TableCell>{order.customer?.name || 'N/A'}</TableCell>
                                <TableCell>{formatCurrency(order.totalAmount)}</TableCell>
                                <TableCell>
                                  <Chip
                                    label={order.status}
                                    color={
                                      order.status === 'shipped' ? 'success' :
                                      order.status === 'pending' ? 'warning' :
                                      order.status === 'cancelled' ? 'error' :
                                      'default'
                                    }
                                    size="small"
                                  />
                                </TableCell>
                                <TableCell>
                                  <Button
                                    size="small"
                                    color="primary"
                                    onClick={() => handleNavigation(`orders/${order._id}`)}
                                  >
                                    View
                                  </Button>
                                </TableCell>
                              </motion.tr>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>

              <Grid item xs={12} md={4}>
                <motion.div
                  variants={fadeInUp}
                  whileHover={{ scale: 1.01 }}
                >
                  <Card sx={{ 
                    borderRadius: 2,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                  }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 2 }}>
                        Top Selling Products
                      </Typography>
                      <List>
                        {dashboardStats.topSellingProducts.map((product, index) => (
                          <motion.div
                            key={product._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <ListItem sx={{ 
                              px: 0,
                              py: 1.5,
                              '&:hover': {
                                bgcolor: 'action.hover',
                                borderRadius: 1
                              }
                            }}>
                              <ListItemIcon>
                                <Avatar
                                  src={product.image}
                                  variant="rounded"
                                  sx={{ 
                                    width: 50, 
                                    height: 50,
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                  }}
                                >
                                  <ImageIcon />
                                </Avatar>
                              </ListItemIcon>
                              <ListItemText
                                primary={product.name}
                                secondary={`${product.stock} units in stock`}
                              />
                              <Typography variant="body2" color="primary" sx={{ fontWeight: 'bold' }}>
                                {formatCurrency(product.price)}
                              </Typography>
                            </ListItem>
                          </motion.div>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            </Grid>
          </motion.div>
        );

      case 'products':
        return (
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Products</Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenDialog()}
                >
                  Add Product
                </Button>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Image</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>Stock</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product._id}>
                        <TableCell>
                          <Avatar
                            src={product.image}
                            variant="rounded"
                            sx={{ width: 50, height: 50 }}
                          >
                            <ImageIcon />
                          </Avatar>
                        </TableCell>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>{formatCurrency(product.price)}</TableCell>
                        <TableCell>
                          <Chip
                            label={product.stock}
                            color={product.stock < 10 ? 'error' : 'success'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleOpenDialog(product)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDelete(product._id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        );

      case 'delivery':
        return (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Delivery Management</Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom>Delivery Settings</Typography>
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={settings.delivery.autoAssign}
                              onChange={(e) => setSettings({
                                ...settings,
                                delivery: {
                                  ...settings.delivery,
                                  autoAssign: e.target.checked
                                }
                              })}
                            />
                          }
                          label="Auto-assign deliveries"
                        />
                      </FormGroup>
                      <TextField
                        fullWidth
                        label="Delivery Radius (km)"
                        type="number"
                        value={settings.delivery.deliveryRadius}
                        onChange={(e) => setSettings({
                          ...settings,
                          delivery: {
                            ...settings.delivery,
                            deliveryRadius: e.target.value
                          }
                        })}
                        sx={{ mt: 2 }}
                      />
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom>Active Deliveries</Typography>
                      <List>
                        {orders.filter(order => order.status === 'shipping').map((order) => (
                          <ListItem key={order._id}>
                            <ListItemText
                              primary={`Order #${order._id}`}
                              secondary={`Delivery to: ${order.shippingAddress}`}
                            />
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() => handleUpdateOrderStatus(order._id, 'delivered')}
                            >
                              Mark Delivered
                            </Button>
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        );

      case 'settings':
        return (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Store Settings</Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom>Store Information</Typography>
                      <TextField
                        fullWidth
                        label="Store Name"
                        value={settings.store.name}
                        onChange={(e) => setSettings({
                          ...settings,
                          store: {
                            ...settings.store,
                            name: e.target.value
                          }
                        })}
                        sx={{ mb: 2 }}
                      />
                      <TextField
                        fullWidth
                        label="Store Description"
                        multiline
                        rows={3}
                        value={settings.store.description}
                        onChange={(e) => setSettings({
                          ...settings,
                          store: {
                            ...settings.store,
                            description: e.target.value
                          }
                        })}
                      />
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom>Notification Settings</Typography>
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={settings.notifications.newOrders}
                              onChange={(e) => setSettings({
                                ...settings,
                                notifications: {
                                  ...settings.notifications,
                                  newOrders: e.target.checked
                                }
                              })}
                            />
                          }
                          label="New Orders"
                        />
                        <FormControlLabel
                          control={
                            <Switch
                              checked={settings.notifications.lowStock}
                              onChange={(e) => setSettings({
                                ...settings,
                                notifications: {
                                  ...settings.notifications,
                                  lowStock: e.target.checked
                                }
                              })}
                            />
                          }
                          label="Low Stock Alerts"
                        />
                        <FormControlLabel
                          control={
                            <Switch
                              checked={settings.notifications.priceUpdates}
                              onChange={(e) => setSettings({
                                ...settings,
                                notifications: {
                                  ...settings.notifications,
                                  priceUpdates: e.target.checked
                                }
                              })}
                            />
                          }
                          label="Price Updates"
                        />
                        <FormControlLabel
                          control={
                            <Switch
                              checked={settings.notifications.deliveryUpdates}
                              onChange={(e) => setSettings({
                                ...settings,
                                notifications: {
                                  ...settings.notifications,
                                  deliveryUpdates: e.target.checked
                                }
                              })}
                            />
                          }
                          label="Delivery Updates"
                        />
                      </FormGroup>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        );

      case 'analytics':
        return renderAnalytics();

      default:
        return null;
    }
  };

  const renderProductDialog = () => (
    <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
      <DialogTitle>
        {selectedProduct ? 'Edit Product' : 'Add New Product'}
      </DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Product Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Stock"
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              >
                <MenuItem value="groceries">Groceries</MenuItem>
                <MenuItem value="produce">Produce</MenuItem>
                <MenuItem value="dairy">Dairy</MenuItem>
                <MenuItem value="meat">Meat</MenuItem>
                <MenuItem value="seafood">Seafood</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>Product Images</Typography>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<CloudUploadIcon />}
                  fullWidth
                >
                  Upload Images
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                  />
                </Button>
              </Box>
              {previewUrls.length > 0 && (
                <ImageList sx={{ width: '100%', height: 200 }} cols={3} rowHeight={164}>
                  {previewUrls.map((url, index) => (
                    <ImageListItem key={index}>
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        loading="lazy"
                        style={{ height: '100%', objectFit: 'cover' }}
                      />
                      <ImageListItemBar
                        position="top"
                        actionIcon={
                          <IconButton
                            sx={{ color: 'white' }}
                            onClick={() => handleRemoveImage(index)}
                          >
                            <DeleteImageIcon />
                          </IconButton>
                        }
                      />
                    </ImageListItem>
                  ))}
                </ImageList>
              )}
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialog}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
        >
          {selectedProduct ? 'Update' : 'Add'} Product
        </Button>
      </DialogActions>
    </Dialog>
  );

  const drawer = (
    <Box sx={{ 
      overflow: 'auto',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      bgcolor: 'rgba(255, 255, 255, 0.95)',
      borderRight: '1px solid',
      borderColor: 'divider'
    }}>
      {/* User Profile Section */}
      <Box sx={{ 
        p: 2, 
        display: 'flex', 
        alignItems: 'center', 
        gap: 2,
        minHeight: 80,
        borderBottom: '1px solid',
        borderColor: 'divider',
        bgcolor: 'rgba(255, 255, 255, 0.95)'
      }}>
        <Avatar 
          src={user?.profileImage}
          sx={{ 
            width: isDrawerCollapsed ? 40 : 48, 
            height: isDrawerCollapsed ? 40 : 48, 
            bgcolor: 'primary.main',
            transition: 'all 0.2s',
            cursor: 'pointer',
            '&:hover': {
              opacity: 0.8
            }
          }}
          onClick={() => setProfileDialog(true)}
        />
        {!isDrawerCollapsed && (
          <Box sx={{ minWidth: 0 }}>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                fontWeight: 'bold', 
                color: 'text.primary',
                noWrap: true, 
                overflow: 'hidden', 
                textOverflow: 'ellipsis' 
              }}
            >
              {user?.name || 'Vendor'}
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'text.secondary',
                noWrap: true, 
                overflow: 'hidden', 
                textOverflow: 'ellipsis' 
              }}
            >
              {user?.email || 'vendor@example.com'}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Navigation Menu */}
      <List sx={{ 
        flexGrow: 1, 
        px: isDrawerCollapsed ? 1 : 2,
        bgcolor: 'rgba(255, 255, 255, 0.95)'
      }}>
        {menuItems.map((item) => (
          <ListItem key={item.id} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              selected={selectedTab === item.id}
              onClick={() => handleNavigation(item.id)}
              sx={{
                borderRadius: 2,
                py: 1.5,
                px: isDrawerCollapsed ? 1 : 2,
                '&.Mui-selected': {
                  bgcolor: 'primary.lighter',
                  '&:hover': {
                    bgcolor: 'primary.lighter',
                  },
                },
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              <ListItemIcon sx={{ 
                minWidth: isDrawerCollapsed ? 'auto' : 40,
                color: selectedTab === item.id ? 'primary.main' : 'inherit'
              }}>
                {item.icon}
              </ListItemIcon>
              {!isDrawerCollapsed && (
                <ListItemText 
                  primary={item.label} 
                  primaryTypographyProps={{
                    fontWeight: selectedTab === item.id ? 'bold' : 'normal',
                    color: 'text.primary'
                  }}
                />
              )}
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Logout Section */}
      <Box sx={{ 
        p: 2, 
        borderTop: '1px solid', 
        borderColor: 'divider',
        bgcolor: 'rgba(255, 255, 255, 0.95)'
      }}>
        <ListItemButton 
          onClick={handleLogout}
          sx={{
            borderRadius: 2,
            py: 1.5,
            px: isDrawerCollapsed ? 1 : 2,
            '&:hover': {
              bgcolor: 'error.lighter',
            },
          }}
        >
          <ListItemIcon sx={{ 
            minWidth: isDrawerCollapsed ? 'auto' : 40,
            color: 'error.main'
          }}>
            <LogoutIcon />
          </ListItemIcon>
          {!isDrawerCollapsed && (
            <ListItemText 
              primary="Logout" 
              primaryTypographyProps={{
                color: 'error.main',
                fontWeight: 'medium'
              }}
            />
          )}
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ 
      display: 'flex', 
      minHeight: '100vh',
      bgcolor: '#f5f5f5',
      overflow: 'hidden'
    }}>
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
            width: drawerWidth,
            background: 'linear-gradient(180deg, #FF6B6B 0%, #4ECDC4 100%)',
            color: 'white'
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
            background: 'linear-gradient(180deg, #FF6B6B 0%, #4ECDC4 100%)',
            color: 'white',
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
          overflow: 'auto',
          position: 'relative'
        }}
      >
        {/* Top Bar */}
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
                {menuItems.find(item => item.id === selectedTab)?.label || 'Dashboard'}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Tooltip title="Notifications">
                <IconButton onClick={handleNotificationClick}>
                  <Badge badgeContent={notifications.filter(n => !n.read).length} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
              <Tooltip title="Profile">
                <IconButton onClick={() => handleNavigation('profile')}>
                  <Avatar 
                    sx={{ 
                      bgcolor: theme.palette.primary.main,
                      width: 32,
                      height: 32,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                  >
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'V'}
                  </Avatar>
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </motion.div>

        {/* Notification Panel */}
        <Menu
          anchorEl={notificationAnchor}
          open={Boolean(notificationAnchor)}
          onClose={handleNotificationClose}
          PaperProps={{
            sx: {
              width: 360,
              maxHeight: 400,
              mt: 1.5
            }
          }}
        >
          <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Typography variant="h6">Notifications</Typography>
          </Box>
          <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <ListItemButton
                  key={notification.id}
                  onClick={() => handleNotificationRead(notification.id)}
                  sx={{
                    py: 1.5,
                    px: 2,
                    bgcolor: notification.read ? 'transparent' : 'action.hover',
                    '&:hover': {
                      bgcolor: 'action.selected'
                    }
                  }}
                >
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        bgcolor: notification.type === 'order' ? 'primary.main' :
                                notification.type === 'stock' ? 'warning.main' :
                                notification.type === 'delivery' ? 'success.main' :
                                'grey.500'
                      }}
                    >
                      {notification.type === 'order' ? <CartIcon /> :
                       notification.type === 'stock' ? <WarningIcon /> :
                       notification.type === 'delivery' ? <ShippingIcon /> :
                       <NotificationsIcon />}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={notification.message}
                    secondary={notification.time}
                    primaryTypographyProps={{
                      fontWeight: notification.read ? 'normal' : 'bold'
                    }}
                  />
                </ListItemButton>
              ))
            ) : (
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography color="text.secondary">No new notifications</Typography>
              </Box>
            )}
          </Box>
          <Divider />
          <Box sx={{ p: 1, textAlign: 'center' }}>
            <Button
              color="primary"
              onClick={() => {
                handleNotificationClose();
                handleNavigation('notifications');
              }}
            >
              View All Notifications
            </Button>
          </Box>
        </Menu>

        {/* Main Content Area */}
        <Box sx={{ 
          flexGrow: 1,
          mb: 3,
          width: '100%'
        }}>
          {renderContent()}
        </Box>

        {/* Product Dialog */}
        {renderProductDialog()}

        {/* Footer */}
        {renderFooter()}

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
}

export default VendorDashboard; 