import React, { useState, useEffect } from 'react';
import axios from 'axios';

function GetDoctor() {
  const [allDoctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null);     // Error state

  useEffect(() => {
    axios
      .get('http://localhost:5043/api/Doctor/GetAllDoctor')
      .then((response) => {
        setDoctors(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching doctors:', error);
        setError('Failed to load doctors.');
        setLoading(false);
      });
  }, []);

  // Loading state UI
  if (loading) {
    return <p>Loading doctors...</p>;
  }

  // Error state UI
  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  // Display doctors
  return (
    <div style={{ padding: '20px' }}>
      <h2>Doctors List</h2>
      {allDoctors.length === 0 ? (
        <p>No doctors found.</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Doctor ID</th>
              <th>Name</th>
              <th>Speciality</th>
              <th>Phone</th>
            </tr>
          </thead>
          <tbody>
            {allDoctors.map((doctor) => (
              <tr key={doctor.doctorId}>
                <td>{doctor.doctorId}</td>
                <td>{doctor.name}</td>
                <td>{doctor.speciality}</td>
                <td>{doctor.phoneNo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default GetDoctor;
