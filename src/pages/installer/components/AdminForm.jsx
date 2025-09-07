import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const AdminForm = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }
        setError('');
        const { confirmPassword, ...adminData } = formData;
        onSubmit(adminData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-xl font-semibold text-foreground">Create Admin Account</h2>
            <p className="text-sm text-muted-foreground">
                This will be the super administrator account for the application.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    label="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                />
                <Input
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                />
            </div>
            <Input
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    label="Password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                />
                <Input
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                />
            </div>

            {error && (
                <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">{error}</div>
            )}

            <div className="flex items-center justify-end pt-4 border-t border-border">
                <Button
                    type="submit"
                    variant="default"
                    iconName="ChevronRight"
                    iconPosition="right"
                >
                    Create Admin & Install
                </Button>
            </div>
        </form>
    );
};

export default AdminForm;
