// src/components/JobForm.jsx
import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stepper,
  Step,
  StepLabel,
  TextField,
  Chip,
  Autocomplete,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';

// Mock datasets for smart autocomplete
const COMMON_TITLES = [
  'Software Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Engineer',
  'Data Scientist', 'Machine Learning Engineer', 'Product Manager', 'DevOps Engineer',
  'Security Engineer', 'QA Engineer', 'Mobile Developer', 'UX Designer'
];

const COMMON_COMPANIES = [
  'Google', 'Microsoft', 'Amazon', 'Apple', 'Meta', 'Netflix', 'Airbnb', 'Uber', 'Stripe',
  'OpenAI', 'NVIDIA', 'Salesforce', 'Adobe', 'Atlassian', 'Spotify', 'Databricks'
];

const DEFAULT_REQUIRED_SKILLS = [
  'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'SQL', 'Docker', 'Kubernetes',
  'AWS', 'GCP', 'Azure', 'Git', 'REST', 'GraphQL', 'CI/CD', 'Unit Testing'
];

const steps = ['Role details', 'Company & status', 'Skills & requirements', 'Review & submit'];

const initialState = {
  title: '',
  company: '',
  location: '',
  status: 'Applied',
  applyUrl: '',
  notes: '',
  skills: [],
  requirements: [],
};

