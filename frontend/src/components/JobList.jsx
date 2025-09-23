// src/components/JobList.jsx
import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Tooltip,
  Box,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ToggleButton,
  ToggleButtonGroup,
  Grid,
  Card,
  CardContent,
  Typography,
  Drawer,
  Button,
  useTheme,
  useMediaQuery,
  TableSortLabel,
  Collapse,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
  FilterList as FilterListIcon,
  Sort as SortIcon
} from '@mui/icons-material';

const getStatusColor = (status) => {
  switch (status) {
    case 'Applied': return 'primary';
    case 'Interview': return 'info';
    case 'Offer': return 'success';
    case 'Rejected': return 'error';
    case 'Pending': return 'warning';
    default: return 'default';
  }
};

const JobList = ({ jobs, onEdit, onDelete }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [viewMode, setViewMode] = useState(isMobile ? 'card' : 'table');
  const [sortBy, setSortBy] = useState('applicationDate');
  const [sortOrder, setSortOrder] = useState('desc');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Available statuses for filtering
  const statuses = ['All', 'Applied', 'Interview', 'Offer', 'Rejected', 'Pending'];

  // Filtered and sorted jobs
  const filteredAndSortedJobs = useMemo(() => {
    let filtered = jobs.filter(job => {
      const matchesSearch = 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || job.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    // Sort jobs
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === 'applicationDate') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      } else if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [jobs, searchTerm, statusFilter, sortBy, sortOrder]);

  const handleSortChange = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Filter Controls Component
  const FilterControls = ({ mobile = false }) => (
    <Box sx={{ 
      p: mobile ? 2 : 0, 
      display: 'flex', 
      flexDirection: mobile ? 'column' : 'row',
      gap: 2,
      alignItems: mobile ? 'stretch' : 'center'
    }}>
      <TextField
        placeholder="Search jobs or companies..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        sx={{ flex: mobile ? undefined : 1, minWidth: 250 }}
        size="small"
      />
      
      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>Status</InputLabel>
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          label="Status"
        >
          {statuses.map(status => (
            <MenuItem key={status} value={status}>
              {status}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>Sort By</InputLabel>
        <Select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          label="Sort By"
        >
          <MenuItem value="title">Job Title</MenuItem>
          <MenuItem value="company">Company</MenuItem>
          <MenuItem value="status">Status</MenuItem>
          <MenuItem value="applicationDate">Date Applied</MenuItem>
        </Select>
      </FormControl>

      <ToggleButtonGroup
        value={sortOrder}
        exclusive
        onChange={(e, value) => value && setSortOrder(value)}
        size="small"
      >
        <ToggleButton value="asc">↑</ToggleButton>
        <ToggleButton value="desc">↓</ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );

  // Table View Component
  const TableView = () => (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
            <TableCell>
              <TableSortLabel
                active={sortBy === 'title'}
                direction={sortBy === 'title' ? sortOrder : 'asc'}
                onClick={() => handleSortChange('title')}
              >
                <strong>Job Title</strong>
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortBy === 'company'}
                direction={sortBy === 'company' ? sortOrder : 'asc'}
                onClick={() => handleSortChange('company')}
              >
                <strong>Company</strong>
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortBy === 'status'}
                direction={sortBy === 'status' ? sortOrder : 'asc'}
                onClick={() => handleSortChange('status')}
              >
                <strong>Status</strong>
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortBy === 'applicationDate'}
                direction={sortBy === 'applicationDate' ? sortOrder : 'asc'}
                onClick={() => handleSortChange('applicationDate')}
              >
                <strong>Application Date</strong>
              </TableSortLabel>
            </TableCell>
            <TableCell><strong>Actions</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredAndSortedJobs.map((job) => (
            <TableRow hover key={job._id}>
              <TableCell>{job.title}</TableCell>
              <TableCell>{job.company}</TableCell>
              <TableCell>
                <Chip
                  label={job.status}
                  color={getStatusColor(job.status)}
                  size="small"
                  variant="outlined"
                />
              </TableCell>
              <TableCell>
                {new Date(job.applicationDate).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Tooltip title="Edit">
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => onEdit(job)}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => onDelete(job._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
          {filteredAndSortedJobs.length === 0 && (
            <TableRow>
              <TableCell align="center" colSpan={5}>
                {jobs.length === 0 
                  ? "No job applications found. Add your first one!"
                  : "No jobs match your current filters."
                }
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );

  // Card View Component
  const CardView = () => (
    <Grid container spacing={2} sx={{ mt: 1 }}>
      {filteredAndSortedJobs.map((job) => (
        <Grid item xs={12} sm={6} md={4} key={job._id}>
          <Card 
            sx={{ 
              height: '100%',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 4
              }
            }}
          >
            <CardContent>
              <Typography variant="h6" component="h3" gutterBottom noWrap>
                {job.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {job.company}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Chip
                  label={job.status}
                  color={getStatusColor(job.status)}
                  size="small"
                  variant="outlined"
                />
                <Typography variant="caption" color="text.secondary">
                  {new Date(job.applicationDate).toLocaleDateString()}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                <Tooltip title="Edit">
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => onEdit(job)}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => onDelete(job._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
      {filteredAndSortedJobs.length === 0 && (
        <Grid item xs={12}>
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              {jobs.length === 0 
                ? "No job applications found. Add your first one!"
                : "No jobs match your current filters."
              }
            </Typography>
          </Paper>
        </Grid>
      )}
    </Grid>
  );

  return (
    <Box sx={{ width: '100%' }}>
      {/* Header with view toggle and mobile filter button */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 2
      }}>
        <Typography variant="h5" component="h2">
          Job Applications ({filteredAndSortedJobs.length})
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          {isMobile && (
            <Button
              variant="outlined"
              startIcon={<FilterListIcon />}
              onClick={() => setMobileFilterOpen(true)}
              size="small"
            >
              Filters
            </Button>
          )}
          
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(e, value) => value && setViewMode(value)}
            size="small"
          >
            <ToggleButton value="table">
              <ViewListIcon />
            </ToggleButton>
            <ToggleButton value="card">
              <ViewModuleIcon />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Box>

      {/* Desktop filters */}
      {!isMobile && <FilterControls />}

      {/* Mobile filter drawer */}
      <Drawer
        anchor="right"
        open={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
      >
        <Box sx={{ width: 280 }}>
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
            <Typography variant="h6">Filters & Sort</Typography>
          </Box>
          <FilterControls mobile />
        </Box>
      </Drawer>

      {/* Content based on view mode */}
      {viewMode === 'table' ? <TableView /> : <CardView />}
    </Box>
  );
};

export default JobList;
