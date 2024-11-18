import { Box, Chip, Dialog, Divider, Grid, Link, TextField, Typography } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import Logo from '../../../icons/roundedlogo.svg';
import useAuth from './useAuth';

interface LoginProps {
    verificationOpen: boolean;
    handleVerificationOpen: (email: string) => void;
    handleSignInOpen: () => void;
    handleVerficationClose: () => void;
    email: string | null;
}

const VerificationCode: React.FC<LoginProps> = ({ verificationOpen, email, handleSignInOpen, handleVerficationClose }) => {
    const { verifyEmail, resendVerificationCode } = useAuth();
    const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
    const [errors, setErrors] = useState<boolean[]>(new Array(6).fill(false));
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const [loading, setLoading] = useState(false);
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);

    useEffect(() => {
        const isFilled = verificationCode.every(digit => digit !== '');
        setIsButtonDisabled(!isFilled);
    }, [verificationCode]);

    const handleVerificationChange = (index: number, value: string) => {
        const newVerificationCode = [...verificationCode];
        newVerificationCode[index] = value.toUpperCase();
        setVerificationCode(newVerificationCode);

        if (value) {
            const newErrors = [...errors];
            newErrors[index] = false;
            setErrors(newErrors);
        }

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').toUpperCase();
        const pastedChars = pastedData.split('').slice(0, 6);

        const newVerificationCode = [...verificationCode];
        pastedChars.forEach((char, index) => {
            if (index < 6) {
                newVerificationCode[index] = char;
            }
        });

        setVerificationCode(newVerificationCode);
        const newErrors = [...errors];
        pastedChars.forEach((_, index) => {
            newErrors[index] = false;
        });
        setErrors(newErrors);
        const nextEmptyIndex = newVerificationCode.findIndex(char => char === '');
        const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
        inputRefs.current[focusIndex]?.focus();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        
        if (!email) {
            setError('Email is required');
            return;
        }

        const enteredCode = verificationCode.join('');

        if (enteredCode.length < 6) {
            setError('Verification code must be 6 digits.');
            return;
        }

        try {
            setLoading(true);
            const result = await verifyEmail(email, enteredCode);

            if (result.success) {
                window.location.reload()
                handleVerficationClose();
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResendCode = async () => {
        if (!email) {
            setError('Email is required');
            return;
        }

        setError('');
        setSuccess('');
        
        try {
            const result = await resendVerificationCode(email);
            if (result.success) {
                setSuccess(result.message);
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError('Failed to resend verification code. Please try again.');
        }
    };

    return (
        <Dialog
            open={verificationOpen}
            maxWidth={'lg'}
            sx={{
                '& .MuiDialog-paper': {
                    borderRadius: '25px',
                    width: 600,
                    border: `1px solid #d0d0d0`,
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
                <Box width={'100%'} display={'flex'} justifyContent={'center'}>
                    <Box
                        component={'img'}
                        src={Logo}
                        height={60}
                        width={'auto'}
                    />
                </Box>
                <Box my={3}>
                    <Typography fontFamily={'Montserrat'} fontSize={24} fontWeight={700} textAlign={'center'} id="dialog-title">
                        Verification Code
                    </Typography>
                    <Typography fontFamily={'Montserrat'} textAlign={'center'} id="dialog-description">
                        Enter The 6 Digit Code Sent to your Email <br /> {email}.
                    </Typography>
                </Box>
                
                <Box my={2}>
                    <Divider>
                        <Chip label="Or" size="small" sx={{fontFamily:'Montserrat'}}/>
                    </Divider>
                </Box>
                
                <form onSubmit={handleSubmit}>
                    <Box>
                        <Grid container spacing={1} justifyContent="center">
                            {verificationCode.map((digit, index) => (
                                <Grid item key={index} xs={2}>
                                    <TextField
                                        inputRef={el => inputRefs.current[index] = el}
                                        id={`verification-${index}`}
                                        type="text"
                                        inputProps={{ maxLength: 1 }}
                                        value={digit}
                                        onChange={(e) => handleVerificationChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e as React.KeyboardEvent<HTMLInputElement>)}
                                        onPaste={handlePaste}
                                        error={errors[index]}
                                        helperText={errors[index] ? 'Invalid code' : ''}
                                        sx={{
                                            width: '100%',
                                            height: '100%',
                                            textAlign: 'center',
                                            '.MuiInputBase-input': {
                                                textAlign: 'center',
                                                background: 'transparent',
                                                fontWeight: 700,
                                                fontFamily: 'Montserrat'
                                            },
                                            borderRadius: 1,
                                            border: `1px solid #d0d0d0`,
                                        }}
                                    />
                                </Grid>
                            ))}
                        </Grid>

                        <Box mt={2}>
                            {error && (
                                <Typography fontFamily={'Montserrat'} fontWeight={700} sx={{color:"red"}} textAlign="center">
                                    {error}
                                </Typography>
                            )}
                            {success && !error && (
                                <Typography fontFamily={'Montserrat'} fontWeight={700} sx={{color:"green"}} textAlign="center">
                                    {success}
                                </Typography>
                            )}
                        </Box>

                        <Box mt={2}>
                            <Box
                                onClick={handleSubmit}
                                display={'flex'}
                                justifyContent={'center'}
                                alignItems={'center'}
                                p={1}
                                border={`1px solid #d0d0d0`}
                                borderRadius={3}
                                sx={{ 
                                    background:'#000', 
                                    cursor: isButtonDisabled ? 'not-allowed' : 'pointer',
                                    opacity: isButtonDisabled ? 0.7 : 1,
                                }}
                            >
                                <Typography fontFamily={'Montserrat'} component={'span'} mr={1} color={'#FFF'}>
                                    {loading ? 'Verifying...' : `Verify Code`}
                                </Typography>
                                {!loading && <i className="bi bi-arrow-right" style={{ color: '#FFF' }}></i>}
                            </Box>

                            <Box display={'flex'} justifyContent={'center'} alignItems={'center'} my={3}>
                                <Link 
                                    onClick={handleResendCode} 
                                    underline="hover" 
                                    color="inherit" 
                                    sx={{
                                        cursor:'pointer',
                                        '&:hover': {
                                            opacity: 0.8
                                        }
                                    }}
                                >
                                    <Typography fontFamily={'Montserrat'} fontWeight={700}>
                                        Resend Verify Code
                                    </Typography>
                                </Link>
                            </Box>

                            <Box my={2}>
                                <Divider />
                            </Box>

                            <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
                                <Typography fontFamily={'Montserrat'}>
                                    Secure by <span style={{fontWeight:700}}>Websparks</span>
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </form>
            </Box>
        </Dialog>
    );
};

export default VerificationCode;