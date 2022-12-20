import { CssBaseline } from '@mui/material';
import { useState } from 'react';

import { WorkForm, WorksTable } from './components';
import Header from './layouts/Header';

const App = () => {
  const [workId, setWorkId] = useState<string>();

  return (
    <>
      <CssBaseline />
      <Header />
      <main>
        <WorkForm workId={workId} setWorkId={setWorkId} />
        <WorksTable setWorkId={setWorkId} />
      </main>
    </>
  );
};

export default App;
