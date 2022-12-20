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
import axios from '../axios';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { AxiosError, AxiosResponse } from 'axios';
import { Work } from '../typings';

interface Props {
  setWorkId: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const WorksTable = ({ setWorkId }: Props) => {
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
      return axios.delete(`/works/${workId}`);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('works');
      },
    }
  );

  const handleDelete = (id: string) => {
    deleteWork(id);
  };

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
                      onClick={() => handleDelete(work._id)}
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
