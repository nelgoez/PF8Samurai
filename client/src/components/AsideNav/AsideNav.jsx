import React from 'react';

import { NavLink } from 'react-router-dom';

//Icons
import HomeIcon from '@material-ui/icons/Home';
import FaceIcon from '@material-ui/icons/Face';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import NoteIcon from '@material-ui/icons/Note';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import PhoneAndroidIcon from '@material-ui/icons/PhoneAndroid';
import AssignmentIcon from '@material-ui/icons/Assignment';
import PaymentIcon from '@material-ui/icons/Payment';
import ForumIcon from '@material-ui/icons/Forum';

//Styles
import styles from './AsideNav.module.css';

export default function AsideNav() {
  const userData = JSON.parse(localStorage.getItem('userdata'));
  return (
    <div className={styles.cont}>
      <aside className={styles.aside}>
        <ul className={styles.buttonsContainer}>
          <NavLink
            to={`/affiliate/${userData.dni}`}
            className={styles.link}
          >
            <HomeIcon />
            <li>Inicio</li>
          </NavLink>
          <NavLink
            to={`/${userData.dni}/affiliate/familymembers`}
            className={styles.link}
            activeClassName={styles.activeLink}
          >
            <FaceIcon />
            <li>Mi cuenta</li>
          </NavLink>
          <NavLink
            to={`/${userData.dni}/affiliate/mymedicalrecords`}
            className={styles.link}
            activeClassName={styles.activeLink}
          >
            <FavoriteBorderIcon />
            <li>Mi carpeta medica</li>
          </NavLink>
          <article>
            <NoteIcon />
            <li>Mi plan</li>
          </article>
          <article>
            <DoneAllIcon />
            <li>Mis autorizaciones</li>
          </article>
          <article>
            <PhoneAndroidIcon />
            <li>Mi credencial</li>
          </article>
          <NavLink
            to={`/${userData.dni}/affiliate/doctor`}
            className={styles.link}
            activeClassName={styles.activeLink}
          >
            <AssignmentIcon />
            <li>Cartilla medica</li>
          </NavLink>
          <article>
            <PaymentIcon />
            <li>Pago online</li>
          </article>
          <article>
            <ForumIcon />
            <li>Contactanos</li>
          </article>
        </ul>
      </aside>
    </div>
  )
}
