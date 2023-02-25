import Article from '../models/articleModel.js'
import { db } from '../config/database.js'
import jwt from 'jsonwebtoken'
import { getStorage, ref, uploadBytes } from "firebase/storage"
import saltedMd5 from 'salted-md5'
import { format } from 'util'
const firestore = db.firestore()
const storage = db.storage().bucket()

export const getAllArticles = async (req, res) => {
  try{
    await firestore.collection('artikel').get().then((data) => {
      const articles = []
      data.forEach((doc) => {
        const images = []
//        doc.data().images.forEach((image) => {
//          images.push(image)
//        });
        articles.push({
          id: doc.id,
          title: doc.data().judul,
          body: doc.data().konten,
          author: doc.data().penulis,
          images: images,
          created_at: doc.data().waktu_artikel.toDate().toLocaleString(),
          updated_at: doc.data().waktu_edit_artikel.toDate().toLocaleString()
        });
      });
      res.status(200).json({
        status: 200,
        message: 'Success',
        data: articles
      });
    });
  }catch(err){
    res.status(500).json({
      message: "Error Occured while getting all articles: " + err,
      status: 500
    })
  }
}

export const getArticleById = async (req, res) => {
  try{
    const id = req.params.id 
    const article = await firestore.collection('artikel').doc(id).get()
    const imagesRef = await firestore.collection('artikel').doc(id).collection('images').get()
    const photos = await imagesRef.docs.map((doc) => doc.data().path)
    res.status(200).json({
      status: 200,
      message: 'Success',
      data: {
        id: article.id,
        title: article.data().judul,
        body: article.data().konten,
        author: article.data().penulis,
        photos: photos,
        created_at: article.data().waktu_artikel,
        updated_at: article.data().waktu_edit_artikel
      }
    });
  }catch(err){
    res.status(500).json({
      message: "Error Occured while getting article by id: " + err,
      status: 500
    })
  }
}

export const createArticle = async (req, res) => {
  try{
    const { title, content, author } = req.body
    const photos = req.files
    //const { authorization } = req.headers
    //const token = authorization.split(' ')[1]
    //const decoded = jwt.verify(token, process.env.JWT_SECRET)
    //const { userId } = decoded
    const now = new Date()
    const uuid = Math.random().toString(16).slice(2)
    const article = new Article(uuid, title, author, content, photos, now, now)
    const articleRef = await firestore.collection('artikel').doc(uuid)
    await articleRef
      .set({
        id_artikel: uuid,
        judul: req.body.title,
        penulis: article.author,
        konten: article.body,
        waktu_artikel: article.created_at,
        waktu_edit_artikel: article.updated_at,
      })
      .then(async function(){
        const firestoreImages = await firestore.collection('artikel').doc(uuid).collection('images')
        let status = true
        let message = ''
        let imageHeader = true
        photos.forEach(async (photo) => {
          const uuidImage = Math.random().toString(16).slice(2)
          const name = saltedMd5(photo.originalname, uuidImage)
          const fileName = name + '.png'
          const blob = storage.file(fileName)
          const blobStream = blob.createWriteStream({
            resumable: false
          })
          blobStream.on('error', (err) => {
            status = false
            message = "Error Occured while uploading image: " + err
          })
          blobStream.on('finish', async function() {
            const publicUrl = format(`https://storage.googleapis.com/${storage.name}/${blob.name}`)
            if(imageHeader){
              await articleRef.update({
                image_link: publicUrl
              })
              imageHeader = false
            }
            try{
              await storage.file(fileName).makePublic()
              await firestoreImages.doc(uuidImage).set({
                path: publicUrl,
              }).then(() => {
                status = true
                message = 'Article created successfully'
              })
            }catch(err){
              status = false
              message = "Error occured while uploading image: " + err
            }
          })
          blobStream.end(photo.buffer)
          if(!status){
            res.status(500).json({
              message: message,
              status: 500
            })
            return
          }
        })
      })
      .catch((err) => {
        res.status(400).json({
          message: `Error occured while creating article: ${err.message}`,
          status: 400
        })
      })
    res.status(200).json({
      message: 'Article created successfully',
      status: 200
    })
  }catch(err) {
    res.status(500).json({
      message: `Something went wrong: ${err.message}`,
      status: 500
    })
  }
}

