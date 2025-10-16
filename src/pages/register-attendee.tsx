import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Box, Snackbar, Alert } from '@mui/material';
import { useRouter } from 'next/router';

const RegisterAttendeePage = () => {
  const [formData, setFormData] = useState({
    eventId: '',
    name: '',
    email: '',
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

    const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/events/${formData.eventId}/register`;

    // ✅ Promise return ko `void` se suppress karo
    void axios
        .post(apiUrl, { name: formData.name, email: formData.email })
        .then((response) => {
        setSnackbar({ open: true, message: 'Attendee registered successfully!', severity: 'success' });
        setFormData({ eventId: '', name: '', email: '' });
        })
        .catch((error) => {
        let errorMessage = 'Something went wrong. Please try again.';
        if (error.response) {
            if (error.response.status === 404) {
            errorMessage = 'Event not found. Please check the Event ID.';
            } else if (error.response.status === 400) {
            errorMessage = 'Invalid data. Please check the input fields.';
            } else {
            errorMessage = error.response.data?.message || `Unexpected error (${error.response.status})`;
            }
        } else if (error.request) {
            errorMessage = 'No response from the server. Please check your internet connection.';
        }

        setSnackbar({ open: true, message: errorMessage, severity: 'error' });
        });
    };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Register Attendee
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Event ID"
          name="eventId"
          value={formData.eventId}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          Register Attendee
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => router.push('/attendee-list')}
          fullWidth
          sx={{ mt: 2 }}
        >
          Go to Attendee List
        </Button>
      </form>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RegisterAttendeePage;
