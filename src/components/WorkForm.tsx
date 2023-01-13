import {
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useController, useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { red } from '@mui/material/colors';

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
    formState: { defaultValues, touchedFields, errors },
    setError,
  } = useForm<Work>({
    defaultValues: initialData,
  });

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
      onError: (e) => {
        for (const [key, value] of Object.entries(e.response?.data as Work)) {
          setError(
            key === 'thumbnail' ? 'thumbnailFile' : (key as keyof Work),
            {
              type: 'custom',
              message: value.message,
            }
          );
        }
      },
    }
  );

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
            gridTemplateColumns: {
              md: '40% 1fr',
            },
          }}
        >
          <Stack gap={2}>
            <TextField
              variant="filled"
              label="Title"
              InputLabelProps={{
                shrink: !!defaultValues?.title || touchedFields.title,
              }}
              error={!!errors.title}
              helperText={errors.title?.message}
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
              error={!!errors.text}
              helperText={errors.text?.message}
              {...register('text')}
            />
            <TextField
              variant="filled"
              label="Category (comma separated)"
              InputLabelProps={{
                shrink: !!defaultValues?.category || touchedFields.category,
              }}
              error={!!errors.category}
              helperText={errors.category?.message}
              {...register('category')}
            />
            <TextField
              variant="filled"
              label="Github url"
              InputLabelProps={{
                shrink: !!defaultValues?.source || touchedFields.source,
              }}
              error={!!errors.source}
              helperText={errors.source?.message}
              {...register('source')}
            />
            <TextField
              variant="filled"
              label="Live url"
              InputLabelProps={{
                shrink: !!defaultValues?.liveUrl || touchedFields.liveUrl,
              }}
              error={!!errors.liveUrl}
              helperText={errors.liveUrl?.message}
              {...register('liveUrl')}
            />
            <Button
              variant="contained"
              sx={{ mt: 3, width: { xs: '100%', sm: 100 } }}
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
              sx={{
                cursor: 'pointer',
                display: 'block',
                border: errors.thumbnailFile ? `2px solid ${red[700]}` : '',
              }}
            >
              <img
                src={thumbnailFilePreview}
                alt=""
                style={{ display: 'block' }}
              />
            </Box>
            {errors.thumbnailFile && (
              <Typography variant="body2" sx={{ mt: 1, color: red[700] }}>
                {errors.thumbnailFile.message}
              </Typography>
            )}
          </Box>
        </Box>
      </form>
    </Container>
  );
};

export default WorkForm;
