import React, { useEffect } from 'react';
import { API_BASE_URL } from '~/config';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useNavigate, useSearchParams } from '@remix-run/react';
import { useLocation } from '@remix-run/react';
import { ClientOnly } from 'remix-utils/client-only';

interface GitHubUserEmail {
  email: string;
  primary: boolean;
  verified: boolean;
  visibility: string | null;
}

interface GitHubUserData {
  name: string;
  avatar_url: string;
  email?: string;
  login: string;  // Adding GitHub username
}

interface LoginResponse {
  access_token: string;
  default_project_id: string;
}

interface ErrorResponse {
  detail?: string;
  message?: string;
  [key: string]: any;
}

export const AuthSuccess: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const code = searchParams.get('code');

  function generateRandomCode(length: number = 100): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }
    return result;
  }

  useEffect(() => {
    if (code && typeof window !== 'undefined') {
      exchangeCodeForAccessToken(code);
      const newUrl = window.location.origin + window.location.pathname + generateRandomCode();
      window.history.replaceState({}, document.title, newUrl);
    }
  }, [code]);

  const exchangeCodeForAccessToken = async (code: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/github/oauth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(JSON.stringify(errorData));
      }

      const data: { access_token: string } = await response.json();
      await fetchGitHubUser(data.access_token);
    } catch (error) {
      console.error('Error exchanging code for access token:', error);
      navigate('/?error=github-auth');
    }
  };

  const fetchGitHubUser = async (accessToken: string): Promise<void> => {
    try {
      // Fetch user data
      const userResponse = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!userResponse.ok) {
        throw new Error(`GitHub API error: ${userResponse.status}`);
      }

      const userData: GitHubUserData = await userResponse.json();

      // Fetch email data
      const emailResponse = await fetch('https://api.github.com/user/emails', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!emailResponse.ok) {
        throw new Error(`GitHub Email API error: ${emailResponse.status}`);
      }

      const userEmails: GitHubUserEmail[] = await emailResponse.json();
      const primaryEmail = userEmails.find((item) => item.primary === true);

      // Use fallback values if data is missing
      const name = userData.name || userData.login || 'GitHub User';
      const email = primaryEmail?.email || '';
      const avatar_url = userData.avatar_url || '';

      console.log('GitHub User Data:', {
        name,
        email,
        avatar_url,
        originalData: userData
      });
      
      await sendGithubLogin(name, avatar_url, email, null);
    } catch (error) {
      console.error('Error fetching GitHub user data:', error);
    //   navigate('/?error=github-user-fetch');
    }
  };

  const sendGithubLogin = async (
    full_name: string,
    profile_pic: string,
    email: string,
    password: string | null
  ): Promise<LoginResponse | void> => {
    try {
      const requestBody = {
        full_name,
        profile_pic,
        email,
        password
      };

      console.log('Sending login request with data:', requestBody);

      const response = await fetch(`${API_BASE_URL}/github-sign`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error('Server response error:', {
          status: response.status,
          statusText: response.statusText,
          data: responseData
        });
        throw new Error(responseData.detail || 'Failed to login with GitHub');
      }

      const result = responseData as LoginResponse;
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', result.access_token);
        localStorage.setItem('default_project', result.default_project_id);
        navigate('/');
      }
      
      return result;
    } catch (error) {
      console.error('Error in sendGithubLogin:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    //   navigate('/?error=github-login-failed');
      throw error;
    }
  };

  return (
    <ClientOnly fallback={
      <Box height={'100vh'} display={'flex'} justifyContent={'center'} alignItems={'center'}>
        <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
          <CircularProgress size={64} thickness={2} />
          <Typography fontSize={24} mt={2}>Loading...</Typography>
        </Box>
      </Box>
    }>
      {() => (
        <Box height={'100vh'} display={'flex'} justifyContent={'center'} alignItems={'center'}>
          <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
            <CircularProgress size={64} thickness={2} />
            <Typography fontSize={24} mt={2}>Logging in with GitHub...</Typography>
          </Box>
        </Box>
      )}
    </ClientOnly>
  );
};