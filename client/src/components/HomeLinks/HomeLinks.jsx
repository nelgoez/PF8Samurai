import React, { useEffect }  from 'react';
import { useLocation } from 'react-router-dom';
import UserProfile from '../UserProfile/UserProfile';

export default function HomeLinks() {
  const location = useLocation();
	useEffect(() => {
    console.log(location.pathname)

	}, [location]);

  let isprofile = location.pathname.includes('profile');
  console.log(isprofile)

  return (
    <div>
      		{	isprofile && <UserProfile/>}
    </div>
  )
}
