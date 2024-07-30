import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import image2 from './images/image.png';

const Forgotpassword = () => {
  // State for form values
  const [formValues, setFormValues] = useState({});
  // State for API errors
  const [errors, setErrors] = useState({});
  // State for showing modal
  const [showModal, setShowModal] = useState(false);
  // State for API response errors
  const [resErrors, setResErrors] = useState({});

  const navigate = useNavigate();

  const handleSignupSubmit = async (event) => {
    event.preventDefault();

    if (!formValues.email) {
      setErrors({ message: 'Please enter email' });
      setTimeout(() => setErrors({}), 2000);
      return;
    }

    try {
      const response = await fetch('http://localhost:3003/api/forgotpassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: formValues.email })
      });

      const json = await response.json();

      if (json.message) {
        setShowModal(true);
        setResErrors(json);
        localStorage.setItem('updatedUser', JSON.stringify(json.updatedUser));
      } else if(json.error) {
        setShowModal(true);
        setResErrors(json);
      }
    } catch (error) {
      console.error('Error:', error);
      setResErrors({ error: 'An error occurred. Please try again.' });
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleInputChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  return (
    <div className="container-fluid" style={{ background: 'linear-gradient(135deg, #ff6f61, #ffbc67)', minHeight: '100vh' }}>
      <div className="row d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="col-md-3">
          <div className="card p-4" style={{ backgroundColor: 'whiteSmoke', borderRadius: '20px' }}>
            <h4 className="text-center mb-4">Forgot Password Page</h4>
            {errors.message && <p className="text-danger text-center">{errors.message}</p>}
            <form onSubmit={handleSignupSubmit} className="needs-validation">
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input type="email" className="form-control" id="email" name="email" placeholder="Please Enter Email" onChange={handleInputChange} required />
              </div>
              <div className="row mt-3">
                <div className="col-md-6">
                  <button className="btn btn-primary w-100" type="submit">Submit</button>
                </div>
                <div className="col-md-6">
                  <button className="btn btn-secondary w-100" type="button" onClick={() => navigate('/')}>Login</button>
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
                    <button className="btn btn-success w-100" onClick={() => navigate('/CreatePassword')}>Ok</button>
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
                    <button className="btn btn w-100"  onClick={handleModalClose}>Ok</button>
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
  );
};

export default Forgotpassword;
