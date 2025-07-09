import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../services/api';
import { toast } from 'react-toastify';
import './UnifiedAuth.css';

const UnifiedAuth = () => {
  const [mode, setMode] = useState('login'); // 'login', 'register', 'verify'
  const [userType, setUserType] = useState('user'); // 'user', 'vendor', 'admin'
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    name: '',
    // Vendor-specific fields
    businessName: '',
    businessAddress: '',
    gstNumber: '',
    panNumber: '',
    // Admin-specific fields
    department: '',
    designation: '',
    adminCode: ''
  });
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login, register, registerVendor, registerAdmin, verifyOTP } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let result;
      
      switch (userType) {
        case 'user':
          result = await register({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
            role: 'ROLE_USER'
          });
          break;
          
        case 'vendor':
          result = await registerVendor({
            firstName: formData.name.split(' ')[0],
            lastName: formData.name.split(' ').slice(1).join(' ') || '',
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
            businessName: formData.businessName,
            businessAddress: formData.businessAddress,
            gstNumber: formData.gstNumber,
            panNumber: formData.panNumber,
            role: 'ROLE_VENDOR'
          });
          break;
          
        case 'admin':
          result = await registerAdmin({
            firstName: formData.name.split(' ')[0],
            lastName: formData.name.split(' ').slice(1).join(' ') || '',
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
            department: formData.department,
            designation: formData.designation,
            role: 'ROLE_ADMIN'
          });
          break;
          
        default:
          throw new Error('Invalid user type');
      }

      if (result.success) {
        setIsOtpSent(true);
        setMode('verify');
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const emailOrPhone = formData.email || formData.phone;
      let result;

      if (userType === 'admin') {
        result = await login(emailOrPhone, formData.password, 'ROLE_ADMIN', formData.adminCode);
      } else {
        result = await login(emailOrPhone, formData.password);
      }

      if (result.success) {
        if (result.requiresOTP) {
          setIsOtpSent(true);
          setMode('verify');
        } else {
          toast.success('Login successful!');
          // Redirect will be handled by the auth context
        }
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerification = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const emailOrPhone = formData.email || formData.phone;
      const result = await verifyOTP(emailOrPhone, otp);

      if (result.success) {
        toast.success('Verification successful!');
        // Redirect will be handled by the auth context
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      toast.error('OTP verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderUserTypeSelector = () => (
    <div className="user-type-selector">
      <div className="user-type-tabs">
        <button 
          className={`tab ${userType === 'user' ? 'active' : ''}`}
          onClick={() => setUserType('user')}
        >
          User
        </button>
        <button 
          className={`tab ${userType === 'vendor' ? 'active' : ''}`}
          onClick={() => setUserType('vendor')}
        >
          Vendor
        </button>
        <button 
          className={`tab ${userType === 'admin' ? 'active' : ''}`}
          onClick={() => setUserType('admin')}
        >
          Admin
        </button>
      </div>
    </div>
  );

  const renderLoginForm = () => (
    <form onSubmit={handleLogin} className="auth-form">
      <h2>Login as {userType.charAt(0).toUpperCase() + userType.slice(1)}</h2>
      
      <div className="form-group">
        <label>Email or Phone</label>
        <input
          type="text"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          required
        />
      </div>

      {userType === 'admin' && (
        <div className="form-group">
          <label>Admin Access Code</label>
          <input
            type="password"
            name="adminCode"
            value={formData.adminCode}
            onChange={handleInputChange}
            required
          />
        </div>
      )}

      <button type="submit" disabled={loading} className="auth-btn">
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );

  const renderRegisterForm = () => (
    <form onSubmit={handleRegister} className="auth-form">
      <h2>Register as {userType.charAt(0).toUpperCase() + userType.slice(1)}</h2>
      
      <div className="form-group">
        <label>Full Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Phone</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          required
        />
      </div>

      {userType === 'vendor' && (
        <>
          <div className="form-group">
            <label>Business Name</label>
            <input
              type="text"
              name="businessName"
              value={formData.businessName}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>Business Address</label>
            <textarea
              name="businessAddress"
              value={formData.businessAddress}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>GST Number</label>
            <input
              type="text"
              name="gstNumber"
              value={formData.gstNumber}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>PAN Number</label>
            <input
              type="text"
              name="panNumber"
              value={formData.panNumber}
              onChange={handleInputChange}
            />
          </div>
        </>
      )}

      {userType === 'admin' && (
        <>
          <div className="form-group">
            <label>Department</label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>Designation</label>
            <input
              type="text"
              name="designation"
              value={formData.designation}
              onChange={handleInputChange}
            />
          </div>
        </>
      )}

      <button type="submit" disabled={loading} className="auth-btn">
        {loading ? 'Registering...' : 'Register'}
      </button>
    </form>
  );

  const renderOtpForm = () => (
    <form onSubmit={handleOtpVerification} className="auth-form">
      <h2>Verify OTP</h2>
      <p>Enter the OTP sent to your email/phone</p>
      
      <div className="form-group">
        <label>OTP</label>
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
          maxLength="6"
        />
      </div>

      <button type="submit" disabled={loading} className="auth-btn">
        {loading ? 'Verifying...' : 'Verify OTP'}
      </button>
    </form>
  );

  return (
    <div className="unified-auth">
      <div className="auth-container">
        {renderUserTypeSelector()}
        
        {mode === 'verify' ? (
          renderOtpForm()
        ) : (
          <>
            <div className="mode-selector">
              <button 
                className={`mode-btn ${mode === 'login' ? 'active' : ''}`}
                onClick={() => setMode('login')}
              >
                Login
              </button>
              <button 
                className={`mode-btn ${mode === 'register' ? 'active' : ''}`}
                onClick={() => setMode('register')}
              >
                Register
              </button>
            </div>

            {mode === 'login' ? renderLoginForm() : renderRegisterForm()}
          </>
        )}
      </div>
    </div>
  );
};

export default UnifiedAuth;
