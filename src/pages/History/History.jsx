import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext'; // Import the useAuth hook
import './History.css'; // Optional: For styling

export default function History() {
    const { isLoggedIn, user, loading: authLoading, refreshAccessToken } = useAuth();
    const [history, setHistory] = useState([]);
    const [pageIndex, setPageIndex] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch booking history from the API
    const fetchHistory = async (page = 1, retry = false) => {
        if (!isLoggedIn) {
            setError('Please log in to view your booking history.');
            return;
        }

        const accessToken = localStorage.getItem('accessToken'); // Direct access for debugging
        if (!accessToken) {
            setError('No access token found. Please log in again.');
            return;
        }

        setLoading(true);
        try {
            console.log('Fetching history with token:', accessToken.substring(0, 10) + '...'); // Debug: Log first 10 chars of token
            const response = await fetch(
                `https://tradivabe.felixtien.dev/api/MatchTour/historyMatchTour?pageIndex=${page}`,
                {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            console.log('Response status:', response.status); // Debug: Log status
            if (!response.ok) {
                if (response.status === 401 && !retry) {
                    console.log('401 Unauthorized, attempting token refresh...'); // Debug
                    const newToken = await refreshAccessToken();
                    if (newToken) {
                        console.log('Retrying with new token:', newToken.substring(0, 10) + '...'); // Debug
                        return fetchHistory(page, true); // Retry with new token
                    } else {
                        setError('Session expired. Please log in again.');
                        return;
                    }
                }
                throw new Error(`Failed to fetch booking history: ${response.statusText}`);
            }
            const data = await response.json();
            console.log('Fetched history data:', data); // Debug: Log response
            setHistory(data.items || []);
            setPageIndex(data.pageIndex || 1);
            setTotalPages(data.totalPages || 1);
        } catch (err) {
            console.error('Error fetching history:', err); // Debug
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Fetch data when component mounts or pageIndex/authLoading/isLoggedIn changes
    useEffect(() => {
        if (!authLoading && isLoggedIn) {
            fetchHistory(pageIndex);
        }
    }, [pageIndex, authLoading, isLoggedIn]);

    // Handle pagination
    const handleNextPage = () => {
        if (pageIndex < totalPages) {
            setPageIndex(pageIndex + 1);
        }
    };

    const handlePreviousPage = () => {
        if (pageIndex > 1) {
            setPageIndex(pageIndex - 1);
        }
    };

    // Format date for display
    const formatDate = (dateString) => {
        if (dateString === '0001-01-01T00:00:00') {
            return 'N/A'; // Handle invalid date
        }
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    if (authLoading) return <div>Loading authentication...</div>;
    if (!isLoggedIn) return <div>Please log in to view your booking history. <a href="/login">Log In</a></div>;
    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error} {error.includes('Unauthorized') && <a href="/login">Log In</a>}</div>;
    if (history.length === 0) return <div>No booking history found.</div>;

    return (
        <div className="history-container">
            <h2>Booking History for {user?.username || 'User'}</h2>
            <table className="history-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tour Title</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Guests</th>
                        <th>Price per Person</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {history.map((item) => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.tour?.title || 'N/A'}</td>
                            <td>{formatDate(item.tour?.dateStart)}</td>
                            <td>{formatDate(item.tour?.dateEnd)}</td>
                            <td>{item.numberGuest}</td>
                            <td>
                                {item.tour?.pricePerPerson
                                    ? `${item.tour.pricePerPerson.toLocaleString('vi-VN')} VND`
                                    : 'N/A'}
                            </td>
                            <td>{item.status || 'N/A'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="pagination">
                <button onClick={handlePreviousPage} disabled={pageIndex === 1}>
                    Previous
                </button>
                <span>Page {pageIndex} of {totalPages}</span>
                <button onClick={handleNextPage} disabled={pageIndex === totalPages}>
                    Next
                </button>
            </div>
        </div>
    );
}