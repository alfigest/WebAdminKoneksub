import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import DataTable from 'react-data-table-component'
import axios from 'axios'
import Cookies from 'universal-cookie'
import ClipLoader from 'react-spinners/ClipLoader'

const deletePartner = async (id, setIsLoading) => {
  setIsLoading(true)
  const cookies = new Cookies()
  const token = cookies.get('token')
  const config = {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }
  const response = await axios.delete(`http://localhost:5000/api/v1/partners/${id}`, config).then((res) => {
    setIsLoading(false)
    return res
  }).catch((err) => {
    setIsLoading(false)
    return err
  })
}

export default function PartnerList({showLoading}){
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState([])
  const [columns, setColumns] = useState([
    {
      name: 'Partner Name',
      selector: row => row.partnerName,
      sortable: true,
    },
    {
      name: 'Address',
      selector: row => row.address,
      sortable: true,
    },
    {
      name: 'Phone',
      selector: row => row.phone,
      sortable: true,
    },
    {
      name: 'Email',
      selector: row => row.partnerEmail,
      sortable: true,
    },
   // {
   //   name: 'Trash Category',
   //   selector: row => row.trashCategory,
   //   sortable: true,
   // },
    {
      name: 'Status',
      selector: row => row.status,
      sortable: true,
    },
    {
      name: 'QR Image',
      cell: (row) => <img src={row.qrcode} alt="qr" style={{width: '100px'}}/>,
      ignoreRowClick: true,
    },
    {
      name: 'Action',
      cell: (row) => <>
      <div className="text-nowrap">
        <button className="btn btn-warning me-3" onClick={() => navigate(`/partner/edit/${row.firebaseId}`)}>Edit</button>
        <button className="btn btn-danger" onClick={() => deletePartner(row.id, setIsLoading)}>Delete</button>
      </div>
      </>,
      ignoreRowClick: true,
      allowOverflow: false,
      button: true,
    },
  ])

  const getAllPartners = async () => {
    const cookies = new Cookies()
    const token = cookies.get('token')
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
    const response = await axios.get('http://localhost:5000/api/v1/partners', config).then((res) => {
      return res
    }).catch((err) => {
      return err
    })
    setData(response.data.data)
    setIsLoading(false)
  }

  useEffect(() => {
    getAllPartners()
  }, [])

  const cookies = new Cookies()
  const navigate = useNavigate()
  return (<div>
      <div className="row justify-content-between align-items-center">
        <h1 className="col-2">Mitra</h1>
        <button className="col-2 btn btn-primary h4 mb-0" onClick={() => navigate('/partner/create')}>Daftarkan Mitra</button>
      </div>  
      <DataTable columns={columns} data={data} progressPending={isLoading} />
    </div>)
}