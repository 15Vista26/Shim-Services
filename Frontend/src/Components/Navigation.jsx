import React, { useState } from 'react';

const Navigation = () => {
    const [isNavOpen, setIsNavOpen] = useState(false);

    const toggleNav = () => {
        setIsNavOpen(!isNavOpen);
    };

    return (
        <div className='bg-black flex items-center h-18 sticky top-0 z-10 px-3 text-lg text-white'>
            <div className='h-15'>
                <img src="shimlogo.jpg" alt="Logo" className='h-full' />
            </div>
            <div className="ml-auto flex items-center gap-7">
                {/* Show navigation toggle button only on mobile */}
                <div className='block lg:hidden text-3xl cursor-pointer' onClick={toggleNav}>
                    {isNavOpen ? (
                        <span>&times;</span>
                    ) : (
                        <span>&#9776;</span>
                    )}
                </div>
                {/* Show navigation links */}
                <ul className='hidden lg:flex gap-5 list-none'>
                    <li>Home</li>
                    <li>About Us</li>
                    <li>Services</li>
                </ul>
                <div className='hidden lg:block'>
                    <button className='bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700'>Contact Us</button>
                </div>
            </div>

            {/* Conditionally render navigation links based on toggle state */}
            {isNavOpen && (
                <div className="lg:hidden absolute top-18 left-0 w-full bg-gray-900 py-3 px-5 flex flex-col gap-4">
                    <ul className='list-none'>
                        <li>Home</li>
                        <li>About Us</li>
                        <li>Services</li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Navigation;
