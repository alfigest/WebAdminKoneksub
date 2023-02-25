import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Croppie from 'croppie'
import 'croppie/croppie.css'
import bootstrap from 'bootstrap/dist/js/bootstrap.min.js'
import CancelIcon from '@mui/icons-material/Cancel'
import EXIF from 'exif-js'
import Cookies from 'universal-cookie'
import ClipLoader from 'react-spinners/ClipLoader'
import { useNavigate } from 'react-router-dom'

export default function AddArticle({showLoading}) {
  const [photos, setPhotos] = useState([])
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [content, setContent] = useState('')
  const [croppie, setCroppie] = useState(null)
  const [cropModal, setCropModal] = useState(null)
  const navigate = useNavigate()

  const updatePhotos = (e) => { 
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
        croppieInstance.bind({
          url: URL.createObjectURL(new Blob(e.target.files, {type: "image/jpg"})),
        })
      })
      setCroppie(croppieInstance)
    }
  } 

  const handleCrop = (e) => {
    croppie.result({
      type: 'blob',
      size: 'viewport',
    }).then((blob) => {
      setPhotos([...photos, blob])
      cropModal.hide() 
    })
    croppie.destroy()
  }

  const handleSubmit = (e) => {
    showLoading(true)
    e.preventDefault()
    // Checking inputs
    if(photos.length === 0 || title === '' || author === '' || content === ''){
      alert("Please fill all the fields")
      showLoading(false)
      return
    }

    const formData = new FormData()
    formData.append('title', title)
    formData.append('author', author)
    formData.append('content', content)
    photos.forEach((photo) => {
      formData.append('photos', photo)
    })
    axios({
      method: 'post',
      url: 'localhost:5000/api/v1/articles',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then((res) => {
      console.log(res)
      showLoading(false)
      navigate('/article')
    }).catch((err) => {
      console.log(err)
      showLoading(false)
    })
  }

  const deletePhotos = (index) => {
    const tempPhotos = photos
    tempPhotos.splice(index, 1)
    setPhotos([...tempPhotos])
  }

  useEffect(() => {
    setCropModal(new bootstrap.Modal(document.getElementById("cropModal")))
  }, [])

   return (
     <div>
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
        <a href="/">Home</a> / <a href="/article">Article</a> / <span>Create Article</span>
      </div>
      <div className="row justify-content-between align-items-center">
        <h1 className="col-4 px-5 mb-3">Create Article</h1>
        <div className="col-12">
          <form className="form-group p-5" encType="multipart/form-data">
            <div className="mb-5 row justify-content-center align-items-start">
              <div className="col-1">
                <label htmlFor="title" className="form-label fs-5">Title</label>
              </div>
              <div className="col-11">
                <input type="text" className="form-control" id="title" onChange={(e) => setTitle(e.target.value)} />
              </div>
            </div>
            <div className="mb-5 row justify-content-center align-items-start">
              <div className="col-1">
                <label htmlFor="author" className="form-label fs-5">Author</label>
              </div>
              <div className="col-11">
                <input type="text" className="form-control" id="author" onChange={(e) => setAuthor(e.target.value)}/>
              </div>
            </div>
            <div className="mb-5 row justify-content-center align-items-start">
              <div className="col-1">
                <label htmlFor="content" className="form-label fs-5">Content</label>
              </div>
              <div className="col-11">
                <textarea className="form-control" id="content" rows="20" onChange={(e) => setContent(e.target.value)}></textarea>
              </div>
            </div>
            <div className="mb-5 row justify-content-center align-items-start">
              <div className="col-1">
                <label htmlFor="content" className="form-label fs-5">Photos</label>
              </div>
              <div className="col-11">
                <input type="file" className="form-control" id="photos" onChange={(e) => updatePhotos(e)}/>
              </div>
            </div>
            <div className="mb-5 row justify-content-center align-items-start">
              <div className="col-1">
              </div>
              <div className="col-11 row justify-content-start align-items-center" id="photosDiv">
                  {photos.map((item, i) => {
                    let previewImage = URL.createObjectURL(item)
                    return (
                      <div className="position-relative col-2 mx-2"><button type="button" className="position-absolute btn p-0" style={{top: "0px", right: "15px"}} onClick={() => deletePhotos(i)}><CancelIcon /></button><img src={previewImage} alt="photos" style={{width: "100%", height: "auto"}} /></div>
                    )
                  })}
              </div>
            </div>
            <div className="row justify-content-end align-items-center">
              <div className="col-11">
                <button type="submit" className="btn btn-primary d-block w-100" onClick={(e) => handleSubmit(e)}>Submit</button>
              </div>
            </div>
          </form>
        </div>
      </div>
     </div>
   )    
}