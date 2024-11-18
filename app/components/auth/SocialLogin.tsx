import { Box, Grid, Typography, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import Google from '../../../icons/google.png';
import Github from '../../../icons/github.png';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { API_BASE_URL } from '~/config';

// Google Sign-In Types
interface PromptMomentNotification {
    isDisplayed(): boolean;
    isNotDisplayed(): boolean;
    getNotDisplayedReason(): string;
    isDismissedMoment(): boolean;
    getDismissedReason(): string;
    isSkippedMoment(): boolean;
    getSkippedReason(): string;
}

interface GoogleCredentialResponse {
    credential?: string;
}

interface GsiButtonConfiguration {
    type: 'standard' | 'icon';
    theme?: 'outline' | 'filled_blue' | 'filled_black';
    size?: 'large' | 'medium' | 'small';
    text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
    shape?: 'rectangular' | 'pill' | 'circle' | 'square';
    logo_alignment?: 'left' | 'center';
    width?: string | number;
    locale?: string;
}

// Extending Window interface
declare global {
    interface Window {
        google?: {
            accounts: {
                id: {
                    initialize: (config: {
                        client_id: string;
                        callback: (response: GoogleCredentialResponse) => void;
                        auto_select?: boolean;
                        cancel_on_tap_outside?: boolean;
                    }) => void;
                    prompt: (
                        momentListener?: (res: PromptMomentNotification) => void
                    ) => void;
                    renderButton: (
                        parent: HTMLElement,
                        options: GsiButtonConfiguration,
                        clickHandler?: () => void
                    ) => void;
                    disableAutoSelect: () => void;
                };
            };
        };
    }
}

interface CodeResponse {
    access_token: string;
    credential?: string;
}
interface GithubData {
    fullName: string;
    Email: string;
    ProfilePicture:string;
}

interface HeaderProps {
    setSubmitError: (title: string) => void;
}

const SocialLogin: React.FC<HeaderProps> = ({ setSubmitError }) => {
    const theme = useTheme();
    const [user, setUser] = useState<CodeResponse | null>(null);
    const [isGoogleInitialized, setIsGoogleInitialized] = useState(false);
    const [guthubData, setGithubData] = useState<GithubData | null>(null)

    const GITHUB_CLIENT_ID = 'Ov23lidS8sgRLAPkYCCh';
    const REDIRECT_URI = `${window.location.origin}/auth/github`;

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;
        
        const loadGoogleScript = () => {
            const script = document.createElement('script');
            script.src = 'https://accounts.google.com/gsi/client';
            script.async = true;
            script.defer = true;
            document.head.appendChild(script);

            script.onload = () => {
                if (window.google) {
                    initializeGSI();
                } else {
                    setSubmitError('Failed to load Google authentication service');
                }
            };

            script.onerror = () => {
                setSubmitError('Failed to load Google authentication script');
            };
        };

        const initializeGSI = () => {
            try {
                window.google?.accounts.id.initialize({
                    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
                    callback: handleGoogleCallback,
                    auto_select: false,
                    cancel_on_tap_outside: true,
                });
                setIsGoogleInitialized(true);
            } catch (error) {
                setSubmitError('Failed to initialize Google Sign-In');
            }
        };

        loadGoogleScript();

        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, []);

    const handleGitHubLogin = () => {
        const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(
          REDIRECT_URI
        )}&scope=user:email`;
        window.location.href = githubAuthUrl;
      };
    const handleFedCMError = (error: unknown) => {
        if (error instanceof Error) {
            if (error.message.includes('AbortError')) {
                setSubmitError('Google Sign-In was cancelled or timed out. Please try again.');
            } else if (error.message.includes('NetworkError')) {
                setSubmitError('Network error occurred during Sign-In. Please check your connection and try again.');
            } else if (error.message.includes('Not signed in')) {
                setSubmitError('Sign-In was not completed. Please try again.');
            } else {
                setSubmitError(`You are not Sign-In any Google account in browser`);
            }
        } else {
            setSubmitError('An unexpected error occurred during Google Sign-In');
        }
    };

    const handleGoogleCallback = async (response: GoogleCredentialResponse) => {
        try {
            if (response.credential) {
                const decoded = JSON.parse(atob(response.credential.split('.')[1]));
                await sendLogin(
                    decoded.name,
                    decoded.picture,
                    decoded.email,
                    null,
                    response.credential
                );
            } else {
                setSubmitError('Invalid Google authentication response');
            }
        } catch (error) {
            handleFedCMError(error);
            console.error('Error processing Google response:', error);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            if (!window.google?.accounts.id) {
                setSubmitError('Google Sign-In is not properly initialized. Please refresh the page and try again.');
                return;
            }

            const signInPromise = new Promise((resolve, reject) => {
                const timeoutId = setTimeout(() => {
                    reject(new Error('Sign-In request timed out'));
                }, 30000);

                window.google!.accounts.id.prompt((notification: PromptMomentNotification) => {
                    clearTimeout(timeoutId);
                    if (notification.isNotDisplayed()) {
                        reject(new Error(`Sign-In prompt not displayed: ${notification.getNotDisplayedReason()}`));
                    } else if (notification.isSkippedMoment()) {
                        reject(new Error('Sign-In was skipped'));
                    } else if (notification.isDismissedMoment()) {
                        reject(new Error(`Sign-In was dismissed: ${notification.getDismissedReason()}`));
                    } else {
                        resolve(notification);
                    }
                });
            });

            await signInPromise;
        } catch (error) {
            handleFedCMError(error);
            console.error('Google login error:', error);
        }
    };

    const sendLogin = async (
        full_name: string, 
        profile_pic: string, 
        email: string, 
        password: string | null,
        credential?: string
    ) => {
        try {
            const response = await fetch(`${API_BASE_URL}/google-sign`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    full_name, 
                    profile_pic, 
                    email, 
                    password,
                    credential
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Login failed');
            }

            const result = await response.json();
            localStorage.setItem('token', result.access_token);
            localStorage.setItem('default_project', result.default_project_id);
            window.location.reload();
            return result;
        } catch (error) {
            if (error instanceof Error) {
                setSubmitError(error.message);
            } else {
                setSubmitError('An unexpected error occurred during login');
            }
            console.error('Login error:', error);
            throw error;
        }
    };

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
                <Box
                    onClick={handleGoogleLogin}
                    p={1}
                    display="flex"
                    justifyContent={'center'}
                    alignItems="center"
                    border={`1px solid ${theme.palette.secondary.main}`}
                    borderRadius={2}
                    sx={{ cursor: 'pointer' }}
                >
                    <Box component="img" src={Google} width={20} height={20} alt="Google Logo" />
                    <Typography ml={1}>Google</Typography>
                </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
                <Box
                    p={1}
                    display="flex"
                    justifyContent={'center'}
                    alignItems="center"
                    border={`1px solid ${theme.palette.secondary.main}`}
                    borderRadius={2}
                    sx={{ cursor: 'pointer' }}
                    onClick={handleGitHubLogin}
                >
                    <Box component="img" src={Github} width={20} height={20} alt="Github Logo" />
                    <Typography ml={1}>Github</Typography>
                </Box>
            </Grid>
            <div id="google-signin-button" style={{ display: 'none' }}></div>
        </Grid>
    );
};

export default SocialLogin;