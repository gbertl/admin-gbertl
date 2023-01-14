import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  LinearProgress,
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
import { useState } from 'react';

interface Props {
  setWorkId: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const WorksTable = ({ setWorkId }: Props) => {
  const [open, setOpen] = useState(false);
  const [workIdToDelete, setWorkIdToDelete] = useState('');

  const { getAccessTokenSilently } = useAuth0();

  const queryClient = useQueryClient();

  const { data: works } = useQuery<AxiosResponse, AxiosError, Work[]>(
    'works',
    async () => {
      const { data } = await axios.get('/works?sort[priorityOrder]=1');
      return data;
    }
  );

  const { mutate: deleteWork, isLoading } = useMutation<
    AxiosResponse,
    AxiosError,
    string
  >(
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

  const handleOpen = (workId: string) => {
    setOpen(true);
    setWorkIdToDelete(workId);
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      setWorkIdToDelete('');
    }, 300);
  };

  const handleConfirm = () => {
    deleteWork(workIdToDelete);
    handleClose();
  };

  return (
    <>
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
                <TableCell>Priority order</TableCell>
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
                  <TableCell>{work.priorityOrder}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Button
                        variant="contained"
                        onClick={() => setWorkId(work._id)}
                        disabled={isLoading && work._id === workIdToDelete}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="contained"
                        onClick={() => handleOpen(work._id)}
                        disabled={isLoading && work._id === workIdToDelete}
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
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Are you sure?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            You're about to delete{' '}
            {works?.find((w) => w._id === workIdToDelete)?.title}. Do you want
            to proceed?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Dismiss</Button>
          <Button onClick={handleConfirm} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default WorksTable;
