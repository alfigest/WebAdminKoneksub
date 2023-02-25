import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RewardOptionList from './components/RewardOptionList.js';
import SubRewardOptionList from './components/SubRewardOptionList.js';
import AddRewardOption from './components/addReward.js';
import AddSubRewardOption from './components/addSubReward.js';
import EditSubRewardOption from './components/editSubReward.js';
import EditRewardOption from'./components/EditRewardOption.js';
import ArticleList from './components/ArticleList.js';
import AddArticle from './components/AddArticle.js';
import EditArticle from './components/EditArticle.js';
import UserList from './components/UserList.js';
import Home from './components/Home';
import Login from './components/Login.js';
import PartnerList from './components/PartnerList.js';
import AddPartner from './components/AddPartner.js';
import EditPartner from './components/EditPartner.js';
import TrashDepositList from './components/TrashDepositList.js';
import AddTrashDeposit from './components/AddTrashDeposit.js';
import EditTrashDeposit from './components/EditTrashDeposit.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import ProtectedRoutes from './ProtectedRoutes.js';
import './components/css/admin.css';
import './components/css/login.css';
import './components/css/opensans-font.css';
import './components/css/style.css';
import 'bootstrap'

function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route exact path="/login" element={<Login />} />
        <Route path="/" element={
          <ProtectedRoutes component={Home}/>
        } />
        <Route path="/article" element={
          <ProtectedRoutes component={ArticleList}/> 
        } />
        <Route path="/article/edit/:id" element={
          <ProtectedRoutes component={EditArticle}/>
        } />
        <Route path="/article/create" element={
          <ProtectedRoutes component={AddArticle}/>
        } />
        <Route path="/reward" element={
          <ProtectedRoutes component={RewardOptionList}/>
        } />
        <Route path="/reward/:id" element={
          <ProtectedRoutes component={SubRewardOptionList}/>
        } />
        <Route path="/reward/:id/create" element={
          <ProtectedRoutes component={AddSubRewardOption}/>
        } />
        <Route path="/reward/:id/edit/:subid" element={
          <ProtectedRoutes component={EditSubRewardOption}/>
        } />
        <Route path="reward/create" element={
          <ProtectedRoutes component={AddRewardOption} />
        } />
        <Route path="reward/edit/:id" element={
          <ProtectedRoutes component={EditRewardOption} />
        } />
        <Route path="/user" element={
          <ProtectedRoutes component={UserList}/>
        } />
        <Route path="/partner" element={
          <ProtectedRoutes component={PartnerList}/>
        } />
        <Route path="/partner/create" element={
          <ProtectedRoutes component={AddPartner}/>
        } />
        <Route path="/partner/edit/:id" element={
          <ProtectedRoutes component={EditPartner}/>
        } />
        <Route path="/trash_deposit" element={
          <ProtectedRoutes component={TrashDepositList}/>
        } />
        <Route path="/trash_deposit/create" element={
          <ProtectedRoutes component={AddTrashDeposit}/>
        } />
        <Route path="/trash_deposit/edit/:id" element={
          <ProtectedRoutes component={EditTrashDeposit}/>
        } />
      </Routes>
    </Router>
    <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossOrigin="anonymous"></script>
    <script src="vendor/jquery/jquery.min.js"></script>
    <script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
    <script src="vendor/jquery-easing/jquery.easing.min.js"></script>
    <script src="js/sb-admin-2.min.js"></script>
    <script src="vendor/chart.js/Chart.min.js"></script>
    <script src="js/demo/chart-area-demo.js"></script>
    <script src="js/demo/chart-pie-demo.js"></script>
    <script src="https://code.jquery.com/jquery-1.11.1.min.js"></script>
    <script src="https://cdn.jsdelivr.net/jquery.validation/1.16.0/jquery.validate.min.js"></script>
    <script src="https://cdn.jsdelivr.net/jquery.validation/1.16.0/additional-methods.min.js"></script>
    </>
  );
}

export default App;
