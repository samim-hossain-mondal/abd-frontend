import * as React from 'react';
import { Box, Typography, Container, CssBaseline, Stack, Button } from '@mui/material';
import axios from 'axios';
import Logo from '../../assets/images/agileLogo.png';
import CardBox from '../elements/welcomePage/CardBox';
import { texts } from '../constants/welcomePage'
import ImageCarousel from '../elements/welcomePage/ImageCarousel';
import StickyHeader from '../elements/welcomePage/StickyHeader';

export default function WelcomePage() {
    const [userProjects, setUserProjects] = React.useState([]);
    const [user, setUser] = React.useState(null);
    // const [loading, setLoading] = React.useState(true);
    const [stickyHeader, setStickyHeader] = React.useState(false);

    React.useEffect(() => {
        const getUser = async () => {
            const response = await axios.get('http://localhost:3001/api/management/me');
            console.log(response);
            setUser(response.data);
        }
        const getUserProjects = async () => {
            const response = await axios.get('http://localhost:3001/api/management/project');
            console.log(response);
            setUserProjects(response.data);
        }
        getUser();
        getUserProjects();
    }, []);

    const handleScroll = () => {
      if (window.pageYOffset > 300) {
          setStickyHeader(true);
      } else {
          setStickyHeader(false);
      }
  };

  console.log(userProjects);
  console.log(user);

  React.useEffect(() => {
      window.addEventListener('scroll', handleScroll);

      return () => {
          window.removeEventListener('scroll', handleScroll);
      };
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: 'backgroundColor.main'
      }}
    >
      <CssBaseline />
      {stickyHeader ? <StickyHeader /> : null}
      <Container component="main" sx={{ mt: 8, mb: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center' }} maxWidth="lg"> 
        <Box component="img" src={Logo} alt="logo" sx={{height: 200, width: 200, borderRadius: '50%', boxShadow: 5, alignSelf: 'center'}} />
        <Typography variant="h3" component="h3" sx={{mt: 3, mb: 5, alignSelf: 'center', fontWeight: 'bold'}}>
          Welcome to My Agile Board
        </Typography>
        <Stack direction="column" spacing={2} sx={{alignSelf: 'center', width: '100%'}}>
            <CardBox title="Why use My Agile Dashboard?" description={texts.whyMyAgile} />
            <CardBox title="Get started with My Agile Board" description="Create a new project or ask your PO to add you to an existing project" />
            <ImageCarousel />
        </Stack>
      </Container>
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: 'grey.200',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
            width: '100%',
            boxShadow: 5
        }}
       >
        <Typography variant="body1" color="text.secondary" align="center">
            Get started with your own Agile board!
        </Typography>
        <Button variant="contained" sx={{backgroundColor: 'primary.main', color: 'white'}}>Create New Project</Button>
    </Box>
    </Box>
  );
}
