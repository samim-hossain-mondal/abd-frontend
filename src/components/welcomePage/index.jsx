/* eslint-disable import/no-unresolved */
import * as React from 'react';
import { Box, Typography, Container, CssBaseline, Stack, Button, Avatar, Card, CardContent, List} from '@mui/material';
import axios from 'axios';
import CardBox from '../elements/welcomePage/CardBox';
import Logo from '../../assets/images/agileLogo.png';
import { texts } from '../constants/welcomePage'
import ImageCarousel from '../elements/welcomePage/ImageCarousel';
import StickyHeader from '../elements/welcomePage/StickyHeader';


function ProfileCard(props) {
  // eslint-disable-next-line react/prop-types
  const { name, jobTitle, avatarUrl, bio } = props;

  return (
    <Card sx={{minWidth: '40%', maxHeight: '100%'}}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ width: 64, height: 64, backgroundColor: 'lightblue' }} src={avatarUrl} alt={name} />
          <Box sx={{ ml: 2 }}>
            <Typography variant="h5">{name}</Typography>
            <Typography variant="subtitle1" color="text.secondary">{jobTitle}</Typography>
          </Box>
        </Box>
        <Typography sx={{ mt: 2 }} variant="body1">{bio}</Typography>
      </CardContent>
    </Card>
  );
}

export default function WelcomePage() {
    const [userProjects, setUserProjects] = React.useState([]);
    const [user, setUser] = React.useState(null);
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
      {/* profile card + project list */}
      <Container component="main" sx={{ mt: 8, mb: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center' }} maxWidth="lg">
  <Stack direction="row" spacing={2} sx={{alignSelf: 'center', width: '100%'}}>
    <ProfileCard
      avatarUrl="/static/images/avatar/2.jpg"
      name={user ? user.name : 'Loading...'}
      jobTitle="Software Engineer"
      bio={`Part of ${userProjects.length} projects`}
    />
    <Container component="main" sx={{ mt: 8, mb: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center' }} maxWidth="lg">
    <Box component="p" sx={{fontSize: 20, px: 1, py: 1, mt: 0, mb: 1, alignSelf: 'center', fontWeight: 100, backgroundColor: 'white', width: '100%', boxShadow: 1}}>
      Your Projects
    </Box>
    <List sx={{width: '100%', overflowY: 'scroll', maxHeight: 'calc(100vh - 500px)'}}>
      {/* simple icon and text list */}
      {userProjects.map((project) => (
        <Box component="card" sx={{display: 'flex', flexDirection: 'column', width: '100%', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', textAlign: 'start', mb: 1}}>
          <Box component="p" sx={{fontSize: 15, width: '100%', padding: 1, margin: 0, backgroundColor: '#85B2FC', color: 'white'}}>{project.projectName}</Box>
          <Box component="p" sx={{fontSize: 15, color: 'text.primary',  width: '100%', px: 2}}>{project.projectId}</Box>
      </Box>
      ))}
    </List>
    </Container>
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
