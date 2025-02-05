/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { DataView } from 'primereact/dataview';
import { classNames } from 'primereact/utils';

export default function TeacherDataView() {
    const [profiles, setProfiles] = useState([]);

    // Mock data for teacher profiles including base64 encoded profile picture
    const mockProfiles = [
        {
            name: "Dr. Alice Green",
            email: "alicegreen@example.com",
            phone: 1234567890,
            department: "Computer Science",
            profilePicture: "data:image/png;base64, ...", // Replace with your base64 string
            test: [],
            completed_test: []
        },
        {
            name: "Prof. Bob White",
            email: "bobwhite@example.com",
            phone: 9876543210,
            department: "Electrical Engineering",
            profilePicture: "data:image/png;base64, ...", // Replace with your base64 string
            test: [],
            completed_test: []
        },
        {
            name: "Dr. Charlie Black",
            email: "charlieblack@example.com",
            phone: 1122334455,
            department: "Mechanical Engineering",
            profilePicture: "data:image/png;base64, ...", // Replace with your base64 string
            test: [],
            completed_test: []
        },
    ];

    useEffect(() => {
        // Simulating fetching data
        setProfiles(mockProfiles); 
    }, []);

    const itemTemplate = (profile, index) => {
        return (
            <div className="col-12" key={profile.email}>
                <div className={classNames('flex flex-column xl:flex-row xl:align-items-start p-3 gap-3', { 'border-top-1 surface-border': index !== 0 })} style={{ borderRadius: '12px', overflow: 'hidden' }}>
                    {/* Profile Picture (Left) */}
                    <div className="flex justify-content-center xl:justify-content-start xl:flex-0">
                        <img 
                            src={profile.profilePicture} 
                            alt={`${profile.name}'s profile`} 
                            className="w-6rem h-6rem rounded-full shadow-2" 
                            
                        />
                    </div>

                    {/* Profile Data (Next to Picture) */}
                    <div className="flex flex-column justify-content-start gap-2 xl:ml-3 xl:flex-1 text-left">
                        <div className="text-xl font-bold text-900">{profile.name}</div>
                        <div className="font-semibold">{profile.department}</div>
                        <div className="font-medium">{profile.phone}</div>
                    </div>

                    {/* Action Buttons (At the end) */}
                    <div className="flex flex-column justify-content-center align-items-end gap-2 xl:ml-3 xl:flex-0">
                        <Button label="View" icon="pi pi-search" className="p-button-text p-button-sm" />
                        <Button label="Delete" icon="pi pi-trash" className="p-button-danger p-button-text p-button-sm" />
                    </div>
                </div>
            </div>
        );
    };

    const listTemplate = (items) => {
        if (!items || items.length === 0) return null;

        let list = items.map((profile, index) => {
            return itemTemplate(profile, index);
        });

        return <div className="grid grid-nogutter">{list}</div>;
    };

    return (
        <div className="card" style={{ width: "50%", borderRadius: "12px", overflow: 'hidden' }}>
            <DataView value={profiles} listTemplate={listTemplate} paginator rows={5} />
        </div>
    );
}
