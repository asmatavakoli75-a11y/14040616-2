import React, { useState } from 'react';
import axios from 'axios';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DatabaseForm = ({ onSubmit }) => {
    const [mongoUri, setMongoUri] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [testSuccess, setTestSuccess] = useState(false);

    const handleInputChange = (e) => {
        setMongoUri(e.target.value);
        setTestSuccess(false); // Reset success on change
    };

    const handleTestConnection = async () => {
        setIsLoading(true);
        setError('');
        setTestSuccess(false);
        try {
            await axios.post('/api/installer/test-db', { mongoUri });
            setTestSuccess(true);
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to connect to the database.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (testSuccess) {
            onSubmit({ mongoUri });
        } else {
            setError('Please test the database connection successfully before proceeding.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-xl font-semibold text-foreground">Database Configuration</h2>
            <p className="text-sm text-muted-foreground">
                Please provide your full MongoDB Connection String URI (e.g., from MongoDB Atlas). This will be written to the server's <code>.env</code> file.
            </p>

            <div>
                <label htmlFor="mongoUri" className="block text-sm font-medium text-foreground mb-1">
                    MongoDB Connection String
                </label>
                <textarea
                    id="mongoUri"
                    name="mongoUri"
                    rows="4"
                    className="block w-full px-3 py-2 bg-background border border-border rounded-md shadow-sm placeholder-muted-foreground focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    value={mongoUri}
                    onChange={handleInputChange}
                    placeholder="mongodb+srv://user:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority"
                    required
                />
            </div>

            {error && (
                <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">{error}</div>
            )}
            {testSuccess && (
                <div className="p-3 text-sm text-success bg-success/10 rounded-md">Connection successful! You can now proceed.</div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-border">
                <Button
                    type="button"
                    variant="outline"
                    onClick={handleTestConnection}
                    loading={isLoading}
                    iconName="Plug"
                >
                    Test Connection
                </Button>
                <Button
                    type="submit"
                    variant="default"
                    disabled={!testSuccess || isLoading}
                    iconName="ChevronRight"
                    iconPosition="right"
                >
                    Next
                </Button>
            </div>
        </form>
    );
};

export default DatabaseForm;
