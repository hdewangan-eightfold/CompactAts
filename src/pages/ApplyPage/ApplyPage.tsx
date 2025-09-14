import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Application } from '../../types';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchPositionById, clearCurrentPosition } from '../../store/slices/positionsSlice';
import { createApplication, clearError as clearApplicationsError } from '../../store/slices/applicationsSlice';
import styles from './ApplyPage.module.scss';

interface FormData {
    candidateName: string;
    email: string;
    phone: string;
    resume: string;
    coverLetter: string;
    experience: string;
    skills: string[];
}

interface FormErrors {
    candidateName?: string;
    email?: string;
    phone?: string;
    resume?: string;
    coverLetter?: string;
    experience?: string;
    skills?: string;
}

const ApplyPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const { currentPosition: position, loading: positionLoading, error: positionError } = useAppSelector((state) => state.positions);
    const { submitting, error: applicationError } = useAppSelector((state) => state.applications);

    const [success, setSuccess] = useState(false);
    const loading = positionLoading;
    const error = positionError || applicationError;

    const [formData, setFormData] = useState<FormData>({
        candidateName: '',
        email: '',
        phone: '',
        resume: '',
        coverLetter: '',
        experience: '',
        skills: []
    });

    const [skillInput, setSkillInput] = useState('');
    const [formErrors, setFormErrors] = useState<FormErrors>({});

    useEffect(() => {
        if (id) {
            dispatch(fetchPositionById(id));
        }

        return () => {
            dispatch(clearCurrentPosition());
        };
    }, [id, dispatch]);

    useEffect(() => {
        if (position && position.status !== 'active') {
            // Position is not accepting applications
        }
    }, [position]);

    const validateForm = (): boolean => {
        const errors: FormErrors = {};

        if (!formData.candidateName.trim()) {
            errors.candidateName = 'Full name is required';
        }

        if (!formData.email.trim()) {
            errors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.email = 'Please enter a valid email address';
        }

        if (!formData.phone.trim()) {
            errors.phone = 'Phone number is required';
        }

        if (!formData.resume.trim()) {
            errors.resume = 'Resume/CV information is required';
        }

        if (!formData.coverLetter.trim()) {
            errors.coverLetter = 'Cover letter is required';
        }

        if (!formData.experience || isNaN(Number(formData.experience)) || Number(formData.experience) < 0) {
            errors.experience = 'Please enter a valid number of years of experience';
        }

        if (formData.skills.length === 0) {
            errors.skills = 'Please add at least one skill';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleInputChange = (field: keyof FormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (formErrors[field as keyof FormErrors]) {
            setFormErrors(prev => ({ ...prev, [field as keyof FormErrors]: undefined }));
        }
    };

    const addSkill = () => {
        const skill = skillInput.trim();
        if (skill && !formData.skills.includes(skill)) {
            setFormData(prev => ({
                ...prev,
                skills: [...prev.skills, skill]
            }));
            setSkillInput('');
            if (formErrors.skills) {
                setFormErrors(prev => ({ ...prev, skills: undefined }));
            }
        }
    };

    const removeSkill = (skillToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            skills: prev.skills.filter(skill => skill !== skillToRemove)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm() || !position) return;

        const applicationData: Omit<Application, 'id' | 'applicationDate' | 'status'> = {
            positionId: position.id,
            candidateName: formData.candidateName,
            email: formData.email,
            phone: formData.phone,
            resume: formData.resume,
            coverLetter: formData.coverLetter,
            experience: parseInt(formData.experience),
            skills: formData.skills
        };

        try {
            dispatch(clearApplicationsError());
            const result = await dispatch(createApplication(applicationData));

            if (createApplication.fulfilled.match(result)) {
                setSuccess(true);

                // Redirect after a delay to show success message
                setTimeout(() => {
                    navigate(`/position/${position.id}`);
                }, 3000);
            }
        } catch (err: any) {
            console.error('Error submitting application:', err);
        }
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
                    <h2>Cannot Apply</h2>
                    <p>{error}</p>
                    <Link to="/positions" className={styles.backButton}>
                        Back to Positions
                    </Link>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className={styles.container}>
                <div className={styles.success}>
                    <h2>Application Submitted Successfully!</h2>
                    <p>Thank you for applying to <strong>{position?.title || 'this position'}</strong> at <strong>{position?.company || 'the company'}</strong>.</p>
                    <p>We have received your application and will be in touch soon.</p>
                    <p>You will be redirected to the position details page in a moment...</p>
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
                <Link to={`/position/${position.id}`} className={styles.backLink}>
                    ← Back to Position Details
                </Link>
            </div>

            <div className={styles.header}>
                <h1>Apply for Position</h1>
                <div className={styles.positionInfo}>
                    <h2>{position.title}</h2>
                    <p>{position.company} • {position.location}</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className={styles.applicationForm}>
                <div className={styles.formGroup}>
                    <label htmlFor="candidateName">Full Name *</label>
                    <input
                        type="text"
                        id="candidateName"
                        value={formData.candidateName}
                        onChange={(e) => handleInputChange('candidateName', e.target.value)}
                        className={formErrors.candidateName ? styles.errorInput : ''}
                    />
                    {formErrors.candidateName && (
                        <span className={styles.errorMessage}>{formErrors.candidateName}</span>
                    )}
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="email">Email Address *</label>
                    <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={formErrors.email ? styles.errorInput : ''}
                    />
                    {formErrors.email && (
                        <span className={styles.errorMessage}>{formErrors.email}</span>
                    )}
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="phone">Phone Number *</label>
                    <input
                        type="tel"
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className={formErrors.phone ? styles.errorInput : ''}
                    />
                    {formErrors.phone && (
                        <span className={styles.errorMessage}>{formErrors.phone}</span>
                    )}
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="resume">Resume/CV *</label>
                    <textarea
                        id="resume"
                        rows={4}
                        placeholder="Please provide a brief summary of your experience, or paste a link to your online resume/LinkedIn profile"
                        value={formData.resume}
                        onChange={(e) => handleInputChange('resume', e.target.value)}
                        className={formErrors.resume ? styles.errorInput : ''}
                    />
                    {formErrors.resume && (
                        <span className={styles.errorMessage}>{formErrors.resume}</span>
                    )}
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="experience">Years of Experience *</label>
                    <input
                        type="number"
                        id="experience"
                        min="0"
                        value={formData.experience}
                        onChange={(e) => handleInputChange('experience', e.target.value)}
                        className={formErrors.experience ? styles.errorInput : ''}
                    />
                    {formErrors.experience && (
                        <span className={styles.errorMessage}>{formErrors.experience}</span>
                    )}
                </div>

                <div className={styles.formGroup}>
                    <label>Skills *</label>
                    <div className={styles.skillsInput}>
                        <input
                            type="text"
                            placeholder="Enter a skill and press Add"
                            value={skillInput}
                            onChange={(e) => setSkillInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                        />
                        <button type="button" onClick={addSkill}>Add</button>
                    </div>

                    {formData.skills.length > 0 && (
                        <div className={styles.skillsTags}>
                            {formData.skills.map((skill, index) => (
                                <span key={index} className={styles.skillTag}>
                                    {skill}
                                    <button
                                        type="button"
                                        onClick={() => removeSkill(skill)}
                                        className={styles.removeSkill}
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}

                    {formErrors.skills && (
                        <span className={styles.errorMessage}>{formErrors.skills}</span>
                    )}
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="coverLetter">Cover Letter *</label>
                    <textarea
                        id="coverLetter"
                        rows={6}
                        placeholder="Tell us why you're interested in this position and why you'd be a great fit..."
                        value={formData.coverLetter}
                        onChange={(e) => handleInputChange('coverLetter', e.target.value)}
                        className={formErrors.coverLetter ? styles.errorInput : ''}
                    />
                    {formErrors.coverLetter && (
                        <span className={styles.errorMessage}>{formErrors.coverLetter}</span>
                    )}
                </div>

                {error && (
                    <div className={styles.submitError}>
                        {error}
                    </div>
                )}

                <div className={styles.formActions}>
                    <button
                        type="submit"
                        disabled={submitting}
                        className={styles.submitButton}
                    >
                        {submitting ? 'Submitting Application...' : 'Submit Application'}
                    </button>
                    <Link to={`/position/${position.id}`} className={styles.cancelButton}>
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default ApplyPage;
