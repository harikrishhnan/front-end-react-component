import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import './DoctorDashboardStyle.css';

const STORAGE_KEYS = {
  appointments: 'mockDoctorAppointments',
  patients: 'mockDoctorPatients',
  medicalRecords: 'mockMedicalRecords',
  doctorProfile: 'mockDoctorProfile',
};

function generateSeedData() {
  const today = new Date();
  const format = (d) => d.toISOString().slice(0, 16);

  const patients = [
    { 
      id: 'p-1001', 
      name: 'John Carter', 
      email: 'john.carter@example.com', 
      dob: '1985-04-12',
      phone: '+1-555-0123',
      address: '123 Main St, City, State'
    },
    { 
      id: 'p-1002', 
      name: 'Amelia Brown', 
      email: 'amelia.brown@example.com', 
      dob: '1992-11-03',
      phone: '+1-555-0124',
      address: '456 Oak Ave, City, State'
    },
    { 
      id: 'p-1003', 
      name: 'Wei Chen', 
      email: 'wei.chen@example.com', 
      dob: '1978-02-20',
      phone: '+1-555-0125',
      address: '789 Pine Rd, City, State'
    },
  ];

  const appointments = [
    {
      id: 'a-2001',
      patientId: 'p-1001',
      reason: 'General Checkup',
      datetime: format(new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 0)),
      status: 'Confirmed',
      notes: 'Patient reports mild fatigue',
    },
    {
      id: 'a-2002',
      patientId: 'p-1002',
      reason: 'Follow-up Consultation',
      datetime: format(new Date(today.getFullYear(), today.getMonth(), today.getDate(), 11, 30)),
      status: 'Confirmed',
      notes: 'Post-treatment follow-up',
    },
    {
      id: 'a-2003',
      patientId: 'p-1003',
      reason: 'Blood Test Review',
      datetime: format(new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14, 0)),
      status: 'Confirmed',
      notes: 'Review recent blood work results',
    },
    {
      id: 'a-2004',
      patientId: 'p-1001',
      reason: 'Emergency Consultation',
      datetime: format(new Date(today.getFullYear(), today.getMonth(), today.getDate(), 16, 30)),
      status: 'Pending',
      notes: 'Patient requested urgent appointment',
    },
  ];

  const medicalRecords = [
    {
      id: 'mr-3001',
      patientId: 'p-1001',
      date: '2024-01-15',
      diagnosis: 'Hypertension',
      prescription: 'Lisinopril 10mg daily',
      notes: 'Patient shows elevated blood pressure. Monitor weekly.',
      doctorName: 'Dr. Current Doctor'
    },
    {
      id: 'mr-3002',
      patientId: 'p-1001',
      date: '2024-02-20',
      diagnosis: 'Follow-up - Hypertension',
      prescription: 'Lisinopril 10mg daily, Amlodipine 5mg daily',
      notes: 'Blood pressure improved but still elevated. Added second medication.',
      doctorName: 'Dr. Current Doctor'
    },
    {
      id: 'mr-3003',
      patientId: 'p-1002',
      date: '2024-03-01',
      diagnosis: 'Migraine',
      prescription: 'Sumatriptan 50mg as needed',
      notes: 'Patient reports severe headaches. Prescribed abortive medication.',
      doctorName: 'Dr. Current Doctor'
    },
  ];

  const doctorProfile = {
    id: 'd-2001',
    name: 'Dr. Current Doctor',
    email: 'doctor@health.com',
    phone: '+1-555-0100',
    specialization: 'Internal Medicine',
    consultationHours: 'Mon-Fri 9:00 AM - 5:00 PM',
    address: 'Medical Center, 100 Health Ave, City, State',
    experience: '15 years',
    education: 'MD - Medical School University'
  };

  return { patients, appointments, medicalRecords, doctorProfile };
}

const DoctorDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [doctorProfile, setDoctorProfile] = useState({});
  const [activeView, setActiveView] = useState('schedule'); // 'schedule', 'patient', 'profile', 'doctors'
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [newMedicalRecord, setNewMedicalRecord] = useState({
    diagnosis: '',
    prescription: '',
    notes: ''
  });
  const [allDoctors, setAllDoctors] = useState([]);
  const [doctorsLoading, setDoctorsLoading] = useState(false);
  const [doctorsError, setDoctorsError] = useState(null);

  useEffect(() => {
    // Load from localStorage or seed
    const storedAppointments = window.localStorage.getItem(STORAGE_KEYS.appointments);
    const storedPatients = window.localStorage.getItem(STORAGE_KEYS.patients);
    const storedMedicalRecords = window.localStorage.getItem(STORAGE_KEYS.medicalRecords);
    const storedDoctorProfile = window.localStorage.getItem(STORAGE_KEYS.doctorProfile);

    if (storedAppointments && storedPatients && storedMedicalRecords && storedDoctorProfile) {
      setAppointments(JSON.parse(storedAppointments));
      setPatients(JSON.parse(storedPatients));
      setMedicalRecords(JSON.parse(storedMedicalRecords));
      setDoctorProfile(JSON.parse(storedDoctorProfile));
      return;
    }

    const seed = generateSeedData();
    setAppointments(seed.appointments);
    setPatients(seed.patients);
    setMedicalRecords(seed.medicalRecords);
    setDoctorProfile(seed.doctorProfile);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.appointments, JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.medicalRecords, JSON.stringify(medicalRecords));
  }, [medicalRecords]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.doctorProfile, JSON.stringify(doctorProfile));
  }, [doctorProfile]);

  const patientsById = useMemo(() => {
    const map = new Map();
    patients.forEach((p) => map.set(p.id, p));
    return map;
  }, [patients]);

  const todayKey = new Date().toISOString().slice(0, 10);
  const todaysAppointments = appointments.filter((a) => (a.datetime || '').slice(0, 10) === todayKey);
  const sortedTodaysAppointments = todaysAppointments.sort((a, b) => new Date(a.datetime) - new Date(b.datetime));

  const handleAppointmentClick = (appointment) => {
    setSelectedAppointment(appointment);
    setSelectedPatient(patientsById.get(appointment.patientId));
    setActiveView('patient');
  };

  const handleUpdateAppointment = (appointmentId, newStatus) => {
    setAppointments(prev => prev.map(a => 
      a.id === appointmentId ? { ...a, status: newStatus } : a
    ));
  };

  const handleAddMedicalRecord = (e) => {
    e.preventDefault();
    if (!newMedicalRecord.diagnosis || !newMedicalRecord.prescription) return;

    const created = {
      id: `mr-${Date.now()}`,
      patientId: selectedPatient.id,
      date: new Date().toISOString().slice(0, 10),
      diagnosis: newMedicalRecord.diagnosis,
      prescription: newMedicalRecord.prescription,
      notes: newMedicalRecord.notes,
      doctorName: doctorProfile.name
    };

    setMedicalRecords(prev => [created, ...prev]);
    setNewMedicalRecord({ diagnosis: '', prescription: '', notes: '' });
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    // Profile update logic would go here
    alert('Profile updated successfully!');
  };

  const fetchAllDoctors = () => {
    setDoctorsLoading(true);
    setDoctorsError(null);
    
    axios
      .get('http://localhost:5043/api/Doctor/GetAllDoctor')
      .then((response) => {
        setAllDoctors(response.data);
        setDoctorsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching doctors:', error);
        setDoctorsError('Failed to load doctors.');
        setDoctorsLoading(false);
      });
  };

  const patientMedicalRecords = useMemo(() => {
    if (!selectedPatient) return [];
    return medicalRecords
      .filter(mr => mr.patientId === selectedPatient.id)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [selectedPatient, medicalRecords]);

  if (activeView === 'profile') {
    return (
      <div className="dashboard-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>Profile Management</h2>
          <button 
            className="dashboard-button secondary"
            onClick={() => setActiveView('schedule')}
          >
            Back to Schedule
          </button>
        </div>

        <div className="dashboard-section">
          <h3>Update Personal & Professional Details</h3>
          <form onSubmit={handleUpdateProfile}>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={doctorProfile.name || ''}
                onChange={(e) => setDoctorProfile(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={doctorProfile.email || ''}
                onChange={(e) => setDoctorProfile(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                value={doctorProfile.phone || ''}
                onChange={(e) => setDoctorProfile(prev => ({ ...prev, phone: e.target.value }))}
                required
              />
            </div>
            <div className="form-group">
              <label>Specialization</label>
              <input
                type="text"
                value={doctorProfile.specialization || ''}
                onChange={(e) => setDoctorProfile(prev => ({ ...prev, specialization: e.target.value }))}
                required
              />
            </div>
            <div className="form-group">
              <label>Consultation Hours</label>
              <input
                type="text"
                value={doctorProfile.consultationHours || ''}
                onChange={(e) => setDoctorProfile(prev => ({ ...prev, consultationHours: e.target.value }))}
                required
              />
            </div>
            <div className="form-group">
              <label>Address</label>
              <textarea
                value={doctorProfile.address || ''}
                onChange={(e) => setDoctorProfile(prev => ({ ...prev, address: e.target.value }))}
                required
                style={{ minHeight: 60 }}
              />
            </div>
            <div className="form-group">
              <label>Experience</label>
              <input
                type="text"
                value={doctorProfile.experience || ''}
                onChange={(e) => setDoctorProfile(prev => ({ ...prev, experience: e.target.value }))}
                required
              />
            </div>
            <div className="form-group">
              <label>Education</label>
              <input
                type="text"
                value={doctorProfile.education || ''}
                onChange={(e) => setDoctorProfile(prev => ({ ...prev, education: e.target.value }))}
                required
              />
            </div>
            <button type="submit" className="dashboard-button">Update Profile</button>
          </form>
        </div>
      </div>
    );
  }

  if (activeView === 'doctors') {
    return (
      <div className="dashboard-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>Doctors List</h2>
          <button 
            className="dashboard-button secondary"
            onClick={() => setActiveView('schedule')}
          >
            Back to Schedule
          </button>
        </div>

        <div className="dashboard-section">
          <button 
            className="dashboard-button"
            onClick={fetchAllDoctors}
            disabled={doctorsLoading}
          >
            {doctorsLoading ? 'Loading...' : 'Refresh Doctors List'}
          </button>

          {doctorsError && (
            <p style={{ color: 'red', marginTop: '10px' }}>{doctorsError}</p>
          )}

          {allDoctors.length === 0 && !doctorsLoading && !doctorsError ? (
            <p className="empty-state">No doctors found. Click "Refresh Doctors List" to fetch data.</p>
          ) : (
            <div style={{ marginTop: '20px' }}>
              <table className="dashboard-table">
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
            </div>
          )}
        </div>
      </div>
    );
  }

  if (activeView === 'patient') {
    return (
      <div className="dashboard-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>Patient View - {selectedPatient?.name}</h2>
          <button 
            className="dashboard-button secondary"
            onClick={() => setActiveView('schedule')}
          >
            Back to Schedule
          </button>
        </div>

        {/* Patient Vitals Header */}
        <div className="dashboard-section">
          <h3>Patient Information</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div>
              <strong>Name:</strong> {selectedPatient?.name}
            </div>
            <div>
              <strong>Email:</strong> {selectedPatient?.email}
            </div>
            <div>
              <strong>Phone:</strong> {selectedPatient?.phone}
            </div>
            <div>
              <strong>Date of Birth:</strong> {selectedPatient?.dob}
            </div>
            <div>
              <strong>Address:</strong> {selectedPatient?.address}
            </div>
          </div>
        </div>

        {/* Current Appointment */}
        {selectedAppointment && (
          <div className="dashboard-section">
            <h3>Current Appointment</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
              <div>
                <strong>Date & Time:</strong> {new Date(selectedAppointment.datetime).toLocaleString()}
              </div>
              <div>
                <strong>Reason:</strong> {selectedAppointment.reason}
              </div>
              <div>
                <strong>Status:</strong> {selectedAppointment.status}
              </div>
              <div>
                <strong>Notes:</strong> {selectedAppointment.notes || 'None'}
              </div>
            </div>
            <div className="button-group">
              {selectedAppointment.status === 'Confirmed' && (
                <button 
                  className="dashboard-button success"
                  onClick={() => handleUpdateAppointment(selectedAppointment.id, 'Completed')}
                >
                  Mark as Complete
                </button>
              )}
              {selectedAppointment.status === 'Pending' && (
                <>
                  <button 
                    className="dashboard-button success"
                    onClick={() => handleUpdateAppointment(selectedAppointment.id, 'Confirmed')}
                  >
                    Confirm Appointment
                  </button>
                  <button 
                    className="dashboard-button danger"
                    onClick={() => handleUpdateAppointment(selectedAppointment.id, 'Cancelled')}
                  >
                    Cancel Appointment
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Medical Records */}
        <div className="dashboard-section">
          <h3>Medical Records</h3>
          <div style={{ marginBottom: '20px' }}>
            <h4>Add New Record</h4>
            <form onSubmit={handleAddMedicalRecord}>
              <div className="form-group">
                <label>Diagnosis</label>
                <input
                  type="text"
                  value={newMedicalRecord.diagnosis}
                  onChange={(e) => setNewMedicalRecord(prev => ({ ...prev, diagnosis: e.target.value }))}
                  required
                />
              </div>
              <div className="form-group">
                <label>Prescription</label>
                <input
                  type="text"
                  value={newMedicalRecord.prescription}
                  onChange={(e) => setNewMedicalRecord(prev => ({ ...prev, prescription: e.target.value }))}
                  required
                />
              </div>
              <div className="form-group">
                <label>Notes</label>
                <textarea
                  value={newMedicalRecord.notes}
                  onChange={(e) => setNewMedicalRecord(prev => ({ ...prev, notes: e.target.value }))}
                  style={{ minHeight: 60 }}
                />
              </div>
              <button type="submit" className="dashboard-button">Add Medical Record</button>
            </form>
          </div>

          <h4>Medical History Timeline</h4>
          {patientMedicalRecords.length === 0 ? (
            <p className="empty-state">No medical records found.</p>
          ) : (
            <ul className="dashboard-list">
              {patientMedicalRecords.map((record) => (
                <li key={record.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div className="patient-name">{record.diagnosis}</div>
                      <div className="appointment-reason">{record.prescription}</div>
                      {record.notes && <div className="prescription-notes">{record.notes}</div>}
                      <div className="prescription-date">{record.date} - {record.doctorName}</div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  }

  // Main Schedule View
  return (
    <div className="dashboard-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Doctor Dashboard</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            className="dashboard-button secondary"
            onClick={() => setActiveView('profile')}
          >
            Profile Management
          </button>
          <button 
            className="dashboard-button secondary"
            onClick={() => setActiveView('doctors')}
          >
            Doctors List
          </button>
        </div>
      </div>

      {/* Today's Schedule */}
      <div className="dashboard-section">
        <h3>Today's Schedule</h3>
        {sortedTodaysAppointments.length === 0 ? (
          <p className="empty-state">No appointments scheduled for today.</p>
        ) : (
          <ul className="dashboard-list">
            {sortedTodaysAppointments.map((appointment) => (
              <li 
                key={appointment.id} 
                style={{ cursor: 'pointer' }}
                onClick={() => handleAppointmentClick(appointment)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div className="patient-name">
                      {patientsById.get(appointment.patientId)?.name || 'Unknown Patient'}
                    </div>
                    <div className="appointment-reason">{appointment.reason}</div>
                    <div className="appointment-time">
                      {new Date(appointment.datetime).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                    {appointment.notes && (
                      <div style={{ color: '#666', fontSize: '0.9rem', marginTop: '4px' }}>
                        Notes: {appointment.notes}
                      </div>
                    )}
                  </div>
                  <div>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      fontWeight: '500',
                      backgroundColor: appointment.status === 'Confirmed' ? '#d4edda' : 
                                   appointment.status === 'Pending' ? '#fff3cd' : '#f8d7da',
                      color: appointment.status === 'Confirmed' ? '#155724' : 
                             appointment.status === 'Pending' ? '#856404' : '#721c24'
                    }}>
                      {appointment.status}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Quick Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Today's Appointments</div>
          <div className="stat-value">{sortedTodaysAppointments.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Confirmed</div>
          <div className="stat-value">
            {sortedTodaysAppointments.filter(a => a.status === 'Confirmed').length}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Pending</div>
          <div className="stat-value">
            {sortedTodaysAppointments.filter(a => a.status === 'Pending').length}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Patients</div>
          <div className="stat-value">{patients.length}</div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;


