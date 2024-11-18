import { Box, Chip, Dialog, Divider, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import Logo from '../../../../icons/roundedlogo.svg';
import useAuth from '../useAuth';

interface PasswordSetProps {
    passwordSetOpen: boolean;
    email: string | null;
    code: string | null;
    handleSignInOpen: () => void;
}

interface FormData {
    newpassword: string;
    confirmpassword: string;
}

const PasswordSet: React.FC<PasswordSetProps> = ({ 
    passwordSetOpen, 
    email, 
    code, 
    handleSignInOpen 
}) => {
    const { resetPassword } = useAuth();
    const [formData, setFormData] = useState<FormData>({
        newpassword: '',
        confirmpassword: '',
    });
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [event.target.id]: event.target.value,
        }));
        setError(''); // Clear error when user types
    };

    const handleToggleNewPasswordVisibility = () => {
        setShowNewPassword(prev => !prev);
    };

    const handleToggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(prev => !prev);
    };

    const validatePassword = (password: string) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
        return regex.test(password);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !code) {
            setError('Email or verification code is missing');
            return;
        }

        if (!validatePassword(formData.newpassword)) {
            setError('Password must be at least 6 characters long, include an uppercase letter, a lowercase letter, a number, and a special character.');
            return;
        }

        if (formData.newpassword !== formData.confirmpassword) {
            setError('New password and confirm password must match.');
            return;
        }

        try {
            setLoading(true);
            const result = await resetPassword(email, code, formData.newpassword);

            if (result.success) {
                handleSignInOpen();
                setFormData({ newpassword: '', confirmpassword: '' });
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
            open={passwordSetOpen}
            maxWidth="lg"
            sx={{
                '& .MuiDialog-paper': {
                    borderRadius: '25px',
                    width: 600,
                    border: '1px solid #d0d0d0',
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
                        Set New Password
                    </Typography>
                    <Typography 
                        fontFamily="Montserrat" 
                        textAlign="center"
                    >
                        Please enter your new password
                    </Typography>
                </Box>

                <Box my={2}>
                    <Divider>
                        <Chip 
                            label="Or" 
                            size="small" 
                            sx={{ fontFamily: 'Montserrat' }} 
                        />
                    </Divider>
                </Box>

                <form onSubmit={handleSubmit}>
                    <Box>
                        <TextField
                            required
                            type={showNewPassword ? 'text' : 'password'}
                            id="newpassword"
                            placeholder="Enter Your New Password"
                            fullWidth
                            variant="outlined"
                            value={formData.newpassword}
                            onChange={handleChange}
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
                                            onClick={handleToggleNewPasswordVisibility}
                                            edge="end"
                                        >
                                            {showNewPassword ? 
                                                <i className="bi bi-eye-slash" /> : 
                                                <i className="bi bi-eye" />
                                            }
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <TextField
                            required
                            type={showConfirmPassword ? 'text' : 'password'}
                            id="confirmpassword"
                            placeholder="Confirm Your New Password"
                            fullWidth
                            variant="outlined"
                            value={formData.confirmpassword}
                            onChange={handleChange}
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
                                            onClick={handleToggleConfirmPasswordVisibility}
                                            edge="end"
                                        >
                                            {showConfirmPassword ? 
                                                <i className="bi bi-eye-slash" /> : 
                                                <i className="bi bi-eye" />
                                            }
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        {error && (
                            <Box mt={2}>
                                <Typography 
                                    fontFamily="Montserrat" 
                                    fontWeight={700} 
                                    textAlign="center" 
                                    color="red"
                                >
                                    {error}
                                </Typography>
                            </Box>
                        )}

                        <Box mt={2}>
                            <Box
                                onClick={!loading ? handleSubmit : undefined}
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                                p={1}
                                border="1px solid #000"
                                borderRadius={3}
                                sx={{ 
                                    background: '#000', 
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    opacity: loading ? 0.7 : 1,
                                }}
                            >
                                <Typography 
                                    fontFamily="Montserrat" 
                                    component="span" 
                                    mr={1} 
                                    color="#FFF"
                                >
                                    {loading ? 'Processing...' : 'Continue'}
                                </Typography>
                                {!loading && <i className="bi bi-arrow-right" style={{ color: '#FFF' }} />}
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

export default PasswordSet;