import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'

export default ({showLoading}) => {
  const { id, subid } = useParams()
  const navigate = useNavigate()
  const [ amount, setAmount ] = useState()
  const [ name, setName ] = useState()  
  const [ points, setPoints ] = useState()

  const getSubRewardOption = async () => {
    showLoading(true)
    await axios.get(`http://localhost:5000/api/v1/rewards/${id}/${subid}`).then((res) => {
      showLoading(false)
      setAmount(res.data.amount)
      setName(res.data.name)
      setPoints(res.data.points)
    }).catch((err) => {
      showLoading(false)
      console.log(err)
    })
  }

  const saveSubRewardOption = async (e) => {
    e.preventDefault()
    showLoading(true)
    await axios.patch(`http://localhost:5000/api/v1/rewards/${id}/${subid}`, {
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

  useEffect(() => {
    getSubRewardOption()
  }, [])

  return(
    <>
      <h3>Edit Sub Reward Option</h3>
      <form onSubmit={saveSubRewardOption}>
        <div className="form-group">
          <label htmlFor="amount">Amount</label>
          <input type="text" className="form-control" id="amount" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input type="text" className="form-control" id="name" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="points">Points</label>
          <input type="number" className="form-control" id="points" placeholder="Points" value={points} onChange={(e) => setPoints(e.target.value)} />
        </div>
        <button type="submit" className="btn btn-primary">Save</button>
      </form>
    </>
  )
}