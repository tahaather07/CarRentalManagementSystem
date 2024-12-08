import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { bookingsAPI } from '../services/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <p className="text-2xl font-bold mt-2">{value}</p>
        </div>
        <div className="text-blue-500 text-2xl">
          {icon}
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  const [stats, setStats] = useState({
    totalCars: 24,
    activeStaff: 12,
    revenue: '$45,231',
    growth: '+23%'
  });

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Monthly Revenue',
        data: [30000, 35000, 25000, 45000, 40000, 45231],
        borderColor: 'rgb(59, 130, 246)',
        tension: 0.1,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Revenue'
      }
    }
  };

  return (
    <div className="p-2 md:p-6">
      <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
        <StatCard 
          title="Total Cars" 
          value={stats.totalCars}
          icon="🚗"
        />
        <StatCard 
          title="Active Staff" 
          value={stats.activeStaff}
          icon="👥"
        />
        <StatCard 
          title="Revenue" 
          value={stats.revenue}
          icon="💰"
        />
        <StatCard 
          title="Growth" 
          value={stats.growth}
          icon="📈"
        />
      </div>

      <div className="bg-white p-3 md:p-6 rounded-lg shadow-md">
        <div className="h-[300px] md:h-[400px]">
          <Line data={chartData} options={{
            ...chartOptions,
            maintainAspectRatio: false,
            responsive: true
          }} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard; 