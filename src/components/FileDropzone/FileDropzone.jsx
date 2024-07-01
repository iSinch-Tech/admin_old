import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button, Stack, Typography, Box } from '@mui/material';
import Previews from './Previews';
import { postFile, deleteFile } from '../../api/files';

const FileDropzone = (props) => {
    const {
        images,
        onLoad,
        onDelete,
        keepDeleted = true,
        namePrefix = 'Изображение',
        placeholder = 'Прикрепите изображение',
        dropzoneConfig = {},
        setIsLoading,
    } = props;

    const onFileUpload = useCallback(async (file) => {
        try {
            setIsLoading(true);

            const formData = new FormData();
            formData.append('file', file);

            const { id } = await postFile(formData);
            onLoad(id);
        } catch {
        } finally {
            setIsLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onFileDelete = useCallback(async (id) => {
        try {
            if (!keepDeleted) await deleteFile(id);
            onDelete(id);
        } catch { }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [keepDeleted]);

    const onDrop = useCallback((acceptedFiles) => {
        acceptedFiles.forEach(onFileUpload)
    }, [onFileUpload]);

    const { getRootProps, getInputProps } = useDropzone({ ...dropzoneConfig, onDrop });

    return (
        <Stack gap={1} sx={{ width: '100%', height: '100%' }}>
            <Button
                component={Box}
                variant="outlined"
                sx={{ borderStyle: 'dashed', height: '56px' }}
                {...getRootProps()}
            >
                <input {...getInputProps()} />
                <Typography variant="button">{placeholder}</Typography>
            </Button>
            <Previews images={images} namePrefix={namePrefix} onDelete={onFileDelete} />
        </Stack>
    )
};

export default FileDropzone;