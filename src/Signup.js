import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import 'react-toastify/dist/ReactToastify.css';
import image2 from './images/image.png';

const Signup = () => {

    // State to handle password visibility toggle
    const [iconchange, seticonchange] = useState('showIcon1')
    // State for signup form values
    const [SignupFormvalues, setSignupFormvalues] = useState({})
    // State for showing modal
    const [showModal, setShowModal] = useState(false);
    // React Router navigation
    const navigate = useNavigate()
    // handle Modal Close
    const handleModalClose = () => {
        setShowModal(false);
    };

    const NavigateToVerifyOtp = () => {
        navigate('/VerifyOtp')

    };


    // State to store API errors
    const [errors, seterrors] = useState([])
    // State to store API errors
    const [resErrors, setreserrors] = useState([])
    // Function to clear errors after a certain time
    const getError = () => {
        setTimeout(() => {
            seterrors(...errors, '')
        }, 2000);
    }


    // Function to handle signup form submission
    const handleSignupSubmitww = async (event) => {
        event.preventDefault()

        console.log(SignupFormvalues, "SignupFormvalues")
        // Validation for empty email or password
        // const emailpattend = '[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$'
        if (!SignupFormvalues.name) {
            seterrors({ ...errors, message: 'Please Enter name' })
            getError()
        } else if (!SignupFormvalues.email) {
            seterrors({ ...errors, message: 'Please Enter email' })
            getError()
        } else if (!SignupFormvalues.phonenumber) {
            seterrors({ ...errors, message: 'Please Enter phoneNumber' })
            getError()
        } else if (!SignupFormvalues.password) {
            seterrors({ ...errors, message: 'Please Enter password' })
            getError()
        } else {
            console.log('else')
            // API call for signup
            const { name, email, phonenumber, password } = SignupFormvalues
            const passwordformat = Number(phonenumber)
            console.log(passwordformat, 'passwordformat')
            const response = await fetch('http://localhost:3001/api/signup', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name, email, password, passwordformat }),
            });
            const json = await response.json();
            if (json.message) {
                setShowModal(true);
                setreserrors(json);
                
                localStorage.setItem('updatedUser', JSON.stringify(json.MainUserData));


            } else if (json.error) {
                setShowModal(true);
                setreserrors(json);
            }
        }
    }







    // Function to handle input changes in signup form
    const SignUponchange = (e) => {
        setSignupFormvalues({ ...SignupFormvalues, [e.target.name]: e.target.value })
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
                <div style={styles.MainSection.loginSection}>


                    <div style={{ backgroundColor: 'whiteSmoke', padding: '30px', borderRadius: '20px', lineHeight: '20px', width: '500px' }}>
                        <h4 style={{ textAlign: 'center' }}>SignUp Page</h4>
                        {errors.message && <span className='text-danger'>{errors.message}</span>}

                        <form className='needs-validation'>
                            <label className='form-label'>First Name</label>
                            <input className='form-control' placeholder='Please Enter First Name' name='name' onChange={SignUponchange} type='text' required />
                            {errors.name && <span className='text-danger'>{errors.name}</span>}<br />

                            <label className='form-label'>Email</label>
                            <input className='form-control' placeholder='Please Enter Email' name='email' onChange={SignUponchange} type='email' required />
                            {errors.email && <span className='text-danger'>{errors.email}</span>}<br />
                            <label className='form-label'>Phone Number</label>
                            <input className='form-control' placeholder='Please Enter Email' name='phonenumber' onChange={SignUponchange} type='number' required />
                            {errors.phonenumber && <span className='text-danger'>{errors.phonenumber}</span>}<br />

                            <label className='form-label'>Password</label>
                            <div className="form-group inner-addon right-addon">
                                <div className="input-group col-6 mx-auto">
                                    <input type={iconchange === 'showIcon1' ? 'password' : 'text'} name='password' onChange={SignUponchange} className="form-control pwd-control" placeholder="Password" required />
                                    <div>{iconchange === 'showIcon1' &&
                                        <i alt="show" className="far fa-eye eye-show"
                                            onClick={() => seticonchange('showIcon2')}
                                        ></i>}
                                        {iconchange === 'showIcon2' &&
                                            <i alt="hide" className="far fa-eye-slash eye-hide"
                                                onClick={() => seticonchange('showIcon1')}
                                            ></i>
                                        }
                                    </div>
                                </div>
                            </div>
                            {errors.password && <span className='text-danger'>{errors.password}</span>}

                            <div className='row mt-3'>
                                <div className='col-md-6'>
                                    <button onClick={() => navigate('/')} className='btn btn' type='submit'>Login</button>

                                </div>
                                <div className='col-md-6'>
                                    <input onClick={handleSignupSubmitww} className='btn btn' type='submit' />
                                </div>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
            {/* Modal */}
            <div className="modal" tabIndex="-1" role="dialog" style={{ display: showModal ? 'block' : 'none', backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(5px)', zIndex: 1040 }}>
                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-body text-center">
                            <img src={image2} alt="Logo" style={{ width: '100px' }} />

                            {resErrors.message && (
                                <>
                                    <h5 className="mt-4">{resErrors.message}</h5>

                                    <div className="row mt-3">

                                        <div className="col-md-6">
                                            <button className="btn btn-success w-100" onClick={NavigateToVerifyOtp}>Ok</button>
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
                                            <button className="btn btn w-100" onClick={handleModalClose}>Ok</button>
                                        </div>
                                        <div className="col-md-6">
                                            <button className="btn btn w-100" onClick={handleModalClose}>Cancel</button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Signup
