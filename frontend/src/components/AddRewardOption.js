import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const AddRewardOption = () => {
  const [ option, setOption ] = useState('');
  const [ description, setDescription ] = useState('');
  const navigate = useNavigate();

  const saveRewardOption = async (e) => {
    e.preventDefault();
    await axios.post('http://wongdeveloper.uk/rewards', {
      option: option,
      description: description
    });
    navigate('/');
  }

  return (
    <div>
      <h3>Add Reward Option</h3>
      <form onSubmit={saveRewardOption}>
        <div className="form-group">
          <label>Option</label>
          <input type="text" className="form-control" value={option} onChange={(e) => setOption(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea className="form-control" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
        </div>
        <button type="submit" className="btn btn-primary">Save</button>
      </form>
    </div>
  )
}

export default AddRewardOption;
