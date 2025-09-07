import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const InstallationProgress = ({ dbConfig, adminConfig }) => {
    const [progress, setProgress] = useState([]);
    const [isComplete, setIsComplete] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const runInstallation = async () => {
            // Step 1: Write config file
            setProgress(prev => [...prev, { text: 'Writing configuration file...', status: 'loading' }]);
            try {
                await axios.post('/api/installer/write-config', dbConfig);
                setProgress(prev => prev.map(p => p.text.startsWith('Writing') ? { ...p, status: 'success' } : p));
            } catch (err) {
                const errorMessage = err.response?.data?.message || 'Failed to write config file.';
                setProgress(prev => prev.map(p => p.text.startsWith('Writing') ? { ...p, status: 'error', message: errorMessage } : p));
                setError(`Installation failed: ${errorMessage}`);
                return; // Stop installation on failure
            }

            // Step 2: Inform user to restart server
            setProgress(prev => [...prev, { text: 'Server restart required to apply new configuration.', status: 'info' }]);
            // In a real-world scenario, we might try to programmatically restart or
            // just wait for the user to do it. Here we'll just pause and then continue,
            // assuming the user has restarted the server. This is a simplification.
            await new Promise(resolve => setTimeout(resolve, 5000)); // 5-second pause

            // Step 3: Create admin user
            setProgress(prev => [...prev, { text: 'Creating admin user...', status: 'loading' }]);
            try {
                await axios.post('/api/installer/create-admin', adminConfig);
                setProgress(prev => prev.map(p => p.text.startsWith('Creating') ? { ...p, status: 'success' } : p));
            } catch (err) {
                const errorMessage = err.response?.data?.message || 'Failed to create admin user. Have you restarted the server?';
                setProgress(prev => prev.map(p => p.text.startsWith('Creating') ? { ...p, status: 'error', message: errorMessage } : p));
                setError(`Installation failed: ${errorMessage}`);
                return;
            }

            // Step 4: Finalizing
            setProgress(prev => [...prev, { text: 'Installation complete!', status: 'success' }]);
            setIsComplete(true);
        };

        runInstallation();
    }, [dbConfig, adminConfig]);

    const getStatusIcon = (status) => {
        switch (status) {
            case 'loading':
                return <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>;
            case 'success':
                return <Icon name="CheckCircle" className="text-success" />;
            case 'error':
                return <Icon name="XCircle" className="text-destructive" />;
            case 'info':
                return <Icon name="Info" className="text-blue-500" />;
            default:
                return null;
        }
    };

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Installation in Progress</h2>
            <div className="p-4 bg-muted/50 rounded-lg border space-y-3">
                {progress.map((item, index) => (
                    <div key={index} className="flex items-start space-x-3">
                        <div className="w-5 h-5 flex-shrink-0 mt-0.5">{getStatusIcon(item.status)}</div>
                        <div className="flex-1">
                            <p className="text-sm font-medium">{item.text}</p>
                            {item.status === 'error' && <p className="text-xs text-destructive">{item.message}</p>}
                        </div>
                    </div>
                ))}
            </div>
            {error && (
                 <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">{error}</div>
            )}
            {isComplete && (
                <div className="text-center pt-4">
                    <p className="text-success font-semibold">Congratulations!</p>
                    <p className="text-muted-foreground mt-1">Your application has been installed successfully.</p>
                    <Button
                        onClick={() => window.location.href = '/patient-login'}
                        className="mt-6"
                        variant="default"
                    >
                        Go to Login Page
                    </Button>
                </div>
            )}
        </div>
    );
};

export default InstallationProgress;
