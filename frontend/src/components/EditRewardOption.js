import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EditRewardOption = ({showLoading}) => {
    const [option, setOption] = useState('');
    const [description, setDescription] = useState('');
    const navigate = useNavigate();
    const { id } = useParams();

    const UpdateRewardOption = async (e) => {
      showLoading(true)
      e.preventDefault();
      await axios.patch(`http://localhost:5000/api/v1/rewards/${id}`, {
        option : option,
        description : description
      });
      showLoading(false)
      navigate('/reward');
    }

    useEffect(() => {
      getRewardOptionById();
    } , []);

    const getRewardOptionById = async () => {
      showLoading(true)
      const res = await axios.get(`http://localhost:5000/api/v1/rewards/${id}`);
      setOption(res.data.option);
      setDescription(res.data.description);
      showLoading(false)
    }

    return (
        <div className="container">
            <h1>Edit Reward Option</h1>
            <form onSubmit={UpdateRewardOption}>
                <div className="form-group">
                    <label>Option</label>
                    <input type="text" className="form-control" value={option} onChange={(e) => setOption(e.target.value)} />

                </div>
                <div className="form-group">
                    <label>Description</label>
                    <textarea className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
                <div className="form-group">
                    <input type="submit" value="Update" className="btn btn-primary" />
                </div>
            </form>
        </div>
    )
}

export default EditRewardOption;