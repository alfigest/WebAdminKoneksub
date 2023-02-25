import User from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import { db } from '../config/database.js'
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
const firestore = db.firestore()
let token = null

// Create and Save a new userModel
const create = async (req, res) => {
    // Validate request
    if(!req.body) {
        return res.status(400).send({
            message: "Input can not be empty"
        });
    }

    // Create a userModel
    const user = new User({
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        type: req.body.type,
        username: req.body.username,
    });

    // Save userModel in the database
    firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
    .then(async function(data) {
        await firestore.collection('users').doc(data.user.email).set(user);
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the user."
        });
    });
}

// Login a user
const login = async (req, res) => {
    const email = req.body.email
    const password = req.body.password
    signInWithEmailAndPassword(getAuth(), email, password)
    .then(async data => {
        const userData = await firestore.collection('UserDetail').doc(email)
        const datauser = await userData.get();
        if(!datauser.exists) {
          return res.status(404).json({
            message: 'Some error occurred while logging in the user: data not found',
            status: 404
          });
        }else{
          let type = datauser.data().type
          if(type=="administrator"){
              token = jwt.sign({
                userId: data.user.uid,
                userEmail: data.user.email
              },
              "RANDOM-TOKEN",
              { expiresIn: "24h" });
              res.status(200).send({
                message: "Login Successful",
                email: data.user.email,
                token: token,
                status: 200
              });
          }else{
            res.status(401).send({
              message: "Some error occurred while logging in the user: user is not an administrator",
              status: 401
            });
          }
        }
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while logging in the user.",
            status: 500
        });
    });
}

// Logout a user
const logout = async (req, res) => {
    const auth = getAuth();
    localStorage.
    signOut(auth).then(() => {  
        res.status(200).send({  
            message: "Logout Successful",
        });
    });
}

// Retrieve all users from the database.
const getAllUsers = async (req, res) => {
    const users = await firestore.collection('UserDetail');
    const data = await users.get();
    const usersArray = [];
    if(data.empty) {
        res.status(404).send('No user record found');
    }
    else{
        data.forEach(doc => {
            usersArray.push({
                email: doc.data().email,
                phoneNumber: doc.data().phone_number,
                type: doc.data().type,
                username: doc.data().username,
            });
        });
        res.status(200).json({
            message: "All users retrieved successfully",
            users: usersArray,
            status: 200
        });
    }
}

const resetPassword = async (req, res) => {
    const email = req.body.email 
    const auth = db.auth()
    // Check password and confirm password
    if(req.body.password != req.body.confirmPassword){
        res.status(400).send({
            message: "Password and confirm password do not match",
            status: 400
        });
    }
    else{
      await auth.getUserByEmail(email)
      .then(function(userRecord) {
        // See the UserRecord reference doc for the contents of userRecord.
          auth.updateUser(userRecord.uid, {
              password: req.body.password 
          })
          .then(function(userRecord) {
              res.status(200).send({
                  message: "Password reset successfully",
                  status: 200
              });
          })
          .catch(function(error) {
              res.status(500).send({
                  message: error.message || "Some error occurred while resetting the password.",
                  status: 500
              });
          });
      })
      .catch(function(error) {
          res.status(500).send({
              message: error.message || "Some error occurred while resetting the password.",
              status: 500
          });
      });
    }
}

const deleteUser = async (req, res) => {
    const email = req.params.id
    const user = await firestore.collection('UserDetail').doc(email);
    const data = await user.get();
    if(!data.exists) {
        res.status(404).send('No user record found');
    }
    else{
        await firestore.collection('UserDetail').doc(email).delete();
        db.auth().getUserByEmail(email).then(function(userRecord) {
          db.auth().deleteUser(userRecord.uid)
          .then(function() {
              res.status(200).send({
                  message: "User deleted successfully",
                  status: 200
              });
          })
          .catch(function(error) {
              res.status(500).send({
                  message: error.message || "Some error occurred while deleting the user.",
                  status: 500
              });
          })
        })
    }
}

export { login, create, logout, getAllUsers, resetPassword, deleteUser }
