import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import DataTable from 'react-data-table-component'
import Cookies from 'universal-cookie'
import ClipLoader from 'react-spinners/ClipLoader'
import Modal from 'react-bootstrap/Modal'



export default function UserList({showLoading}) {
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [userId, setUserId] = useState('')
  const navigate = useNavigate()

  const handleShow = () => {
    setShowModal(true)
  }

  const handleClose = () => {
    setShowModal(false)
  }

  const resetPassword = (id, handleShow) => {
    setUserId(id)
    handleShow(true)
  }

  const deleteUser = async (id) => {
    setIsLoading(true)
    const cookies = new Cookies()
    const token = cookies.get('token')
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    await axios.delete(`http://localhost:5000/api/v1/user/${id}`, config)
    getAllUsers()
  }

  const getAllUsers = async () => {
    const cookies = new Cookies()
    const token = cookies.get('TOKEN')
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    axios
      .get('http://localhost:5000/api/v1/user', config)
      .then((response) => {
        setUsers(response.data.users)
        setIsLoading(false)
      })
      .catch((error) => {
        if (error.response.status === 401) {
          navigate('/login')
        }
      })
  }

  useEffect(() => {
    getAllUsers()
  }, [])

  const columns = [
    {
      name: 'Username',
      selector: row => row.username,
      sortable: true,
    },
    {
      name: 'Email',
      selector: row => row.email,
      sortable: true,
    },
    {
      name: 'Phone Number',
      selector: row => '+62 ' + row.phoneNumber,
      sortable: true,
    },
    {
      name: 'Role',
      selector: row => row.type,
      sortable: true,
    },
    {
      name: 'Actions',
      cell: (row) => (
        <div className="d-flex">
          <button
            className="btn btn-danger me-1"
            onClick={() => deleteUser(row.email)}
          >
            Delete
          </button>
          <button
            className="btn btn-warning"
            onClick={() => resetPassword(row.email, handleShow)}
          >
            Reset Password 
          </button>
        </div>
      ),
    },
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    showLoading(true)
    const data = {
      password: e.target.password.value,
      confirmPassword: e.target.confirmPassword.value,
      email: e.target.email.value
    }
    const cookies = new Cookies()
    const token = cookies.get('TOKEN')
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    axios
      .post('http://localhost:5000/api/v1/user/reset', data, config)
      .then((response) => {
        if (response.status === 200) {
          setShowModal(false)
          getAllUsers()
          showLoading(false)
        }
      })
      .catch((error) => {
        alert(error.response.data.message)
        showLoading(false)
      })
  }

  return (
    <div>
      <Modal show={showModal} onHide={handleClose} centered>
        <form className="resetPasswordForm" id="resetPasswordForm" onSubmit={(e) => handleSubmit(e)}>
          <Modal.Header closeButton>
            <Modal.Title>Reset Password User</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <input type="hidden" name="email" value={userId} />
            <div className="form-group">
              <label htmlFor="password">Type New Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                className="form-control"
                id="confirmPassword"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button className="btn btn-secondary" variant="secondary" onClick={handleClose}>
              Close 
            </button>
            <button type="submit" className="btn btn-primary" variant="primary">
              Save Changes
            </button>
          </Modal.Footer>
        </form>
      </Modal>
      <div className="row justify-content-between align-items-center">
        <h1 className="col-4">User Management</h1>
      </div>  
      <DataTable columns={columns} data={users} progressPending={isLoading} />
    </div>
  )
}