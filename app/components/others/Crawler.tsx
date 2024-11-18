import { Box, CircularProgress, Dialog, TextField, Typography } from '@mui/material';
import React, { useState } from 'react'
import { API_BASE_URL } from '~/config';

interface FormData {
    url: string;
}

interface ApiResponse {
    image_base64: string;
    success: boolean;
}

interface ApiError {
    detail: string;
    status: number;
}

class CrawlerError extends Error {
    constructor(
        message: string,
        public status?: number,
        public detail?: string
    ) {
        super(message);
        this.name = 'CrawlerError';
    }
}

interface HeaderProps {
    crawlerOpen: boolean;
    isCrawlerLoading: boolean;
    setIsCrawlerLoading:(state: boolean) => void;
    handleCrawlerClose: () => void;
    addFiles: (files: FileList) => void;
}

const Crawler: React.FC<HeaderProps> = ({
    crawlerOpen, 
    isCrawlerLoading, 
    setIsCrawlerLoading, 
    handleCrawlerClose,
    addFiles
}) => {
    const [formData, setFormData] = useState<FormData>({ url: '' });
    const [error, setError] = useState<string>('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [id]: value,
        }));
        if (error) setError('');
    };

    const validateUrl = (url: string): boolean => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    const base64ToFile = async (base64Data: string, filename: string): Promise<File> => {
        // Remove data URL prefix if present
        const base64WithoutPrefix = base64Data.replace(/^data:image\/\w+;base64,/, '');
        
        // Convert base64 to blob
        const byteString = atob(base64WithoutPrefix);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        const blob = new Blob([ab], { type: 'image/jpeg' });
        
        // Create File object
        return new File([blob], filename, { type: 'image/jpeg' });
    };

    const crawlerData = async (url: string): Promise<ApiResponse> => {
        if (!validateUrl(url)) {
            throw new CrawlerError('Invalid URL format');
        }

        try {
            const response = await fetch(`${API_BASE_URL}/screenshot`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url }),
            });

            if (!response.ok) {
                const errorData = await response.json() as ApiError;
                throw new CrawlerError(
                    'Server error',
                    response.status,
                    errorData.detail
                );
            }

            const responseData = await response.json() as ApiResponse;
            
            if (!responseData.image_base64) {
                throw new CrawlerError('No image data received from server');
            }

            return responseData;
        } catch (error) {
            if (error instanceof CrawlerError) {
                throw error;
            }
            if (error instanceof Error) {
                throw new CrawlerError(error.message);
            }
            throw new CrawlerError('An unexpected error occurred');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsCrawlerLoading(true);

        try {
            if (!formData.url.trim()) {
                throw new CrawlerError('Please enter a valid URL.');
            }

            const result = await crawlerData(formData.url);
            
            // Convert base64 to File object
            const hostname = new URL(formData.url).hostname;
            const timestamp = new Date().getTime();
            const filename = `screenshot-${hostname}-${timestamp}.jpg`;
            const file = await base64ToFile(result.image_base64, filename);
            
            // Create a FileList-like object
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            
            // Add the file to the chat
            addFiles(dataTransfer.files);
            handleCrawlerClose();
        } catch (error) {
            if (error instanceof CrawlerError) {
                setError(error.detail || error.message);
            } else {
                setError('An unexpected error occurred. Please try again.');
            }
        } finally {
            setIsCrawlerLoading(false);
        }
    };

    return (
        <Dialog
            open={crawlerOpen}
            onClose={isCrawlerLoading ? undefined : handleCrawlerClose}
            maxWidth={'lg'}
            sx={{
                '& .MuiDialog-paper': {
                    borderRadius: '25px',
                    width: 600,
                    border: `1px solid #d3d3d3`,
                    background: '#FFF'
                },
            }}
            BackdropProps={{
                sx: {
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    backdropFilter: 'blur(8px)',
                },
            }}
        >
            <Box p={3}>
                <Box my={3}>
                    <Typography
                        fontSize={24}
                        fontWeight={700}
                        textAlign="center"
                        id="dialog-title"
                    >
                        Generate from Crawler
                    </Typography>
                    <Typography textAlign="center" id="dialog-description">
                        Paste a website link to generate a modern and beautiful website
                    </Typography>
                </Box>
                <form onSubmit={handleSubmit}>
                    <Box>
                        <TextField
                            required
                            type="text"
                            id="url"
                            placeholder="Generate from Crawler"
                            fullWidth
                            variant="outlined"
                            value={formData.url}
                            onChange={handleChange}
                            disabled={isCrawlerLoading}
                            error={!!error}
                            helperText={error}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: '#d3d3d3',
                                        borderRadius: '15px',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#d3d3d3',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#d3d3d3',
                                    },
                                },
                            }}
                        />
                        <Box mt={2} width={'100%'}>
                            <Box
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                                p={1}
                                border="1px solid #000"
                                borderRadius={3}
                                width={'100%'}
                                sx={{
                                    background: '#000',
                                    cursor: isCrawlerLoading ? 'default' : 'pointer',
                                    opacity: isCrawlerLoading ? 0.7 : 1,
                                }}
                                onClick={isCrawlerLoading ? undefined : handleSubmit}
                                component="button"
                                type="submit"
                            >
                                {isCrawlerLoading && (
                                    <CircularProgress color="success" size={20} sx={{ mx: 1 }} />
                                )}
                                <Typography component="span" mx={1} color="#FFF">
                                    Generate
                                </Typography>
                                <i className="bi bi-arrow-right" />
                            </Box>
                            {isCrawlerLoading && (
                                <Box display="flex" justifyContent="center" mt={1} mb={2}>
                                    <Typography>
                                        Crawler may take some time. Please Wait...
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    </Box>
                </form>
            </Box>
        </Dialog>
    );
};

export default Crawler;