import React from 'react';
import { Menubar } from 'primereact/menubar';
import { useNavigate } from 'react-router-dom';
import {useDispatch} from "react-redux";
import {persistor} from "../store";
import axios from "axios";
export default function StudentNavBar() {
    const navigate=useNavigate();
    const dispatch=useDispatch();
    const handleLogout=async()=>{
        await axios.post(process.env.REACT_APP_LOGOUT,{},{withCredentials:true}); 
        persistor.purge().then(()=>{
            dispatch({type:"user/logout"});
            navigate("/");
        })
    }
    const items = [
        {
            label: 'Home',
            icon: 'pi pi-home',
            command:()=>navigate("/studentdashboard")
        },
        {
            label:'Profile',
            icon:'pi pi-user',
            command:()=>navigate("/studentprofile")
        },
        {
            label:'View Report',
            icon:'pi pi-book',
            command:()=>navigate("/studentreport")
        },
        {
            label: 'Logout',
            icon: 'pi pi-sign-out',
            command:()=>handleLogout()
        },
    ];

    //const start = <img alt="logo" src="https://primefaces.org/cdn/primereact/images/logo.png" height="40" className="mr-2"></img>;
    const end = (
        <div className="flex align-items-center gap-2">
        </div>
    );

    return (
        <div className="card" style={{marginTop:"8px", position:"fixed",width:"99%",alignItems:"center",zIndex:"1"}}>
            <Menubar model={items}  end={end} />
        </div>
    )
}
        