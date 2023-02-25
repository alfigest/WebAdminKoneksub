import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Croppie from 'croppie'
import 'croppie/croppie.css'
import bootstrap from 'bootstrap/dist/js/bootstrap.min.js'
import CancelIcon from '@mui/icons-material/Cancel'
import Cookie from 'universal-cookie'
import ClipLoader from 'react-spinners/ClipLoader'

export default ({showLoading}) => {
  const [photos, setPhotos] = useState([])
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [content, setContent] = useState('')
  const [croppie, setCroppie] = useState(null)
  const [cropModal, setCropModal] = useState(null)
  const navigate = useNavigate()
  const { id } = useParams()
  const [existingPhotos, setExistingPhotos] = useState([])

  const getArticle = async () => {
    showLoading(true)
    const { data } = await axios.get(`http://localhost:5000/api/v1/articles/${id}`)
    setTitle(data.data.title)
    setAuthor(data.data.author)
    setContent(data.data.body)
    /*data.data.photos.forEach(photo => {
      let getFileBlob = async (photo, cb) => {
        let xhr = new XMLHttpRequest()
        xhr.open("GET", photo)
        xhr.crossOrigin = "Anonymous"
        xhr.responseType = "blob"
        xhr.addEventListener('load', () => {
          cb(xhr.response)
        })
        xhr.send()
      }
      getFileBlob(photo, (blob) => {
        setPhotos([...photos, blob])
      })
    })*/
    setPhotos(data.data.photos)
    setExistingPhotos(data.data.photos)
    showLoading(false)
  }

  useEffect(() => {
    getArticle()
  }, [])

  const updatePhotos = (e) => {
    const el = document.getElementById("image-helper")
    if(el){
      const croppieInstance = new Croppie(el, {
        enableExif: true,
        enforceBoundary: false,
        viewport: { height: 250, width: 250 },
        boundary: { height: 280, width: 400 },
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
    formData.append('existing_photos', existingPhotos)
    photos.forEach((photo) => {
      formData.append('photos', photo)
    })
    axios({
      method: 'patch',
      url: `http://localhost:5000/api/v1/articles/${id}`,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then((res) => {
      showLoading(false)
      navigate('/article')
    }).catch((err) => {
      console.log(err)
      showLoading(false)
    })
  }

  const deletePhotos = (index) => {
    const tempPhotos = photos
    let oldPhotos = photos[index]
    tempPhotos.splice(index, 1)
    setExistingPhotos(existingPhotos.filter((photo, i) => photo !== oldPhotos))
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
        <a href="/">Home</a> / <a href="/article">Article</a> / <span>Edit Article</span>
      </div>
      <div className="row justify-content-between align-items-center">
        <h1 className="col-4 px-5 mb-3">Edit Article</h1>
        <div className="col-12">
          <form className="form-group p-5" encType="multipart/form-data">
            <div className="mb-5 row justify-content-center align-items-start">
              <div className="col-1">
                <label htmlFor="title" className="form-label fs-5">Title</label>
              </div>
              <div className="col-11">
                <input type="text" className="form-control" id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
            </div>
            <div className="mb-5 row justify-content-center align-items-start">
              <div className="col-1">
                <label htmlFor="author" className="form-label fs-5">Author</label>
              </div>
              <div className="col-11">
                <input type="text" className="form-control" id="author" value={author} onChange={(e) => setAuthor(e.target.value)}/>
              </div>
            </div>
            <div className="mb-5 row justify-content-center align-items-start">
              <div className="col-1">
                <label htmlFor="content" className="form-label fs-5">Content</label>
              </div>
              <div className="col-11">
                <textarea className="form-control" id="content" rows="20" onChange={(e) => setContent(e.target.value)} value={content}>{content}</textarea>
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
                    let previewImage;
                    try{
                      previewImage = URL.createObjectURL(item)
                    }catch(err){
                      previewImage = item
                    }
                    return (
                      <div key={previewImage} className="position-relative col-2 mx-2"><button type="button" className="position-absolute btn p-0" style={{top: "0px", right: "15px"}} onClick={() => deletePhotos(i)}><CancelIcon /></button><img src={previewImage} alt="photos" style={{width: "100%", height: "auto"}} /></div>
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