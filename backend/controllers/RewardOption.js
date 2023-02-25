import RewardOption from '../models/rewardOptionModel.js'
import { db } from '../config/database.js'
const firestore = db.firestore();

const getAllRewardOptions = async (req, res, next) => {
  try {
    const rewardOptions = await firestore.collection('reward_options');
    const data = await rewardOptions.get();
    const arr = [];
    if(data.empty) {
      return res.status(200).json({
        message: 'No reward options found',
        data: arr
      });
    }else{
      data.forEach(doc => {
        const rewards = new RewardOption(doc.id, doc.data().description, doc.data().option);
        arr.push(rewards);
      });
      return res.status(200).json({
        message: 'All reward options found',
        data: arr
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const getRewardOptionById = async (req, res) => {
  try {
    const id = req.params.id;
    const rewardOption = await firestore.collection('reward_options').doc(id);
    const data = await rewardOption.get();
    if(!data.exists) {
      return res.status(404).json({
        message: 'Reward option not found'
      });
    }else{
      res.status(200).json(data.data());
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const getSubRewardOptionById = async (req, res) => {
  try{
    const id = req.params.id;
    const rewardOption = await firestore.collection('reward_options').doc(id).get();
    const subRewardOption = await firestore.collection('reward_options').doc(id).collection('sub_options');
    const data = await subRewardOption.get();
    const arr = [];
    if(data.empty) {
      return res.status(200).json({
        message: 'No reward options found',
        data: arr,
        title: rewardOption.data().option,
        option: rewardOption.data().option,
        description: rewardOption.data().description
      });
    }else{
      data.forEach(doc => {
        arr.push({
          id: doc.id,
          ...doc.data()
        });
      });
      return res.status(200).json({
        message: 'All sub reward options found',
        data: arr,
        title: rewardOption.data().option,
        option: rewardOption.data().option,
        description: rewardOption.data().description
      });
    }
  }catch(error){
    res.status(500).json({ message: error.message });
  }
}

const getSubRewardOptionBySubId = async (req, res) => {
  try{
    const id = req.params.id;
    const subid = req.params.subid;
    const rewardOption = await firestore.collection('reward_options').doc(id).collection('sub_options').doc(subid);
    const data = await rewardOption.get();
    if(data.empty) {
      return res.status(404).json({
        message: 'Reward option not found'
      });
    }else{
      res.status(200).json(data.data());
    }
  }catch(error){
    res.status(500).json({ message: error.message });
  }
}

const createSubRewardOption = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const subRewardOption = await firestore.collection('reward_options').doc(id).collection('sub_options').doc();
    await subRewardOption.set({
      amount: data.amount,
      name: data.name,
      points: parseInt(data.points)
    });
    res.status(201).json({
      message: 'Sub reward option created successfully',
      id: subRewardOption.id
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const updateSubRewardOption = async (req, res) => {
  try {
    const id = req.params.id;
    const subid = req.params.subid;
    const data = req.body;
    const subRewardOption = await firestore.collection('reward_options').doc(id).collection('sub_options').doc(subid);
    await subRewardOption.update({
      amount: data.amount,
      name: data.name,
      points: parseInt(data.points)
    });
    res.status(200).json({
      message: 'Sub reward option updated successfully',
      id: subRewardOption.get 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const deleteSubRewardOption = async (req, res) => {
  try {
    const id = req.params.id;
    const subid = req.params.subid;
    const subRewardOption = await firestore.collection('reward_options').doc(id).collection('sub_options').doc(subid);
    const data = await subRewardOption.get();
    if(data.empty) {
      return res.status(404).json({
        message: 'No sub reward options found'
      });
    }else{
      await firestore.collection('reward_options').doc(id).collection('sub_options').doc(subid).delete();

      return res.status(200).json({
        message: 'Sub reward option deleted'
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const createRewardOption = async (req, res) => {
  try {
    const data = req.body;
    const optionRef = await firestore.collection('reward_options').doc()
    await optionRef.set({
      option: data.option,
      description: data.description
    }).then(async function () {
      await firestore.collection('reward_options').doc(optionRef.id).set({
        id: optionRef.id
      }, { merge: true });
    });
    res.status(200).json({ message: 'Reward option created' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const updateRewardOption = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const rewardOption = await firestore.collection('reward_options').doc(id);
    await rewardOption.update({
      id: id,
      option: data.option,
      description: data.description
    });
    res.status(204).json({ message: 'Reward option updated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const deleteRewardOption = async (req, res) => {
  try {
    const id = req.params.id;
    await firestore.collection('reward_options').doc(id).delete();
    res.status(204).json({ message: 'Reward option deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export {
  getAllRewardOptions,
  getRewardOptionById,
  getSubRewardOptionById,
  getSubRewardOptionBySubId,
  createSubRewardOption,
  updateSubRewardOption,
  deleteSubRewardOption,
  createRewardOption,
  updateRewardOption,
  deleteRewardOption
}

