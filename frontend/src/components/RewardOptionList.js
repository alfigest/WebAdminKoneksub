import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import DataTable from 'react-data-table-component'
import Cookies from 'universal-cookie'
import ClipLoader from 'react-spinners/ClipLoader'

export default ({ showLoading }) => {
  const [ reward, setReward ] = useState()
  const [subRewardOptions, setSubRewardOptions] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const cookies = new Cookies()
  const token = cookies.get('token')
  const { id } = useParams()

  const columns = [
    {
      name: 'Name',
      selector: row => row.name,
      sortable: true,
    },
    {
      name: 'Amount',
      selector: row => row.amount,
      sortable: true,
    },
    {
      name: 'Points',
      selector: row => row.points,
      sortable: true,
    },
    {
      name: 'Action',
      cell: (row) => <>
        <div className="text-nowrap">
          <button className="btn btn-warning me-3" onClick={() => navigate(`/reward/${id}/edit/${row.id}`)}>Edit</button>
          <button className="btn btn-danger" onClick={() => deleteSubRewardOption(row.id, setLoading)}>Delete</button>
        </div>
      </>,
      ignoreRowClick: true,
      allowOverflow: false,
      button: true,
    }
  ]

  const deleteSubRewardOption = async (subid, setLoading) => {
    showLoading(true)
    setLoading(true)
    await axios.delete(`http://localhost:5000/api/v1/rewards/${id}/${subid}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((res) => {
      setLoading(false)
      return res 
    }).catch((err) => {
      setLoading(false) 
      return
    })
    getSubRewardOptions()
    showLoading(false)
  }

  const getSubRewardOptions = () => {
    axios
      .get('http://localhost:5000/api/v1/rewards/' + id, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setSubRewardOptions(response.data.data)
        setReward(response.data.title)
        setLoading(false)
        showLoading(false)
      })
      .catch((error) => {
        setLoading(false)
        showLoading(false)
      })
  }

  useEffect(() => {
    showLoading(true)
    getSubRewardOptions()
  }, [])

  return (
    <>
    <div className="container mb-4">
      <a href="/">Home</a> / <a href="/reward">Reward</a> / <span>Sub Reward</span>
    </div>
    <div>
      <div className="row justify-content-between align-items-center">
        <h1 className="col-6">Sub Reward for {reward}</h1>
        <button className="col-2 btn btn-primary h4 mb-0" onClick={() => navigate(`/reward/${id}/create`)}>Add Sub Reward</button>
      </div>  
      <DataTable
        columns={columns}
        data={subRewardOptions}
        highlightOnHover
        pointerOnHover
      />
    </div>
    </>
  )
}