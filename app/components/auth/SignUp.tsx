import { Box, Chip, CircularProgress, Dialog, Divider, IconButton, InputAdornment, InputLabel, Link, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import Logo from '../../../icons/roundedlogo.svg';
import SocialLogin from './SocialLogin';
import useAuth from './useAuth';

interface SignUpProps {
    signUpOpen: boolean;
    handleSignUpClose: () => void;
    handleSignInOpen: () => void;
    handleVerficationOpen: (email: string) => void;
}

interface FormData {
    name: string;
    email: string;
    password: string;
}

interface FormErrors {
    name?: string;
    email?: string;
    password?: string;
}

const SignUp: React.FC<SignUpProps> = ({ signUpOpen, handleSignUpClose, handleSignInOpen, handleVerficationOpen }) => {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        password: '',
    });
    const { register } = useAuth();
    const [formErrors, setFormErrors] = useState<FormErrors>({});
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState(false);

    const validateName = (name: string) => {
        if (!name) return 'Name is required';
        if (name.length < 2) return 'Name must be at least 2 characters long';
        return '';
    };

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) return 'Email is required';
        if (!emailRegex.test(email)) return 'Enter a valid email address';
        return '';
    };

    const validatePassword = (password: string) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
        if (!password) return 'Password is required';
        if (!passwordRegex.test(password)) {
            return 'Password must contain at least 6 characters, 1 lowercase, 1 uppercase, 1 number, and 1 special character';
        }
        return '';
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
        
        // Clear previous error for this field
        setFormErrors(prev => ({ ...prev, [id]: '' }));
        
        // Clear general error message
        setError('');
    };

    const handleTogglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // Validate all fields
        const nameError = validateName(formData.name);
        const emailError = validateEmail(formData.email);
        const passwordError = validatePassword(formData.password);

        if (nameError || emailError || passwordError) {
            setFormErrors({
                name: nameError,
                email: emailError,
                password: passwordError,
            });
            setIsLoading(false);
            return;
        }

        try {
            const result = await register({
                name: formData.name,
                email: formData.email,
                password: formData.password
            });

            if (result.success) {
                handleVerficationOpen(formData.email);
                handleSignUpClose();
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog
            open={signUpOpen}
            onClose={handleSignUpClose}
            maxWidth="lg"
            sx={{
                '& .MuiDialog-paper': {
                    borderRadius: '25px',
                    width: 600,
                    border: '1px solid',
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
                        Create your account
                    </Typography>
                    <Typography fontFamily="Montserrat" textAlign="center">
                        Welcome! Please fill in the details to get started.
                    </Typography>
                </Box>

                <Box>
                    <SocialLogin setSubmitError={setError} />
                </Box>

                <Box my={2}>
                    <Divider>
                        <Chip sx={{ fontFamily: 'Montserrat' }} label="Or" size="small" />
                    </Divider>
                </Box>

                <form onSubmit={handleSubmit}>
                    <Box>
                        <TextField
                            required
                            type="text"
                            id="name"
                            placeholder="Enter Your Full Name"
                            fullWidth
                            variant="outlined"
                            value={formData.name}
                            onChange={handleChange}
                            error={!!formErrors.name}
                            sx={{
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
                                },
                            }}
                        />
                        <InputLabel sx={{ fontSize: 12, color: 'red', ml: 2 }}>{formErrors.name}</InputLabel>

                        <TextField
                            required
                            type="email"
                            id="email"
                            placeholder="Enter Your Email"
                            fullWidth
                            variant="outlined"
                            value={formData.email}
                            onChange={handleChange}
                            error={!!formErrors.email}
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
                                },
                            }}
                        />
                        <InputLabel sx={{ fontSize: 12, color: 'red', ml: 2 }}>{formErrors.email}</InputLabel>

                        <TextField
                            required
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            placeholder="Enter Your Password"
                            fullWidth
                            variant="outlined"
                            value={formData.password}
                            onChange={handleChange}
                            error={!!formErrors.password}
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
                                },
                            }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={handleTogglePasswordVisibility}
                                            edge="end"
                                        >
                                            {showPassword ? <i className="bi bi-eye-slash" /> : <i className="bi bi-eye" />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <InputLabel sx={{ fontSize: 12, color: 'red', ml: 2 }}>{formErrors.password}</InputLabel>

                        {error && (
                            <Box mt={2}>
                                <Typography fontFamily="Montserrat" textAlign="center" color="red" fontWeight={700}>
                                    {error}
                                </Typography>
                            </Box>
                        )}

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
                                    cursor: 'pointer',
                                    '&:hover': {
                                        opacity: 0.9
                                    }
                                }}
                            >
                                {isLoading ? (
                                    <CircularProgress color="inherit" size={20} sx={{ color: '#FFF' }} />
                                ) : (
                                    <>
                                        <Typography fontFamily="Montserrat" component="span" mx={1} color="#FFF">
                                            Continue
                                        </Typography>
                                        <i className="bi bi-arrow-right" style={{ color: '#FFF' }} />
                                    </>
                                )}
                            </Box>
                        </Box>
                    </Box>
                </form>

                <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
                    <Typography fontFamily="Montserrat">
                        Already have an Account?{' '}
                        <Link 
                            onClick={() => {
                                handleSignUpClose();
                                handleSignInOpen();
                            }}
                            sx={{ 
                                cursor: 'pointer',
                                textDecoration: 'none',
                                '&:hover': {
                                    textDecoration: 'underline'
                                }
                            }}
                        >
                            Login
                        </Link>
                    </Typography>
                </Box>

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

export default SignUp;