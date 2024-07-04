import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import image2 from './images/image.png';

const Login = () => {

    // React Router navigation
    const navigate = useNavigate()

    // State for login form values
    const [Formvalues, setFormvalues] = useState()

    // State to handle password visibility toggle
    const [iconchange, seticonchange] = useState('showIcon1')
    // State to store API errors
    const [errors, seterrors] = useState([])

    // Function to clear errors after a certain time
    const getError = () => {
        setTimeout(() => {
            seterrors(...errors, '')
        }, 2000);
    }
    // Function to handle login form submission
    const handleSubmit = async (event) => {
        event.preventDefault()
        if (Formvalues === undefined) {
            seterrors({ ...errors, message: 'Please Enter Email Or Password' })
            getError()
        } else if (!Formvalues.email) {
            seterrors({ ...errors, email: 'Please Enter Email' })
            getError()
        } else if (!Formvalues.password) {
            seterrors({ ...errors, password: 'Please Enter password' })
            getError()
        } else {
            const { email, password } = Formvalues
            const response = await fetch('https://demo-backend-1-qtq9.onrender.com/api/login', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password }),
            });
            const json = await response.json();
            // Save auth token
            localStorage.setItem('token', json.token)
            localStorage.setItem('userDetails', JSON.stringify(json.userDetails))
            console.log(json)
            if (json.message === 'Login Successfully') {
                toast.success("Login Successfully!")
                setTimeout(() => {
                    navigate("/Dashboard/Home")
                }, 2000);
            } else {
                setTimeout(() => {
                    toast.error(json.error)
                }, 2000);
            }
            // alert("Account Created Successfully", "success");
        }
    }
    const HandleSignupSubmit = (event) => {
        event.preventDefault()
        navigate('/Signup')
    }
    // Function to handle input changes in login form
    const onchange = (e) => {
        setFormvalues({ ...Formvalues, [e.target.name]: e.target.value })
    }
    // Function to handle input changes in signup form
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

                    <div style={styles.MainSection.loginSection.loginSectioncard} >
                        <h4 style={{ textAlign: 'center' }}>Login</h4>
                        {/* <div>
                                <button onClick={notify}>Notify!</button>
                                <ToastContainer />
                            </div> */}
                        {errors.message && <span className='text-danger'>{errors.message}</span>}

                        <form>
                            <label className='form-label'>Email</label>
                            <input className='form-control' placeholder='Please Enter Email' name='email' onChange={onchange} type='email' required />
                            {errors.email && <span className='text-danger'>{errors.email}</span>}
                            <label className='form-label'>Password</label>
                            <div className="form-group inner-addon right-addon">
                                <div className="input-group col-6 mx-auto">
                                    <input type={iconchange === 'showIcon1' ? 'password' : 'text'} name='password' onChange={onchange} className="form-control pwd-control" placeholder="Password" required />
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
                            <button className='btn btn22 mt-3' onClick={handleSubmit}  >Login</button>
                            <span style={{ fontSize: '14px', fontWeight: 'bold' }} onClick={() => navigate('/Forgotpassword')}>Forgot Password?</span><br />
                            <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Don't have an account?<a onClick={HandleSignupSubmit}>Signup</a></span>
                        </form>

                    </div>


                </div>
            </div>

            <ToastContainer />
        </div>

    )
}

export default Login
