import Partner from '../models/partnerModel.js'
import { db } from '../config/database.js'
import jwt from 'jsonwebtoken'
import axios from 'axios'
import admin from 'firebase-admin'
import { ref, deleteObject } from 'firebase/storage'

const firestore = db.firestore()
const storage = db.storage().bucket()

export const createPartner = async (req, res) => {
  try {
    const data = req.body
    const image = req.file
    const coord = JSON.parse(data.coord)
    const schedule = JSON.parse(data.schedule)
    const trashCategory = JSON.parse(data.trashCategory)
    const geoPoint = new admin.firestore.GeoPoint(
      coord.lat,
      coord.lng
    )
    const refPartner = await firestore.collection('mitra').doc()
    await refPartner.set({
      coord: geoPoint, 
      drop_point: data.address,
      email_mitra: data.partnerEmail,
      nama_mitra: data.partnerName,
      status: data.status,
      trash: trashCategory,
      whatsapp: data.phone,
      schedule: schedule,
    })
    // Store photos
    let status = true
    let message = ''
    const fileName = refPartner.id + '.png'
    const blob = storage.file(fileName)
    const blobStream = blob.createWriteStream({
      resumable: false
    })
    blobStream.on('error', function(err){
      status = false
      message = "Error occured while uploading image: " + err
    })
    blobStream.on('finish', async function(){
      const publicUrl = `https://storage.googleapis.com/${storage.name}/${blob.name}`
      try{
        let incrementId = 0
        await storage.file(fileName).makePublic()
        await firestore.collection('mitra').get().then(async function(querySnapshot) {
          incrementId = querySnapshot.size
          await firestore.collection('mitra').doc(refPartner.id).set({
            id: (querySnapshot.size).toString(),
            image: publicUrl,
            qrcode: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${incrementId}`
          }, {merge: true}).then(async function(){
            res.status(200).send({
              message: 'Partner created successfully',
              qrcode: incrementId,
              status: 200
            })
          }).catch(function(error){
            res.status(400).send({
              message: 'Failed to create partner: ' + error,
              status: 400
            })
          })
        })
      }catch(err){
        status = false
        message = "Error occured while uploading image: " + err
      }
    })
    blobStream.end(image.buffer)
    if(!status){
      res.status(500).json({
        message: message,
        status: 500
      })
      return
    }
  } catch (error) {
    res.status(500).send({
      message: error.message || 'Something went wrong while creating partner',
      status: 500
    })
  }
}

export const getAllPartners = async (req, res) => {
  try {
    const partners = await firestore.collection('mitra')
    const data = await partners.get()
    const partnersArray = []
    if (data.empty) {
      res.status(404).send({
        message: 'No partner found',
        status: 404
      })
    } else {
      data.forEach(doc => {
        const partner = new Partner(
          doc.id,
          doc.data().coord,
          doc.data().drop_point,
          doc.data().email_mitra,
          doc.data().id,
          doc.data().nama_mitra,
          doc.data().image,
          doc.data().qrcode,
          doc.data().status,
          doc.data().trash,
          doc.data().whatsapp,
          doc.data().schedule
        )
        partnersArray.push(partner)
      })
      res.status(200).send({
        message: 'Partners fetched successfully',
        status: 200,
        data: partnersArray
      })
    }
  } catch (error) {
    res.status(500).send({
      message: error.message || 'Something went wrong while fetching partners',
      status: 500
    })
  }
}

export const getPartner = async (req, res) => {
  try {
    const id = req.params.id
    const partner = await firestore.collection('mitra').doc(id)
    const data = await partner.get()
    if (!data.exists) {
      res.status(404).send({
        message: 'Partner not found',
        status: 404
      })
    } else {
      res.status(200).send({
        message: 'Partner fetched successfully',
        status: 200,
        data: data.data()
      })
    }
  } catch (error) {
    res.status(500).send({
      message: error.message || 'Something went wrong while fetching partner',
      status: 500
    })
  }
}

export const updatePartner = async (req, res) => {
  try {
    const id = req.params.id
    const data = req.body
    const image = req.file
    const coord = JSON.parse(data.coord)
    const schedule = JSON.parse(data.schedule)
    const trashCategory = JSON.parse(data.trashCategory)
    const geoPoint = new admin.firestore.GeoPoint(
      coord.lat,
      coord.lng
    )
    const refPartner = await firestore.collection('mitra').doc(id)
    await refPartner.set({
      coord: geoPoint, 
      drop_point: data.address,
      email_mitra: data.partnerEmail,
      nama_mitra: data.partnerName,
      status: data.status,
      trash: trashCategory,
      whatsapp: data.phone,
      schedule: schedule,
    }, {merge: true})

    // Store photos
    if(image){
      let status = true
      let message = ''
      const fileName = refPartner.id + '.png'
      const blob = storage.file(fileName)
      const blobStream = blob.createWriteStream({
        resumable: false
      })
      blobStream.on('error', function(err){
        status = false
        message = "Error occured while uploading image: " + err
      })
      blobStream.on('finish', async function(){
        const publicUrl = `https://storage.googleapis.com/${storage.name}/${blob.name}`
        try{
          await storage.file(fileName).makePublic()
          await firestore.collection('mitra').get().then((querySnapshot) => {
            const incrementId = querySnapshot.size
            res.status(200).send({
              message: 'Partner created successfully',
              qrcode: incrementId,
              status: 200
            })
          }).catch(function(error){
            res.status(400).send({
              message: 'Failed to create partner: ' + error,
              status: 400
            })
          })
        }catch(err){
          status = false
          message = "Error occured while uploading image: " + err
        }
      })
      blobStream.end(image.buffer)
      if(!status){
        res.status(500).json({
          message: message,
          status: 500
        })
        return
      }
    }else{
      res.status(200).send({
        message: 'Partner updated successfully',
        status: 200
      })
    }
  } catch (error) {
    res.status(500).send({
      message: error.message || 'Something went wrong while updating partner',
      status: 500
    })
  }
}

export const deletePartner = async (req, res) => {
  try {
    const id = req.params.id
    await firestore.collection('mitra').doc(id).delete()
    res.status(200).send({
      message: 'Partner deleted successfully',
      status: 200
    })
  } catch (error) {
    res.status(500).send({
      message: error.message || 'Something went wrong while deleting partner',
      status: 500
    })
  }
}

// Language: javascript
// Path: models/partnerModel.js  
