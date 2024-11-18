import { useEffect, useState } from 'react';
import { API_BASE_URL } from '~/config';

export interface User {
    full_name: string;
    fp_code_expire: string | null;
    access_token: string;
    role: string;
    created_at: string;
    status: string;
    theme: string;
    register_type: string;
    language: string;
    ev_code: string | null;
    register_ip: string;
    id: number;
    profile_pic: string;
    email: string;
    ev_code_expire: string | null;
    login_ip: string;
    email_verified: boolean;
    fp_code: string | null;
}

interface Plan {
    user_id: number;
    plan_id: number;
    price: number;
    plan_end_date: string;
    remaining_request: number;
    last_access_time: string | null;
    unlimited_access: boolean;
    id: number;
    name: string;
    plan_start_date: string;
    total_request: number;
    status: string;
    remaining_chat_time: number;
}

interface UserResponse {
    user: User;
    user_plan: Plan;
}

const getStoredToken = (): string | null => {
    try {
        return localStorage.getItem('token');
    } catch (error) {
        console.error('Error accessing localStorage:', error);
        return null;
    }
};

export const UserMe = async (token: string): Promise<UserResponse | null> => {
    if (!token) {
        console.error('No token provided');
        return null;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/user/me`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            if (response.status === 401) {
                // Token is invalid or expired
                localStorage.removeItem('token');
                localStorage.removeItem('default_project');
                window.location.reload();
                return null;
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: UserResponse = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching user data:', error);
        return null;
    }
};

const useUser = () => {
    const [user, setUser] = useState<User | null>(null);
    const [plan, setPlan] = useState<Plan | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;
        const token = getStoredToken();

        const fetchUserData = async () => {
            if (!token) {
                setLoading(false);
                setError('No authentication token found.');
                return;
            }

            try {
                setLoading(true);
                setError(null);
                const result = await UserMe(token);
                
                if (isMounted && result) {
                    setUser(result.user);
                    setPlan(result.user_plan);
                } else if (isMounted) {
                    setError('Failed to fetch user data.');
                }
            } catch (err) {
                if (isMounted) {
                    setError('An error occurred while fetching user data.');
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchUserData();

        return () => {
            isMounted = false;
        };
    }, []);

    const refetchUser = async () => {
        const token = getStoredToken();
        if (!token) {
            setError('No authentication token found.');
            return;
        }

        setLoading(true);
        try {
            const result = await UserMe(token);
            if (result) {
                setUser(result.user);
                setPlan(result.user_plan);
                setError(null);
            } else {
                setError('Failed to fetch user data.');
            }
        } catch (err) {
            setError('An error occurred while fetching user data.');
        } finally {
            setLoading(false);
        }
    };

    return { 
        getStoredToken,
        user, 
        plan,
        loading,
        error,
        refetchUser
    };
};

export default useUser;