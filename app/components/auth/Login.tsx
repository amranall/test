import { Box, Chip, Dialog, Divider, IconButton, InputAdornment, Link, TextField, Typography, Alert } from '@mui/material';
import React, { useState } from 'react';
import SocialLogin from './SocialLogin';
import Logo from '../../../icons/roundedlogo.svg';
import useAuth from './useAuth';

interface LoginProps {
    signinOpen: boolean;
    handleSignInClose: () => void;
    handleSignUpOpen: () => void;
    handleEnterEmailOpen: () => void;
}

interface FormData {
    email: string;
    password: string;
}

interface FormErrors {
    email?: string;
    password?: string;
    general?: string;
}

const Login: React.FC<LoginProps> = ({ signinOpen, handleSignInClose, handleSignUpOpen, handleEnterEmailOpen }) => {
    const { login } = useAuth();
    const [formData, setFormData] = useState<FormData>({
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});
    const [submitError, setSubmitError] = useState<string>('')
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateForm = () => {
        const newErrors: FormErrors = {};
        
        // Email validation
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }
        
        // Password validation
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [id]: value,
        }));
        // Clear error when user starts typing
        if (errors[id as keyof FormErrors]) {
            setErrors(prev => ({
                ...prev,
                [id]: undefined
            }));
        }
    };

    const handleTogglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        setErrors({});

        try {
            const result = await login(formData.email, formData.password);
            if (result.success) {
                window.location.reload();
                handleSignInClose();
            } else {
                if (result.message.toLowerCase().includes('user not found')) {
                    setSubmitError('User not found with this email');
                } else if (result.message.toLowerCase().includes('password')) {
                    setSubmitError('Invalid password');
                } else {
                    setSubmitError( result.message || 'Login failed. Please try again.');
                }
            }
        } catch (error) {
            setErrors({
                general: 'An error occurred during login. Please try again later.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog
            open={signinOpen}
            onClose={handleSignInClose}
            maxWidth={'lg'}
            sx={{
                '& .MuiDialog-paper': {
                    borderRadius: '25px',
                    width: 600,
                    border: `1px solid ${'#d0d0d0'}`,
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
                <Box width={'100%'} display={'flex'} justifyContent={'center'}>
                    <Box
                        component={'img'}
                        src={Logo}
                        height={60}
                        width={'auto'}
                    />
                </Box>
                <Box my={3}>
                    <Typography
                        fontSize={24}
                        fontWeight={700}
                        textAlign={'center'}
                        id="dialog-title"
                        fontFamily={'Montserrat'}
                    >
                        Sign in to Websparks
                    </Typography>
                    <Typography fontFamily={'Montserrat'} textAlign={'center'} id="dialog-description">
                        Welcome back! Please sign in to continue
                    </Typography>
                </Box>

                {errors.general && (
                    <Box mb={2}>
                        <Alert severity="error" sx={{ borderRadius: '8px' }}>
                            {errors.general}
                        </Alert>
                    </Box>
                )}

                <Box>
                    <SocialLogin setSubmitError={setSubmitError} />
                </Box>
                <Box my={2}>
                    <Divider>
                        <Chip label={`Or`} size="small" sx={{fontFamily: '"Montserrat", sans-serif'}} />
                    </Divider>
                </Box>
                <form onSubmit={handleSubmit}>
                    <Box>
                        <TextField
                            required
                            type="email"
                            id="email"
                            placeholder={`Enter Your Email`}
                            fullWidth
                            variant="outlined"
                            value={formData.email}
                            onChange={handleChange}
                            error={!!errors.email}
                            helperText={errors.email}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: errors.email ? 'error.main' : '#d0d0d0',
                                        borderRadius: '15px',
                                    },
                                    '& input': {
                                        fontFamily: '"Montserrat", sans-serif'
                                    },
                                    '& input::placeholder': {
                                        fontFamily: '"Montserrat", serif',
                                        opacity: 0.7
                                    },
                                    '&:hover fieldset': {
                                        borderColor: errors.email ? 'error.main' : '#d0d0d0',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: errors.email ? 'error.main' : '#d0d0d0',
                                    },
                                },
                            }}
                        />
                        <TextField
                            required
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            placeholder={`Enter Your Password`}
                            fullWidth
                            variant="outlined"
                            value={formData.password}
                            onChange={handleChange}
                            error={!!errors.password}
                            helperText={errors.password}
                            sx={{
                                mt: 2,
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: errors.password ? 'error.main' : '#d0d0d0',
                                        borderRadius: '15px',
                                    },
                                    '& input': {
                                        fontFamily: '"Montserrat", sans-serif'
                                    },
                                    '& input::placeholder': {
                                        fontFamily: '"Montserrat", serif',
                                        opacity: 0.7
                                    },
                                    '&:hover fieldset': {
                                        borderColor: errors.password ? 'error.main' : '#d0d0d0',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: errors.password ? 'error.main' : '#d0d0d0',
                                    },
                                },
                            }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={handleTogglePasswordVisibility}
                                            edge="end"
                                        >
                                            {showPassword ? <i className="bi bi-eye-slash"></i> : <i className="bi bi-eye"></i>}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Box display={'flex'} justifyContent={'end'} mt={1}>
                            <Link sx={{cursor:'pointer'}} onClick={handleEnterEmailOpen}>
                                <p>Forgot Password?</p>
                            </Link>
                        </Box>
                        {submitError && (
                            <Typography fontFamily={'Montserrat'} fontWeight={700} sx={{color:"red"}} textAlign="center">
                                {submitError}
                            </Typography>
                        )}
                        <Box mt={2}>
                            <Box 
                                component="button"
                                type="submit"
                                disabled={isSubmitting}
                                onClick={handleSubmit} 
                                display={'flex'} 
                                justifyContent={'center'} 
                                alignItems={'center'} 
                                p={1} 
                                border={`1px solid`} 
                                borderRadius={3} 
                                sx={{
                                    background: isSubmitting ? '#666' : '#000',
                                    color: '#FFF',
                                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                    width: '100%',
                                }}
                            >
                                <span style={{marginRight:'5px'}}>
                                    {isSubmitting ? 'Logging in...' : 'Login'}
                                </span>
                                {!isSubmitting && <i className="bi bi-arrow-right"></i>}
                            </Box>
                        </Box>
                    </Box>
                </form>
                <Box display={'flex'} justifyContent={'center'} alignItems={'center'} mt={2}>
                    <Box>
                        <span>Don't have An Account? </span>
                        <Link onClick={handleSignUpOpen} sx={{ cursor: 'pointer' }}>
                            <span>Signup</span>
                        </Link>
                    </Box>
                </Box>
                <Box my={2}>
                    <Divider />
                </Box>
                <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
                    <span> Secure by <span style={{fontWeight:700}}>Websparks</span> </span>
                </Box>
            </Box>
        </Dialog>
    );
};

export default Login;