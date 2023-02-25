import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import DataTable from 'react-data-table-component'
import axios from 'axios'
import Cookies from 'universal-cookie'
import ClipLoader from 'react-spinners/ClipLoader'

const deleteArticle = async (id, setIsLoading) => {
    setIsLoading(true)
    const cookies = new Cookies()
    const token = cookies.get('token')
    const config = {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }
    const response = await axios.delete(`http://localhost:5000/api/v1/articles/${id}`, config).then((res) => {
      setIsLoading(false)
      return res
    }).catch((err) => {
      setIsLoading(false)
      return err
    })
}

export default function ArticleList() {
  const navigate = useNavigate()
  const [columns , setColumns] = useState([
    {
      name: 'Title',
      selector: row => row.title,
      sortable: true,
    },
    {
      name: 'Author',
      selector: row => row.author,
      sortable: true,
    },
    {
      name: 'Created At',
      selector: row => row.created_at,
      sortable: true,
    },
    {
      name: 'Action',
      cell: (row) => <>
      <div className="text-nowrap">
        <button className="btn btn-warning me-3" onClick={() => navigate(`/article/edit/${row.id}`)}>Edit</button>
        <button className="btn btn-danger" onClick={() => deleteArticle(row.id, setIsLoading)}>Delete</button>
      </div>
      </>,
      ignoreRowClick: true,
      allowOverflow: false,
      button: true,
    },
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const cookies = new Cookies();
  const [data, setData] = useState([]);
  const [color, setColor] = useState('#ffffff');

  const getArticles = async () => {
    const response = await axios.get('http://localhost:5000/api/v1/articles/')
    setData(response.data.data)
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      getArticles()
      setTimeout(() => {
        setIsLoading(false)
      }, 1000)
    }, 2000);
  }, [data]);

  return (
    <div>
      <div className="row justify-content-between align-items-center">
        <h1 className="col-2">Articles</h1>
        <button className="col-2 btn btn-primary h4 mb-0" onClick={() => navigate('/article/create')}>Create Article</button>
      </div>  
      <DataTable columns={columns} data={data} progressPending={isLoading} />
    </div>
  )
}