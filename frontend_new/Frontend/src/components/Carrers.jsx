import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import axios from 'axios';
import {useAuth} from "../AuthContext";
import Footer from './FooterComponent';

const Careers = () => {
  const {userRole} = useAuth();
  const [jobOpenings, setJobOpenings] = useState([]);
  const [newJob, setNewJob] = useState({ title: '', description: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch job openings from backend
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/jobs`);
        console.log('Response:', response);
        setJobOpenings(response.data.jobs);
      } catch (err) {
        console.error('Failed to fetch job openings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleDeleteJob = (deletedJobId) => {
    setJobOpenings((prev) => prev.filter((job) => job._id !== deletedJobId));
  };

  // Handle input change for new job form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewJob((prev) => ({ ...prev, [name]: value }));
  };

  // Submit new job to backend
  const handleNewJobSubmit = async (e) => {
    e.preventDefault();
    if (!newJob.title || !newJob.description) {
      setError('All fields are required.');
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/jobs`, newJob, {
        headers: {
          'Content-Type': 'application/json' // Ensure the correct content type
        }
      });
      
      if (response.status === 201) {
        setJobOpenings((prev) => [...prev, response.data.job]); // Assuming the returned job is in 'data.job'
        setNewJob({ title: '', description: '' }); // Reset the form
        setError(''); // Clear any previous errors
      }
    } catch (err) {
      console.error('Failed to post new job:', err);
      setError('Failed to post job. Try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 font-sans">
  <header className="bg-blue-400 text-white py-6">
    <div className="container mx-auto text-center">
      <h1 className="text-4xl font-bold">Join Our Team</h1>
      <p className="mt-2 text-lg">Explore exciting opportunities to grow with us.</p>
    </div>
  </header>

  <main className="flex-grow">
    <Box sx={{ my: 4, mx: 2 }}>
      {userRole === 'admin' && (
        <Box sx={{ mb: 6, p: 3, bgcolor: 'white', borderRadius: 2 }}>
          <Typography variant="h5" fontWeight="bold" mb={2}>
            Create New Job Opening
          </Typography>
          <form onSubmit={handleNewJobSubmit}>
            <TextField
              label="Job Title"
              name="title"
              value={newJob.title}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Job Description"
              name="description"
              value={newJob.description}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              multiline
              rows={4}
            />
            {error && <Typography color="error">{error}</Typography>}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
            >
              Post Job
            </Button>
          </form>
        </Box>
      )}

      <section>
        <Typography variant="h5" fontWeight="bold" textAlign="center" mb={4}>
          Current Openings
        </Typography>
        {loading ? (
          <Typography textAlign="center">Loading...</Typography>
        ) : (
          <Grid container spacing={4}>
            {jobOpenings.map((job) => (
              <Grid item xs={12} sm={6} md={4} key={job._id}>
                <JobListing job={job} onDeleteJob={handleDeleteJob} />
              </Grid>
            ))}
          </Grid>
        )}
      </section>
    </Box>
  </main>

  <Footer />
</div>

  );
};

const JobListing = ({ job, onDeleteJob  }) => {
  const {userRole} = useAuth();
  const [isApplying, setIsApplying] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '', resume: null });
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(true);
  const [jobOpenings, setJobOpenings] = useState([]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, resume: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message || !formData.resume) {
      setFormError('All fields are required.');
      return;
    }
  
    try {
      const formDataToSubmit = new FormData();
      formDataToSubmit.append('jobId', job._id);
      formDataToSubmit.append('name', formData.name);
      formDataToSubmit.append('email', formData.email);
      formDataToSubmit.append('message', formData.message);
      formDataToSubmit.append('resume', formData.resume); // Attach resume file

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/jobs/${job._id}/apply`, formDataToSubmit, {
        headers: {
          'Content-Type': 'multipart/form-data', // Important for file uploads
        },
      });

      if (response.status === 200) {
        alert('Your application has been submitted successfully!');
        setFormData({ name: '', email: '', message: '', resume: null });
        setIsApplying(false);
      }
    } catch (err) {
      console.error('Error submitting application:', err);
      alert('Failed to submit application. Try again.');
    }
  };

  // const fetchJobs = async () => {
  //   try {
  //     const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/jobs`);
  //     console.log('Fetched jobs:', response);
  //     setJobOpenings(response.data.jobs);
  //   } catch (err) {
  //     console.error('Failed to fetch job openings:', err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleDelete = async () => {
    try {
      if (!job._id) {
        alert('Job ID is missing.');
        return;
      }
      console.log('Job ID:', job._id);
  
      const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/jobs/${job._id}`);
      
      console.log('Response:', response); // Log the full response for debugging
  
      if (response.status === 200 || response.status === 204) {
        alert('Job listing deleted successfully!');
        // setJobOpenings((prev) => prev.filter((job) => job._id !== _id));
        onDeleteJob(job._id);
        // Update the state to remove the deleted job
        // setJobOpenings((prev) => prev.filter((item) => item._id !== job._id));
      } else {
        alert('Failed to delete job. Try again.');
      }
    } catch (err) {
      console.error('Error deleting job:', err);
      alert('Failed to delete job. Try again.');
    }
  };
  
  

  return (
    <Card sx={{ boxShadow: 3, borderRadius: 2, overflow: 'hidden' }}>
    <CardContent sx={{ bgcolor: '#f5f5f5', p: 3 }}>
      <Typography variant="h6" color="primary" fontWeight="bold" gutterBottom>
        {job.title}
      </Typography>
      <Typography variant="body2" color="textSecondary" mb={2}>
        {job.description}
      </Typography>
    </CardContent>
    <CardActions
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        p: 2,
        borderTop: '1px solid #ddd',
      }}
    >
      <Button
        variant="contained"
        color="primary"
        onClick={() => setIsApplying(!isApplying)}
        size="small"
      >
        {isApplying ? 'Cancel' : 'Apply'}
      </Button>
  
      {userRole === 'admin' && (
        <Button
          variant="outlined"
          color="error"
          onClick={handleDelete}
          size="small"
        >
          Delete
        </Button>
      )}
    </CardActions>
    {isApplying && (
      <Box
        sx={{
          p: 3,
          bgcolor: '#fff',
          borderTop: '1px solid #ddd',
          borderBottomLeftRadius: 2,
          borderBottomRightRadius: 2,
        }}
      >
        <form onSubmit={handleSubmit}>
          <TextField
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Why do you want this job?"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            multiline
            rows={4}
            required
          />
          <Typography variant="body2" color="textSecondary" mt={2} mb={1}>
            Attach your resume here:
          </Typography>
          <input
            type="file"
            name="resume"
            onChange={handleFileChange}
            required
            style={{
              display: 'block',
              marginBottom: '15px',
            }}
          />
          {formError && <Typography color="error">{formError}</Typography>}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
          >
            Submit
          </Button>
        </form>
      </Box>
    )}
  </Card>
  
  );

};

export default Careers;
