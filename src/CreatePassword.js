import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import 'react-toastify/dist/ReactToastify.css';
import image2 from './images/image.png';

const CreatePassword = () => {
    const [userData, setUserData] = useState({});
    const [CreatePasswordValues, setCreatePasswordValues] = useState({})
    const [errors, setErrors] = useState({})
    const [resErrors, setResErrors] = useState({});
    const [showModel, setshowModel] = useState(false)
    const navigate = useNavigate()
    
    const handleModalClose = () => {
        setshowModel(false)
    }
    // Function to handle input changes in signup form
    const CreatePasswordform = (e) => {
        setCreatePasswordValues({ ...CreatePasswordValues, [e.target.name]: e.target.value })
    }
    // Effect hook to handle initial dashboard setup
    useEffect(() => {
        // Retrieving data from local storage
        const updatedUser = JSON.parse(localStorage.getItem('updatedUser'));
        setUserData(updatedUser || {});
    }, [])
    // State for signup form values
    const getError = () => {
        setTimeout(() => {
            setErrors({});
        }, 2000);
    }
    // Function to handle signup form submission
    const handleCreatePasswordSubmitww = async () => {

        // Validation for empty email or password
        // const emailpattend = '[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$'
        if (!CreatePasswordValues.otp) {
            setErrors({ ...errors, message: 'Please Enter otp' });
            getError()
        } else if (!CreatePasswordValues.newPassword) {
            setErrors({ ...errors, message: 'Please Enter newPassword' });
            getError()
        } else if (!CreatePasswordValues.ConfirmPassword) {
            setErrors({ ...errors, message: 'Please Enter ConfirmPassword' });
            getError()
        } else if (CreatePasswordValues.newPassword !== CreatePasswordValues.ConfirmPassword) {
            setErrors({ ...errors, message: 'newPassword and ConfirmPassword should be same' });
            getError()
        } else {
            try {
                // API call for signup
                const { otp, newPassword, ConfirmPassword } = CreatePasswordValues;
                const response = await fetch('http://localhost:3003/api/CreatePassword', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ email: userData.email, otp, newPassword, ConfirmPassword }),
                });
                const json = await response.json();
                if (json.message) {
                    setshowModel(true)
                    setResErrors(json)
                    localStorage.removeItem('updatedUser')

                } else if (json.error) {
                    setshowModel(true)
                    setResErrors(json)
                }
            } catch (error) {
                console.error(error);
            }

        }
    }

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
            },
        }
    }
    return (

        <div className='container-fluid' style={{
            width: "100%",
            height: "1000px",
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            background: 'linear-gradient(135deg, #ff6f61, #ffbc67)',


        }} >

            <div style={styles.MainSection} className='row' >
                <div style={styles.MainSection.loginSection} >


                    <div style={{ backgroundColor: 'whiteSmoke', padding: '30px', borderRadius: '20px', lineHeight: '20px', width: '500px' }}>
                        <h4 style={{ textAlign: 'center' }}>Create Password Page</h4>
                        {errors.message && <span className='text-danger'>{errors.message}</span>}

                        <form className='needs-validation' onSubmit={(e) => e.preventDefault()}>

                            <label className='form-label'>Email</label>
                            <p>{userData.email}</p>


                            <label className='form-label'>Otp</label>
                            <input className='form-control' placeholder='Please Enter Otp' name='otp' onChange={CreatePasswordform} type='text' required />
                            {errors.otp && <span className='text-danger'>{errors.otp}</span>}<br />

                            <label className='form-label'>New Password</label>
                            <input className='form-control' placeholder='Please Enter new Password' name='newPassword' onChange={CreatePasswordform} type='text' required />
                            {errors.newPassword && <span className='text-danger'>{errors.newPassword}</span>}<br />

                            <label className='form-label'>Confirm Password</label>
                            <input className='form-control' placeholder='Please Enter Confirm Password' name='ConfirmPassword' onChange={CreatePasswordform} type='text' required />
                            {errors.ConfirmPassword && <span className='text-danger'>{errors.ConfirmPassword}</span>}<br />


                            <div className='row mt-3'>
                                <div className='col-md-6'>
                                    <button onClick={() => navigate('/')} className='btn btn' type='submit'>Login</button>

                                </div>
                                <div className='col-md-6'>
                                    <button onClick={handleCreatePasswordSubmitww} className='btn btn'>Submit</button>

                                </div>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
            {/* Modal */}
            {
                showModel && (
                    <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(5px)', zIndex: 1040 }}>
                        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                            <div className="modal-content">
                                <div className="modal-body text-center">
                                    <img src={image2} alt="Logo" style={{ width: '100px' }} />
                                    {resErrors.message && (
                                        <> 
                                         <h5 className="mt-4">{resErrors.message}</h5>
                                            <div className="row mt-3">
                                                <div className="col-md-6">
                                                    <button className="btn btn-success w-100" onClick={() => navigate('/')}>Ok</button>
                                                </div>
                                                <div className="col-md-6">
                                                    <button className="btn btn-danger w-100" onClick={handleModalClose}>Cancel</button>
                                                </div>
                                            </div>
                                        </>
                                    )}     {resErrors.error && (
                                        <>
                                        <h5 className="mt-4">{resErrors.error}</h5>
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
                )
            }


        </div>
    )
}

export default CreatePassword
