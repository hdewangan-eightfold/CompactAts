import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Position } from '../../types';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchPositions, searchPositions, setSearchQuery, clearError } from '../../store/slices/positionsSlice';
import styles from './PositionsPage.module.scss';

const PositionsPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const { positions, loading, error, searchQuery } = useAppSelector((state) => state.positions);
    const [localSearchQuery, setLocalSearchQuery] = useState('');

    useEffect(() => {
        if (positions.length === 0) {
            dispatch(fetchPositions());
        }
    }, [dispatch, positions.length]);

    useEffect(() => {
        setLocalSearchQuery(searchQuery);
    }, [searchQuery]);

    const loadPositions = () => {
        dispatch(fetchPositions());
    };

    const handleSearch = () => {
        if (!localSearchQuery.trim()) {
            dispatch(fetchPositions());
            dispatch(setSearchQuery(''));
            return;
        }

        dispatch(searchPositions(localSearchQuery));
        dispatch(setSearchQuery(localSearchQuery));
    };

    const formatDate = (dateString: string): string => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getStatusColor = (status: Position['status']): string => {
        switch (status) {
            case 'active': return styles.statusActive;
            case 'closed': return styles.statusClosed;
            case 'draft': return styles.statusDraft;
            default: return '';
        }
    };

    if (loading && positions.length === 0) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>Loading positions...</div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Open Positions</h1>
                <div className={styles.searchSection}>
                    <div className={styles.searchBar}>
                        <input
                            type="text"
                            placeholder="Search positions..."
                            value={localSearchQuery}
                            onChange={(e) => setLocalSearchQuery(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            className={styles.searchInput}
                        />
                        <button onClick={handleSearch} className={styles.searchButton}>
                            Search
                        </button>
                        {searchQuery && (
                            <button
                                onClick={() => {
                                    setLocalSearchQuery('');
                                    dispatch(setSearchQuery(''));
                                    loadPositions();
                                }}
                                className={styles.clearButton}
                            >
                                Clear
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {error && (
                <div className={styles.error}>
                    <p>{error}</p>
                    <button onClick={() => {
                        dispatch(clearError());
                        loadPositions();
                    }} className={styles.retryButton}>
                        Retry
                    </button>
                </div>
            )}

            {loading && (
                <div className={styles.loadingOverlay}>Searching...</div>
            )}

            <div className={styles.positionsGrid}>
                {positions.length === 0 && !loading ? (
                    <div className={styles.noResults}>
                        <p>No positions found.</p>
                        {searchQuery && (
                            <p>Try adjusting your search terms or <button onClick={() => {
                                setLocalSearchQuery('');
                                dispatch(setSearchQuery(''));
                                loadPositions();
                            }}>view all positions</button>.</p>
                        )}
                    </div>
                ) : (
                    positions.map((position) => (
                        <div key={position.id} className={styles.positionCard}>
                            <div className={styles.cardHeader}>
                                <h3>
                                    <Link to={`/position/${position.id}`} className={styles.positionTitle}>
                                        {position.title}
                                    </Link>
                                </h3>
                                <span className={`${styles.status} ${getStatusColor(position.status)}`}>
                                    {position.status}
                                </span>
                            </div>

                            <div className={styles.cardContent}>
                                <p className={styles.company}>{position.company}</p>
                                <p className={styles.location}>{position.location}</p>
                                <p className={styles.type}>{position.type.replace('-', ' ')}</p>
                                <p className={styles.department}>Department: {position.department}</p>

                                <div className={styles.description}>
                                    {position.description.length > 150
                                        ? `${position.description.substring(0, 150)}...`
                                        : position.description}
                                </div>
                            </div>

                            <div className={styles.cardFooter}>
                                <div className={styles.dates}>
                                    <span>Posted: {formatDate(position.postedDate)}</span>
                                </div>
                                <div className={styles.actions}>
                                    <Link to={`/position/${position.id}`} className={styles.viewButton}>
                                        View Details
                                    </Link>
                                    <Link to={`/apply/${position.id}`} className={styles.applyButton}>
                                        Apply Now
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default PositionsPage;
