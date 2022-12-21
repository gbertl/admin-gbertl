import { Box, Button, Container, Stack, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { useController, useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import placeholder from '../assets/images/placeholder.png';
import { Work } from '../typings';
import axios from '../axios';
import { AxiosError, AxiosResponse } from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import * as api from '../api';

interface Props {
  workId?: string;
  setWorkId: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const initialData = {
  title: '',
  text: '',
  category: '',
  source: '',
  liveUrl: '',
};

const WorkForm = ({ workId, setWorkId }: Props) => {
  const { getAccessTokenSilently } = useAuth0();

  const queryClient = useQueryClient();

  const { mutate: createUpdateWork } = useMutation<
    AxiosResponse,
    AxiosError,
    Work
  >(
    async (newWork) => {
      const token = await getAccessTokenSilently();

      if (workId) {
        return api.updateWork(workId, newWork, token);
      } else {
        return api.createWork(newWork, token);
      }
    },
    {
      onSuccess: () => {
        setThumbnailFilePreview(placeholder);
        reset(initialData);
        setWorkId('');
        queryClient.invalidateQueries('works');
      },
    }
  );

  const { data: work, refetch: refetchWork } = useQuery<
    AxiosResponse,
    AxiosError,
    Work
  >(
    ['work', workId],
    async ({ queryKey }) => {
      const { data } = await axios.get(`/works/${queryKey[1]}`);
      return data;
    },
    {
      enabled: false,
      onSuccess: (data) => {
        setThumbnailFilePreview(data.thumbnailUrl);
        reset(data);
      },
    }
  );

  const [thumbnailFilePreview, setThumbnailFilePreview] = useState(placeholder);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { defaultValues, touchedFields },
  } = useForm<Work>({
    defaultValues: initialData,
  });

  const { field: thumbnailFileField } = useController({
    name: 'thumbnailFile',
    control,
  });

  const handleChangeThumbnailFile = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const thumbnailData = e.target.files?.[0];

    if (!thumbnailData) return;

    setThumbnailFilePreview(URL.createObjectURL(thumbnailData));

    thumbnailFileField.onChange(thumbnailData);
  };

  const onSubmit = (data: Work) => {
    createUpdateWork(data);
  };

  useEffect(() => {
    if (workId) {
      refetchWork();
    }
  }, [workId]);

  return (
    <Container>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box
          sx={{
            display: 'grid',
            gap: 5,
            gridTemplateColumns: '40% 1fr',
          }}
        >
          <Stack gap={2}>
            <TextField
              variant="filled"
              label="Title"
              InputLabelProps={{
                shrink: !!defaultValues?.title || touchedFields.title,
              }}
              {...register('title')}
            />
            <TextField
              variant="filled"
              label="Text"
              multiline
              rows={2}
              InputLabelProps={{
                shrink: !!defaultValues?.text || touchedFields.text,
              }}
              {...register('text')}
            />
            <TextField
              variant="filled"
              label="Category (comma separated)"
              InputLabelProps={{
                shrink: !!defaultValues?.category || touchedFields.category,
              }}
              {...register('category')}
            />
            <TextField
              variant="filled"
              label="Github url"
              InputLabelProps={{
                shrink: !!defaultValues?.source || touchedFields.source,
              }}
              {...register('source')}
            />
            <TextField
              variant="filled"
              label="Live url"
              InputLabelProps={{
                shrink: !!defaultValues?.liveUrl || touchedFields.liveUrl,
              }}
              {...register('liveUrl')}
            />
            <Button
              variant="contained"
              sx={{ mt: 5, width: 100 }}
              type="submit"
            >
              Submit
            </Button>{' '}
          </Stack>

          <Box>
            <input
              type="file"
              id="thumbnailFile"
              hidden
              onChange={handleChangeThumbnailFile}
            />

            <Box
              component="label"
              htmlFor="thumbnailFile"
              sx={{ cursor: 'pointer' }}
            >
              <img src={thumbnailFilePreview} alt="" />
            </Box>
          </Box>
        </Box>
      </form>
    </Container>
  );
};

export default WorkForm;
