import { Box, Chip, Dialog, Divider, TextField, Typography, useTheme } from '@mui/material';
import React, { useState } from 'react';
import Logo from '../../../../icons/roundedlogo.svg';
import useAuth from '../useAuth';

interface LoginProps {
    enterEmailOpen: boolean;
    handleEnterEmailClose: () => void;
    handleForgotVerificationOpen: (email: string) => void;
}

interface FormData {
    email: string;
}

const EnterEmail: React.FC<LoginProps> = ({ 
    enterEmailOpen, 
    handleEnterEmailClose, 
    handleForgotVerificationOpen 
}) => {
    const theme = useTheme();
    const { sendForgotPasswordOtp } = useAuth();

    const [formData, setFormData] = useState<FormData>({
        email: '',
    });
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState(false);

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) return 'Email is required';
        if (!emailRegex.test(email)) return 'Enter a valid email address';
        return '';
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value,
        }));
        setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const emailError = validateEmail(formData.email);
        if (emailError) {
            setError(emailError);
            return;
        }

        try {
            setLoading(true);
            const result = await sendForgotPasswordOtp(formData.email);
            
            if (result.success) {
                handleForgotVerificationOpen(formData.email);
                setFormData({ email: '' });
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog
            open={enterEmailOpen}
            onClose={handleEnterEmailClose}
            maxWidth={'lg'}
            sx={{
                '& .MuiDialog-paper': {
                    borderRadius: '25px',
                    width: 600,
                    border: `1px solid #d3d3d3`,
                    background: '#FFF',
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
                <Box width="100%" display="flex" justifyContent="center">
                    <Box
                        component="img"
                        src={Logo}
                        height={60}
                        width="auto"
                    />
                </Box>
                
                <Box my={3}>
                    <Typography 
                        fontSize={24} 
                        fontWeight={700} 
                        textAlign="center" 
                        fontFamily="Montserrat"
                    >
                        Forgot Password
                    </Typography>
                    <Typography 
                        textAlign="center" 
                        fontFamily="Montserrat"
                    >
                        Enter your email address to receive a verification code
                    </Typography>
                </Box>

                <Box my={2}>
                    <Divider>
                        <Chip label="Or" size="small" sx={{ fontFamily: 'Montserrat' }} />
                    </Divider>
                </Box>

                <form onSubmit={handleSubmit}>
                    <Box>
                        <TextField
                            required
                            type="email"
                            id="email"
                            placeholder="Enter Your Email"
                            fullWidth
                            variant="outlined"
                            value={formData.email}
                            onChange={handleChange}
                            error={!!error}
                            helperText={error}
                            sx={{
                                mt: 2,
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: '#d0d0d0',
                                        borderRadius: '15px',
                                    },
                                    '& input': {
                                        fontFamily: 'Montserrat, sans-serif'
                                    },
                                    '& input::placeholder': {
                                        fontFamily: 'Montserrat, serif',
                                        opacity: 0.7
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#d0d0d0',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#d0d0d0',
                                    },
                                },
                                '& .MuiFormHelperText-root': {
                                    fontFamily: 'Montserrat',
                                    marginLeft: 2
                                }
                            }}
                        />

                        <Box mt={2}>
                            <Box
                                onClick={handleSubmit}
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                                p={1}
                                border="1px solid #000"
                                borderRadius={3}
                                sx={{ 
                                    background: '#000', 
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    opacity: loading ? 0.7 : 1
                                }}
                            >
                                <Typography 
                                    component="span" 
                                    mr={1} 
                                    color="#FFF"
                                    fontFamily="Montserrat"
                                >
                                    {loading ? 'Sending...' : 'Send Verification Code'}
                                </Typography>
                                {!loading && <i className="bi bi-arrow-right" style={{ color: '#FFF' }}></i>}
                            </Box>
                        </Box>
                    </Box>
                </form>

                <Box my={2}>
                    <Divider />
                </Box>

                <Box display="flex" justifyContent="center" alignItems="center">
                    <Typography fontFamily="Montserrat">
                        Secure by <span style={{ fontWeight: 700 }}>Websparks</span>
                    </Typography>
                </Box>
            </Box>
        </Dialog>
    );
};

export default EnterEmail;