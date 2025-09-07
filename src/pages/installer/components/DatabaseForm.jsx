import React, { useState } from 'react';
import axios from 'axios';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const DatabaseForm = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
        dbHost: 'localhost',
        dbName: 'clbp_db',
        dbUser: 'root',
        dbPass: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [testSuccess, setTestSuccess] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setTestSuccess(false); // Reset success on change
    };

    const handleTestConnection = async () => {
        setIsLoading(true);
        setError('');
        setTestSuccess(false);
        try {
            await axios.post('/api/installer/test-db', formData);
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
            onSubmit(formData);
        } else {
            setError('Please test the database connection successfully before proceeding.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-xl font-semibold text-foreground">Database Configuration</h2>
            <p className="text-sm text-muted-foreground">
                Please provide your database connection details. These will be written to the server's <code>.env</code> file.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    label="Database Host"
                    name="dbHost"
                    value={formData.dbHost}
                    onChange={handleInputChange}
                    required
                />
                <Input
                    label="Database Name"
                    name="dbName"
                    value={formData.dbName}
                    onChange={handleInputChange}
                    required
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    label="Database User"
                    name="dbUser"
                    value={formData.dbUser}
                    onChange={handleInputChange}
                    required
                />
                <Input
                    label="Database Password"
                    name="dbPass"
                    type="password"
                    value={formData.dbPass}
                    onChange={handleInputChange}
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
