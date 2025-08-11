import React, { useEffect, useMemo, useState } from 'react';
import './PatientDashboardStyle.css';

const STORAGE_KEYS = {
  appointments: 'mockPatientAppointments',
  doctors: 'mockPatientDoctors',
  medicalRecords: 'mockPatientMedicalRecords',
  patientProfile: 'mockPatientProfile',
};

function generateSeedData() {
  const today = new Date();
  const format = (d) => d.toISOString().slice(0, 16);

  const doctors = [
    { 
      id: 'd-2001', 
      name: 'Dr. Sarah Johnson', 
      email: 'sarah.johnson@health.com', 
      specialization: 'Cardiology',
      phone: '+1-555-0101',
      consultationHours: 'Mon-Fri 9:00 AM - 5:00 PM',
      rating: 4.8,
      experience: '15 years'
    },
    { 
      id: 'd-2002', 
      name: 'Dr. Michael Chen', 
      email: 'michael.chen@health.com', 
      specialization: 'Neurology',
      phone: '+1-555-0102',
      consultationHours: 'Mon-Fri 10:00 AM - 6:00 PM',
      rating: 4.9,
      experience: '12 years'
    },
    { 
      id: 'd-2003', 
      name: 'Dr. Emily Rodriguez', 
      email: 'emily.rodriguez@health.com', 
      specialization: 'Pediatrics',
      phone: '+1-555-0103',
      consultationHours: 'Mon-Fri 8:00 AM - 4:00 PM',
      rating: 4.7,
      experience: '8 years'
    },
    { 
      id: 'd-2004', 
      name: 'Dr. James Wilson', 
      email: 'james.wilson@health.com', 
      specialization: 'Orthopedics',
      phone: '+1-555-0104',
      consultationHours: 'Mon-Fri 9:00 AM - 5:00 PM',
      rating: 4.6,
      experience: '20 years'
    },
  ];

  const appointments = [
    {
      id: 'a-3001',
      doctorId: 'd-2001',
      doctorName: 'Dr. Sarah Johnson',
      doctorSpecialization: 'Cardiology',
      reason: 'Heart Checkup Follow-up',
      datetime: format(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 10, 0)),
      status: 'Confirmed',
      notes: 'Regular follow-up appointment'
    },
    {
      id: 'a-3002',
      doctorId: 'd-2002',
      doctorName: 'Dr. Michael Chen',
      doctorSpecialization: 'Neurology',
      reason: 'Migraine Consultation',
      datetime: format(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5, 14, 30)),
      status: 'Confirmed',
      notes: 'Discuss treatment options'
    },
    {
      id: 'a-3003',
      doctorId: 'd-2001',
      doctorName: 'Dr. Sarah Johnson',
      doctorSpecialization: 'Cardiology',
      reason: 'Blood Pressure Review',
      datetime: format(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1, 11, 0)),
      status: 'Completed',
      notes: 'Appointment completed successfully'
    },
  ];

  const medicalRecords = [
    {
      id: 'mr-4001',
      date: '2024-01-15',
      doctorName: 'Dr. Sarah Johnson',
      diagnosis: 'Hypertension',
      prescription: 'Lisinopril 10mg daily',
      notes: 'Patient shows elevated blood pressure. Monitor weekly.',
      type: 'Consultation'
    },
    {
      id: 'mr-4002',
      date: '2024-02-20',
      doctorName: 'Dr. Sarah Johnson',
      diagnosis: 'Follow-up - Hypertension',
      prescription: 'Lisinopril 10mg daily, Amlodipine 5mg daily',
      notes: 'Blood pressure improved but still elevated. Added second medication.',
      type: 'Follow-up'
    },
    {
      id: 'mr-4003',
      date: '2024-03-01',
      doctorName: 'Dr. Michael Chen',
      diagnosis: 'Migraine',
      prescription: 'Sumatriptan 50mg as needed',
      notes: 'Patient reports severe headaches. Prescribed abortive medication.',
      type: 'Consultation'
    },
  ];

  const patientProfile = {
    id: 'p-1001',
    name: 'John Carter',
    email: 'john.carter@example.com',
    phone: '+1-555-0123',
    dob: '1985-04-12',
    address: '123 Main St, City, State',
    emergencyContact: 'Jane Carter',
    emergencyPhone: '+1-555-0126',
    bloodType: 'O+',
    allergies: 'Penicillin',
    medicalHistory: 'Hypertension, Migraine'
  };

  return { doctors, appointments, medicalRecords, patientProfile };
}

