import React from 'react';
import { Menubar } from 'primereact/menubar';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { persistor } from "../store";
import axios from "axios";

export default function AdminNavBar() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();

    const handleLogout = async () => {
        await axios.post(process.env.REACT_APP_LOGOUT, {}, { withCredentials: true });
        persistor.purge().then(() => {
            dispatch({ type: "user/logout" });
            navigate("/");
        });
    };

    const items = [
        {
            label: 'Home',
            icon: 'pi pi-home',
            command: () => navigate("/admindashboard"),
            className: location.pathname === "/admindashboard" ? "active-tab" : ""
        },
        {
            label: 'Profile',
            icon: 'pi pi-user-edit',
            command: () => navigate("/adminprofile"),
            className: location.pathname === "/adminprofile" ? "active-tab" : ""
        },
        {
            label: 'Manage Teachers',
            icon: 'pi pi-user',
            command: () => navigate("/adminteacher"),
            className: location.pathname === "/adminteacher" ? "active-tab" : ""
        },
        {
            label: 'Manage Students',
            icon: 'pi pi-id-card',
            command: () => navigate("/adminstudent"),
            className: location.pathname === "/adminstudent" ? "active-tab" : ""
        },
        {
            label: 'View Report',
            icon: 'pi pi-book',
            command:()=>navigate("/adminreport"),
            className: location.pathname === "/adminreport" ? "active-tab" : ""
        },
        {
            label: 'Logout',
            icon: 'pi pi-sign-out',
            command: () => handleLogout()
        },
    ];

    //const start = <img alt="logo" src="https://primefaces.org/cdn/primereact/images/logo.png" height="40" className="mr-2"></img>;
    const end = (
        <div className="flex align-items-center gap-2">
        </div>
    );

    return (
        <div className="card" style={{ position: "fixed", width: "100%", alignItems: "center", zIndex: "1", backgroundColor: "white",borderRadius:"1em" }}>
            <Menubar model={items} end={end} />
        </div>
    );
}