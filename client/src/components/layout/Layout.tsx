import React from 'react';
import Header from '../common/Header';
import Footer from '../common/Footer';
import { Outlet } from 'react-router-dom';


const Layout: React.FC = () => {
    return (
        <>
            <div className='w-full'>

                <Header />
                <main className="container mx-auto p-4">
                    <Outlet />
                </main>
                <Footer />
            </div>
        </>
    );
};

export default Layout;