export const editArticle = async(req, res) => {
  try{
    const { title, content, author, existing_photos, photos } = req.body
    const photos_file = req.files
    const uuid = req.params.id
    //const { authorization } = req.headers
    //const token = authorization.split(' ')[1]
    //const decoded = jwt.verify(token, process.env.JWT_SECRET)
    //const { userId } = decoded
    const now = new Date()
    const article = new Article(uuid, title, author, content, photos_file, now, now)
    const articleRef = await firestore.collection('artikel').doc(uuid)
    await articleRef
      .set({
        id_artikel: uuid,
        judul: req.body.title,
        penulis: article.author,
        konten: article.body,
        waktu_edit_artikel: article.updated_at,
      }, { merge: true })
      .then(async function(){
        const firestoreImages = await firestore.collection('artikel').doc(uuid).collection('images')
        await firestoreImages.get().then(async (querySnapshot) => {
          querySnapshot.forEach(async (doc) => {
            await firestoreImages.doc(doc.id).delete()
          })
        })
        let status = true
        let message = ''
        let imageHeader = true
        photos_file.forEach(async (photo) => {
          const uuidImage = Math.random().toString(16).slice(2)
          const name = saltedMd5(photo.originalname, uuidImage)
          if(photo instanceof Object){
            const fileName = name + '.png'
            const blob = storage.file(fileName)
            const blobStream = blob.createWriteStream({
              resumable: false
            })
            blobStream.on('error', (err) => {
              status = false
              message = "Error Occured while uploading image: " + err
            })
            blobStream.on('finish', async function() {
              const publicUrl = format(`https://storage.googleapis.com/${storage.name}/${blob.name}`)
              if(imageHeader){
                await articleRef.update({
                  image_link: publicUrl
                })
                imageHeader = false
              }
              try{
                await storage.file(fileName).makePublic()
                await firestoreImages.doc(uuidImage).set({
                  path: publicUrl,
                }).then(() => {
                  status = true
                  message = 'Article created successfully'
                })
              }catch(err){
                status = false
                message = "Error occured while uploading image: " + err
              }
            })
            blobStream.end(photo.buffer)
            if(!status){
              res.status(500).json({
                message: message,
                status: 500
              })
              return
            }
          }else{
            if(imageHeader){
              await articleRef.update({
                image_link: photo
              })
              imageHeader = false
            }
            await firestoreImages.doc(uuidImage).set({
              path: photo,
            }).then(() => {
              status = true
              message = 'Article created successfully'
            })
          }
        })
        if(photos){
          photos.forEach(async (photo) => {
            await firestoreImages.doc().set({
              path: photo,
            }).then(() => {
              status = true
              message = 'Article created successfully'
            })
          })
        }
      })
      .catch((err) => {
        res.status(400).json({
          message: `Error occured while creating article: ${err.message}`,
          status: 400
        })
        return
      })
    res.status(200).json({
      message: 'Article created successfully',
      status: 200
    })
  }catch(err) {
    res.status(500).json({
      message: `Something went wrong: ${err.message}`,
      status: 500
    })
    return
  }
}

export const deleteArticle = async (req, res) => {
  try{
    const id = req.params.id
    await firestore.collection('artikel').doc(id).collection('images').listDocuments().then((docs) => {
      docs.forEach((doc) => {
        doc.delete()
      })
    }).catch((err) => {
      res.status(500).json({
        message: "Error occured while deleting article: " + err,
        status: 500
      })
    }).then(async () => {
        await firestore
          .collection('artikel')
          .doc(id)
          .delete()
          .then(() => {
            res.status(200).json({
              message: "Article successfully deleted",
              status: 200
            })
          })
          .catch((error) => {
            res.status(400).json({
              message: `Error occured while deleting article: ${err.message}`,
              status: 400
            })
          })
    })
  }catch(err) {
    res.status(500).json({
      message: `Something went wrong: ${err.message}`,
      status: 500
    })
  }
}


