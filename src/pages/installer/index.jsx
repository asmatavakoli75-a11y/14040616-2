import React, { useState } from 'react';
import Icon from '../../components/AppIcon';
import DatabaseForm from './components/DatabaseForm';
import AdminForm from './components/AdminForm';
import InstallationProgress from './components/InstallationProgress';

const Installer = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [dbConfig, setDbConfig] = useState(null);
    const [adminConfig, setAdminConfig] = useState(null);
    const [error, setError] = useState('');

    const handleDbSubmit = (config) => {
        setDbConfig(config);
        setCurrentStep(2);
    };

    const handleAdminSubmit = (config) => {
        setAdminConfig(config);
        setCurrentStep(3);
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return <DatabaseForm onSubmit={handleDbSubmit} />;
            case 2:
                return <AdminForm onSubmit={handleAdminSubmit} />;
            case 3:
                return <InstallationProgress dbConfig={dbConfig} adminConfig={adminConfig} />;
            default:
                return <div>Welcome to the Installer</div>;
        }
    };

    const steps = [
        { id: 1, name: 'Database Setup', description: 'Configure your database connection.' },
        { id: 2, name: 'Admin Account', description: 'Create the administrator account.' },
        { id: 3, name: 'Installation', description: 'Finalize the installation.' },
    ];

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-2xl mx-auto">
                <div className="text-center mb-8">
                    <Icon name="Shield" size={48} className="text-primary mx-auto" />
                    <h1 className="text-3xl font-bold text-foreground mt-4">Application Installer</h1>
                    <p className="text-muted-foreground mt-2">
                        Welcome! Let's get your application set up.
                    </p>
                </div>

                {/* Stepper UI */}
                <div className="mb-8">
                    <ol className="flex items-center w-full">
                        {steps.map((step, index) => (
                            <li key={step.id} className={`flex w-full items-center ${index < steps.length - 1 ? "after:content-[''] after:w-full after:h-1 after:border-b after:border-border after:border-4 after:inline-block" : ""}`}>
                                <span className={`flex items-center justify-center w-10 h-10 rounded-full shrink-0 ${currentStep >= step.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                                    {currentStep > step.id ? <Icon name="Check" size={20} /> : step.id}
                                </span>
                            </li>
                        ))}
                    </ol>
                </div>

                <div className="bg-card p-8 rounded-lg border shadow-lg">
                    {error && <div className="p-4 mb-4 text-sm text-destructive bg-destructive/10 rounded-md">{error}</div>}
                    {renderStep()}
                </div>
            </div>
        </div>
    );
};

export default Installer;
