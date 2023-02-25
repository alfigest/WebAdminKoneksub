import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ClipLoader from 'react-spinners/ClipLoader'
import DataTable from 'react-data-table-component'
import Cookies from 'universal-cookie'
import axios from 'axios'
import bootstrap from 'bootstrap/dist/js/bootstrap.min.js'

export default ({showLoading}) => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState([])
  const [updateModal, setUpdateModal] = useState()
  const [status, setStatus] = useState('')
  const [pointResult, setPointResult] = useState('')
  const [trashData, setTrashData] = useState('')
  const [id, setId] = useState('')
  var modal;
  const [columns, setColumns] = useState([
    {
      name: 'ID',
      selector: row => row.id,
      sortable: true,
    },
    {
      name: 'Tanggal',
      selector: row => row.dayStamp,
      sortable: true,
    },
    {
      name: 'Waktu',
      selector: row => row.timeStamp,
      sortable: true,
    },
    {
      name: 'Mitra',
      selector: row => row.namaMitra,
      sortable: true,
    },
    {
      name: 'Status',
      selector: row => row.status,
      sortable: true,
    },
    {
      name: 'Point Reward',
      selector: row => row.pointResult,
      sortable: true,
    },
    {
      name: 'User',
      selector: row => row.user,
      sortable: true,
    },
    {
      name: 'Action',
      cell: (row) => <>
      <div className="text-nowrap">
        <div className="btn btn-warning me-3" onClick={() => modalTrashDeposit(row)}>Update</div>
        <div className="btn btn-danger" onClick={() => deleteTrashDeposit(row.id)}>Reject</div>
      </div>
      </>,
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    }
  ])

  useEffect(() => {
    if(!localStorage.getItem('token')) {
      navigate('/login')
    }
    getTrashDeposits()
  }, [])

  useEffect(() => {
    setUpdateModal(new bootstrap.Modal(document.getElementById("updateModal")))
  }, [])

  const modalTrashDeposit = (data) => {
    setStatus(data.status)
    setPointResult(data.pointResult)
    setTrashData(data.jenisSampah)
    setId(data.id)
    modal = new bootstrap.Modal(document.getElementById("updateModal"))
    modal.show()
  }

  const getTrashDeposits = async () => {
    showLoading(true)
    setIsLoading(true)
    const response = await axios.get('http://localhost:5000/api/v1/trash_deposits')
    var dataArr = []
    response.data.data.forEach((item, index) => {
      dataArr.push({...item, user: response.data.user[index] })
    })
    setData(dataArr)
    setIsLoading(false)
    showLoading(false)
  }

  const deleteTrashDeposit = async (id) => {
    const response = await axios.delete(`http://localhost:5000/api/v1/trash_deposits/${id}`)
    getTrashDeposits()
  }

  const updateTrashDeposit = async (id) => {
    const response = await axios.patch(`http://localhost:5000/api/v1/trash_deposits/${id}`, {
      status: status,
      pointResult: pointResult,
      jenis_sampah: trashData 
    })
    getTrashDeposits()
  }

  return (
    <div>
      <div className="modal fade" id="updateModal" tabIndex="-1" aria-labelledby="updateModalLabel">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="updateModalLabel">Update Status</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="status" className="form-label">Status</label>
                <select className="form-select" id="status" value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="disetor">Disetor</option>
                  <option value="diangkut">Diangkut</option>
                  <option value="dipilah">Dipilah</option>
                  <option value="ditimbang">Ditimbang</option>
                  <option value="sukses">Selesai</option>
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="pointResult" className="form-label">Point Reward</label>
                <input type="number" className="form-control" id="pointResult" value={pointResult} onChange={(e) => setPointResult(e.target.value)} />
              </div>
              <div className="mb-3">
                <label htmlFor="note" className="form-label">Jenis Sampah</label>
                <textarea className="form-control" id="note" rows="3" placeholder="Plastik: 0.5 kg, Organik: 0.5 kg" onChange={(e) => setTrashData(e.target.value)} value={trashData}></textarea>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary" data-bs-dismiss="modal" aria-label="Close" onClick={(e) => updateTrashDeposit(id)}>Save changes</button>
            </div>
          </div>
        </div>
      </div>
      <div className="container mb-4">
        <a href="/">Home</a> / <a>Trash Deposit</a>
      </div>
      <div>
        <div className="row justify-content-between align-items-center">
          <h1 className="col-3">Trash Deposit</h1>
        </div>  
        <DataTable columns={columns} data={data} progressPending={isLoading} />
      </div>
    </div>
  );
}