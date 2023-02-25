import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Cookies from 'universal-cookie'
import MapContainer2 from './MapContainer2.js'
import Croppie from 'croppie'
import 'croppie/croppie.css'
import bootstrap from 'bootstrap/dist/js/bootstrap.min.js'
import './css/AddPartner.css'

export default ({showLoading}) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [role, setRole] = useState('')
  const [status, setStatus] = useState('')
  const [openHour, setOpenHour] = useState('')
  const [closeHour, setCloseHour] = useState('')
  const [image, setImage] = useState('')
  const imageRef = React.useRef()
  const [croppie, setCroppie] = useState(null)
  const [cropModal, setCropModal] = useState(null)
  const [resultModal, setResultModal] = useState(null)
  const [qrImage, setQrImage] = useState('0')
  const [modalMessage, setModalMessage] = useState('Partner added successfully')
  const [trashCategory, setTrashCategory] = useState([
    { name: '1', value: false },
    { name: '2', value: false },
    { name: '3', value: false },
  ])
  const [days, setDays] = useState([
    { name: 'monday', value: false },
    { name: 'tuesday', value: false },
    { name: 'wednesday', value: false },
    { name: 'thursday', value: false },
    { name: 'friday', value: false },
    { name: 'saturday', value: false },
    { name: 'sunday', value: false },
  ])

  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [latLng, setLatLng] = useState()
  const navigate = useNavigate()
  const cookies = new Cookies()

  const initiateCroppie = () => {
    const el = document.getElementById('image-helper')
    if(el){
      const croppieInstance = new Croppie(el, {
        enableExif: true,
        enforceBoundary: false,
        viewport: {
          width: 250,
          height: 250,
        },
        boundary: {
          width: 280,
          height: 400,
        },
      })
      setCroppie(croppieInstance)
    }
  }
  
  useEffect(() => {
    setCropModal(new bootstrap.Modal(document.getElementById("cropModal")))
    setResultModal(new bootstrap.Modal(document.getElementById("resultModal")))
  }, [])

  const updatePhotos = (e) => { 
    const file = e.target.files
    const el = document.getElementById("image-helper")
    if(el){
      const croppieInstance = new Croppie(el, {
        enableExif: true,
        enforceBoundary: false,
        viewport: {
          height: 250,
          width: 250,
        },
        boundary: {
          height: 280,
          width: 400,
        },
      })
      cropModal.show()
      const shownModal = document.getElementById("cropModal")
      shownModal.addEventListener('shown.bs.modal', event => {
        if(file.length > 0){
          croppieInstance.bind({
            url: URL.createObjectURL(new Blob(file, {type: "image/jpg"})),
          })
        }
      })
      setCroppie(croppieInstance)
    }
  } 

  const handleCrop = (e) => {
    croppie.result({
      type: 'blob',
      size: 'viewport',
    }).then((blob) => {
      setImage(blob)
      cropModal.hide() 
    })
  }

  const cancelCropModal = document.getElementById("cropModal")
  if(cancelCropModal){
    cancelCropModal.addEventListener('hide.bs.modal', event => {
      if(croppie){
        croppie.destroy()
      }
    })
  }

  const resultTempModal = document.getElementById("resultModal")
  if(resultTempModal){
    resultTempModal.addEventListener('hide.bs.modal', event => {
      navigate('/partner')
    })
  }

  const setLatitudeLongitude = (newLatLng) => {
    setLatLng(newLatLng)
  }

  const updateTrashCategory = (e) => {
    const newTrashCategory = trashCategory.map((item) => {
      if (item.name === e.target.value) {
        item.value = e.target.checked
      }
      return item 
    })
    setTrashCategory(newTrashCategory)
  }

  const updateDays = (e) => {
    const newDays = days.map((item) => {
      if (item.name === e.target.value) {
        item.value = e.target.checked
      }
      return item 
    })
    setDays(newDays)
  }

  const addPartner = async (e) => {
    showLoading(true)
    e.preventDefault()
    if(name == '' || email == '' || password == '' || address == '' || phone == '' || status == '' || openHour == '' || closeHour == '' || image == '' || latLng == undefined){
      alert('Please fill all the fields')
      showLoading(false)
      return
    }
    try {
      const formData = new FormData()
      formData.append('partnerName', name)
      formData.append('partnerEmail', email)
      formData.append('password', password)
      formData.append('address', address)
      formData.append('phone', phone)
      formData.append('status', status)
      formData.append('image', image)
      formData.append('coord', JSON.stringify(latLng))
      const workingDays = days.filter((item) => item.value === true).map((item) => item.name)
      const trashAccepted = trashCategory.filter((item) => item.value === true).map((item) => +item.name)
      formData.append('trashCategory', JSON.stringify(trashAccepted))
      const schedule = {
        open: openHour,
        close: closeHour,
        days: workingDays,
      }
      formData.append('schedule', JSON.stringify(schedule))
      const { data } = await axios({
        method: 'POST',
        url: 'http://localhost:5000/api/v1/partners',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${cookies.get('token')}`,
        },
      }).then((response) => {
        setModalMessage(response.data.message)
        setQrImage(response.data.qrcode)
        resultModal.show()
        showLoading(false)
      }).catch((error) => {
        console.log(error)
        showLoading(false)
      })
      setMessage(data.message)
    } catch (error) {
      setError(error.response)
      setTimeout(() => {
        setError('')
      }, 1000)
    }
  }

  return (
    <div>
      <div className="modal fade" id="resultModal" tabIndex="-1" aria-labelledby="resultModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="resultModalLabel">{modalMessage}</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <p> This is the QR Code for the partner. Please show this to the partner to scan. </p>
              <div className="d-flex justify-content-center mb-5">
                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${qrImage}`} alt="loading" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="modal fade" id="cropModal" tabIndex="-1" aria-labelledby="cropModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="cropModalLabel">Crop Image</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div id="image-helper"></div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary" onClick={() => handleCrop()}>Save changes</button>
            </div>
          </div>
        </div>
      </div>
      <div className="container px-5 mb-4">
        <a href="/">Home</a> / <a href="/partner">Partner</a> / <span>Create Partner</span>
      </div>
      <div className="row justify-content-between align-items-center">
        <h1 className="col-4 px-5 mb-3">Register Partner</h1>
        <div className="col-md-12 px-5">
          <div className="card">
            <div className="card-header">Partner Registration Form</div>
            <div className="card-body">
              {message && <p className="alert alert-success">{message}</p>}
              {error && <p className="alert alert-danger">{error}</p>}
              <form onSubmit={addPartner} encType="multipart/form-data">
                <div className="form-group">
                  <label htmlFor="name">Partner Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="address">Address</label>
                  <input
                    type="text"
                    className="form-control"
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone</label>
                  <div className="input-group">
                    <span className="input-group-text">+62</span>
                    <input
                      type="text"
                      className="form-control"
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="status">Status</label>
                  <select
                    className="form-control"
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="" hidden disabled>Select Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="unvalidated">Unvalidated</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="trash">Trash Category</label>
                  <div className="input-group">
                    <div className="form-check form-check-inline">
                      <input className="form-check-input" type="checkbox" value="1" id="plastic" onChange={(e) => updateTrashCategory(e)} />
                      <label className="form-check-label" htmlFor="plastic">
                        Plastic 
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input className="form-check-input" type="checkbox" value="2" id="electronic" onChange={(e) => updateTrashCategory(e)}/>
                      <label className="form-check-label" htmlFor="electronic">
                        Electronic Waste 
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input className="form-check-input" type="checkbox" value="3" id="cardboard" onChange={(e) => updateTrashCategory(e)}/>
                      <label className="form-check-label" htmlFor="cardboard">  
                        Cardboard Box 
                      </label>
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="schedule">Schedule</label>
                  <div className="input-group">
                    <div className="form-check form-check-inline">
                      <input className="form-check-input" type="checkbox" value="monday" id="monday" onChange={(e) => updateDays(e)} />
                      <label className="form-check-label" htmlFor="monday">
                        Monday 
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input className="form-check-input" type="checkbox" value="tuesday" id="tuesday" onChange={(e) => updateDays(e)}/>
                      <label className="form-check-label" htmlFor="tuesday">
                        Tuesday 
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input className="form-check-input" type="checkbox" value="wednesday" id="wednesday" onChange={(e) => updateDays(e)}/>
                      <label className="form-check-label" htmlFor="wednesday">
                        Wednesday 
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input className="form-check-input" type="checkbox" value="thursday" id="thursday" onChange={(e) => updateDays(e)}/>
                      <label className="form-check-label" htmlFor="thursday">
                        Thursday 
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input className="form-check-input" type="checkbox" value="friday" id="friday" onChange={(e) => updateDays(e)}/>
                      <label className="form-check-label" htmlFor="friday">
                        Friday 
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input className="form-check-input" type="checkbox" value="saturday" id="saturday" onChange={(e) => updateDays(e)}/>
                      <label className="form-check-label" htmlFor="saturday">
                        Saturday 
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input className="form-check-input" type="checkbox" value="sunday" id="sunday" onChange={(e) => updateDays(e)}/>
                      <label className="form-check-label" htmlFor="sunday">
                        Sunday 
                      </label>
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="hours">Working Hours</label>
                  <div className="input-group">
                    <input type="time" className="form-control" id="hours" onChange={(e) => setOpenHour(e.target.value)} />
                    <input type="time" className="form-control" id="hours" onChange={(e) => setCloseHour(e.target.value)}/>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="photos">Partner Photo</label>
                  <input type="file" ref={imageRef} className="form-control" id="photos" onChange={(e) => updatePhotos(e)}/>
                </div>
                <div className="form-group">
                  <label htmlFor="locationMap">Location Map</label>
                  <div className="map-container" id="mapBox">
                    <MapContainer2 setLatitudeLongitude={setLatitudeLongitude} />
                  </div>
                </div>
                <div className="d-flex flex-row-reverse justify-content-between align-items-center">
                  <button type="submit" className="btn btn-primary">
                    Add Partner 
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}