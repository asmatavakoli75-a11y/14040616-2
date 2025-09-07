import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';

const InstallationProgress = ({ dbConfig, adminConfig }) => {
    const [progress, setProgress] = useState([]);
    const [isComplete, setIsComplete] = useState(false);
    const [error, setError] = useState('');
    const [stage, setStage] = useState('write_config'); // write_config, create_admin, done
    const [isWaitingForRestart, setIsWaitingForRestart] = useState(false);

    const updateProgress = (text, status, message = '') => {
        setProgress(prev => {
            const existingIndex = prev.findIndex(p => p.text === text);
            if (existingIndex > -1) {
                const newProgress = [...prev];
                newProgress[existingIndex] = { text, status, message };
                return newProgress;
            }
            return [...prev, { text, status, message }];
        });
    };

    const runWriteConfig = useCallback(async () => {
        updateProgress('Writing configuration file...', 'loading');
        try {
            await axios.post('/api/installer/write-config', dbConfig);
            updateProgress('Writing configuration file...', 'success');
            setStage('create_admin');
            setIsWaitingForRestart(true); // Prompt user to restart
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to write config file.';
            updateProgress('Writing configuration file...', 'error', errorMessage);
            setError(`Installation failed: ${errorMessage}`);
        }
    }, [dbConfig]);

    const runCreateAdmin = useCallback(async () => {
        setIsWaitingForRestart(false);
        updateProgress('Creating admin user...', 'loading');
        try {
            await axios.post('/api/installer/create-admin', adminConfig);
            updateProgress('Creating admin user...', 'success');
            updateProgress('Installation complete!', 'success');
            setIsComplete(true);
            setStage('done');
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to create admin user.';
            updateProgress('Creating admin user...', 'error', errorMessage);
            setError(`Failed to create admin. Please ensure you have restarted the server and try again.`);
        }
    }, [adminConfig]);

    useEffect(() => {
        if (stage === 'write_config') {
            runWriteConfig();
        }
    }, [stage, runWriteConfig]);

    const getStatusIcon = (status) => {
        switch (status) {
            case 'loading':
                return <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>;
            case 'success':
                return <Icon name="CheckCircle" className="text-success" />;
            case 'error':
                return <Icon name="XCircle" className="text-destructive" />;
            default:
                return <Icon name="Circle" className="text-muted" />;
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

            {isWaitingForRestart && (
                <div className="p-4 my-4 text-center bg-blue-500/10 text-blue-700 rounded-lg border border-blue-500/20">
                    <Icon name="Info" className="mx-auto mb-2" />
                    <h3 className="font-bold">Action Required: Restart Server</h3>
                    <p className="text-sm mt-1">
                        The configuration file has been saved. Please restart the backend server process for the changes to take effect.
                    </p>
                    <Button
                        onClick={runCreateAdmin}
                        className="mt-4"
                        variant="default"
                    >
                        I have restarted the server, Continue
                    </Button>
                </div>
            )}

            {error && !isWaitingForRestart && (
                 <div className="p-3 my-4 text-sm text-destructive bg-destructive/10 rounded-md">
                    <p>{error}</p>
                    {stage === 'create_admin' && (
                        <Button onClick={runCreateAdmin} variant="link" className="p-0 h-auto mt-2 text-destructive">
                            Try again
                        </Button>
                    )}
                 </div>
            )}

            {isComplete && (
                <div className="text-center pt-4">
                    <Icon name="PartyPopper" size={32} className="text-success mx-auto mb-2" />
                    <p className="text-success font-semibold">Congratulations!</p>
                    <p className="text-muted-foreground mt-1">Your application has been installed successfully.</p>
                    <Button
                        onClick={() => window.location.reload()}
                        className="mt-6"
                        variant="default"
                        iconName="RefreshCw"
                        iconPosition="left"
                    >
                        Finish & Go to Login Page
                    </Button>
                </div>
            )}
        </div>
    );
};

export default InstallationProgress;