const PatientDashboard = () => {
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [patientProfile, setPatientProfile] = useState({});
  const [activeView, setActiveView] = useState('home'); // 'home', 'booking', 'records', 'profile'
  const [bookingStep, setBookingStep] = useState(1); // 1: Find Doctor, 2: Select Date/Time, 3: Confirm
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDateTime, setSelectedDateTime] = useState('');
  const [bookingReason, setBookingReason] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');

  useEffect(() => {
    // Load from localStorage or seed
    const storedDoctors = window.localStorage.getItem(STORAGE_KEYS.doctors);
    const storedAppointments = window.localStorage.getItem(STORAGE_KEYS.appointments);
    const storedMedicalRecords = window.localStorage.getItem(STORAGE_KEYS.medicalRecords);
    const storedPatientProfile = window.localStorage.getItem(STORAGE_KEYS.patientProfile);

    if (storedDoctors && storedAppointments && storedMedicalRecords && storedPatientProfile) {
      setDoctors(JSON.parse(storedDoctors));
      setAppointments(JSON.parse(storedAppointments));
      setMedicalRecords(JSON.parse(storedMedicalRecords));
      setPatientProfile(JSON.parse(storedPatientProfile));
      return;
    }

    const seed = generateSeedData();
    setDoctors(seed.doctors);
    setAppointments(seed.appointments);
    setMedicalRecords(seed.medicalRecords);
    setPatientProfile(seed.patientProfile);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.appointments, JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.patientProfile, JSON.stringify(patientProfile));
  }, [patientProfile]);

  const upcomingAppointments = appointments.filter(a => new Date(a.datetime) > new Date());
  const pastAppointments = appointments.filter(a => new Date(a.datetime) <= new Date());

  const filteredDoctors = useMemo(() => {
    let filtered = doctors;
    
    if (searchTerm) {
      const q = searchTerm.trim().toLowerCase();
      filtered = filtered.filter(d => 
        d.name.toLowerCase().includes(q) || 
        d.specialization.toLowerCase().includes(q)
      );
    }
    
    if (selectedSpecialization) {
      filtered = filtered.filter(d => d.specialization === selectedSpecialization);
    }
    
    return filtered;
  }, [doctors, searchTerm, selectedSpecialization]);

  const specializations = useMemo(() => {
    const specs = [...new Set(doctors.map(d => d.specialization))];
    return specs.sort();
  }, [doctors]);

  const handleBookAppointment = () => {
    setActiveView('booking');
    setBookingStep(1);
    setSelectedDoctor(null);
    setSelectedDateTime('');
    setBookingReason('');
  };

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    setBookingStep(2);
  };

  const handleDateTimeSelect = () => {
    if (!selectedDateTime) return;
    setBookingStep(3);
  };

  const handleConfirmBooking = () => {
    if (!selectedDoctor || !selectedDateTime || !bookingReason) return;

    const newAppointment = {
      id: `a-${Date.now()}`,
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      doctorSpecialization: selectedDoctor.specialization,
      reason: bookingReason,
      datetime: selectedDateTime,
      status: 'Pending',
      notes: 'Appointment requested by patient'
    };

    setAppointments(prev => [newAppointment, ...prev]);
    
    // Reset and go back to home
    setActiveView('home');
    setBookingStep(1);
    setSelectedDoctor(null);
    setSelectedDateTime('');
    setBookingReason('');
    
    alert('Appointment booked successfully!');
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    alert('Profile updated successfully!');
  };

  const handleCancelAppointment = (appointmentId) => {
    setAppointments(prev => prev.map(a => 
      a.id === appointmentId ? { ...a, status: 'Cancelled' } : a
    ));
  };

  if (activeView === 'profile') {
    return (
      <div className="dashboard-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>Profile Management</h2>
          <button 
            className="dashboard-button secondary"
            onClick={() => setActiveView('home')}
          >
            Back to Home
          </button>
        </div>

        <div className="dashboard-section">
          <h3>Update Personal Information</h3>
          <form onSubmit={handleUpdateProfile}>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={patientProfile.name || ''}
                onChange={(e) => setPatientProfile(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={patientProfile.email || ''}
                onChange={(e) => setPatientProfile(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                value={patientProfile.phone || ''}
                onChange={(e) => setPatientProfile(prev => ({ ...prev, phone: e.target.value }))}
                required
              />
            </div>
            <div className="form-group">
              <label>Date of Birth</label>
              <input
                type="date"
                value={patientProfile.dob || ''}
                onChange={(e) => setPatientProfile(prev => ({ ...prev, dob: e.target.value }))}
                required
              />
            </div>
            <div className="form-group">
              <label>Address</label>
              <textarea
                value={patientProfile.address || ''}
                onChange={(e) => setPatientProfile(prev => ({ ...prev, address: e.target.value }))}
                required
                style={{ minHeight: 60 }}
              />
            </div>
            <div className="form-group">
              <label>Emergency Contact</label>
              <input
                type="text"
                value={patientProfile.emergencyContact || ''}
                onChange={(e) => setPatientProfile(prev => ({ ...prev, emergencyContact: e.target.value }))}
                required
              />
            </div>
            <div className="form-group">
              <label>Emergency Phone</label>
              <input
                type="tel"
                value={patientProfile.emergencyPhone || ''}
                onChange={(e) => setPatientProfile(prev => ({ ...prev, emergencyPhone: e.target.value }))}
                required
              />
            </div>
            <div className="form-group">
              <label>Blood Type</label>
              <select
                value={patientProfile.bloodType || ''}
                onChange={(e) => setPatientProfile(prev => ({ ...prev, bloodType: e.target.value }))}
                required
              >
                <option value="">Select blood type</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
            <div className="form-group">
              <label>Allergies</label>
              <input
                type="text"
                value={patientProfile.allergies || ''}
                onChange={(e) => setPatientProfile(prev => ({ ...prev, allergies: e.target.value }))}
                placeholder="e.g., Penicillin, None"
              />
            </div>
            <div className="form-group">
              <label>Medical History</label>
              <textarea
                value={patientProfile.medicalHistory || ''}
                onChange={(e) => setPatientProfile(prev => ({ ...prev, medicalHistory: e.target.value }))}
                placeholder="List any chronic conditions or medical history"
                style={{ minHeight: 60 }}
              />
            </div>
            <button type="submit" className="dashboard-button">Update Profile</button>
          </form>
        </div>
      </div>
    );
  }

  if (activeView === 'records') {
    return (
      <div className="dashboard-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>Medical Records</h2>
          <button 
            className="dashboard-button secondary"
            onClick={() => setActiveView('home')}
          >
            Back to Home
          </button>
        </div>

        <div className="dashboard-section">
          <h3>Medical History Timeline</h3>
          {medicalRecords.length === 0 ? (
            <p className="empty-state">No medical records found.</p>
          ) : (
            <ul className="dashboard-list">
              {medicalRecords.map((record) => (
                <li key={record.id}>
                  <div>
                    <div className="patient-name">{record.diagnosis}</div>
                    <div className="appointment-reason">{record.prescription}</div>
                    {record.notes && <div className="prescription-notes">{record.notes}</div>}
                    <div className="prescription-date">
                      {record.date} - {record.doctorName} ({record.type})
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

  if (activeView === 'booking') {
    return (
      <div className="dashboard-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>Book New Appointment</h2>
          <button 
            className="dashboard-button secondary"
            onClick={() => setActiveView('home')}
          >
            Back to Home
          </button>
        </div>

        {/* Step Indicator */}
        <div className="dashboard-section">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ 
                padding: '8px 12px', 
                borderRadius: '50%', 
                backgroundColor: bookingStep >= 1 ? '#007bff' : '#ccc',
                color: 'white',
                fontWeight: 'bold'
              }}>
                1
              </span>
              <span>Find Doctor</span>
              <span style={{ color: '#ccc' }}>→</span>
              <span style={{ 
                padding: '8px 12px', 
                borderRadius: '50%', 
                backgroundColor: bookingStep >= 2 ? '#007bff' : '#ccc',
                color: 'white',
                fontWeight: 'bold'
              }}>
                2
              </span>
              <span>Select Date & Time</span>
              <span style={{ color: '#ccc' }}>→</span>
              <span style={{ 
                padding: '8px 12px', 
                borderRadius: '50%', 
                backgroundColor: bookingStep >= 3 ? '#007bff' : '#ccc',
                color: 'white',
                fontWeight: 'bold'
              }}>
                3
              </span>
              <span>Confirm Booking</span>
            </div>
          </div>

          {/* Step 1: Find Doctor */}
          {bookingStep === 1 && (
            <div>
              <h3>Step 1: Find a Doctor</h3>
              <div style={{ marginBottom: '20px' }}>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search by doctor name or specialization"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select
                  className="search-input"
                  value={selectedSpecialization}
                  onChange={(e) => setSelectedSpecialization(e.target.value)}
                  style={{ marginBottom: '0' }}
                >
                  <option value="">All Specializations</option>
                  {specializations.map(spec => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
              </div>

              {filteredDoctors.length === 0 ? (
                <p className="empty-state">No doctors found matching your criteria.</p>
              ) : (
                <div style={{ display: 'grid', gap: '16px' }}>
                  {filteredDoctors.map(doctor => (
                    <div key={doctor.id} className="dashboard-section" style={{ cursor: 'pointer' }} onClick={() => handleDoctorSelect(doctor)}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <div className="patient-name">{doctor.name}</div>
                          <div className="appointment-reason">{doctor.specialization}</div>
                          <div className="appointment-time">{doctor.consultationHours}</div>
                          <div className="prescription-notes">Experience: {doctor.experience}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#28a745' }}>
                            ⭐ {doctor.rating}
                          </div>
                          <button className="dashboard-button">Select</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 2: Select Date & Time */}
          {bookingStep === 2 && selectedDoctor && (
            <div>
              <h3>Step 2: Select Date & Time</h3>
              <div className="dashboard-section">
                <h4>Selected Doctor: {selectedDoctor.name}</h4>
                <p>Specialization: {selectedDoctor.specialization}</p>
                <p>Consultation Hours: {selectedDoctor.consultationHours}</p>
              </div>

              <div className="form-group">
                <label>Select Date & Time</label>
                <input
                  type="datetime-local"
                  value={selectedDateTime}
                  onChange={(e) => setSelectedDateTime(e.target.value)}
                  required
                  min={new Date().toISOString().slice(0, 16)}
                />
              </div>

              <div className="form-group">
                <label>Reason for Visit</label>
                <textarea
                  value={bookingReason}
                  onChange={(e) => setBookingReason(e.target.value)}
                  placeholder="Please describe the reason for your appointment"
                  required
                  style={{ minHeight: 80 }}
                />
              </div>

              <button 
                className="dashboard-button"
                onClick={handleDateTimeSelect}
                disabled={!selectedDateTime || !bookingReason}
              >
                Continue to Confirmation
              </button>
            </div>
          )}

          {/* Step 3: Confirm Booking */}
          {bookingStep === 3 && selectedDoctor && (
            <div>
              <h3>Step 3: Confirm Booking</h3>
              <div className="dashboard-section">
                <h4>Appointment Details</h4>
                <div style={{ display: 'grid', gap: '12px', marginBottom: '20px' }}>
                  <div><strong>Doctor:</strong> {selectedDoctor.name}</div>
                  <div><strong>Specialization:</strong> {selectedDoctor.specialization}</div>
                  <div><strong>Date & Time:</strong> {new Date(selectedDateTime).toLocaleString()}</div>
                  <div><strong>Reason:</strong> {bookingReason}</div>
                </div>

                <div className="button-group">
                  <button className="dashboard-button success" onClick={handleConfirmBooking}>
                    Confirm Booking
                  </button>
                  <button 
                    className="dashboard-button secondary"
                    onClick={() => setBookingStep(2)}
                  >
                    Back to Edit
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Main Home View
  return (
    <div className="dashboard-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Welcome, {patientProfile.name}!</h2>
        <div className="button-group">
          <button 
            className="dashboard-button secondary"
            onClick={() => setActiveView('records')}
          >
            Medical Records
          </button>
          <button 
            className="dashboard-button secondary"
            onClick={() => setActiveView('profile')}
          >
            Profile Management
          </button>
        </div>
      </div>

      {/* Upcoming Appointments */}
      <div className="dashboard-section">
        <h3>Upcoming Appointments</h3>
        {upcomingAppointments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p className="empty-state">No upcoming appointments scheduled.</p>
            <button 
              className="dashboard-button"
              onClick={handleBookAppointment}
              style={{ marginTop: '16px' }}
            >
              Book New Appointment
            </button>
          </div>
        ) : (
          <div>
            <ul className="dashboard-list">
              {upcomingAppointments.map((appointment) => (
                <li key={appointment.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div className="patient-name">{appointment.doctorName}</div>
                      <div className="appointment-reason">{appointment.reason}</div>
                      <div className="appointment-time">
                        {new Date(appointment.datetime).toLocaleString()}
                      </div>
                      <div className="prescription-notes">{appointment.doctorSpecialization}</div>
                    </div>
                    <div>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '0.8rem',
                        fontWeight: '500',
                        backgroundColor: appointment.status === 'Confirmed' ? '#d4edda' : '#fff3cd',
                        color: appointment.status === 'Confirmed' ? '#155724' : '#856404'
                      }}>
                        {appointment.status}
                      </span>
                      {appointment.status === 'Confirmed' && (
                        <button 
                          className="dashboard-button danger"
                          onClick={() => handleCancelAppointment(appointment.id)}
                          style={{ marginLeft: '8px' }}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <button 
                className="dashboard-button"
                onClick={handleBookAppointment}
              >
                Book Another Appointment
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Past Appointments */}
      {pastAppointments.length > 0 && (
        <div className="dashboard-section">
          <h3>Recent Appointments</h3>
          <ul className="dashboard-list max-height-list">
            {pastAppointments.slice(0, 3).map((appointment) => (
              <li key={appointment.id}>
                <div>
                  <div className="patient-name">{appointment.doctorName}</div>
                  <div className="appointment-reason">{appointment.reason}</div>
                  <div className="appointment-time">
                    {new Date(appointment.datetime).toLocaleString()}
                  </div>
                  <div className="prescription-notes">{appointment.doctorSpecialization}</div>
                  <div style={{ 
                    color: appointment.status === 'Completed' ? '#28a745' : '#6c757d',
                    fontSize: '0.9rem',
                    fontWeight: '500'
                  }}>
                    {appointment.status}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Quick Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Upcoming Appointments</div>
          <div className="stat-value">{upcomingAppointments.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Appointments</div>
          <div className="stat-value">{appointments.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Medical Records</div>
          <div className="stat-value">{medicalRecords.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Available Doctors</div>
          <div className="stat-value">{doctors.length}</div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;


