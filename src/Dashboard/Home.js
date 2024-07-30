import React, { useEffect, useState } from 'react'; // Importing React, useEffect, and useState hooks
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'; // Importing components from Reactstrap for UI
import image from '../images/edit.png'; // Importing an image
import image2 from '../images/image.png'
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set } from "firebase/database";
import { doc, setDoc,updateDoc ,deleteDoc} from 'firebase/firestore/lite';
const firebaseConfig = {
  apiKey: "AIzaSyAhQ7QorOrL7uMyrvMW0PBTdS5i0-QgpAY",
  authDomain: "fir-project-97865.firebaseapp.com",
  projectId: "fir-project-97865",
  storageBucket: "fir-project-97865.appspot.com",
  messagingSenderId: "555223929233",
  appId: "1:555223929233:web:3800588d69ce1aeaef0a30",
  measurementId: "G-0D0WDRG969"
};
// Initialize Firebase
initializeApp(firebaseConfig);
const db = getFirestore();
// import db from "firebase"
const Home = (args) => {
  // State variables
  const [viewToggle, setToggle] = useState('AllDetails');
  const [clickedData, setClickedData] = useState(''); // Data clicked for viewing details

  const [color, setColor] = useState('');
  const [id, setId] = useState('');
  const [error, setError] = useState('');
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
  const [EditUserObject, setEditUserObject] = useState({ name: '' });
  const [data, setData] = useState([]);
  const handleModalClose = () => {
    setModal(false)
    setShowModal(false);

  };

  // List of all Contacts
  const [Contacts, setContactslist] = useState([]);
  const generateUniqueId = (length = 20) => {
    // Define the characters to use in the ID
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let uniqueId = '';
    for (let i = 0; i < length; i++) {
      // Generate a random index to pick a character from the charset
      const randomIndex = Math.floor(Math.random() * charset.length);
      uniqueId += charset[randomIndex];
    }
    return uniqueId;
  };
  const addDataToFirebase = async () => {
    try {
      const docId = generateUniqueId(); // Generate or specify your document ID
      const docRef = doc(db, 'colors', docId); // Create or reference a specific document ID
      await setDoc(docRef, {
        color: 'color32222',
        value: 'red',
        createdAt: new Date(),
        _id: docId
      });
      console.log('Document successfully written!');
      fetchData()
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };
  const updateDataToFirebase = async () => {
    try {
      const docRef = doc(db, 'colors', 'jRP1DXop3AuEGjTI3ADW'); // Create or reference a specific document ID
      await updateDoc(docRef, {
        color: 'colorUpdated',
        value: 'red',
        createdAt: new Date(),
        _id: "yWtHZM7Bj2XG6DO7AvMx"
      });
      console.log('Document successfully written!');
      fetchData()
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };
  const deleteDataFromFirebase = async (id) => {
    try {
      const docRef = doc(db, 'colors', id); // Create or reference a specific document ID
      await deleteDoc(docRef, {
        _id: id
      });
      console.log('Document successfully deleted!');
      fetchData()
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };
  // Toggle modal for creating note
  const toggle = () => setModal(!modal);

  // Toggle modal for editing user
  const editusertoggle = (e) => {
    console.log(edituserDatawwww, "EditProjectDataToEdit")
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
  const fetchData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "colors"));
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setData(data);
      console.log('Fetched data:', data);
    } catch (error) {
      console.error("Error fetching Firestore data:", error.message);
    }
  };
  // Fetch all Contacts on component mount
  useEffect(() => {
    getallContacts()
    // Fetch data from Firestore
    // Fetch Firestore data


    fetchData()


    setTimeout(() => {
    }, 3000)
  }, []);



  // get all Contacts function
  const getallContacts = () => {
    const userId = JSON.parse(localStorage.getItem('userDetails'))
    console.log(userId, 'userId')
    fetch('http://localhost:3003/api/getContacts', {
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
    if (!EditUserObject.title) {
      setErrors({ ...errors, message: '' }); // Set an error message if the title is missing
    }
    const token = localStorage.getItem("token")
    const response = await fetch('http://localhost:3003/api/editUser', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token, // Ensure there is a 
      },
      body: JSON.stringify({
        name: EditUserObject.name ? EditUserObject.name : edituserDatawwww.name,
        age: EditUserObject.age ? EditUserObject.age : edituserDatawwww.age,
        phoneNumber: EditUserObject.phoneNumber ? EditUserObject.phoneNumber : edituserDatawwww.phoneNumber,
        address: EditUserObject.address ? EditUserObject.address : edituserDatawwww.address,
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
      const response = await fetch('http://localhost:3003/api/createContact', {
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
    console.log(e, "localStorage")
    const userId = e._id
    const token = localStorage.getItem("token")
    const response = await fetch('http://localhost:3003/api/deleteContact', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token, // Ensure there is a 
      },
      body: JSON.stringify({ ContactId: userId }),
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
            <Button onClick={() => addDataToFirebase()}>
              Create User
            </Button>
          </div>
        </div>
      </div>
      {/* Cards List */}
      <div className='row'>
        {data.length == 0 && <p style={{ textAlign: 'center', color: 'red' }}>No data Found</p>}
        {viewToggle === 'AllDetails' &&
          data.map((x, index) => {
            return (
              <div className='col-lg-3 col-md-4 col-sm-6 col-12 mb-3' key={index}>
                <div className='card'>
                  <div className='row' style={{ display: 'flex', justifyContent: "space-between", alignItems: "center" }}>
                    <div className='col-4 text-center'>
                      <img src={image} className='img-fluid' style={{ cursor: 'pointer' }} onClick={() => updateDataToFirebase(x)} />
                    </div>
                    <div className='col-4 text-center'>
                      <button className='btn btn' onClick={() => deleteDataFromFirebase(x._id)}>Delete</button>
                    </div>
                  </div>
                  <div className='row mt-3'>
                    <div className='col-12'>
                      <p>Name:<span style={{ color: '#003399' }}>{x.color}</span></p>
                      <p>Value:<span style={{ color: '#003399' }}>{x.value}</span></p>
                      {/* <p>PhoneNumber:<span style={{ color: '#003399' }}>{x.phoneNumber}</span></p>
                      <p>Address:<span style={{ color: '#003399' }}>{x.address}</span></p> */}
                    </div>
                  </div>
                  <button className='btn btn w-100' onClick={() => handleData(x)}>View Details</button>
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
        <ModalHeader toggle={editusertoggle}>Edit Contact</ModalHeader>
        <form>
          <ModalBody>
            <label className='form-label'>Name</label>
            <input type='text' name='name' value={EditUserObject.name} onChange={editUser} className='form-control' placeholder='Please Enter Name' />
            <label className='form-label'>Age</label>
            <input type='number' name='age' value={EditUserObject.age} onChange={editUser} className='form-control' placeholder='Please Enter Age' />
            <label className='form-label'>Phone Number</label>
            <input type='number' name='phoneNumber' value={EditUserObject.phoneNumber} onChange={editUser} className='form-control' placeholder='Please Enter Phone Number' />
            <label className='form-label'>Address</label>
            <input type='text' name='address' value={EditUserObject.address} onChange={editUser} className='form-control' placeholder='Please Enter Address' />
          </ModalBody>
          <ModalFooter>
            <button className='btn btn22 mt-3' onClick={handleeditContactsubmit}>Edit Contact</button><br />
          </ModalFooter>
        </form>
      </Modal>
      {/* Create user modal */}
      <Modal isOpen={modal} toggle={toggle} {...args}>
        <ModalHeader toggle={toggle}>Create Contact</ModalHeader>
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
                    <div className="col-md-6 mb-3">
                      <button className="btn btn-danger w-100" onClick={handleModalClose}>Cancel</button>
                    </div>
                  </div>
                </>
              )}     {resErrors.error && (
                <>
                  <h5 className="mt-4">{resErrors.error}</h5>
                  <div className="row mt-3">
                    <div className="col-md-6 mb-3">
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
