import React, { useEffect, useState } from 'react';
import axios from 'axios';
import image2 from '../images/image.png';
const subTasks = () => {
    const [projectData, setProjectData] = useState(null); // Initialize as null to check if it's been set
    const [tasks, setTasks] = useState([]); // State to store the fetched tasks
    const [showAddTaskModal, setshowAddTaskModal] = useState(false) // open create task modal 
    const [createTaskForm, setcreateTaskForm] = useState([]) // open create task modal 
    const [resErrors, setResErrors] = useState({});
    const [AddTaskImage, setAddTaskImage] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [errors, setErrors] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [alertErrors, setAlertErrors] = useState('none');
    const [textColor, setTextColor] = useState('');
    const [error, setError] = useState('');
    const handleAddTaskModalClose = () => {  // function to close the create task modal
        setshowAddTaskModal(false)
    }
    const handleModalClose = () => {
        setShowModal(false);
    };
    // Fetch project data from localStorage on component mount
    useEffect(() => {
        const storedtaskData = JSON.parse(localStorage.getItem('taskData'));
        if (storedtaskData) {
            setProjectData(storedtaskData);
        }
    }, []);

    // Fetch all Tasks once projectData is set
    useEffect(() => {
        if (projectData) {
            getAllsubTasks();
        }
    }, [projectData]);

    const getAllsubTasks = () => {
        const userdata = JSON.parse(localStorage.getItem('userDetails'));
        const userId = userdata._id;
        
        fetch('http://localhost:3003/api/getTasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + localStorage.getItem('token'),
            },
            body: JSON.stringify({ userId: userId, TaskId: storedtaskData._id }),
        })
            .then(response => response.json())
            .then(data => {
                setTasks(data.Tasks);
                // localStorage.removeItem('projectData')
                console.log(data.Tasks, 'Tasks');
            })
            .catch(error => {
                console.error('Error fetching data:', error.message);
            });
    };
    // create project image upload
    const handleFileChange = (event) => {
        setUploading(true);
        if (event.target.files && event.target.files.length > 0) {
            submitFiles(event.target.files);
        }
    };
    const submitFiles = (files) => {
        if (files.length > 0) {
            const formData = new FormData();
            Array.from(files).forEach(file => {
                formData.append('images', file);
            });

            axios.post('http://localhost:3003/multipleUpload', formData)
                .then(response => {
                    console.log('Files uploaded successfully:', response.data.files);
                    const uploadedFiles = response.data.files.map((file) => ({
                        url: file.url,
                    }));
                    setAddTaskImage(uploadedFiles);
                    console.log(uploadedFiles, 'uploadedFiles');
                    setUploading(false);
                })
                .catch((error) => {
                    setError(error.response?.data?.message || 'Something went wrong. Please try again later.');
                    setAlertErrors('block');
                    setTextColor('error');
                    setUploading(false);
                    console.error('Something went wrong. Please try again later.', error);
                });
        } else {
            console.error('No files selected');
        }
    };
    const createTask = (e) => {
        setcreateTaskForm({ ...createTaskForm, [e.target.name]: [e.target.value] })
    }
    const handleCreateTaskSubmit = async (e) => {
        e.preventDefault();
        console.log(projectData,'submit')
        // Uncomment the following lines to enable form validation and project creation logic
        if (!createTaskForm.TaskName) {
            setErrors({ ...errors, message: 'Please Enter TaskName' });
        } else if (!createTaskForm.description) {
            setErrors({ ...errors, message: 'Please Enter description' });
        } else if (!AddTaskImage[0].url) {
            setErrors({ ...errors, message: 'Please Upload Image' });
        } else {
   

            const userId = JSON.parse(localStorage.getItem('userDetails'));
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3003/api/createTask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token,
                },
                body: JSON.stringify({
                    TaskName: createTaskForm.TaskName,
                    description: createTaskForm.description,
                    image: AddTaskImage[0].url,
                    userId: userId._id,
                    projectId: projectData._id
                }),
            });
            const responseData = await response.json();
            console.log(responseData, 'responseData')
            if (responseData.error) {
                setShowModal(true);
                setshowAddTaskModal(false);
                setResErrors(responseData);
            } else {
                setshowAddTaskModal(false);
                setShowModal(true);
                setResErrors(responseData);
                getAllTasks();
            }

        }
    }
    return (
        <>
            <div>
                <div className='row' style={styles.createTaskButtonStyle}>
                    <div className='col-md-3' style={styles.createTaskButtonStyle}>
                        <button className='btn btn w-100' onClick={() => setshowAddTaskModal(true)}>Create Task</button>
                    </div>
                </div>
                <div className='row'>
          {tasks.map((x, index) => (
            <div className='col-md-4'>
              <div className='card' style={styles.cardStyles} key={index}>
                <div className='row mb-3' style={{ display: 'flex', justifyContent: 'space-between' }}>
                  {/* <img onClick={() => openEditProjectModal(x)} src={editicon} style={{ width: '50px' }} />
                  <img onClick={() => deleteProject(x)} src={deleteicon} style={{ width: '50px' }} /> */}
                </div>
                <img src={x.image} style={styles.projectImageStyles} alt='Project' />
                <h6>{x.TaskName}</h6>
                <p>{x.description}</p>
              </div>
            </div>
          ))}

        </div>
          
            </div>
            <div className='modal' tabIndex='-1' role='dialog' style={{ display: showAddTaskModal ? 'block' : 'none', backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(5px)', zIndex: 1040 }}>
                <div className='modal-dialog modal-dialog-centered modal-dialog-scrollable'>
                    <div className='modal-content'>
                        <div className='modal-body'>
                            <div className='row' style={styles.createTaskButtonStyle}>
                                <button type='button' className='btn-close' aria-label='Close' onClick={handleAddTaskModalClose}></button>
                            </div>
                            <form>
                                <h3 style={styles.h3}>Create Task</h3>
                                <label className='form-label'>Task Name</label>
                                <input type='text' name='TaskName' onChange={createTask} className='form-control' placeholder='Please Enter Name' />
                                <label className='form-label'>Description</label>
                                <input type='text' name='description' onChange={createTask} className='form-control' placeholder='Please Enter Description' />
                                <label className='form-label'>Image</label>
                                <input type='file' multiple onChange={handleFileChange} />
                                {uploading && <p>Uploading...</p>}
                                {error && <div style={{ display: alertErrors, color: textColor }}>{error}</div>}
                                <ul>
                                    {AddTaskImage.map((doc, index) => (
                                        <li key={index}>
                                            <a href={doc.url} target='_blank' rel='noopener noreferrer'>{doc.name}</a>
                                        </li>
                                    ))}
                                </ul>
                                <div className='row mt-3'>
                                    <div className='col-md-3'>
                                        <button className='btn btn w-100' onClick={handleCreateTaskSubmit}>Submit</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <div className='modal' tabIndex='-1' role='dialog' style={{ display: showModal ? 'block' : 'none', backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(5px)', zIndex: 1040 }}>
                <div className='modal-dialog modal-dialog-centered modal-dialog-scrollable'>
                    <div className='modal-content'>
                        <div className='modal-body text-center'>
                            <img src={image2} alt='Logo' style={{ width: '100px' }} />
                            {resErrors.message && (
                                <>
                                    <h5 className='mt-4'>{resErrors.message}</h5>
                                    <div className='row mt-3'>
                                        <div className='col-md-6'>
                                            <button className='btn btn-success w-100' onClick={handleModalClose}>Ok</button>
                                        </div>
                                        <div className='col-md-6 mb-3'>
                                            <button className='btn btn-danger w-100' onClick={handleModalClose}>Cancel</button>
                                        </div>
                                    </div>
                                </>
                            )}
                            {resErrors.error && (
                                <>
                                    <h5 className='mt-4'>{resErrors.error}</h5>
                                    <div className='row mt-3'>
                                        <div className='col-md-6 mb-3'>
                                            <button className='btn btn w-100' onClick={handleModalClose}>Ok</button>
                                        </div>
                                        <div className='col-md-6'>
                                            <button className='btn btn w-100' onClick={handleModalClose}>Cancel</button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
const styles = {
    cardStyles: {
      backgroundColor: 'white',
      height: '100%',
      width: '100%',
    },
    projectImageStyles: {
      width: '10%',
    },
    projectImage2: {
      border: '1px solid',
      borderRadius: '100%',
      marginLeft: '1px',
      width: '30px',
      height: '30px',
      margin: '5px',
    },
    imageContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      alignItems: 'center',
    },
    imageCount: {
      backgroundColor: 'lightgray',
      border: '1px solid gray',
      borderRadius: '70%',
      fontSize: '20px',
      fontWeight: 'bold',
      paddingRight: '2px',
      color: 'black',
    },
    cardBottomStyle: {
      marginTop: '10px',
    },
    createProjectButtonStyle: {
      display: 'flex',
      justifyContent: 'end',
    },
    h3: {
      textAlign: 'center',
    },
  };
export default subTasks;
