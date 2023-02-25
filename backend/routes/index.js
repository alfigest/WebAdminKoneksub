import express from 'express'
import { getAllRewardOptions, getRewardOptionById, getSubRewardOptionById, getSubRewardOptionBySubId, createSubRewardOption, updateSubRewardOption, deleteSubRewardOption, createRewardOption, updateRewardOption, deleteRewardOption } from '../controllers/RewardOption.js'
import { getAllArticles, getArticleById, createArticle, editArticle, deleteArticle } from '../controllers/Article.js'
import { login, logout, getAllUsers, resetPassword, deleteUser } from '../controllers/User.js'
import { getAllPartners, getPartner, createPartner, updatePartner, deletePartner } from '../controllers/Partner.js'
import { getAllTrashDeposits, getTrashDepositById, createTrashDeposit, updateTrashDeposit, deleteTrashDeposit } from '../controllers/TrashDeposit.js' 
import { getAllRewardTransactions } from '../controllers/RewardTransaction.js'
const router = express.Router()
import multer from 'multer'
import dotenv from 'dotenv'
dotenv.config()
const upload = multer({ storage: multer.memoryStorage() })

router.get('/rewards', getAllRewardOptions)
router.get('/rewards/:id', getSubRewardOptionById)
router.get('/rewards/:id/:subid', getSubRewardOptionBySubId)
router.post('/rewards', createRewardOption)
router.patch('/rewards/:id', updateRewardOption)
router.post('/rewards/:id', createSubRewardOption)
router.patch('/rewards/:id/:subid', updateSubRewardOption)
router.delete('/rewards/:id', deleteRewardOption)
router.delete('/rewards/:id/:subid', deleteSubRewardOption)
router.get('/articles', getAllArticles)
router.get('/articles/:id', getArticleById)
router.post('/articles', upload.array("photos"), createArticle)
router.patch('/articles/:id', upload.array("photos"), editArticle)
router.delete('/articles/:id', deleteArticle)
router.get('/user', getAllUsers)
router.post('/login', login)
router.post('/logout', logout)
router.post('/user/reset', resetPassword)
router.delete('/user/:id', deleteUser)
router.get('/partners', getAllPartners)
router.get('/partners/:id', getPartner)
router.post('/partners', upload.single("image"), createPartner)
router.patch('/partners/:id', upload.single("image"), updatePartner)
router.delete('/partners/:id', deletePartner)
router.get('/trash_deposits', getAllTrashDeposits)
router.get('/trash_deposits/:id', getTrashDepositById)
router.post('/trash_deposits', createTrashDeposit)
router.patch('/trash_deposits/:id', updateTrashDeposit)
router.delete('/trash_deposits/:id', deleteTrashDeposit)
router.get('/reward_transactions', getAllRewardTransactions)

export default router

