import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button, CircularProgress, Typography, Pagination, Snackbar, Alert } from '@mui/material';
import { useRouter } from 'next/router';

interface Attendee {
  id: number;
  name: string;
  email: string;
}

const AttendeeListPage = () => {
  const [eventId, setEventId] = useState('');
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' as 'success' | 'error' });

  const router = useRouter();

  const fetchAttendees = async (page = 1) => {
    if (!eventId || isNaN(Number(eventId))) {
      setSnackbar({ open: true, message: 'Please enter a valid numeric Event ID.', severity: 'error' });
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/events/${eventId}/attendees`, {
        params: { page },
      });
      setAttendees(response.data.data);
      setCurrentPage(response.data.current_page);
      setTotalPages(response.data.last_page);
    } catch (err: any) {
      console.error('Error fetching attendees:', err);
      let errorMessage = 'Failed to fetch attendees. Please try again later.';

      if (err.response) {
        if (err.response.status === 404) {
          errorMessage = 'Event not found. Please check the Event ID.';
        } else {
          errorMessage = `Error: ${err.response.data.message || 'Unexpected server error.'}`;
        }
      } else if (err.request) {
        errorMessage = 'No response from the server. Please check your network connection.';
      } else {
        errorMessage = `Error: ${err.message}`;
      }

      setError(errorMessage);
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    fetchAttendees(page);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '16px' }}>
      <Typography variant="h4" gutterBottom>
        Attendee List
      </Typography>
      <div style={{ marginBottom: '16px' }}>
        <TextField
          label="Event ID"
          value={eventId}
          onChange={(e) => setEventId(e.target.value)}
          fullWidth
          variant="outlined"
          margin="normal"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={() => fetchAttendees(1)}
          style={{ marginTop: '8px', marginRight: '8px' }}
        >
          Fetch Attendees
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => router.push('/register-attendee')}
          style={{ marginTop: '8px', marginRight: '8px' }}
        >
          Register Attendee
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => router.push('/')}
          style={{ marginTop: '8px' }}
        >
          Back to Home
        </Button>
      </div>

      {loading && <CircularProgress />}

      {error && (
        <Typography color="error" style={{ marginTop: '16px' }}>
          {error}
        </Typography>
      )}

      {attendees.length > 0 && (
        <>
          <TableContainer component={Paper} style={{ marginTop: '16px' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {attendees.map((attendee) => (
                  <TableRow key={attendee.id}>
                    <TableCell>{attendee.name}</TableCell>
                    <TableCell>{attendee.email}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            style={{ marginTop: '16px', display: 'flex', justifyContent: 'center' }}
          />
        </>
      )}

      {attendees.length === 0 && !loading && !error && (
        <Typography style={{ marginTop: '16px' }}>
          No attendees found for this event.
        </Typography>
      )}

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AttendeeListPage;