

import React from 'react';
import {  ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#f8fafc] overflow-hidden">
            {/* --- Hero Section --- */}
            <div className="relative pt-20 pb-16 md:pt-12 md:pb-24">
                {/* Background Decor (Glow Effect) */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 overflow-hidden">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-200/50 blur-[120px] rounded-full"></div>
                    <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-blue-200/50 blur-[120px] rounded-full"></div>
                </div>

                <div className="max-w-5xl mx-auto px-6 text-center">
                    <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 px-4 py-1.5 rounded-full text-indigo-600 text-sm font-bold mb-6 animate-fade-in">
                      
                        <span >Workforce Management Simplified</span>
                    </div>
                    
                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight mb-6">
                        Empower Your <span className="text-yellow-800">Workflow</span> <br /> 
                        with Company Portal
                    </h1>
                    
                    <p className="max-w-2xl mx-auto text-slate-500 text-lg md:text-xl leading-relaxed mb-10">
                        A seamless bridge between Admin control and Employee productivity. 
                        Manage tasks, attendance, and communication in one unified dashboard.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                        <button 
                            onClick={() => navigate('/login')}
                            className="group flex items-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-200 transition-all active:scale-95"
                        >
                            Get Started Now
                            <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button className="px-8 py-4 rounded-2xl font-bold text-lg text-slate-600 hover:bg-white border border-transparent hover:border-slate-200 transition-all">
                            Learn More
                        </button>
                    </div>
                </div>
            </div>

           
            </div>

           
        
    );
};

export default Home;
