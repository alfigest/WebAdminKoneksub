import TrashDeposit from '../models/trashDepositModel.js'
import { db } from '../config/database.js'
const firestore = db.firestore()

export const getAllTrashDeposits = async (req, res, next) => {
  try{
    const trashDeposits = await firestore.collection('dataSetorSampah')
    const data = await trashDeposits.get()
    if(data.empty){
      return res.status(200).json({
        message: 'No trash deposit found',
        data: []
      })
    }else{
      const arr = []
      const arrUser = []
      data.forEach(async function(doc) {
        const trashDeposit = new TrashDeposit(doc.id, doc.data().day_stamp, doc.data().id_mitra, doc.data().id_upload, doc.data().jenis_sampah, doc.data().nama_mitra, doc.data().pointResult, doc.data().status, doc.data().sudahClaimPoint, doc.data().time_stamp, doc.data().uid_user)
        const idMitra = trashDeposit.idMitra
        const idUser = trashDeposit.uidUser 
        const idUpload = trashDeposit.idUpload 
        const username = new Promise((resolve, reject) => {
          firestore.collection("UserDetail").doc("mchaelwng@gmail.com").get().then(doc => {
            resolve(doc.data().username)
          })
        })
        arr.push(trashDeposit)
        arrUser.push(username)
      })
      return res.status(200).json({
        message: 'All trash deposits found',
        data: await Promise.all(arr),
        user: await Promise.all(arrUser)
      })
    }
  }catch(error){
    return res.status(500).json({
      message: 'Something went wrong',
      data: error.toString()
    })
  }
}

export const getTrashDepositById = async (req, res, next) => {
  try{
    const id = req.params.id 
    const trashDeposit = await firestore.collection('dataSetorSampah').doc(id)
    const data = await trashDeposit.get()
    if(!data.exists){
      return res.status(200).json({
        message: 'Trash deposit not found',
        data: {}
      })
    }
    return res.status(200).json({
      message: 'Trash deposit found',
      data: data.data()
    })
  }catch (error){
    return res.status(500).json({
      message: 'Something went wrong',
      data: error
    })
  }
}

export const createTrashDeposit = async (req, res, next) => {
  try{
    const trashDeposit = req.body
    await firestore.collection('dataSetorSampah').doc().set(trashDeposit, {merge: true})
    return res.status(200).json({
      message: 'Trash deposit created',
      data: trashDeposit
    })
  }catch (error){
    return res.status(500).json({
      message: 'Something went wrong',
      data: error
    })
  }
}

export const updateTrashDeposit = async (req, res, next) => {
  try{
    const id = req.params.id
    const trashDeposit = req.body
    await firestore.collection('dataSetorSampah').doc(id).update(trashDeposit, {merge: true})
    return res.status(200).json({
      message: 'Trash deposit updated',
      data: trashDeposit
    })
  }catch (error){
    return res.status(500).json({
      message: 'Something went wrong',
      data: error
    })
  }
}

export const deleteTrashDeposit = async (req, res, next) => {
  try{
    const id = req.params.id
    await firestore.collection('dataSetorSampah').doc(id).delete()
    return res.status(200).json({
      message: 'Trash deposit deleted',
      data: {}
    })
  }catch (error){
    return res.status(500).json({
      message: 'Something went wrong',
      data: error
    })
  }
}
