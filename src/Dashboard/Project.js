import React, { useEffect, useState } from 'react';
import projectImage from '../images/idea.png';
import { format } from 'date-fns';
import axios from 'axios';
import image2 from '../images/image.png';
import editicon from '../images/edit.png'; // Importing an image
import { useNavigate } from 'react-router-dom'
import deleteicon from '../images/delete (1).png'; // Importing an image
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'; // Importing components from Reactstrap for UI
const Project = (args) => {
      // React Router navigation
      const navigate = useNavigate()

  const [projectsList, setProjectsList] = useState([]);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [showEditProjectModal, setShowEditProjectModal] = useState(false);
  const [EditProjectDataToEdit, setEditProjectDataToEdit] = useState([]);
  const [resErrors, setResErrors] = useState({});
  const [errors, setErrors] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [createProjectForm, setCreateProjectForm] = useState({});
  const [EditProjectObject, setEditProjectObject] = useState({ projectName: '' });
  const [uploading, setUploading] = useState(false);
  const [uploadingedit, setUploadingedit] = useState(false);
  const [AddProjectImage, setAddProjectImage] = useState([]);
  const [editProjectImage, seteditProjectImage] = useState([]);
  const [error, setError] = useState('');
  const [alertErrors, setAlertErrors] = useState('none');
  const [textColor, setTextColor] = useState('');
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
          setAddProjectImage(uploadedFiles);
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
  const handleFileChangeedit = (event) => {
    setUploadingedit(true);
    if (event.target.files && event.target.files.length > 0) {
      submitFilesedit(event.target.files);
    }
  };
  const submitFilesedit = (files) => {
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
          seteditProjectImage(uploadedFiles);
          console.log(uploadedFiles, 'uploadedFiles');
          setUploadingedit(false);
        })
        .catch((error) => {
          setError(error.response?.data?.message || 'Something went wrong. Please try again later.');
          setAlertErrors('block');
          setTextColor('error');
          setUploadingedit(false);
          console.error('Something went wrong. Please try again later.', error);
        });
    } else {
      console.error('No files selected');
    }
  };
  const handleAddProjectModalClose = () => {
    setShowAddProjectModal(false);
  };
  const handleModalClose = () => {
    setShowModal(false);
  };
  const openCreateProjectModal = () => {
    setShowAddProjectModal(true);
  };
  const openEditProjectModal = (e) => {
    console.log(EditProjectObject, 'setCreateProjectForm')
    setEditProjectObject(e)
    setEditProjectDataToEdit(e);
    setShowEditProjectModal(!showEditProjectModal)
  };
  const createProject = (e) => {
    setCreateProjectForm({ ...createProjectForm, [e.target.name]: e.target.value });
  };
  const editProject = (e) => {
    setEditProjectObject({ ...EditProjectObject, [e.target.name]: e.target.value });
    // setEditUserObject({ ...edituserDatawwww, [e.target.name]: e.target.value }); // Update the form state with new input values
  };
  const MAX_VISIBLE_IMAGES = 3;
  const images = [
    projectImage,
    projectImage,
    projectImage,
    projectImage,
    projectImage,
    projectImage,
    projectImage,
  ];
  useEffect(() => {
    getAllProjects();
  }, []);
  const getAllProjects = () => {
    const userId = JSON.parse(localStorage.getItem('userDetails'));
    fetch('http://localhost:3003/api/getProjects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
      body: JSON.stringify({ userId: userId._id }),
    })
      .then(response => {

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        return response.json();
      })
      .then(data => {
        setProjectsList(data.Projects);
        console.log(data.Projects, 'projectsList')
      })
      .catch(error => {
        console.error('Error fetching data:', error.message);
      });
  };
  const handleCreateProjectSubmit = async (e) => {
    e.preventDefault();
    console.log(AddProjectImage, 'AddProjectImage')
    // Uncomment the following lines to enable form validation and project creation logic
    if (!createProjectForm.projectName) {
      setErrors({ ...errors, message: 'Please Enter projectName' });
    } else if (!createProjectForm.description) {
      setErrors({ ...errors, message: 'Please Enter description' });
    } else if (!AddProjectImage[0].url) {
      setErrors({ ...errors, message: 'Please Upload Image' });
    } else {
      console.log('submit')
      const projectName = createProjectForm.projectName
      const description = createProjectForm.description
      const image = AddProjectImage[0].url;
      const userId = JSON.parse(localStorage.getItem('userDetails'));
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3003/api/createProject', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify({
          projectName: projectName,
          description: description,
          image: image,
          userId: userId._id,
        }),
      });
      const responseData = await response.json();
      console.log(responseData, 'responseData')
      if (responseData.error) {
        setShowModal(true);
        setShowAddProjectModal(false);
        setResErrors(responseData);
      } else {
        setShowAddProjectModal(false);
        setShowModal(true);
        setResErrors(responseData);
        getAllProjects();
      }
    }
  };
  const handleEditProjectSubmit = async (e) => {
    e.preventDefault();
    console.log(EditProjectDataToEdit, 'EditProjectDataToEdit')
    // Uncomment the following lines to enable form validation and project creation logic
    if (!EditProjectObject.projectName) {
      setErrors({ ...errors, message: 'Please Enter projectName' });
    } else if (!EditProjectObject.description) {
      setErrors({ ...errors, message: 'Please Enter description' });
    } else {
      let Image;
      const projectName = EditProjectObject ? EditProjectObject.projectName : EditProjectDataToEdit.projectName;
      const description = EditProjectObject ? EditProjectObject.description : EditProjectDataToEdit.description;
      if (editProjectImage && editProjectImage[0]) {
        Image = editProjectImage[0].url
      } else {
        Image = EditProjectDataToEdit.image
      }
      const userId = JSON.parse(localStorage.getItem('userDetails'));
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3003/api/editProject', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify({
          projectName: projectName,
          description: description,
          image: Image,
          userId: userId._id,
          projectId: EditProjectDataToEdit._id,
        }),
      });
      const responseData = await response.json();
      console.log(responseData, 'responseData')
      if (responseData.error) {
        setShowModal(true);
        setShowEditProjectModal(false)
        setResErrors(responseData);
      } else {
        setShowEditProjectModal(false)
        setShowModal(true);
        setResErrors(responseData);
        getAllProjects();
      }
    }
  };
  const deleteProject = async (e) => {
    console.log(e, "localStorage")
    const userId = JSON.parse(localStorage.getItem('userDetails'))
    const projectId = e._id
    const token = localStorage.getItem("token")
    const response = await fetch('http://localhost:3003/api/deleteProject', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token, // Ensure there is a 
      },
      body: JSON.stringify({ projectId: projectId, userId: userId }),
    });
    const responseData = await response.json();
    if (responseData.error) {
      setShowModal(true)
      setResErrors(responseData)
    } else {
      setShowModal(true)
      setResErrors(responseData)
      getAllProjects()
      console.log(responseData, 'response')
    }
  }
  const RouteToTaskWithData =async (projectData)=>{
    localStorage.setItem('projectData',JSON.stringify(projectData))
    navigate("/Dashboard/Task")
  }
  return (
    <>
      <div className='container-fluid'>
        <div className='row' style={styles.createProjectButtonStyle}>
          <div className='col-md-3' style={styles.createProjectButtonStyle}>
            <button className='btn btn w-100' onClick={openCreateProjectModal}>Create Project</button>
          </div>
        </div>
        <div className='row'>
          {projectsList.map((x, index) => (
            <div className='col-md-4'>
              <div className='card' style={styles.cardStyles} key={index}>
                <div className='row mb-3' style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <img onClick={() => openEditProjectModal(x)} src={editicon} style={{ width: '50px' }} />
                  <img onClick={() => deleteProject(x)} src={deleteicon} style={{ width: '50px' }} />
                </div>
                <img src={x.image} style={styles.projectImageStyles} alt='Project' />
                <h2>{x.projectName}</h2>
                <p>{x.description}</p>
                <p><span>Task Count:</span><span>{x.Tasks.length}</span></p>
                <div className='row' onClick={()=>RouteToTaskWithData(x)}>
                  <div className='col-md-4' style={styles.cardBottomStyle}>
                    <p><span>Date:</span><span>{format(new Date(x.updatedAt), 'dd-MM-yyyy')}</span></p>
                  </div>
                  <div className='col-md-8' style={styles.imageContainer}>
                    Users:
                    {images.slice(0, MAX_VISIBLE_IMAGES).map((image, idx) => (
                      <img key={idx} src={image} style={styles.projectImage2} alt={`Project ${idx + 1}`} />
                    ))}
                    {images.length > MAX_VISIBLE_IMAGES && (
                      <div style={styles.imageCount}>
                        +{images.length - MAX_VISIBLE_IMAGES}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

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
      <div className='modal' tabIndex='-1' role='dialog' style={{ display: showAddProjectModal ? 'block' : 'none', backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(5px)', zIndex: 1040 }}>
        <div className='modal-dialog modal-dialog-centered modal-dialog-scrollable'>
          <div className='modal-content'>
            <div className='modal-body'>
              <div className='row' style={styles.createProjectButtonStyle}>
                <button type='button' className='btn-close' aria-label='Close' onClick={handleAddProjectModalClose}></button>
              </div>
              <form>
                <h3 style={styles.h3}>Create Project</h3>
                <label className='form-label'>ProjectName</label>
                <input type='text' name='projectName' onChange={createProject} className='form-control' placeholder='Please Enter Name' />
                <label className='form-label'>Description</label>
                <input type='text' name='description' onChange={createProject} className='form-control' placeholder='Please Enter Description' />
                <label className='form-label'>Image</label>
                <input type='file' multiple onChange={handleFileChange} />
                {uploading && <p>Uploading...</p>}
                {error && <div style={{ display: alertErrors, color: textColor }}>{error}</div>}
                <ul>
                  {AddProjectImage.map((doc, index) => (
                    <li key={index}>
                      <a href={doc.url} target='_blank' rel='noopener noreferrer'>{doc.name}</a>
                    </li>
                  ))}
                </ul>
                <div className='row mt-3'>
                  <div className='col-md-3'>
                    <button className='btn btn w-100' onClick={handleCreateProjectSubmit}>Submit</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Modal isOpen={showEditProjectModal} toggle={openEditProjectModal} {...args}>
        <ModalHeader toggle={openEditProjectModal}>Edit Contact</ModalHeader>
        <form>
          <ModalBody>

            <h3 style={styles.h3}>Edit Project</h3>
            <label className='form-label'>ProjectName</label>
            <input type='text' name='projectName' value={EditProjectObject.projectName} onChange={editProject} className='form-control' placeholder='Please Enter Name' />
            <label className='form-label'>Description</label>
            <input type='text' name='description' value={EditProjectObject.description} onChange={editProject} className='form-control' placeholder='Please Enter Description' />
            <label className='form-label'>Image</label>
            <input type='file' multiple onChange={handleFileChangeedit} />
            {uploading && <p>Uploading...</p>}
            {error && <div style={{ display: alertErrors, color: textColor }}>{error}</div>}
          </ModalBody>
          <ModalFooter>
            <button className='btn btn22 mt-3' onClick={handleEditProjectSubmit}>Edit Contact</button><br />
          </ModalFooter>
        </form>
      </Modal>
    </>
  );
}
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
export default Project;
