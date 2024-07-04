import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import image2 from './images/image.png';

const VerifyOtp = () => {
    const [userData, setUserData] = useState({});
    const [VerifyOtpValues, setVerifyOtpValues] = useState({});

    const navigate = useNavigate();
    const [errors, seterrors] = useState([]);
    const [resErrors, setreserrors] = useState({});
    const [showModel, setshowModel] = useState(false);

    useEffect(() => {
        const updatedUser = JSON.parse(localStorage.getItem('updatedUser'));
        setUserData(updatedUser);
        console.log(updatedUser, "userData");
    }, []);

    const getError = () => {
        setTimeout(() => {
            seterrors({});
        }, 2000);
    };

    const handleVerifyOtpSubmit = async (event) => {
        event.preventDefault();

        if (!userData.email) {
            seterrors({ message: 'Please enter email' });
            setTimeout(() => seterrors({}), 2000);
            return;
        }

        if (!VerifyOtpValues.otp) {
            seterrors({ ...errors, message: 'Please Enter OTP' });
            getError();
            return;
        }

        try {
            const { otp } = VerifyOtpValues;
            const response = await fetch('http://localhost:3001/api/verifyOtp', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email: userData.email, otp: otp }),
            });
            const json = await response.json();
            if (json.message) {
                setshowModel(true);
                setreserrors(json);
                console.log(json, 'MainUserData');
            } else if (json.error) {
                setshowModel(true);
                setreserrors(json);
                console.log(json.error, 'error');
            }
        } catch (error) {
            console.error('Error during OTP verification:', error);
            // Optionally handle error state here
        }
    };

    const handleModalClose = () => {
        setshowModel(false);
    };

    const NavigateToLogin = () => {
        localStorage.removeItem('updatedUser');
        navigate('/');
    };

    const VerifyOtpform = (e) => {
        setVerifyOtpValues({ ...VerifyOtpValues, [e.target.name]: e.target.value });
    };

    const styles = {
        MainSection: {
            display: 'flex',
            justifyContent: 'center',
            loginSection: {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '90vh',
                loginSectioncard: {
                    backgroundColor: 'White',
                    padding: '30px',
                    borderRadius: '20px',
                    lineHeight: '20px',
                    width: '400px'
                }
            }
        }
    };

    return (
        <div className='container-fluid' style={{
            width: "100%",
            height: "1000px",
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            background: 'linear-gradient(135deg, #ff6f61, #ffbc67)',
        }}>
            <div style={styles.MainSection} className='row'>
                <div style={styles.MainSection.loginSection}>
                    <div style={{ backgroundColor: 'whiteSmoke', padding: '30px', borderRadius: '20px', lineHeight: '20px', width: '500px' }}>
                        <h4 style={{ textAlign: 'center' }}>Create Password Page</h4>
                        <form className='needs-validation'>
                            <label className='form-label'>Email</label>
                            <p style={{ textAlign: 'center', color: 'red' }}>OTP Sent To This Mail Id {userData.email}!</p>
                            <label className='form-label'>OTP</label>
                            <input className='form-control' placeholder='Please Enter OTP' name='otp' onChange={VerifyOtpform} type='text' required />
                            {errors.otp && <span className='text-danger'>{errors.otp}</span>}<br />
                            <div className='row mt-3'>
                                <div className='col-md-6'>
                                    <button onClick={() => navigate('/')} className='btn btn' type='submit'>Login</button>
                                </div>
                                <div className='col-md-6'>
                                    <input onClick={handleVerifyOtpSubmit} className='btn btn' type='submit' />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            {/* Modal */}
            <div className="modal" tabIndex="-1" role="dialog" style={{ display: showModel ? 'block' : 'none', backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(5px)', zIndex: 1040 }}>
                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-body text-center">
                            <img src={image2} alt="Logo" style={{ width: '100px' }} />

                            {resErrors.message && (
                                <>         <h5 className="mt-4">{resErrors.message}</h5>

                                    <div className="row mt-3">
                                        <div className="col-md-6">
                                            <button className="btn btn-success w-100" onClick={NavigateToLogin}>Ok</button>
                                        </div>
                                        <div className="col-md-6">
                                            <button className="btn btn-danger w-100" onClick={handleModalClose}>Cancel</button>
                                        </div>
                                    </div>
                                </>
                            )}
                            {resErrors.error && (
                                <>         <h5 className="mt-4">{resErrors.error}</h5>
                                    <div className="row mt-3">
                                        <div className="col-md-6">
                                            <button className="btn btn-success w-100" onClick={handleModalClose}>Ok</button>
                                        </div>
                                        <div className="col-md-6">
                                            <button className="btn btn-danger w-100" onClick={handleModalClose}>Cancel</button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyOtp;
