// src/components/StudentInfo/StudentInfo.js

import React from "react";
import "./StudentInfo.css"; // Styling for the StudentInfo component

// Functional component for displaying student information
const StudentInfo = () => {
  return (
    <div className="parent-container">
      {/* Container for the information display */}
      <div className="container">
        <p>
          <strong>Course:</strong> SE/ComS319 Construction of User Interfaces,
          Fall 2023
        </p>
        <p>
          <strong>Date:</strong> December 3, 2023
        </p>
        <p>
          <strong>Professor:</strong> Dr. Abraham N. Aldaco Gastelum <br />
          <strong>Email:</strong> aaldaco@iastate.edu
        </p>
        <p>
          <strong>Name:</strong> Jack Krause <br />
          <strong>Email:</strong> jmkrause@iastate.edu
        </p>
        <p>
          <strong>Name:</strong> Jagger Gourley <br />
          <strong>Email:</strong> gourley@iastate.edu
        </p>
      </div>
    </div>
  );
};

export default StudentInfo;