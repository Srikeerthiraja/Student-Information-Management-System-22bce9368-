import { Avatar, Box, Card, CardContent, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
// Note: Removed the unused 'styled' import and component definitions (ProfileCard, etc.)

const TeacherProfile = () => {
  const { currentUser, response, error } = useSelector((state) => state.user);

  if (response) { console.log(response) }
  else if (error) { console.log(error) }

  // Defensive checks are good practice:
  const teachSclass = currentUser?.teachSclass?.sclassName || 'N/A';
  const teachSubject = currentUser?.teachSubject?.subName || 'N/A';
  const teachSchool = currentUser?.school?.schoolName || 'N/A';
  const teacherName = currentUser?.name || 'Teacher';
  const teacherEmail = currentUser?.email || 'N/A';

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(to right, #83a4d4, #b6fbff)', // Gradient background
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
          {/* Use optional chaining in case currentUser or name is null/undefined */}
          {currentUser?.name?.charAt(0).toUpperCase()} 
        </Avatar>

        <Typography variant="h5" fontWeight="bold" gutterBottom>
          {teacherName}
        </Typography>

        <CardContent>
          <Typography variant="body1" color="text.secondary" gutterBottom>
             Email: {teacherEmail}
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
             School: {teachSchool}
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
             Class: {teachSclass}
          </Typography>
          <Typography variant="body1" color="text.secondary">
             Subject: {teachSubject}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  )
}

export default TeacherProfile