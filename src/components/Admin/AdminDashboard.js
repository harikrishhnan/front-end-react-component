import React, { useEffect, useMemo, useState } from 'react';
import './AdminDashboardStyle.css';

const STORAGE_KEYS = {
  patients: 'mockPatients',
  doctors: 'mockDoctors',
  appointments: 'mockAppointments',
  users: 'mockUsers',
};

function generateSeedData() {
  const today = new Date();
  const format = (d) => d.toISOString().slice(0, 16); // yyyy-MM-ddTHH:mm

  const patients = [
    { id: 'p-1001', name: 'John Carter', email: 'john.carter@example.com', registrationDate: '2024-01-15', status: 'Active' },
    { id: 'p-1002', name: 'Amelia Brown', email: 'amelia.brown@example.com', registrationDate: '2024-02-20', status: 'Active' },
    { id: 'p-1003', name: 'Wei Chen', email: 'wei.chen@example.com', registrationDate: '2024-03-10', status: 'Active' },
    { id: 'p-1004', name: 'Maria Garcia', email: 'maria.garcia@example.com', registrationDate: '2024-01-28', status: 'Active' },
    { id: 'p-1005', name: 'David Kim', email: 'david.kim@example.com', registrationDate: '2024-02-15', status: 'Inactive' },
  ];

  const doctors = [
    { id: 'd-2001', name: 'Dr. Sarah Johnson', email: 'sarah.johnson@health.com', specialization: 'Cardiology', registrationDate: '2023-06-15', status: 'Active' },
    { id: 'd-2002', name: 'Dr. Michael Chen', email: 'michael.chen@health.com', specialization: 'Neurology', registrationDate: '2023-08-22', status: 'Active' },
    { id: 'd-2003', name: 'Dr. Emily Rodriguez', email: 'emily.rodriguez@health.com', specialization: 'Pediatrics', registrationDate: '2023-11-10', status: 'Active' },
    { id: 'd-2004', name: 'Dr. James Wilson', email: 'james.wilson@health.com', specialization: 'Orthopedics', registrationDate: '2023-09-05', status: 'Inactive' },
  ];

  const appointments = [
    {
      id: 'a-3001',
      patientId: 'p-1001',
      doctorId: 'd-2001',
      patientName: 'John Carter',
      doctorName: 'Dr. Sarah Johnson',
      reason: 'Heart Checkup',
      datetime: format(new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 0)),
      status: 'Confirmed',
    },
    {
      id: 'a-3002',
      patientId: 'p-1002',
      doctorId: 'd-2002',
      patientName: 'Amelia Brown',
      doctorName: 'Dr. Michael Chen',
      reason: 'Neurological Consultation',
      datetime: format(new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14, 30)),
      status: 'Pending',
    },
    {
      id: 'a-3003',
      patientId: 'p-1003',
      doctorId: 'd-2003',
      patientName: 'Wei Chen',
      doctorName: 'Dr. Emily Rodriguez',
      reason: 'Child Vaccination',
      datetime: format(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 9, 0)),
      status: 'Confirmed',
    },
    {
      id: 'a-3004',
      patientId: 'p-1004',
      doctorId: 'd-2001',
      patientName: 'Maria Garcia',
      doctorName: 'Dr. Sarah Johnson',
      reason: 'Follow-up Consultation',
      datetime: format(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 11, 0)),
      status: 'Confirmed',
    },
  ];

  return { patients, doctors, appointments };
}

const AdminDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const [newAppointment, setNewAppointment] = useState({
    patientId: '',
    doctorId: '',
    reason: '',
    datetime: '',
  });

  useEffect(() => {
    // Load from localStorage or seed
    const storedPatients = window.localStorage.getItem(STORAGE_KEYS.patients);
    const storedDoctors = window.localStorage.getItem(STORAGE_KEYS.doctors);
    const storedAppointments = window.localStorage.getItem(STORAGE_KEYS.appointments);

    if (storedPatients && storedDoctors && storedAppointments) {
      setPatients(JSON.parse(storedPatients));
      setDoctors(JSON.parse(storedDoctors));
      setAppointments(JSON.parse(storedAppointments));
      return;
    }

    const seed = generateSeedData();
    setPatients(seed.patients);
    setDoctors(seed.doctors);
    setAppointments(seed.appointments);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.patients, JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.doctors, JSON.stringify(doctors));
  }, [doctors]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.appointments, JSON.stringify(appointments));
  }, [appointments]);

  const totalPatients = patients.length;
  const totalDoctors = doctors.length;
  const totalAppointments = appointments.length;
  const upcomingAppointments = appointments.filter(a => new Date(a.datetime) > new Date());

  const filteredPatients = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return patients;
    return patients.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.email.toLowerCase().includes(q)
    );
  }, [patients, searchTerm]);

  const filteredDoctors = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return doctors;
    return doctors.filter(d => 
      d.name.toLowerCase().includes(q) || 
      d.email.toLowerCase().includes(q) ||
      d.specialization.toLowerCase().includes(q)
    );
  }, [doctors, searchTerm]);

  const handleCreateAppointment = (e) => {
    e.preventDefault();
    if (!newAppointment.patientId || !newAppointment.doctorId || !newAppointment.reason || !newAppointment.datetime) {
      return;
    }

    const patient = patients.find(p => p.id === newAppointment.patientId);
    const doctor = doctors.find(d => d.id === newAppointment.doctorId);

    const created = {
      id: `a-${Date.now()}`,
      patientId: newAppointment.patientId,
      doctorId: newAppointment.doctorId,
      patientName: patient?.name || '',
      doctorName: doctor?.name || '',
      reason: newAppointment.reason,
      datetime: newAppointment.datetime,
      status: 'Confirmed',
    };

    setAppointments(prev => [created, ...prev]);
    setNewAppointment({ patientId: '', doctorId: '', reason: '', datetime: '' });
  };

  const handleDeleteUser = (userId, userType) => {
    if (userType === 'patient') {
      setPatients(prev => prev.filter(p => p.id !== userId));
      setAppointments(prev => prev.filter(a => a.patientId !== userId));
    } else if (userType === 'doctor') {
      setDoctors(prev => prev.filter(d => d.id !== userId));
      setAppointments(prev => prev.filter(a => a.doctorId !== userId));
    }
  };

  const handleEditUser = (user, userType) => {
    setEditingUser({ ...user, userType });
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (!editingUser) return;

    if (editingUser.userType === 'patient') {
      setPatients(prev => prev.map(p => p.id === editingUser.id ? editingUser : p));
    } else if (editingUser.userType === 'doctor') {
      setDoctors(prev => prev.map(d => d.id === editingUser.id ? editingUser : d));
    }

    setShowEditModal(false);
    setEditingUser(null);
  };

  const handleAppointmentAction = (appointmentId, action) => {
    setAppointments(prev => prev.map(a => {
      if (a.id === appointmentId) {
        switch (action) {
          case 'confirm': return { ...a, status: 'Confirmed' };
          case 'cancel': return { ...a, status: 'Cancelled' };
          case 'complete': return { ...a, status: 'Completed' };
          default: return a;
        }
      }
      return a;
    }));
  };

  return (
    <div className="dashboard-container">
      <h2>Admin Dashboard</h2>

      {/* Stats Overview */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Patients</div>
          <div className="stat-value">{totalPatients}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Doctors</div>
          <div className="stat-value">{totalDoctors}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Appointments</div>
          <div className="stat-value">{totalAppointments}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Upcoming Appointments</div>
          <div className="stat-value">{upcomingAppointments.length}</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="dashboard-section">
        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
          <button 
            className={`dashboard-button ${activeTab === 'overview' ? 'success' : 'secondary'}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`dashboard-button ${activeTab === 'users' ? 'success' : 'secondary'}`}
            onClick={() => setActiveTab('users')}
          >
            Users Management
          </button>
          <button 
            className={`dashboard-button ${activeTab === 'appointments' ? 'success' : 'secondary'}`}
            onClick={() => setActiveTab('appointments')}
          >
            Appointments
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            <h3>System Overview</h3>
            <div className="dashboard-grid">
              <div>
                <h4>Recent Appointments</h4>
                <ul className="dashboard-list max-height-list">
                  {appointments.slice(0, 5).map(a => (
                    <li key={a.id}>
                      <div className="patient-name">{a.patientName}</div>
                      <div className="appointment-reason">{a.reason}</div>
                      <div className="appointment-time">{new Date(a.datetime).toLocaleString()}</div>
                      <div style={{ color: a.status === 'Confirmed' ? '#28a745' : a.status === 'Pending' ? '#ffc107' : '#6c757d' }}>
                        {a.status}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4>Create New Appointment</h4>
                <form onSubmit={handleCreateAppointment}>
                  <div className="form-group">
                    <label>Patient</label>
                    <select
                      value={newAppointment.patientId}
                      onChange={(e) => setNewAppointment(s => ({ ...s, patientId: e.target.value }))}
                      required
                    >
                      <option value="">Select patient</option>
                      {patients.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Doctor</label>
                    <select
                      value={newAppointment.doctorId}
                      onChange={(e) => setNewAppointment(s => ({ ...s, doctorId: e.target.value }))}
                      required
                    >
                      <option value="">Select doctor</option>
                      {doctors.map(d => (
                        <option key={d.id} value={d.id}>{d.name} - {d.specialization}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Reason</label>
                    <input
                      type="text"
                      value={newAppointment.reason}
                      onChange={(e) => setNewAppointment(s => ({ ...s, reason: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Date & Time</label>
                    <input
                      type="datetime-local"
                      value={newAppointment.datetime}
                      onChange={(e) => setNewAppointment(s => ({ ...s, datetime: e.target.value }))}
                      required
                    />
                  </div>
                  <button type="submit" className="dashboard-button">Create Appointment</button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Users Management Tab */}
        {activeTab === 'users' && (
          <div>
            <h3>Users Management</h3>
            <input
              type="text"
              className="search-input"
              placeholder="Search by name, email, or specialization"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <div style={{ marginBottom: '20px' }}>
              <h4>Patients</h4>
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Registration Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPatients.map(p => (
                    <tr key={p.id}>
                      <td>{p.name}</td>
                      <td>{p.email}</td>
                      <td>{p.registrationDate}</td>
                      <td>{p.status}</td>
                      <td>
                        <div className="button-group">
                          <button 
                            className="dashboard-button secondary"
                            onClick={() => handleEditUser(p, 'patient')}
                          >
                            Edit
                          </button>
                          <button 
                            className="dashboard-button danger"
                            onClick={() => handleDeleteUser(p.id, 'patient')}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div>
              <h4>Doctors</h4>
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Specialization</th>
                    <th>Registration Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDoctors.map(d => (
                    <tr key={d.id}>
                      <td>{d.name}</td>
                      <td>{d.email}</td>
                      <td>{d.specialization}</td>
                      <td>{d.registrationDate}</td>
                      <td>{d.status}</td>
                      <td>
                        <div className="button-group">
                          <button 
                            className="dashboard-button secondary"
                            onClick={() => handleEditUser(d, 'doctor')}
                          >
                            Edit
                          </button>
                          <button 
                            className="dashboard-button danger"
                            onClick={() => handleDeleteUser(d.id, 'doctor')}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Appointments Tab */}
        {activeTab === 'appointments' && (
          <div>
            <h3>Appointment Management</h3>
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Date & Time</th>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map(a => (
                  <tr key={a.id}>
                    <td>{new Date(a.datetime).toLocaleString()}</td>
                    <td>{a.patientName}</td>
                    <td>{a.doctorName}</td>
                    <td>{a.reason}</td>
                    <td>{a.status}</td>
                    <td>
                      <div className="button-group">
                        {a.status === 'Pending' && (
                          <>
                            <button 
                              className="dashboard-button success"
                              onClick={() => handleAppointmentAction(a.id, 'confirm')}
                            >
                              Confirm
                            </button>
                            <button 
                              className="dashboard-button danger"
                              onClick={() => handleAppointmentAction(a.id, 'cancel')}
                            >
                              Cancel
                            </button>
                          </>
                        )}
                        {a.status === 'Confirmed' && (
                          <button 
                            className="dashboard-button success"
                            onClick={() => handleAppointmentAction(a.id, 'complete')}
                          >
                            Mark Complete
                          </button>
                        )}
                        <button 
                          className="dashboard-button danger"
                          onClick={() => setAppointments(prev => prev.filter(app => app.id !== a.id))}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit User Modal */}
      {showEditModal && editingUser && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '8px',
            minWidth: '400px'
          }}>
            <h3>Edit {editingUser.userType === 'patient' ? 'Patient' : 'Doctor'}</h3>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={editingUser.name}
                onChange={(e) => setEditingUser(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={editingUser.email}
                onChange={(e) => setEditingUser(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            {editingUser.userType === 'doctor' && (
              <div className="form-group">
                <label>Specialization</label>
                <input
                  type="text"
                  value={editingUser.specialization}
                  onChange={(e) => setEditingUser(prev => ({ ...prev, specialization: e.target.value }))}
                />
              </div>
            )}
            <div className="form-group">
              <label>Status</label>
              <select
                value={editingUser.status}
                onChange={(e) => setEditingUser(prev => ({ ...prev, status: e.target.value }))}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div className="button-group" style={{ marginTop: '20px' }}>
              <button className="dashboard-button success" onClick={handleSaveEdit}>
                Save Changes
              </button>
              <button 
                className="dashboard-button secondary" 
                onClick={() => {
                  setShowEditModal(false);
                  setEditingUser(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;


