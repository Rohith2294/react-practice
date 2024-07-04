import React, { useEffect, useState } from 'react'; // Importing React, useEffect, and useState hooks
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'; // Importing components from Reactstrap for UI
import image from '../images/edit.png'; // Importing an image
import image2 from '../images/image.png'
const Home = (args) => {
  // State variables
  const [viewToggle, setToggle] = useState('AllDetails'); // Toggle between AllDetails and viewDetails views
  const [clickedData, setClickedData] = useState(''); // Data clicked for viewing details

  // State for handling form errors
  const [errors, setErrors] = useState([]);
  // State for showing modal
  const [showModal, setShowModal] = useState(false);
  // State for API response errors
  const [resErrors, setResErrors] = useState({});
  // create Contacts data
  const [modal, setModal] = useState(false); // State for creating notes modal
  const [createuserform, setcreateuserform] = useState({}); // Form state for edit user

  // edit Contacts data
  const [editusertoggleModal, seteditusertoggle] = useState(false); // State for edit user modal
  const [edituserDatawwww, setEditUserData] = useState([]); // Data of the user to be edited
  const [edituserForm, setEditUserObject] = useState({ name: '' }); // Form state for edit user

  const handleModalClose = () => {

      setModal(false)
      setShowModal(false);
    
  };

  // List of all Contacts
  const [Contacts, setContactslist] = useState([]);


  // Toggle modal for creating note
  const toggle = () => setModal(!modal);

  // Toggle modal for editing user
  const editusertoggle = (e) => {
    setEditUserObject(e);
    setEditUserData(e);
    seteditusertoggle(!editusertoggleModal);
  };

  // Function to handle switching views and displaying user details
  const handleData = (e) => {
    console.log(e, "handleData");
    setToggle('viewDetails');
    setClickedData(e);
  };

  // Fetch all Contacts on component mount
  useEffect(() => {
    getallContacts()
    setTimeout(() => {
    }, 3000)
  }, []);



  // get all Contacts function
  const getallContacts = () => {
    const userId = JSON.parse(localStorage.getItem('userDetails'))
    console.log(userId, 'userId')
    fetch('https://demo-backend-1-qtq9.onrender.com/api/getContacts', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json', // Ensure the headers are specified
        Authorization: "Bearer" + ' ' + localStorage.getItem("token"), // Include token in the headers for authorization
      },
      body: JSON.stringify({ userId: userId._id })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Fetched data:', data);
        setContactslist(data.Contacts); // Update state with fetched user data
      })
      .catch(error => {
        console.error("Error fetching data:", error.message);
      });
  }
  // Handle form submission for Edit User
  const handleeditContactsubmit = async (e) => {
    e.preventDefault();
    if (!edituserForm.title) {
      setErrors({ ...errors, message: '' }); // Set an error message if the title is missing
    }
    const token = localStorage.getItem("token")
    const response = await fetch('http://localhost:3001/api/editUser', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token, // Ensure there is a 
      },
      body: JSON.stringify({
        name: edituserForm.name ? edituserForm.name : edituserDatawwww.name,
        age: edituserForm.age ? edituserForm.age : edituserDatawwww.age,
        phoneNumber: edituserForm.phoneNumber ? edituserForm.phoneNumber : edituserDatawwww.phoneNumber,
        address: edituserForm.address ? edituserForm.address : edituserDatawwww.address,
        id: edituserDatawwww._id
      }),
    });
    const edituserresponse = await response.json();
    if (edituserresponse.error) {
      alert(edituserresponse.error)
    } else {
      getallContacts()
      seteditusertoggle(false);
    }
  };
  // Handle form submission for Edit User
  const handleCreateContactsubmit = async (e) => {
    e.preventDefault();
    if (!createuserform.name) {
      setErrors({ ...errors, message: 'Please Enter Name' });
    } else if (!createuserform.age) {
      setErrors({ ...errors, message: 'Please Enter age' });
    } else if (!createuserform.phoneNumber) {
      setErrors({ ...errors, message: 'Please Enter phoneNumber' });
    } else if (!createuserform.address) {
      setErrors({ ...errors, message: 'Please Enter address' });
    } else {
      const name = createuserform.name
      const age = Number(createuserform.age)
      const phoneNumber = Number(createuserform.phoneNumber)
      const address = createuserform.age
      const userId = JSON.parse(localStorage.getItem('userDetails'))
      console.log(createuserform, 'createuserform')
      const token = localStorage.getItem("token")
      const response = await fetch('https://demo-backend-1-qtq9.onrender.com/api/createContact', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token, // Ensure there is a 
        },
        body: JSON.stringify({ name, age, phoneNumber, address, userId: userId._id }),
      });
      const responseData = await response.json();
      if (responseData.error) {
        setShowModal(true)
        setModal(false);
        setResErrors(responseData)
      } else {
        setModal(false);
        setShowModal(true)
        setResErrors(responseData)
        getallContacts()
        console.log(responseData, 'response')
      }
    }
  };
  // Handle form submission for delete User
  const deleteUser = async (e) => {
    console.log(e,"localStorage")
    const userId = e._id
    const token = localStorage.getItem("token")
    const response = await fetch('https://demo-backend-1-qtq9.onrender.com/api/deleteContact', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token, // Ensure there is a 
      },
      body: JSON.stringify({ ContactId:userId }),
    });
    const responseData = await response.json();
    if (responseData.error) {
      setShowModal(true)
      setModal(false);
      setResErrors(responseData)
    } else {
      setShowModal(true)
      setModal(false);
      setResErrors(responseData)
      getallContacts()
      console.log(responseData, 'response')
    }
  }
  // edit user form fields
  const editUser = (e) => {
    setEditUserObject({ ...edituserDatawwww, [e.target.name]: e.target.value });
    // setEditUserObject({ ...edituserDatawwww, [e.target.name]: e.target.value }); // Update the form state with new input values
  };
  // Create User form fields
  const CreateUser = (e) => {
    setcreateuserform({ ...createuserform, [e.target.name]: e.target.value }); // Update the form state with new input values
  };

  return (
    <div className='container-fluid'>
      {/* Button to toggle create note modal */}
      <div>
        <div className='row mt-3' style={{ display: 'flex', justifyContent: 'end' }}>
          <div className='col-md-2'>
            <Button onClick={toggle}>
              Create User
            </Button>
          </div>
        </div>
      </div>
      {/* Cards List */}
      <div className='row'>
        {Contacts.length == 0 && <p style={{ textAlign: 'center', color: 'red' }}>No Contacts Found</p>}
        {viewToggle === 'AllDetails' &&
          Contacts.map((x, index) => {
            return (
              <div className='col-md-3 col-sm-6 mb-3' key={index}>
                <div className='card'>
                  <div className='row' style={{ display: 'flex', justifyContent: "space-between" }}>
                    <div className='col-md-4'>
                      <img src={image} style={{ width: '20px', marginLeft: '90px' }} onClick={() => editusertoggle(x)} />
                    </div>
                    <div className='col-md-4'>
                      <button className='btn btn' onClick={() => deleteUser(x)}>delete</button>
                    </div>
                  </div>
                  <div className='row'>
                    <div className='col-md-6'>
                      <p>{x.name}</p>
                      <p>{x.age}</p>
                      <p>{x.phoneNumber}</p>
                      <p>{x.address}</p>
                    </div>

                  </div>
                  <button className='btn btn' onClick={() => handleData(x)}>View Details</button>
                </div>
              </div>
            );
          })
        }
      </div>

      {/* View Cards Details */}
      {viewToggle === 'viewDetails' &&
        <div className='row'>
          <p onClick={() => setToggle('AllDetails')}>Back</p>
          <div className='col-md-3'>
            <div className='card'>
              <p>{clickedData.name}</p>
              <p>{clickedData.age}</p>
            </div>
          </div>
        </div>
      }
      {/* Edit user Modal */}
      <Modal isOpen={editusertoggleModal} toggle={editusertoggle} {...args}>
        <ModalHeader toggle={editusertoggle}>Create Contact</ModalHeader>
        <form>
          <ModalBody>
            <label className='form-label'>Name</label>
            <input type='text' name='name' value={edituserForm.name} onChange={editUser} className='form-control' placeholder='Please Enter Name' />
            <label className='form-label'>Age</label>
            <input type='number' name='age' value={edituserForm.age} onChange={editUser} className='form-control' placeholder='Please Enter Age' />
            <label className='form-label'>Phone Number</label>
            <input type='number' name='phoneNumber' value={edituserForm.phoneNumber} onChange={editUser} className='form-control' placeholder='Please Enter Phone Number' />
            <label className='form-label'>Address</label>
            <input type='text' name='address' value={edituserForm.address} onChange={editUser} className='form-control' placeholder='Please Enter Address' />
          </ModalBody>
          <ModalFooter>
            <button className='btn btn22 mt-3' onClick={handleeditContactsubmit}>Create Contact</button><br />
          </ModalFooter>
        </form>
      </Modal>
      {/* Create user modal */}
      <Modal isOpen={modal} toggle={toggle} {...args}>
        <ModalHeader toggle={toggle}>Edit Contact</ModalHeader>
        <form>
          <ModalBody>
            <p>{errors.message}</p>
            <label className='form-label'>Name</label>
            <input type='text' name='name' onChange={CreateUser} className='form-control' placeholder='Please Enter Name' />
            <label className='form-label'>Age</label>
            <input type='number' name='age' onChange={CreateUser} className='form-control' placeholder='Please Enter Age' />
            <label className='form-label'>Phone Number</label>
            <input type='number' name='phoneNumber' onChange={CreateUser} className='form-control' placeholder='Please Enter Phone Number' />
            <label className='form-label'>Address</label>
            <input type='text' name='address' onChange={CreateUser} className='form-control' placeholder='Please Enter Address' />
          </ModalBody>
          <ModalFooter>
            <button className='btn btn22 mt-3' onClick={handleCreateContactsubmit}>Create Contact</button><br />
          </ModalFooter>
        </form>
      </Modal>
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
                      <button className="btn btn-success w-100" onClick={handleModalClose}>Ok</button>
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
  );
};

export default Home;
