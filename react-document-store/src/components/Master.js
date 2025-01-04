import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Main from "./Main";
import Navbar from "./Navbar";
import NewMemberForm from "./NewMemberForm";
import FileViewer from "./FileViewer";

function SuccessMessage(props) {
    return (
        <div className={`success-message ${!props.message || props.message.length == 0 ? 'hide' : ''}`}>
            <div className="success-message-icon">
                <i className="fas fa-check-circle"></i>
            </div>
            <div className="success-message-text">
                {props.message || ''}
            </div>
        </div>
    )
}

function ErrorMessage(props) {
    return (
        <div className={`error-message-container ${!props.message || props.message.length == 0 ? 'hide' : ''}`}>
            <div className="error-message-icon">
                <i className="fas fa-times-circle"></i>
            </div>
            <div className="error-message-text">
                {props.message || ''}
            </div>
        </div>
    )

}

function Master() {
    // State to hold fetched data
    const navigate = useNavigate()
    const [familyId, setFamilyId] = useState("");
    const [creator, setCreator] = useState("");
    const [folders, setFolders] = useState([]);
    const [members, setMembers] = useState([]);
    const [activeFolder, setActiveFolder] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null)
    const [successMessage, setSuccessMessage] = useState(null)
    const [fileSrc, setFileSrc] = useState()
    const [newMemberDetails, setNewMemberDetails] = useState([false, '', '', 'public'])

    useEffect(() => {
        if (errorMessage) {
            const timer = setTimeout(() => {
                setErrorMessage('');
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [errorMessage]);


    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage('');
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [successMessage]);


    const fetchData = async () => {
        try {
            const family_id = "fid-1";
            const creator = "SHAFAAT HUSSAIN KHAN"
            const response = await fetch("http://localhost:5000/family-data", {
                method: "POST", // Ensure it's a POST request
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ family_id }), // Include the required data
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }

            const result = await response.json();

            if (result.ok == false) { navigate("/login") }
            else {
                setFamilyId(familyId);
                setCreator(creator);

                if (result.data) {
                    const f = result.data.folders.map((obj) => {

                        return { name: obj.name, access: obj.access }

                    });
                    const m = result.data.folders.map((obj) => {
                        return { member_name: obj.name, files: obj.files }
                    })

                    setFolders(f)
                    setMembers(m)
                }

            }



        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };


    // Fetch data on component mount
    useEffect(() => {
        fetchData();
    }, []);

    // Handler for active folder
    const handleActiveFolder = (folderName) => {
        setActiveFolder(folderName);
    };

    // Loading and error handling
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    // Render the main component after data has loaded
    return (
        <>

            <ErrorMessage message={errorMessage} />
            <SuccessMessage message={successMessage} />
            <NewMemberForm newMemberDetails={newMemberDetails} setNewMemberDetails={setNewMemberDetails} setMembers={setMembers} setFolders={setFolders} setErrorMessage={setErrorMessage} setSuccessMessage={setSuccessMessage} />

            <Navbar family_id={familyId} creator={creator} />
            <Main
                setActiveFolder={handleActiveFolder}
                folders={folders}
                members={members}
                setMembers={setMembers}
                setFolders={setFolders}
                activeFolder={activeFolder}
                errorMessage={errorMessage}
                setErrorMessage={setErrorMessage}
                successMessage={successMessage}
                setSuccessMessage={setSuccessMessage}
                setFileSrc={setFileSrc}
                setNewMemberDetails={setNewMemberDetails}
            />
        </>
    );
}

export default Master;
