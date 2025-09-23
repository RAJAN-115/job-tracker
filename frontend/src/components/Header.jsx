// src/components/Header.jsx
import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Badge,
  Chip,
  useTheme,
  useMediaQuery,
  Tooltip,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  Card,
  CardContent,
  LinearProgress
} from '@mui/material';
import {
  Work as WorkIcon,
  Menu as MenuIcon,
  Brightness4,
  Brightness7,
  Notifications,
  Dashboard,
  Add,
  Analytics,
  Settings,
  Person,
  TrendingUp,
  CheckCircle,
  Schedule,
  Cancel
} from '@mui/icons-material';

const Header = ({ toggleTheme, isDarkMode, jobs = [] }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const [profileAnchor, setProfileAnchor] = useState(null);
  const [notifications, setNotifications] = useState([]);

  // Calculate live statistics from jobs
  const stats = React.useMemo(() => {
    const total = jobs.length;
    const applied = jobs.filter(job => job.status === 'applied').length;
    const interviewing = jobs.filter(job => job.status === 'interviewing').length;
    const offered = jobs.filter(job => job.status === 'offered').length;
    const rejected = jobs.filter(job => job.status === 'rejected').length;
    
    return { total, applied, interviewing, offered, rejected };
  }, [jobs]);

  // Simulate notifications (in a real app, these would come from an API)
  useEffect(() => {
    const generateNotifications = () => {
      const mockNotifications = [
        { id: 1, message: 'New job application deadline approaching', type: 'warning', time: '2 hours ago' },
        { id: 2, message: 'Interview scheduled for tomorrow', type: 'info', time: '1 day ago' },
        { id: 3, message: 'Application status updated', type: 'success', time: '2 days ago' }
      ];
      setNotifications(mockNotifications);
    };
    
    generateNotifications();
  }, []);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleNotificationClick = (event) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleProfileClick = (event) => {
    setProfileAnchor(event.currentTarget);
  };

  const handleClose = () => {
    setNotificationAnchor(null);
    setProfileAnchor(null);
  };

  const navigationItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/' },
    { text: 'Add Job', icon: <Add />, path: '/add' },
    { text: 'Analytics', icon: <Analytics />, path: '/analytics' },
    { text: 'Settings', icon: <Settings />, path: '/settings' }
  ];

  const StatCard = ({ label, value, color, icon }) => (
    <Card sx={{ minWidth: 120, bgcolor: `${color}.50`, borderLeft: `4px solid`, borderLeftColor: `${color}.main` }}>
      <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h6" color={`${color}.main`} fontWeight="bold">
              {value}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {label}
            </Typography>
          </Box>
          <Box color={`${color}.main`}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  const drawer = (
    <Box sx={{ width: 250 }}>
      <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
        <Typography variant="h6" fontWeight="bold">
          Job Tracker
        </Typography>
        <Typography variant="body2" opacity={0.8}>
          Manage your career journey
        </Typography>
      </Box>
      <List>
        {navigationItems.map((item) => (
          <ListItem button key={item.text}>
            <ListItemIcon sx={{ color: 'primary.main' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <Box sx={{ p: 2 }}>
        <Typography variant="subtitle2" gutterBottom color="text.secondary">
          Quick Stats
        </Typography>
        <Box display="flex" flexDirection="column" gap={1}>
          <StatCard 
            label="Total" 
            value={stats.total} 
            color="primary" 
            icon={<WorkIcon />}
          />
          <StatCard 
            label="Applied" 
            value={stats.applied} 
            color="info" 
            icon={<TrendingUp />}
          />
          <StatCard 
            label="Interviewing" 
            value={stats.interviewing} 
            color="warning" 
            icon={<Schedule />}
          />
        </Box>
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar position="sticky" elevation={2} sx={{ bgcolor: 'background.paper', color: 'text.primary' }}>
        <Toolbar sx={{ minHeight: { xs: 64, sm: 70 } }}>
          {/* Mobile Menu Button */}
          {isMobile && (
            <IconButton
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Logo and Title */}
          <Box display="flex" alignItems="center" sx={{ flexGrow: isMobile ? 1 : 0 }}>
            <WorkIcon sx={{ mr: 1.5, color: 'primary.main', fontSize: 32 }} />
            <Box>
              <Typography variant="h5" component="div" fontWeight="bold" color="primary.main">
                Job Tracker Pro
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' } }}>
                Your Career Management Dashboard
              </Typography>
            </Box>
          </Box>

          {/* Desktop Stats */}
          {!isMobile && (
            <Box display="flex" gap={2} sx={{ ml: 4, flexGrow: 1 }}>
              <Chip 
                label={`${stats.total} Total Jobs`} 
                color="primary" 
                variant="outlined" 
                size="small"
                icon={<WorkIcon />}
              />
              <Chip 
                label={`${stats.applied} Applied`} 
                color="info" 
                variant="outlined" 
                size="small"
                icon={<TrendingUp />}
              />
              <Chip 
                label={`${stats.interviewing} Interviewing`} 
                color="warning" 
                variant="outlined" 
                size="small"
                icon={<Schedule />}
              />
              <Chip 
                label={`${stats.offered} Offers`} 
                color="success" 
                variant="outlined" 
                size="small"
                icon={<CheckCircle />}
              />
            </Box>
          )}

          {/* Action Buttons */}
          <Box display="flex" alignItems="center" gap={1}>
            {/* Theme Toggle */}
            <Tooltip title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
              <IconButton onClick={toggleTheme} color="inherit">
                {isDarkMode ? <Brightness7 /> : <Brightness4 />}
              </IconButton>
            </Tooltip>

            {/* Notifications */}
            <Tooltip title="Notifications">
              <IconButton onClick={handleNotificationClick} color="inherit">
                <Badge badgeContent={notifications.length} color="error">
                  <Notifications />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* Profile Menu */}
            <Tooltip title="Profile">
              <IconButton onClick={handleProfileClick}>
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                  <Person />
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>

        {/* Progress bar for loading states */}
        <LinearProgress 
          sx={{ 
            height: 2, 
            '& .MuiLinearProgress-bar': {
              transition: 'transform 0.4s ease'
            }
          }} 
          variant="determinate" 
          value={100} 
        />
      </AppBar>

      {/* Mobile Navigation Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        sx={{
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 250,
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Notifications Menu */}
      <Menu
        anchorEl={notificationAnchor}
        open={Boolean(notificationAnchor)}
        onClose={handleClose}
        PaperProps={{
          sx: { width: 320, maxHeight: 400 }
        }}
      >
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6">Notifications</Typography>
        </Box>
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <MenuItem key={notification.id} onClick={handleClose}>
              <Box>
                <Typography variant="body2">{notification.message}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {notification.time}
                </Typography>
              </Box>
            </MenuItem>
          ))
        ) : (
          <MenuItem onClick={handleClose}>
            <Typography variant="body2" color="text.secondary">
              No new notifications
            </Typography>
          </MenuItem>
        )}
      </Menu>

      {/* Profile Menu */}
      <Menu
        anchorEl={profileAnchor}
        open={Boolean(profileAnchor)}
        onClose={handleClose}
        PaperProps={{
          sx: { width: 200 }
        }}
      >
        <MenuItem onClick={handleClose}>
          <ListItemIcon><Person /></ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon><Settings /></ListItemIcon>
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleClose}>
          <ListItemIcon><Analytics /></ListItemIcon>
          Analytics
        </MenuItem>
      </Menu>
    </>
  );
};

export default Header;
