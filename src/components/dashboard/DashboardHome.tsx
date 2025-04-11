import React from 'react';

function DashboardHome() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[
        { title: 'Total Posts', value: '120' },
        { title: 'Categories', value: '15' },
        { title: 'Latest Updates', value: '25' },
      ].map((stat) => (
        <div
          key={stat.title}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <h3 className="text-gray-500 text-sm">{stat.title}</h3>
          <p className="text-3xl font-bold mt-2">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}

export default DashboardHome;