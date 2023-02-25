import React, { useState, useEffect, CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import styles from './modules/Login.module.css';
import logo from '../assets/logo.png';
import Cookies from 'universal-cookie';
import ClipLoader from 'react-spinners/ClipLoader';
import Modal from 'react-modal';

const wrapper: CSSProperties = {
  position: "fixed", 
  top: "50%", 
  left: "50%", 
  transform: "translate(-50%, -50%)",
}

const container: CSSProperties = {
  height: '100vh',
  width: '100vw',
  backgroundColor: "RGBA(0,0,0,0.5)",
  position: "fixed",
  zIndex: '9999',
}

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    padding: '2rem',
  },
};

Modal.setAppElement('#root')

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [color, setColor] = useState('#ffffff');
  const [errMessage, setErrMessage] = useState('Email or password is incorrect');
  const navigate = useNavigate();
  const title = "Login Gate Koneksub Administrator";
  const cookies = new Cookies();

  const openModal = () => {
    setIsModalOpen(true);
  }

  const closeModal = () => {
    setIsModalOpen(false);
  }

  useEffect(() => {
    let temptoken = cookies.get('token');
    if (temptoken) {
      navigate('/');
    }
    document.title = title;
  } , []);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if(email == "" || password == "") {
      alert("Email dan Password tidak boleh kosong");
      return false;
    }
    setIsLoading(true);
    fetch(`http://localhost:5000/api/v1/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    }).then((res) => res.json()).then((data) => {
        if (data.token) {
          setIsLoading(false);
          cookies.set("TOKEN", data.token, { path: "/" });
          localStorage.setItem('token', data.token);
          navigate('/');
        }
        if(data.status == 500 || data.status == 401) {
          setIsLoading(false);
          setIsModalOpen(true);
          setErrMessage(data.message);
        }
      }).catch((err) => {
        setIsLoading(false);
        setIsModalOpen(true);
        setErrMessage(err.message);
      });
  }
  return (
    <HelmetProvider>
      <Helmet>
        <style>{'body { background-color: #FFFFFF; }'}</style>
      </Helmet>
      {isLoading ? (
      <div style={container}>
        <div style={wrapper}>
          <ClipLoader color={color} loading={isLoading} size={200}/>
        </div>
      </div>) : (
        <div />
      )}
      <Modal isOpen={isModalOpen} onRequestClose={closeModal} style={customStyles}>
        <h2 className="h2 mb-3">{errMessage}</h2>
        <button className="btn btn-info d-block ms-auto" onClick={closeModal}>Close</button>
      </Modal>

      <section className="vh-100" style={{backgroundcolor: "red"}}>
        <img src={logo} alt="logo" className={styles.logo} />
        <div className="container-fluid h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-md-9 col-lg-6 col-xl-5">
              <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
                className="img-fluid" alt="Sample image" />
            </div>
            <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
              <form className="login_index" id="login_checker" onSubmit={(e)=>handleSubmit(e)}>
                <div className="form-outline mb-4">
                  <label className="form-label" htmlFor="form3Example3" id="your_email">Email Address</label>
                  <input type="text" id="form3Example3" className="form-control form-control-lg"
                    placeholder="Enter email address" name="login_email" onChange={ (e) => setEmail(e.target.value) } />
                </div>
      
                <div className="form-outline mb-3">
                  <label className="form-label" htmlFor="form3Example4">Password</label>
                  <input type="password" id="form3Example4" className="form-control form-control-lg"
                    placeholder="Enter password" name = "login_pass" onChange={ (e) => setPassword(e.target.value) }/>
                </div>
      
                <div className="text-center text-lg-start mt-4 pt-2">
                  <input onClick={ (e) => handleSubmit(e) } type="submit" className="btn btn-primary w-100" id="login" name="login" value="Login" />
                </div>
              </form>
            </div>
            <br />
          </div>
        </div>
      </section>
    </HelmetProvider>
  );
} 
export default Login;