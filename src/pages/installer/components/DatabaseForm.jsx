import React, { useState } from 'react';
import axios from 'axios';
import Button from '../../../components/ui/Button';

const InputField = ({ id, label, value, onChange, placeholder, type = "text" }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-foreground mb-1">
            {label}
        </label>
        <input
            type={type}
            id={id}
            name={id}
            className="block w-full px-3 py-2 bg-background border border-border rounded-md shadow-sm placeholder-muted-foreground focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required
        />
    </div>
);

const DatabaseForm = ({ onSubmit }) => {
    const [dbConfig, setDbConfig] = useState({
        dbHost: '127.0.0.1',
        dbUser: 'root',
        dbPassword: '',
        dbName: '',
        dbPort: '3306',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [testSuccess, setTestSuccess] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setDbConfig(prev => ({ ...prev, [name]: value }));
        setTestSuccess(false); // Reset success on change
    };

    const handleTestConnection = async () => {
        setIsLoading(true);
        setError('');
        setTestSuccess(false);
        try {
            await axios.post('/api/installer/test-db', dbConfig);
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
            onSubmit(dbConfig);
        } else {
            setError('Please test the database connection successfully before proceeding.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-xl font-semibold text-foreground">Database Configuration</h2>
            <p className="text-sm text-muted-foreground">
                Please provide your MySQL database connection details. This will be written to the server's <code>.env</code> file.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField id="dbHost" label="Database Host" value={dbConfig.dbHost} onChange={handleInputChange} />
                <InputField id="dbPort" label="Database Port" value={dbConfig.dbPort} onChange={handleInputChange} />
                <InputField id="dbName" label="Database Name" value={dbConfig.dbName} onChange={handleInputChange} placeholder="e.g., clbp_db" />
                <InputField id="dbUser" label="Database User" value={dbConfig.dbUser} onChange={handleInputChange} placeholder="e.g., root" />
                <InputField id="dbPassword" label="Database Password" type="password" value={dbConfig.dbPassword} onChange={handleInputChange} />
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