const JobForm = ({ open, handleClose, currentJob, addOrUpdateJob }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [activeStep, setActiveStep] = useState(0);
  const [job, setJob] = useState(initialState);
  const [skillInput, setSkillInput] = useState('');
  const [reqInput, setReqInput] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (currentJob) {
      setJob({ ...initialState, ...currentJob });
      setActiveStep(0);
    } else {
      setJob(initialState);
      setActiveStep(0);
    }
    setErrors({});
    setSkillInput('');
    setReqInput('');
  }, [currentJob, open]);

  const companyOptions = useMemo(() => COMMON_COMPANIES, []);
  const titleOptions = useMemo(() => COMMON_TITLES, []);
  const skillOptions = useMemo(() => DEFAULT_REQUIRED_SKILLS, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJob(prev => ({ ...prev, [name]: value }));
  };

  const addChip = (field, value) => {
    if (!value) return;
    setJob(prev => ({ ...prev, [field]: Array.from(new Set([...(prev[field] || []), value])) }));
  };

  const removeChip = (field, value) => {
    setJob(prev => ({ ...prev, [field]: (prev[field] || []).filter(v => v !== value) }));
  };

  const validateStep = (stepIndex) => {
    const newErrors = {};
    if (stepIndex === 0) {
      if (!job.title?.trim()) newErrors.title = 'Job title is required';
      if (!job.location?.trim()) newErrors.location = 'Location is required';
    } else if (stepIndex === 1) {
      if (!job.company?.trim()) newErrors.company = 'Company is required';
      if (!job.status?.trim()) newErrors.status = 'Status is required';
      if (job.applyUrl && !/^https?:\/\//i.test(job.applyUrl)) newErrors.applyUrl = 'Enter a valid URL';
    } else if (stepIndex === 2) {
      if (!job.skills || job.skills.length === 0) newErrors.skills = 'Add at least one skill';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep(activeStep)) return;
    setActiveStep(prev => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => setActiveStep(prev => Math.max(prev - 1, 0));

  const handleSubmit = () => {
    // Final validation before submit
    for (let i = 0; i < steps.length - 1; i++) {
      if (!validateStep(i)) {
        setActiveStep(i);
        return;
      }
    }
    addOrUpdateJob(job);
    handleClose();
    setJob(initialState);
    setActiveStep(0);
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box display="grid" gap={2} gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr' }}>
            <Autocomplete
              options={titleOptions}
              freeSolo
              value={job.title}
              onInputChange={(_, v) => setJob(p => ({ ...p, title: v }))}
              renderInput={(params) => (
                <TextField {...params} label="Job Title" required error={!!errors.title} helperText={errors.title} />
              )}
            />
            <TextField
              label="Location"
              name="location"
              value={job.location}
              onChange={handleChange}
              required
              error={!!errors.location}
              helperText={errors.location}
            />
            <TextField
              label="Job Posting URL"
              name="applyUrl"
              value={job.applyUrl}
              onChange={handleChange}
              error={!!errors.applyUrl}
              helperText={errors.applyUrl}
              fullWidth
              sx={{ gridColumn: { xs: '1 / -1', sm: 'span 2' } }}
            />
            <TextField
              label="Notes"
              name="notes"
              value={job.notes}
              onChange={handleChange}
              multiline
              minRows={3}
              sx={{ gridColumn: '1 / -1' }}
            />
          </Box>
        );
      case 1:
        return (
          <Box display="grid" gap={2} gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr' }}>
            <Autocomplete
              options={companyOptions}
              freeSolo
              value={job.company}
              onInputChange={(_, v) => setJob(p => ({ ...p, company: v }))}
              renderInput={(params) => (
                <TextField {...params} label="Company" required error={!!errors.company} helperText={errors.company} />
              )}
            />
            <FormControl>
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                label="Status"
                name="status"
                value={job.status}
                onChange={handleChange}
                error={!!errors.status}
              >
                {['Applied', 'Interview', 'Rejected', 'Offer', 'Pending'].map(s => (
                  <MenuItem key={s} value={s}>{s}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        );
      case 2:
        return (
          <Box display="grid" gap={3}>
            <Box>
              <Autocomplete
                options={skillOptions}
                freeSolo
                inputValue={skillInput}
                onInputChange={(_, v) => setSkillInput(v)}
                onChange={(_, v) => {
                  if (typeof v === 'string') addChip('skills', v);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Add a skill"
                    placeholder="e.g., React, Node.js"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addChip('skills', skillInput.trim());
                        setSkillInput('');
                      }
                    }}
                    error={!!errors.skills}
                    helperText={errors.skills}
                  />
                )}
              />
              <Box mt={1} display="flex" flexWrap="wrap" gap={1}>
                {(job.skills || []).map((s) => (
                  <Chip key={s} label={s} onDelete={() => removeChip('skills', s)} />
                ))}
              </Box>
            </Box>

            <Box>
              <Autocomplete
                options={[]}
                freeSolo
                inputValue={reqInput}
                onInputChange={(_, v) => setReqInput(v)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Add a requirement"
                    placeholder="e.g., 3+ years experience, GraphQL knowledge"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addChip('requirements', reqInput.trim());
                        setReqInput('');
                      }
                    }}
                  />
                )}
              />
              <Box mt={1} display="flex" flexWrap="wrap" gap={1}>
                {(job.requirements || []).map((r) => (
                  <Chip key={r} label={r} onDelete={() => removeChip('requirements', r)} />
                ))}
              </Box>
            </Box>

            <Box p={2} bgcolor={(theme) => theme.palette.action.hover} borderRadius={2}>
              <strong>AI suggestions (coming soon)</strong>
              <div style={{ fontSize: 14, opacity: 0.8 }}>
                This area will surface AI-powered suggestions for skills and keywords from the job description.
              </div>
            </Box>
          </Box>
        );
      case 3:
      default:
        return (
          <Box display="grid" gap={2}>
            <Box>
              <strong>Review</strong>
            </Box>
            <Box>
              <div><strong>Title:</strong> {job.title || '-'} </div>
              <div><strong>Company:</strong> {job.company || '-'} </div>
              <div><strong>Location:</strong> {job.location || '-'} </div>
              <div><strong>Status:</strong> {job.status || '-'} </div>
              <div><strong>URL:</strong> {job.applyUrl || '-'} </div>
            </Box>
            <Box>
              <div><strong>Skills:</strong></div>
              <Box mt={1} display="flex" flexWrap="wrap" gap={1}>
                {(job.skills || []).length ? job.skills.map((s) => <Chip key={s} label={s} />) : '—'}
              </Box>
            </Box>
            <Box>
              <div><strong>Requirements:</strong></div>
              <Box mt={1} display="flex" flexWrap="wrap" gap={1}>
                {(job.requirements || []).length ? job.requirements.map((r) => <Chip key={r} label={r} />) : '—'}
              </Box>
            </Box>
            <TextField
              label="Additional Notes"
              name="notes"
              value={job.notes}
              onChange={handleChange}
              multiline
              minRows={3}
              fullWidth
            />
          </Box>
        );
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm" fullScreen={fullScreen}>
      <DialogTitle sx={{ pr: 6 }}>
        {currentJob ? 'Edit Job Application' : 'Add New Job Application'}
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {renderStepContent()}
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1, justifyContent: 'space-between' }}>
        <Box>
          <Button onClick={handleClose}>Cancel</Button>
        </Box>
        <Box display="flex" gap={1}>
          <Button disabled={activeStep === 0} onClick={handleBack} variant="outlined">Back</Button>
          {activeStep < steps.length - 1 ? (
            <Button onClick={handleNext} variant="contained">Next</Button>
          ) : (
            <Button onClick={handleSubmit} variant="contained">{currentJob ? 'Update' : 'Add'}</Button>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default JobForm;
