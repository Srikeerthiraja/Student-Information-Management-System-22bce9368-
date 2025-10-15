import { AccountCircle, Group, School } from '@mui/icons-material';
import {
  Box,
  Container,
  Grid,
  Paper,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const ChooseUser = ({ visitor }) => {
  const navigate = useNavigate();
  const navigateHandler = (user) => {
    if (user === "Admin") {
      navigate('/Adminlogin');
    }
    else if (user === "Student") {
      navigate('/Studentlogin');
    }
    else if (user === "Teacher") {
      navigate('/Teacherlogin');
    }
  };

  return (
    <StyledContainer>
      <Container maxWidth="lg">
        <Box textAlign="center" mb={6}>
          <StyledTitle>Choose Your Role</StyledTitle>
          <StyledSubtitle>
            Select how you want to access the system
          </StyledSubtitle>
        </Box>

        <Grid 
          container 
          spacing={4} 
          justifyContent="center" 
          alignItems="center"
        >
          <Grid item xs={12} sm={6} md={4}>
            <div onClick={() => navigateHandler("Admin")}>
              <StyledPaper elevation={3}>
                <Box mb={2}>
                  <AccountCircle style={{ fontSize: 80 }} />
                </Box>
                <StyledTypography>
                  Admin
                </StyledTypography>
                <StyledDescription>
                  Login as an administrator to access the dashboard to manage app data.
                </StyledDescription>
              </StyledPaper>
            </div>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <div onClick={() => navigateHandler("Student")}>
              <StyledPaper elevation={3}>
                <Box mb={2}>
                  <School style={{ fontSize: 80 }} />
                </Box>
                <StyledTypography>
                  Student
                </StyledTypography>
                <StyledDescription>
                  Login as a student to explore course materials and assignments.
                </StyledDescription>
              </StyledPaper>
            </div>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <div onClick={() => navigateHandler("Teacher")}>
              <StyledPaper elevation={3}>
                <Box mb={2}>
                  <Group style={{ fontSize: 80 }} />
                </Box>
                <StyledTypography>
                  Teacher
                </StyledTypography>
                <StyledDescription>
                  Login as a teacher to create courses, assignments, and track student progress.
                </StyledDescription>
              </StyledPaper>
            </div>
          </Grid>
        </Grid>
      </Container>
    </StyledContainer>
  );
};

export default ChooseUser;


const StyledContainer = styled.div`
  background: linear-gradient(135deg, rgb(112, 29, 29) 0%, rgb(98, 139, 17) 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const StyledTitle = styled.h1`
  color: white;
  font-size: 48px;
  margin-bottom: 16px;
  font-weight: 700;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
`;

const StyledSubtitle = styled.p`
  color: rgba(255, 255, 255, 0.9);
  font-size: 20px;
  font-weight: 300;
`;

const StyledPaper = styled(Paper)`
  padding: 40px 20px;
  text-align: center;
  background-color: #1f1f38;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 12px;
  min-height: 320px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #2c2c6c;
    color: white;
    transform: translateY(-10px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
  }

  svg {
    transition: all 0.3s ease;
  }

  &:hover svg {
    transform: scale(1.1);
    color: #4db5ff;
  }
`;

const StyledTypography = styled.h2`
  margin-bottom: 16px;
  font-size: 28px;
  font-weight: 600;
  color: inherit;
`;

const StyledDescription = styled.p`
  font-size: 15px;
  line-height: 1.6;
  color: inherit;
  margin: 0;
  padding: 0 10px;
`;