
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import 'react-toastify/dist/ReactToastify.css';
import image2 from './images/image.png';

const CreatePassword = () => {
    const [userData, setUserData] = useState({});
    const [CreatePasswordValues, setCreatePasswordValues] = useState({});
    const [errors, setErrors] = useState({});
    const [resErrors, setResErrors] = useState({});
    const [showModel, setShowModel] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const updatedUser = JSON.parse(localStorage.getItem('updatedUser'));
        setUserData(updatedUser || {});
    }, []);

    const getError = () => {
        setTimeout(() => {
            setErrors({});
        }, 2000);
    };

    const handleCreatePasswordSubmit = async () => {
        if (!CreatePasswordValues.otp) {
            setErrors({ message: 'Please Enter otp' });
            getError();
        } else if (!CreatePasswordValues.newPassword) {
            setErrors({ message: 'Please Enter newPassword' });
            getError();
        } else if (!CreatePasswordValues.ConfirmPassword) {
            setErrors({ message: 'Please Enter ConfirmPassword' });
            getError();
        } else if (CreatePasswordValues.newPassword !== CreatePasswordValues.ConfirmPassword) {
            setErrors({ message: 'newPassword and ConfirmPassword should be same' });
            getError();
        } else {
            try {
                const { otp, newPassword, ConfirmPassword } = CreatePasswordValues;
                const response = await fetch('http://localhost:3001/api/CreatePassword', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email: userData.email, otp, newPassword, ConfirmPassword }),
                });
                const json = await response.json();
                if (json.message) {
                    setShowModel(true);
                    setResErrors(json);
                    localStorage.removeItem('updatedUser');
                } else if (json.error) {
                    setShowModel(true);
                    setResErrors(json);
                }
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handleModalClose = () => {
        setShowModel(false);
    };

    const handleInputChange = (e) => {
        setCreatePasswordValues({ ...CreatePasswordValues, [e.target.name]: e.target.value });
    };

    const styles = {
        MainSection: {
            display: 'flex',
            justifyContent: 'center',
        },
        loginSection: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '90vh',
        },
        loginSectioncard: {
            backgroundColor: 'White',
            padding: '30px',
            borderRadius: '20px',
            lineHeight: '20px',
            width: '400px',
        },
    };

    return (
        <div
            className='container-fluid'
            style={{
                width: '100%',
                height: '1000px',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                background: 'linear-gradient(135deg, #ff6f61, #ffbc67)',
            }}
        >
            <div style={styles.MainSection} className='row'>
                <div style={styles.loginSection}>
                    <div style={{ backgroundColor: 'whiteSmoke', padding: '30px', borderRadius: '20px', lineHeight: '20px', width: '500px' }}>
                        <h4 style={{ textAlign: 'center' }}>Create Password Page</h4>
                        {errors.message && <span className='text-danger'>{errors.message}</span>}
                        <form className='needs-validation' onSubmit={(e) => e.preventDefault()}>
                            <label className='form-label'>Email</label>
                            <p>{userData.email}</p>
                            <label className='form-label'>Otp</label>
                            <input
                                className='form-control'
                                placeholder='Please Enter Otp'
                                name='otp'
                                onChange={handleInputChange}
                                type='text'
                                required
                            />
                            {errors.otp && <span className='text-danger'>{errors.otp}</span>}
                            <br />

                            <label className='form-label'>New Password</label>
                            <input
                                className='form-control'
                                placeholder='Please Enter new Password'
                                name='newPassword'
                                onChange={handleInputChange}
                                type='password'
                                required
                            />
                            {errors.newPassword && <span className='text-danger'>{errors.newPassword}</span>}
                            <br />

                            <label className='form-label'>Confirm Password</label>
                            <input
                                className='form-control'
                                placeholder='Please Enter Confirm Password'
                                name='ConfirmPassword'
                                onChange={handleInputChange}
                                type='password'
                                required
                            />
                            {errors.ConfirmPassword && <span className='text-danger'>{errors.ConfirmPassword}</span>}
                            <br />

                            <div className='row mt-3'>
                                <div className='col-md-6'>
                                    <button onClick={() => navigate('/')} className='btn btn-primary' type='button'>
                                        Login
                                    </button>
                                </div>
                                <div className='col-md-6'>
                                    <button onClick={handleCreatePasswordSubmit} className='btn btn-primary' type='button'>
                                        Submit
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            {/* Modal */}
            {showModel && (
                <div className='modal' tabIndex='-1' role='dialog' style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(5px)', zIndex: 1040 }}>
                    <div className='modal-dialog modal-dialog-centered modal-dialog-scrollable'>
                        <div className='modal-content'>
                            <div className='modal-body text-center'>
                                <img src={image2} alt='Logo' style={{ width: '100px' }} />
                                <h5 className='mt-4'>{resErrors.message}</h5>
                                {resErrors.message && (
                                    <div className='row mt-3'>
                                        <div className='col-md-6'>
                                            <button className='btn btn-success w-100' onClick={() => navigate('/CreatePassword')}>
                                                Ok
                                            </button>
                                        </div>
                                        <div className='col-md-6'>
                                            <button className='btn btn-danger w-100' onClick={handleModalClose}>
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                )}
                                {resErrors.error && (
                                    <div className='row mt-3'>
                                        <div className='col-md-6'>
                                            <button className='btn btn-success w-100' onClick={handleModalClose}>
                                                Ok
                                            </button>
                                        </div>
                                        <div className='col-md-6'>
                                            <button className='btn btn-danger w-100' onClick={handleModalClose}>
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreatePassword;
