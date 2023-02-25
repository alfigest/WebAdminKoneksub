import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Cookies from 'universal-cookie'
import bootstrap from 'bootstrap/dist/js/bootstrap.min.js'

export default ({showLoading}) => {
  const [option, setOption] = useState('')
  const [description, setDescription] = useState('')
  const navigate = useNavigate()
  const cookies = new Cookies()
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const addReward = async (e) => {
    showLoading(true)
    e.preventDefault()
    if(option == '' || description == ''){
      alert('Please fill all the fields!')
      showLoading(false)
      return
    }
    try{
      const { data } = await axios({
        method: 'POST',
        url: 'http://localhost:5000/api/v1/rewards',
        data: {
          option: option,
          description: description
        },
        headers: {
          'Content-Type' : 'application/json',
          Authorization: `Bearer ${cookies.get('token')}`,
        },
      }).then((response) => {
        showLoading(false)
        navigate('/reward')
      }).catch((error) => {
        console.log(error)
        showLoading(false)
      })
    }catch (error){
      setError(error.response)
      setTimeout(() => {
        setError('')
      }, 1000)
    }
  }

  return(
    <div>
      <div className="container px-5 mb-4">
        <a href="/">Home</a> / <a href="/reward">Reward</a> / <span>Create Reward Option</span>
      </div>
      <div className="row justify-content-between align-items-center">
        <h1 className="col-5 px-5 mb-3">Create Reward Option</h1>
        <div className="col-md-12 px-5">
          <div className="card">
            <div className="card-header">Reward Option Creation Form</div>
            <div className="card-body">
              {message && <p className="alert alert-success">{message}</p>}
              {error && <p className="alert alert-danger">{error}</p>}
              <form onSubmit={addReward}>
                <div className="form-group">
                  <label htmlFor="option">Reward Option</label>
                  <input
                    type="text"
                    className="form-control"
                    id="option"
                    value={option}
                    onChange={(e) => setOption(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    rows="10"
                    className="form-control"
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div className="d-flex flex-row-reverse justify-content-between align-items-center">
                  <button type="submit" className="btn btn-primary">
                    Add Reward
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