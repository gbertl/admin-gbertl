import {
  Box,
  Button,
  Container,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { AxiosError, AxiosResponse } from 'axios';

import axios from '../axios';
import { Work } from '../typings';
import { useAuth0 } from '@auth0/auth0-react';
import * as api from '../api';

interface Props {
  setWorkId: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const WorksTable = ({ setWorkId }: Props) => {
  const { getAccessTokenSilently } = useAuth0();

  const queryClient = useQueryClient();

  const { data: works } = useQuery<AxiosResponse, AxiosError, Work[]>(
    'works',
    async () => {
      const { data } = await axios.get('/works');
      return data;
    }
  );

  const { mutate: deleteWork } = useMutation<AxiosResponse, AxiosError, string>(
    async (workId) => {
      const token = await getAccessTokenSilently();

      return api.deleteWork(workId, token);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('works');
      },
    }
  );

  return (
    <Container sx={{ mt: 8 }}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Thumbnail</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Text</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Github url</TableCell>
              <TableCell>Live url</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {works?.map((work) => (
              <TableRow key={work._id}>
                <TableCell>
                  <img src={work.thumbnailUrl} alt="" width="300" />
                </TableCell>
                <TableCell>{work.title}</TableCell>
                <TableCell>{work.text}</TableCell>
                <TableCell>{work.category}</TableCell>
                <TableCell>
                  <Link href={work.source}>{work.source}</Link>
                </TableCell>
                <TableCell>
                  <Link href={work.liveUrl}>{work.liveUrl}</Link>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      variant="contained"
                      onClick={() => setWorkId(work._id)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => deleteWork(work._id)}
                    >
                      Delete
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default WorksTable;
