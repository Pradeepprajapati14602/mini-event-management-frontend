import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, Typography, Box, Button } from '@mui/material';
import { useRouter } from 'next/router';

const EventListingPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const router = useRouter();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/events`);
        setEvents(response.data);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to fetch events. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
        <Typography>Loading events...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Upcoming Events
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => router.push('/create-event')}
        >
          Create Event
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => router.push('/attendee-list')}
        >
          Attendee List
        </Button>
      </Box>
      {events.length === 0 ? (
        <Typography>No upcoming events found.</Typography>
      ) : (
        <Box>
          {events.map((event: any) => (
            <Card key={event.id} sx={{ mb: 2 }}>
              <CardHeader title={event.name} />
              <CardContent>
                <Typography>Location: {event.location}</Typography>
                <Typography>
                  Start Time: {new Date(event.start_time).toLocaleString()}
                </Typography>
                <Typography>
                  End Time: {new Date(event.end_time).toLocaleString()}
                </Typography>
                <Typography>Max Capacity: {event.max_capacity}</Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default EventListingPage;