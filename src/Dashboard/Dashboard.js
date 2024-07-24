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


    // State variable to toggle mobile screen sidebar
    const [getMobileScreenSidebar, setMobileScreenSidebar] = useState(true)
    const [selectedColor, setSelectedColor] = useState('Dashboard')

    // State variable to store user details
    const [userDetails, setUserDetails] = useState([])

    // Function to toggle sidebar visibility
    const handleSidebarToggle = () => setMobileScreenSidebar(!getMobileScreenSidebar);

    // Function to handle sidebar item click
    const handleSidebarItemClick = (item) => {
        setSelectedColor(item)
        if (item === 'Dashboard') {
            navigate('/Dashboard/Home')
        } else if (item === 'Project') {
            navigate('/Dashboard/Project')
        }
    }

    // Effect hook to handle initial dashboard setup
    useEffect(() => {
        // Retrieving data from local storage
        const getData = JSON.parse(localStorage.getItem('userDetails'))
        setUserDetails(getData)
        const viewDashboardData = localStorage.getItem('DashboardName')

        // Redirecting based on dashboard data
        if (viewDashboardData === '"Dashboard"') {
            navigate('/Dashboard/Home')
            setSelectedColor('Dashboard')
        }
    }, [navigate])

    return (
        <>
            <div id='content'>
                {/* Top navigation bar */}
                <div className='row topnavbar' style={{ backgroundColor: '#343A40', color: 'white', padding: '20px' }}>
                    <div className='col-12' style={{ display: 'flex', justifyContent: 'space-between' }}>
                        {/* Sidebar toggle button */}
                        <div className='sidebartoggle' style={{ cursor: 'pointer' }} onClick={handleSidebarToggle}>
                            <i className='fa fa-bars'></i>
                        </div>
                        {/* Logout button */}
                        <div className='logoutbtn' style={{ cursor: 'pointer' }} onClick={Logout}>Logout</div>
                    </div>
                </div>

                <div className='row'>
                    {/* Sidebar */}
                    {getMobileScreenSidebar && (
                        <div className='col-md-1 col-sm-4 col-6 sidebar'>
                            <div className='sidebarStyle'>
                                <p className='SidebardItems' style={{
                                    backgroundColor: selectedColor === 'Dashboard' ? '#C1BDB4' : 'black',
                                    color: selectedColor === 'Dashboard' ? 'black' : 'white'
                                }} onClick={() => handleSidebarItemClick('Dashboard')}>Dashboard</p>
                                <p className='SidebardItems' style={{
                                    backgroundColor: selectedColor === 'Project' ? '#C1BDB4' : 'black',
                                    color: selectedColor === 'Project' ? 'black' : 'white'
                                }} onClick={() => handleSidebarItemClick('Project')}>Projects</p>
                            </div>
                        </div>
                    )}

                    {/* Main content */}
                    <div className={getMobileScreenSidebar ? 'col-md-9 col-sm-8 col-6' : 'col-12'} style={{ height: '900px' }}>
                        <div className='row' style={{ marginTop: '20px' }}>
                            <span>Hi <span style={{ color: 'green' }}>{userDetails.email}</span>, welcome to the website</span>
                        </div>
                        <Outlet /> {/* Outlet for rendering nested routes */}
                    </div>
                </div>
            </div>

       
        </>
    )
}

export default Dashboard
