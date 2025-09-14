import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import Navigation from './components/Navigation/Navigation';
import PositionsPage from './pages/PositionsPage/PositionsPage';
import PositionDetailPage from './pages/PositionDetailPage/PositionDetailPage';
import ApplyPage from './pages/ApplyPage/ApplyPage';
import { initializeDatabase } from './services/dbInit';
import './App.scss';

function App() {
    const [isDbInitialized, setIsDbInitialized] = useState(false);

    useEffect(() => {
        const initDB = async () => {
            try {
                await initializeDatabase();
                setIsDbInitialized(true);
            } catch (error) {
                console.error('Failed to initialize database:', error);
                setIsDbInitialized(true); // Still show app even if DB init fails
            }
        };

        initDB();
    }, []);

    if (!isDbInitialized) {
        return (
            <div className="App">
                <div className="loading-container">
                    <h2>Initializing Application...</h2>
                    <p>Setting up database and loading initial data.</p>
                </div>
            </div>
        );
    }

    return (
        <Provider store={store}>
            <Router>
                <div className="App">
                    <Navigation />
                    <main className="main-content">
                        <Routes>
                            <Route path="/" element={<PositionsPage />} />
                            <Route path="/positions" element={<PositionsPage />} />
                            <Route path="/position/:id" element={<PositionDetailPage />} />
                            <Route path="/apply/:id" element={<ApplyPage />} />
                        </Routes>
                    </main>
                </div>
            </Router>
        </Provider>
    );
}

export default App;
