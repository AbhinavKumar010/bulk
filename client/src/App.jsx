import { 
  BrowserRouter as Router, 
  Routes, 
  Route,
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements
} from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Pages
import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import CustomerDashboard from './pages/customer/Dashboard';
import VendorDashboard from './pages/vendor/Dashboard';
import DeliveryDashboard from './pages/delivery/Dashboard';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';

// Theme configuration
const theme = createTheme({
  palette: {
    primary: {
      main: '#FF0000', // Red color scheme
      light: '#FF3333',
      dark: '#CC0000',
    },
    secondary: {
      main: '#333333',
      light: '#666666',
      dark: '#000000',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
  },
});

// Create router with future flags
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route 
        path="/customer" 
        element={
          <ProtectedRoute requiredRole="customer">
            <CustomerDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/customer/*" 
        element={
          <ProtectedRoute requiredRole="customer">
            <CustomerDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/vendor/*" 
        element={
          <ProtectedRoute requiredRole="vendor">
            <VendorDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/delivery/*" 
        element={
          <ProtectedRoute requiredRole="delivery">
            <DeliveryDashboard />
          </ProtectedRoute>
        } 
      />
      <Route path="*" element={<NotFound />} />
    </Route>
  ),
  {
    future: {
      v7_startTransition: true
    }
  }
);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
      <ToastContainer position="top-right" autoClose={3000} />
    </ThemeProvider>
  );
}

export default App;
