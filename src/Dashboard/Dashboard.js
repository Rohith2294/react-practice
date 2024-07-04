import React, { useState, useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

const Dashboard = () => {
    // Initializing navigation hook
    const navigate = useNavigate()

    // Function to handle logout
    const Logout = () => {
        navigate('/')
        localStorage.clear(); // Clearing local storage
    }
    // const [togglesidebar, settogglesidebar] = useState(true)
    // State variable to toggle mobile screen sidebar
    const [getMobileScreenSidebar, setMobileScreenSidebar] = useState(true)

  const [SelectedColor,setSelectedColor]=useState('Dashboard')
    const handlesidebar = () => setMobileScreenSidebar(!getMobileScreenSidebar);
    // State variable to toggle mobile screen sidebar
    const [userDetails, setuserDetails] = useState([])
 

    // Function to toggle sidebar visibility
    const getSidebar = () => {
        // Toggling the state variable
        if (getMobileScreenSidebar === false) {
            setMobileScreenSidebar(true)
        } else {
            setMobileScreenSidebar(false)
        }
    }
const setSelectedColorhandler=(e)=>{
    if (e === 'Dashboard') {
        navigate('/Dashboard/Home') 
        setSelectedColor('Dashboard')
    }else if(e === 'Page1'){
        setSelectedColor('Page1')
        navigate('/Dashboard/Page1')
    }
}
    // Effect hook to handle initial dashboard setup
    useEffect(() => {
        // Retrieving data from local storage
        const getData = JSON.parse(localStorage.getItem('userDetails'))
        setuserDetails(getData)
        const viewDashboardData = localStorage.getItem('DashboardName')

        // Redirecting based on dashboard data
        if (viewDashboardData === '"Dashboard"') {
            navigate('/Dashboard/Home')
            setSelectedColor='Dashboard'
        }

        console.log(getData, "getData")
    }, [])

    return (
        <>
            <div id='content'>
                {/* Top navigation bar */}
                <div className='row top-navbar' style={{ backgroundColor: '#343A40', color: 'white', padding: '20px' }}>
                    <div className='row' style={{ display: 'flex', justifyContent: 'space-between' }}>
                        {/* Sidebar toggle button */}
                        <div className='col-md-2 sidebar'>Home     &nbsp;&nbsp; <i className='fa fa-bars' onClick={handlesidebar}></i></div>
                        {/* Menu toggle button */}


                        <div className='col-md-2 sidebar1' style={{ color: 'red' }} onClick={handlesidebar}>Menu</div>
                        {/* Logout button */}
                        <div className='col-md-2' style={{ display: 'flex', justifyContent: 'end' }} onClick={() => Logout()}>Logout</div>
                    </div>
                </div>

                <div className='row' >

                    {/* Sidebar */}
                    {getMobileScreenSidebar &&
                        <div className='col-md-1' >
                            <div className='sidebarStyle'>
                                {/* Sidebar items */}
                                <p className='SidebardItems' style={{
                                    backgroundColor: SelectedColor === 'Dashboard' ? '#C1BDB4' : 'black',
                                    color: SelectedColor === 'Dashboard' ? 'black' : 'white'
                                }}
                                     onClick={() => {setSelectedColorhandler('Dashboard')}}   >Users</p>
                                <p  style={{
                                        backgroundColor: SelectedColor === 'Page1' ? '#C1BDB4' : 'black',
                                        color: SelectedColor === 'Page1' ? 'black' : 'white'
                                }} className='SidebardItems' onClick={() => { setSelectedColorhandler('Page1') }}  >Page1</p>
                            </div>
                        </div>
                    }
                    {/* Mobile screen sidebar */}
                    {/* {getMobileScreenSidebar &&
                        <div className='col-md-2 ' >
                            <div style={{ backgroundColor: 'black', color: 'white', height: '900px', width: '200px' }}>
                                <h5 className='SidebardItems' onClick={() => { navigate('/Dashboard/Home') }}  >Home</h5>
                                <h5 className='SidebardItems' onClick={() => { navigate('/Dashboard/Page1') }} >Page1</h5>
                            </div>
                        </div>
                    } */}
                    {/* Main content */}
                    <div className='col-md-11' style={{ backgroundColor: '#E4E4E4', height: '900px' }}>
                        <div className='row' style={{ marginTop: '20px' }} ><span>hii <span style={{ color: 'green' }}>{userDetails.email}</span> welcome to website</span></div>
                        <Outlet /> {/* Outlet for rendering nested routes */}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Dashboard
