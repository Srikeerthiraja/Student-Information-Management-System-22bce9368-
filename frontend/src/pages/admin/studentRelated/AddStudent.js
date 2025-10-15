import { CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import Popup from '../../../components/Popup';
import { getAllSclasses } from '../../../redux/sclassRelated/sclassHandle';
import { registerUser } from '../../../redux/userRelated/userHandle';
import { underControl } from '../../../redux/userRelated/userSlice';

const AddStudent = ({ situation }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = useParams();

    const userState = useSelector(state => state.user);
    const { status, currentUser, response, error } = userState;
    const { sclassesList } = useSelector((state) => state.sclass);

    // State hooks
    const [name, setName] = useState('');
    const [rollNum, setRollNum] = useState('');
    const [password, setPassword] = useState('');
    const [className, setClassName] = useState('');
    const [sclassName, setSclassName] = useState('');
    const [errors, setErrors] = useState({}); // Validation errors
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");
    const [loader, setLoader] = useState(false);

    const adminID = currentUser._id;
    const role = "Student";
    const attendance = [];

    // Set sclassName if coming from Class page
    useEffect(() => {
        if (situation === "Class") {
            setSclassName(params.id);
        }
    }, [params.id, situation]);

    // Load all classes for dropdown
    useEffect(() => {
        dispatch(getAllSclasses(adminID, "Sclass"));
    }, [adminID, dispatch]);

    // Handle class selection change
    const changeHandler = (event) => {
        if (event.target.value === 'Select Class') {
            setClassName('Select Class');
            setSclassName('');
        } else {
            const selectedClass = sclassesList.find(
                (classItem) => classItem.sclassName === event.target.value
            );
            setClassName(selectedClass.sclassName);
            setSclassName(selectedClass._id);
        }
    };

    // Form fields object
    const fields = { name, rollNum, password, sclassName, adminID, role, attendance };

    // Validation
    const validateForm = () => {
        const newErrors = {};
        if (!name.trim()) newErrors.name = 'Name is required';
        if (!rollNum || rollNum < 1) newErrors.rollNum = 'Valid roll number required';
        if (!password || password.length < 6) newErrors.password = 'Password must be 6+ characters';
        if (!sclassName) newErrors.sclassName = 'Class is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Form submission
    const submitHandler = (event) => {
        event.preventDefault();

        if (!validateForm()) {
            setMessage('Please fix validation errors');
            setShowPopup(true);
            return;
        }

        setLoader(true);
        dispatch(registerUser(fields, role));
    };

    // Handle backend status updates
    useEffect(() => {
        if (status === 'added') {
            dispatch(underControl());
            navigate(-1);
        } else if (status === 'failed') {
            setMessage(response);
            setShowPopup(true);
            setLoader(false);
        } else if (status === 'error') {
            setMessage("Network Error");
            setShowPopup(true);
            setLoader(false);
        }
    }, [status, navigate, error, response, dispatch]);

    return (
        <>
            <div className="register">
                <form className="registerForm" onSubmit={submitHandler}>
                    <span className="registerTitle">Add Student</span>

                    <label>Name</label>
                    <input
                        className="registerInput"
                        type="text"
                        placeholder="Enter student's name..."
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        autoComplete="name"
                        required
                    />
                    {errors.name && <p className="error">{errors.name}</p>}

                    {situation === "Student" && (
                        <>
                            <label>Class</label>
                            <select
                                className="registerInput"
                                value={className}
                                onChange={changeHandler}
                                required
                            >
                                <option value="Select Class">Select Class</option>
                                {sclassesList.map((classItem, index) => (
                                    <option key={index} value={classItem.sclassName}>
                                        {classItem.sclassName}
                                    </option>
                                ))}
                            </select>
                            {errors.sclassName && <p className="error">{errors.sclassName}</p>}
                        </>
                    )}

                    <label>Roll Number</label>
                    <input
                        className="registerInput"
                        type="number"
                        placeholder="Enter student's Roll Number..."
                        value={rollNum}
                        onChange={(e) => setRollNum(e.target.value)}
                        required
                    />
                    {errors.rollNum && <p className="error">{errors.rollNum}</p>}

                    <label>Password</label>
                    <input
                        className="registerInput"
                        type="password"
                        placeholder="Enter student's password..."
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="new-password"
                        required
                    />
                    {errors.password && <p className="error">{errors.password}</p>}

                    <button className="registerButton" type="submit" disabled={loader}>
                        {loader ? <CircularProgress size={24} color="inherit" /> : "Add"}
                    </button>
                </form>
            </div>
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </>
    );
};

export default AddStudent;
