import RewardTransaction from '../models/rewardTransactionModel.js'
import { db } from '../config/database.js'
const firestore = db.firestore()

export const createRewardTransaction = async (req, res, next) => {
    try {
        const data = req.body
        await firestore.collection('reward_transactions').doc().set(data)
        res.send('Record saved successfuly')
    } catch (error) {
        res.status(400).send(error.message)
    }
}

export const getAllRewardTransactions = async (req, res, next) => {
    try {
        const rewardTransactions = await firestore.collection('reward_transactions')
        const data = await rewardTransactions.get()
        if (data.empty) {
            res.status(404).send('No reward transaction record found')
        } else {
            const rewardTransactionsArray = []
            data.forEach(doc => {
              const data = doc.data()
              const rewardOptionPromise = new Promise((resolve, reject) => {
                firestore.collection('reward_options').doc(data.option_id).get().then(data => {
                  resolve(data)
                }).catch(err => {
                  reject(err)
                })
              })
              const subRewardOptionPromise = new Promise((resolve, reject) => {
                firestore.collection('reward_options').doc(data.option_id).collection('sub_options').doc(data.sub_option_id).get().then(data => {
                  resolve(data)
                }).catch(err => {
                  reject(err)
                })
              })
              const userPromise = new Promise((resolve, reject) => {
                firestore.collection('UserDetail').doc(data.user_id).get().then(data => {
                  resolve(data)
                }).catch(err => {
                  reject(data)
                })
              })
              Promise.all([rewardOptionPromise, subRewardOptionPromise, userPromise]).then(values => {
                const rewardOption = values[0].data()
                var reward = ' '
                if(rewardOption){
                  reward = rewardOption.option
                }
                const subRewardOption = values[1].data()
                var subReward = ' '
                if(subRewardOption){
                  subReward = subRewardOption.name + ' ' + subRewardOption.amount
                }
                const user = values[2].data()
                var username = ' '
                if(user){
                  username = user.username
                }
                const rewardTransaction = new RewardTransaction(
                    doc.id,
                    data.accept,
                    data.created_at,
                    reward,
                    data.points,
                    subReward,
                    username,
                )
                rewardTransactionsArray.push(rewardTransaction)
              })
            })
            res.send(rewardTransactionsArray)
        }
    } catch (error) {
        res.status(400).send(error.message)
    }
}

async function fetchData(doc, rewardTransactionsArray) {
    const data = doc.data()
    const rewardOption = await firestore.collection('reward_options').doc(data.option_id).get()
    const rewardOptionData = rewardOption.data()
    const rewardSubOption = await firestore.collection('reward_options').doc(data.option_id).collection('sub_options').doc(data.sub_option_id).get()
    const rewardSubOptionData = rewardSubOption.data()
    console.log(rewardSubOptionData)
    const user = await firestore.collection('UserDetail').doc(data.user_id).get()
    const userData = user.data()
    var subReward = ' '
    if(rewardSubOptionData){
      subReward = rewardSubOptionData.name + ' ' + rewardSubOptionData.amount
    }
    var reward = ' '
    if(rewardOptionData){
      reward = rewardOptionData.option
    }
    var username = ' '
    if(userData){
      username = userData.username
    }
    const rewardTransaction = new RewardTransaction(
        doc.id,
        data.accept,
        data.created_at,
        data.id,
        reward,
        data.points,
        subReward,
        username,
    )
    rewardTransactionsArray.push(rewardTransaction)
}




