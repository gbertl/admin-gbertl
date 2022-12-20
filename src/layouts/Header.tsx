import { useAuth0 } from '@auth0/auth0-react';
import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography,
} from '@mui/material';

const Header = () => {
  const { isAuthenticated, loginWithPopup, logout } = useAuth0();

  return (
    <AppBar position="static" sx={{ mb: 5 }}>
      <Container>
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
              textTransform: 'uppercase',
            }}
          >
            Admin
          </Typography>

          <Box sx={{ marginLeft: 'auto' }}>
            {isAuthenticated ? (
              <Button
                sx={{ color: 'white', textTransform: 'uppercase' }}
                onClick={() => logout()}
              >
                Logout
              </Button>
            ) : (
              <Button
                sx={{ color: 'white', textTransform: 'uppercase' }}
                onClick={() => loginWithPopup()}
              >
                Log in
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
