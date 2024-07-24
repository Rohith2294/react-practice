
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import Login from "./Login";
import Dashboard from "./Dashboard/Dashboard";
import Home from "./Dashboard/Home";
import Project from "./Dashboard/Project";
import Signup from "./Signup";
import Forgotpassword from "./ForgotPassword";
import CreatePassword from "./CreatePassword";
import VerifyOtp from "./VerifyOtp";
import Task from "./Dashboard/Task";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/Forgotpassword" element={<Forgotpassword />} />
        <Route path="/CreatePassword" element={<CreatePassword />} />
        <Route path="/VerifyOtp" element={<VerifyOtp />} />
        <Route path="/Dashboard" element={<Dashboard />} >
          <Route path="/Dashboard/Home" element={<Home />} />
          <Route path="/Dashboard/Project" element={<Project />} />
          <Route path="/Dashboard/Task" element={<Task />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
