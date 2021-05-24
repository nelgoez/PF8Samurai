import React from 'react';
import { Route } from 'react-router-dom';
import { useFirebaseApp } from 'reactfire';
import RenderPDF from '../Affiliate/UserMedRec/RenderPDF.jsx';
import UserNav from '../Affiliate/UserNav/UserNav.jsx';
import AffiliateOrdersAndPrescriptions from '../Affiliate/AffiliateOrdersAndPrescriptions/AffiliateOrdersAndPrescriptions';

function RoutesAffiliate() {
    const firebase = useFirebaseApp();
    return (
        <>
            <Route
                path='/:id/affiliate'
                render={() => <UserNav firebase={firebase} />}
            />
            <Route
                exact
                path='/:id/mymedicalrecords/pdf'
                render={() => <RenderPDF firebase={firebase} />}
            />
            {/* -------------Ordenes y Recetas--------------------------- */}
            <Route
                exact
                path='/:id/affiliate/ordersandpresc'
                render={() => (
                    <AffiliateOrdersAndPrescriptions firebase={firebase} />
                )}
            />
        </>
    );
}

export default RoutesAffiliate;
