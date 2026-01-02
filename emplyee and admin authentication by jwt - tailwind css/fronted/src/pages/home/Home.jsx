import React from 'react'
import Navbar from '../../components/Navbar'

const Home = () => {
    return (
        <div>
            <div className="text-center mt-20">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to Our App</h1>
                <p className="text-gray-600 text-lg">
                    Use the navigation bar to access Admin or Employee dashboards.
                </p>
            </div>
        </div>
    )
}

export default Home