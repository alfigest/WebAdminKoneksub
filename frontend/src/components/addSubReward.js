import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'

export default ({showLoading}) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [ amount, setAmount ] = useState()
  const [ name, setName ] = useState()
  const [ points, setPoints ] = useState()

  const saveSubRewardOption = async (e) => {
    e.preventDefault()
    showLoading(true)
    await axios.post(`http://wongdeveloper.uk/api/v1/rewards/${id}`, {
      amount: amount,
      name: name,
      points: points
    }).then((res) => {
      showLoading(false)
      navigate(`/reward/${id}`)
    }).catch((err) => {
      showLoading(false)
      console.log(err)
    })
  }

  return(
    <>
      <div className="container mb-4">
        <a href="/">Home</a> / <a href="/reward">Reward</a> / <a href={`/reward/${id}`}>Sub Reward</a> / <span> Create Sub Reward</span>
      </div>
      <h3>Add Sub Reward Option</h3>
      <form onSubmit={saveSubRewardOption}>
        <div className="form-group">
          <label htmlFor="amount">Amount</label>
          <input type="text" className="form-control" id="amount" placeholder="Amount" onChange={(e) => setAmount(e.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input type="text" className="form-control" id="name" placeholder="Name" onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="points">Points</label>
          <input type="number" className="form-control" id="points" placeholder="Points" onChange={(e) => setPoints(e.target.value)} />
        </div>
        <button type="submit" className="btn btn-primary">Save</button>
      </form>
    </>
  )
}
