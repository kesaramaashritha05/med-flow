import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Mail, Shield, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/Toast';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user: currentUser } = useAuth();
    const { showToast } = useToast();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axios.get('http://localhost:5001/api/admin/users'); // Need to implement this route
                setUsers(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const deleteUser = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            await axios.delete(`http://localhost:5001/api/admin/users/${id}`);
            setUsers(users.filter(u => u._id !== id));
            showToast('User deleted successfully');
        } catch (err) {
            showToast('Failed to delete user', 'error');
        }
    };

    if (loading) return <div>Loading users...</div>;

    return (
        <div className="user-management">
            <div className="table-card">
                <table className="custom-table">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Joined</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u._id} className={u._id === currentUser?.id ? 'row-highlight' : ''}>
                                <td>
                                    <div className="user-info-cell">
                                        <div className="avatar-xs">{u.name ? u.name[0] : '?'}</div>
                                        <span>{u.name || 'Unknown'} {u._id === currentUser?.id && <span className="you-label">(You)</span>}</span>
                                    </div>
                                </td>
                                <td>{u.email}</td>
                                <td><span className={`role-badge ${u.role.toLowerCase()}`}>{u.role}</span></td>
                                <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                                <td className="actions-cell">
                                    <button onClick={() => deleteUser(u._id)} className="btn-reject-sm">
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManagement;
