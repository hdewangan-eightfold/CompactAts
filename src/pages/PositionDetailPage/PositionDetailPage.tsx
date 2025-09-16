import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Position, Application } from '../../types';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchPositionById, clearCurrentPosition } from '../../store/slices/positionsSlice';
import { fetchApplicationsByPosition, updateApplicationStatus, clearError as clearApplicationsError } from '../../store/slices/applicationsSlice';
import styles from './PositionDetailPage.module.scss';

type TabType = 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'hired';

const PositionDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const { currentPosition: position, loading: positionLoading, error: positionError } = useAppSelector((state) => state.positions);
    const { applicationsByPosition, loading: applicationsLoading, error: applicationsError } = useAppSelector((state) => state.applications);

    const [activeTab, setActiveTab] = useState<TabType>('pending');
    const [sortBy, setSortBy] = useState<'applicationDate' | 'candidateName'>('applicationDate');

    const loading = positionLoading || applicationsLoading;
    const error = positionError || applicationsError;
    const applications = id ? (applicationsByPosition[id] || []) : [];

    useEffect(() => {
        if (id) {
            dispatch(fetchPositionById(id));
            dispatch(fetchApplicationsByPosition(id));
        }

        return () => {
            dispatch(clearCurrentPosition());
        };
    }, [id, dispatch]);

    const formatDate = (dateString: string): string => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
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

    const getApplicationStatusColor = (status: Application['status']): string => {
        switch (status) {
            case 'pending': return styles.statusPending;
            case 'reviewed': return styles.statusReviewed;
            case 'shortlisted': return styles.statusShortlisted;
            case 'rejected': return styles.statusRejected;
            case 'hired': return styles.statusHired;
            default: return '';
        }
    };

    const canApply = (): boolean => {
        return position?.status === 'active';
    };

    const handleStatusUpdate = async (applicationId: string, newStatus: Application['status']) => {
        try {
            dispatch(clearApplicationsError());
            await dispatch(updateApplicationStatus({ id: applicationId, status: newStatus }));
        } catch (err) {
            console.error('Error updating application status:', err);
        }
    };

    const filteredAndSortedApplications = applications
        .filter(app => app.status === activeTab)
        .sort((a, b) => {
            switch (sortBy) {
                case 'candidateName':
                    return a.candidateName.localeCompare(b.candidateName);
                case 'applicationDate':
                default:
                    return new Date(b.applicationDate).getTime() - new Date(a.applicationDate).getTime();
            }
        });

    const statusCounts = {
        pending: applications.filter(app => app.status === 'pending').length,
        reviewed: applications.filter(app => app.status === 'reviewed').length,
        shortlisted: applications.filter(app => app.status === 'shortlisted').length,
        rejected: applications.filter(app => app.status === 'rejected').length,
        hired: applications.filter(app => app.status === 'hired').length,
    };

    if (loading && !position) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>Loading position details...</div>
            </div>
        );
    }

    if (error && !loading) {
        return (
            <div className={styles.container}>
                <div className={styles.error}>
                    <h2>Position Not Found</h2>
                    <p>{error}</p>
                    <button onClick={() => navigate('/positions')} className={styles.backButton}>
                        Back to Positions
                    </button>
                </div>
            </div>
        );
    }

    if (!position) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>Loading position details...</div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.navigation}>
                <Link to="/positions" className={styles.backLink}>
                    ← Back to Positions
                </Link>
            </div>

            <div className={styles.positionHeader}>
                <div className={styles.headerContent}>
                    <h1>{position.title}</h1>
                    <span className={`${styles.status} ${getStatusColor(position.status)}`}>
                        {position.status}
                    </span>
                </div>

                <div className={styles.companyInfo}>
                    <h2>{position.company}</h2>
                    <div className={styles.locationAndType}>
                        <span>{position.location}</span>
                        <span className={styles.separator}>•</span>
                        <span>{position.type.replace('-', ' ')}</span>
                        <span className={styles.separator}>•</span>
                        <span>{position.department}</span>
                    </div>
                </div>
            </div>

            <div className={styles.content}>
                <div className={styles.mainContent}>
                    <section className={styles.section}>
                        <h3>Job Description</h3>
                        <div className={styles.description}>
                            {position.description.split('\n').map((paragraph, index) => (
                                <p key={index}>{paragraph}</p>
                            ))}
                        </div>
                    </section>

                    <section className={styles.section}>
                        <h3>Requirements</h3>
                        <ul className={styles.requirements}>
                            {position.requirements.map((requirement, index) => (
                                <li key={index}>{requirement}</li>
                            ))}
                        </ul>
                    </section>
                </div>

                <div className={styles.sidebar}>
                    <div className={styles.applicationCard}>
                        <h3>Application Information</h3>

                        <div className={styles.dates}>
                            <div className={styles.dateItem}>
                                <strong>Posted:</strong>
                                <span>{formatDate(position.postedDate)}</span>
                            </div>
                        </div>

                        <div className={styles.actions}>
                            {canApply() ? (
                                <>
                                    <Link to={`/apply/${position.id}`} className={styles.applyButton}>
                                        Apply for This Position
                                    </Link>
                                    <p className={styles.applyHint}>
                                        Submit your application today!
                                    </p>
                                </>
                            ) : (
                                <div className={styles.applicationClosed}>
                                    <p>
                                        {position.status === 'closed'
                                            ? 'This position is no longer accepting applications.'
                                            : 'Applications are currently not being accepted.'}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Candidates Section */}
            <div className={styles.candidatesSection}>
                <div className={styles.candidatesHeader}>
                    <h2>Applications ({applications.length})</h2>
                    <div className={styles.candidatesControls}>
                        <div className={styles.sorting}>
                            <label>Sort by:</label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as 'applicationDate' | 'candidateName')}
                            >
                                <option value="applicationDate">Application Date</option>
                                <option value="candidateName">Name</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className={styles.candidatesTabs}>
                    {(['pending', 'reviewed', 'shortlisted', 'rejected', 'hired'] as TabType[]).map((tab) => (
                        <button
                            key={tab}
                            className={`${styles.tabButton} ${activeTab === tab ? styles.active : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)} ({statusCounts[tab]})
                        </button>
                    ))}
                </div>

                {loading && applicationsLoading && (
                    <div className={styles.loadingApplications}>Loading applications...</div>
                )}

                {applicationsError && (
                    <div className={styles.errorBanner}>
                        <p>{applicationsError}</p>
                        <button onClick={() => dispatch(clearApplicationsError())}>×</button>
                    </div>
                )}

                <div className={styles.candidatesList}>
                    {filteredAndSortedApplications.length === 0 && !applicationsLoading ? (
                        <div className={styles.noResults}>
                            <p>No applications found for this filter.</p>
                            {activeTab !== 'pending' && (
                                <button onClick={() => setActiveTab('pending')}>Show Pending Applications</button>
                            )}
                        </div>
                    ) : (
                        filteredAndSortedApplications.map((application) => (
                            <div key={application.id} className={styles.candidateCard}>
                                <div className={styles.candidateHeader}>
                                    <div className={styles.candidateInfo}>
                                        <h4>{application.candidateName}</h4>
                                        <div className={styles.contactInfo}>
                                            <span>{application.email}</span>
                                            <span>{application.phone}</span>
                                        </div>
                                    </div>
                                    <div className={styles.statusSection}>
                                        <span className={`${styles.applicationStatus} ${getApplicationStatusColor(application.status)}`}>
                                            {application.status}
                                        </span>
                                        <select
                                            value={application.status}
                                            onChange={(e) => handleStatusUpdate(application.id, e.target.value as Application['status'])}
                                            className={styles.statusSelect}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="reviewed">Reviewed</option>
                                            <option value="shortlisted">Shortlisted</option>
                                            <option value="rejected">Rejected</option>
                                            <option value="hired">Hired</option>
                                        </select>
                                    </div>
                                </div>

                                <div className={styles.candidateContent}>
                                    <div className={styles.experienceAndSkills}>
                                        <div className={styles.experience}>
                                            <strong>Experience:</strong> {application.experience} years
                                        </div>
                                        <div className={styles.skills}>
                                            <strong>Skills:</strong>
                                            <div className={styles.skillTags}>
                                                {application.skills.map((skill, index) => (
                                                    <span key={index} className={styles.skillTag}>{skill}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className={styles.applicationDetails}>
                                        <div className={styles.applicationDate}>
                                            <strong>Applied:</strong> {formatDate(application.applicationDate)}
                                        </div>

                                        {application.resume && (
                                            <div className={styles.resume}>
                                                <strong>Resume/CV:</strong>
                                                <div className={styles.resumeContent}>
                                                    {application.resume.length > 200
                                                        ? `${application.resume.substring(0, 200)}...`
                                                        : application.resume}
                                                </div>
                                            </div>
                                        )}

                                        <div className={styles.coverLetter}>
                                            <strong>Cover Letter:</strong>
                                            <div className={styles.coverLetterContent}>
                                                {application.coverLetter.length > 300
                                                    ? `${application.coverLetter.substring(0, 300)}...`
                                                    : application.coverLetter}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {filteredAndSortedApplications.length > 0 && (
                    <div className={styles.summary}>
                        <p>Showing {filteredAndSortedApplications.length} of {applications.length} applications</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PositionDetailPage;