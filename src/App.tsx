import { useAuth0 } from '@auth0/auth0-react';
import { CssBaseline } from '@mui/material';
import { useState } from 'react';

import { WorkForm, WorksTable } from './components';
import Header from './layouts/Header';

const App = () => {
  const [workId, setWorkId] = useState<string>();
  const { isAuthenticated } = useAuth0();

  return (
    <>
      <CssBaseline />
      <Header />
      <main>
        {isAuthenticated && (
          <>
            <WorkForm workId={workId} setWorkId={setWorkId} />
            <WorksTable setWorkId={setWorkId} />
          </>
        )}
      </main>
    </>
  );
};

export default App;
