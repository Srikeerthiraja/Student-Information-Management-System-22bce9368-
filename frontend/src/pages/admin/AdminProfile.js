import { Avatar, Box, Card, CardContent, Typography } from '@mui/material';
import { useSelector } from 'react-redux';

const AdminProfile = () => {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(to right, #83a4d4, #b6fbff)',
      }}
    >
      <Card
        sx={{
          width: 360,
          padding: 3,
          borderRadius: 4,
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
          textAlign: 'center',
          backgroundColor: '#fff',
        }}
      >
        <Avatar
          sx={{
            width: 80,
            height: 80,
            margin: '0 auto 16px auto',
            bgcolor: '#1976d2',
            fontSize: '2rem',
          }}
        >
          {currentUser?.name?.charAt(0).toUpperCase()}
        </Avatar>

        <Typography variant="h5" fontWeight="bold" gutterBottom>
          {currentUser?.name}
        </Typography>

        <CardContent>
          <Typography variant="body1" color="text.secondary" gutterBottom>
             {currentUser?.email}
          </Typography>
          <Typography variant="body1" color="text.secondary">
             {currentUser?.schoolName}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AdminProfile;
