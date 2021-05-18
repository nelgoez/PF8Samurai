import React, { useState, useEffect } from 'react';
import supabase from '../../supabase.config.js';
//Styles
import styles from './UserHome.module.css';
import UserNav from '../UserNav/UserNav.jsx';
import AsideNav from '../AsideNav/AsideNav.jsx';
import Footer from '../Footer/Footer.jsx';
import HomeLinks from '../HomeLinks/HomeLinks';

function UserHome() {
    const affiliateData = JSON.parse(localStorage.getItem('affiliatedata'));
    return (
        <div className={styles.userhomepage}>
            <UserNav />
            <div className={styles.usercontent}>
                <AsideNav />
                <h1>Hola {affiliateData.name}</h1>
                <HomeLinks/>
            </div>
            <Footer />
        </div>
    );
}

export default UserHome;
