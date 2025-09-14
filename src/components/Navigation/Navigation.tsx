import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../store/hooks';
import { fetchPositions, clearCurrentPosition, clearError as clearPositionsError } from '../../store/slices/positionsSlice';
import { fetchAllApplications, clearError as clearApplicationsError } from '../../store/slices/applicationsSlice';
import { fetchAllCandidates, clearError as clearCandidatesError } from '../../store/slices/candidatesSlice';
import { resetDatabase } from '../../services/dbInit';
import styles from './Navigation.module.scss';

const Navigation: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [showResetConfirm, setShowResetConfirm] = useState(false);
    const [isResetting, setIsResetting] = useState(false);

    const isActive = (path: string): boolean => {
        return location.pathname === path ||
            (path === '/positions' && location.pathname === '/');
    };

    const handleResetData = async () => {
        try {
            setIsResetting(true);

            // Reset database
            await resetDatabase();

            // Clear Redux state and refresh data
            dispatch(clearCurrentPosition());
            dispatch(clearPositionsError());
            dispatch(clearApplicationsError());
            dispatch(clearCandidatesError());

            // Refetch data to populate Redux store with fresh data
            await dispatch(fetchPositions());
            await dispatch(fetchAllApplications());
            await dispatch(fetchAllCandidates());

            // Navigate to positions page
            navigate('/positions');

            setShowResetConfirm(false);

            // Show success message
            alert('Browser data has been reset successfully!');

        } catch (error) {
            console.error('Error resetting data:', error);
            alert('Failed to reset data. Please try again.');
        } finally {
            setIsResetting(false);
        }
    };

    return (
        <>
            <nav className={styles.navigation}>
                <div className={styles.container}>
                    <div className={styles.brand}>
                        <Link to="/">
                            <h1>RecruitmentApp</h1>
                        </Link>
                    </div>
                    <div className={styles.menu}>
                        <Link
                            to="/positions"
                            className={`${styles.menuItem} ${isActive('/positions') ? styles.active : ''}`}
                        >
                            Positions
                        </Link>
                        <button
                            onClick={() => setShowResetConfirm(true)}
                            className={styles.resetButton}
                            disabled={isResetting}
                        >
                            {isResetting ? 'Resetting...' : 'Reset Data'}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Reset Confirmation Modal */}
            {showResetConfirm && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <div className={styles.modalHeader}>
                            <h3>Reset Browser Data</h3>
                        </div>
                        <div className={styles.modalContent}>
                            <p>
                                This will permanently delete all positions, applications, and candidates data
                                from your browser and reload with fresh sample data.
                            </p>
                            <p><strong>This action cannot be undone.</strong></p>
                        </div>
                        <div className={styles.modalActions}>
                            <button
                                onClick={() => setShowResetConfirm(false)}
                                className={styles.cancelButton}
                                disabled={isResetting}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleResetData}
                                className={styles.confirmButton}
                                disabled={isResetting}
                            >
                                {isResetting ? 'Resetting...' : 'Reset Data'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Navigation;
