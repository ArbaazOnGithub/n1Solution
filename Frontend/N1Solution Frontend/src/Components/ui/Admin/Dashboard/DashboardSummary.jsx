import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../card';
import RecentOrdersTable from '../Orders/RecentOrdersTable';
import config from '@/config';
import { useNavigate } from 'react-router-dom'; // Add this for navigation

const DashboardSummary = () => {
  const [summary, setSummary] = useState({
    totalUsers: 0,
    newUsers: 0,
    totalServices: 0,
    newOrders: 0,
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Add this for navigation

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          throw new Error('No authentication token found');
        }

        // Fetch users
        const usersResponse = await fetch(`${config.apiUrl}/api/users`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!usersResponse.ok) {
          const errorText = await usersResponse.text();
          throw new Error(`HTTP error! Status: ${usersResponse.status}, Message: ${errorText}`);
        }

        const usersData = await usersResponse.json();
        const totalUsers = usersData.length;

        // Fetch new users
        const newUserS = await fetch(`${config.apiUrl}/api/users/new-users`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!newUserS.ok) {
          const errorText = await newUserS.text();
          throw new Error(`HTTP error! Status: ${newUserS.status}, Message: ${errorText}`);
        }

        const newUsersData = await newUserS.json();
        const newUsers = newUsersData.length;

        // Fetch services
        const servicesResponse = await fetch(`${config.apiUrl}/api/services`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!servicesResponse.ok) {
          const errorText = await servicesResponse.text();
          throw new Error(`HTTP error! Status: ${servicesResponse.status}, Message: ${errorText}`);
        }

        const servicesData = await servicesResponse.json();
        const totalServices = servicesData.length;

        // Fetch orders
        const ordersResponse = await fetch(`${config.apiUrl}/api/orders`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!ordersResponse.ok) {
          const errorText = await ordersResponse.text();
          throw new Error(`HTTP error! Status: ${ordersResponse.status}, Message: ${errorText}`);
        }

        const ordersData = await ordersResponse.json();
        const newOrders = ordersData.length;

        // Update summary state
        setSummary({
          totalUsers,
          newUsers,
          totalServices,
          newOrders,
        });
      } catch (error) {
        console.error('Error fetching summary data:', error);
        // Handle authentication errors (e.g., redirect to login)
        if (error.message.includes('No authentication token found') || error.message.includes('401')) {
          navigate('/login'); // Redirect to login page
        }
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchSummary();
  }, [navigate]);

  if (loading) {
    return <div>Loading summary data...</div>;
  }

  if (summary.totalUsers === 0 && summary.newUsers === 0 && summary.totalServices === 0 && summary.newOrders === 0) {
    return <p className="text-gray-500">No summary data found</p>;
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-gray-200 p-4 rounded-2xl">
        <Card>
          <CardHeader>
            <CardTitle>New Users Today</CardTitle>
          </CardHeader>
          <CardContent>{summary.newUsers}</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
          </CardHeader>
          <CardContent>{summary.totalUsers}</CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Total Services</CardTitle>
          </CardHeader>
          <CardContent>{summary.totalServices}</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Orders</CardTitle>
          </CardHeader>
          <CardContent>{summary.newOrders}</CardContent>
        </Card>
      </div>
      <div>
        <RecentOrdersTable />
      </div>
    </>
  );
};

export default DashboardSummary;