import axios from 'axios';
import {
    authError,
    authFailed,
    authLogout,
    authRequest,
    authSuccess,
    doneSuccess,
    getError,
    getFailed,
    getRequest,
    stuffAdded
} from './userSlice';

const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:5000';

export const loginUser = (fields, role) => async (dispatch) => {
    dispatch(authRequest());

    try {
        const url = `${BASE_URL}/${capitalize(role)}Login`;
        const result = await axios.post(url, fields, {
            headers: { 'Content-Type': 'application/json' },
        });

        console.log('Login response:', result.data);

        if (result.data.role) {
            dispatch(authSuccess(result.data));
        } else {
            dispatch(authFailed(result.data.message || 'Login failed'));
        }
    } catch (error) {
        console.error('Login error:', error);
        dispatch(authError(error.response?.data?.message || error.message));
    }
};

// ========================
// REGISTER USER
// ========================
export const registerUser = (fields, role) => async (dispatch) => {
    dispatch(authRequest());

    try {
    
        const url = `${BASE_URL}/${role.toLowerCase()}Reg`;
        
        const result = await axios.post(url, fields, {
            headers: { 'Content-Type': 'application/json' },
        });

        console.log('Registration response:', result.data);

        if (result.data.schoolName || result.data.school) {
            if (result.data.schoolName) {
                // Admin registration
                dispatch(authSuccess(result.data));
            } else {
                // Student/Teacher registration
                dispatch(stuffAdded(result.data));
            }
        } else {
            dispatch(authFailed(result.data.message || 'Registration failed'));
        }
    } catch (error) {
        console.error('Registration error:', error);
        dispatch(authError(error.response?.data?.message || error.message));
    }
};

// ========================
// LOGOUT USER
// ========================
export const logoutUser = () => (dispatch) => {
    dispatch(authLogout());
};

// ========================
// GET USER DETAILS
// ========================
export const getUserDetails = (id, address) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const token = localStorage.getItem('token');
        const config = token
            ? { headers: { Authorization: `Bearer ${token}` } }
            : {};

        const result = await axios.get(`${BASE_URL}/${address}/${id}`, config);

        if (result.data) {
            dispatch(doneSuccess(result.data));
        }
    } catch (error) {
        console.error('Get user details error:', error);
        dispatch(getError(error.response?.data?.message || error.message));
    }
};

// ========================
// DELETE USER
// ========================
export const deleteUser = (id, address) => async (dispatch) => {
    dispatch(getRequest());
    dispatch(getFailed("Sorry, the delete function has been disabled for now."));
};

// ========================
// UPDATE USER
// ========================
export const updateUser = (fields, id, address) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const token = localStorage.getItem('token');
        const config = token
            ? {
                  headers: {
                      'Content-Type': 'application/json',
                      Authorization: `Bearer ${token}`,
                  },
              }
            : { headers: { 'Content-Type': 'application/json' } };

        const result = await axios.put(
            `${BASE_URL}/${address}/${id}`,
            fields,
            config
        );

        if (result.data.schoolName) {
            dispatch(authSuccess(result.data));
        } else {
            dispatch(doneSuccess(result.data));
        }
    } catch (error) {
        console.error('Update user error:', error);
        dispatch(getError(error.response?.data?.message || error.message));
    }
};

// ========================
// ADD STUFF
// ========================
export const addStuff = (fields, address) => async (dispatch) => {
    dispatch(authRequest());

    try {
        const token = localStorage.getItem('token');
        const config = token
            ? {
                  headers: {
                      'Content-Type': 'application/json',
                      Authorization: `Bearer ${token}`,
                  },
              }
            : { headers: { 'Content-Type': 'application/json' } };

        const result = await axios.post(
            `${BASE_URL}/${address}Create`,
            fields,
            config
        );

        if (result.data.message) {
            dispatch(authFailed(result.data.message));
        } else {
            dispatch(stuffAdded(result.data));
        }
    } catch (error) {
        console.error('Add stuff error:', error);
        dispatch(authError(error.response?.data?.message || error.message));
    }
};

// ========================
// Helper Function
// ========================
function capitalize(word) {
    if (!word) return '';
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}