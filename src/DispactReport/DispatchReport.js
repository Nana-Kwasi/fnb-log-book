import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, query, orderBy } from "firebase/firestore";
import { BarChart, Bar, XAxis, YAxis, Cell, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import app from '../Config';
import "../dispatchreport.css"

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#ffffff',
  },
  headerSection: {
    marginBottom: 30,
    borderBottom: 2,
    borderBottomColor: '#2563eb',
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    color: '#1e40af',
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  dateText: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  statsSection: {
    marginBottom: 30,
    padding: 20,
    backgroundColor: '#f0f9ff',
    borderRadius: 8,
    border: 1,
    borderColor: '#93c5fd',
  },
  statsSectionTitle: {
    fontSize: 18,
    color: '#1e40af',
    marginBottom: 15,
    fontWeight: 'bold',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  statItem: {
    flex: 1,
    padding: 10,
  },
  statLabel: {
    fontSize: 12,
    color: '#4b5563',
    marginBottom: 5,
  },
  statValue: {
    fontSize: 16,
    color: '#1e40af',
    fontWeight: 'bold',
  },
  table: {
    marginTop: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#2563eb',
    padding: 12,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  tableHeaderCell: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'left',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#ffffff',
    minHeight: 40,
    padding: 8,
  },
  tableRowEven: {
    backgroundColor: '#f8fafc',
  },
  tableCell: {
    flex: 1,
    fontSize: 10,
    color: '#374151',
    padding: 8,
    textAlign: 'left',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    color: '#6b7280',
    fontSize: 10,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 10,
  },
  pageNumber: {
    position: 'absolute',
    bottom: 30,
    right: 40,
    fontSize: 12,
    color: '#6b7280',
  }
});

const PDFReport = ({ data, stats }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.headerSection}>
        <Text style={styles.title}>Dispatch Report</Text>
        <Text style={styles.dateText}>
          Generated on: {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZoneName: 'short'
          })}
        </Text>
      </View>

      <View style={styles.statsSection}>
        <Text style={styles.statsSectionTitle}>Summary Statistics</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Total Dispatches</Text>
            <Text style={styles.statValue}>{stats.total}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Unique Recipients</Text>
            <Text style={styles.statValue}>{stats.uniqueRecipients}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Most Used Mode</Text>
            <Text style={styles.statValue}>{stats.mostUsedMode}</Text>
          </View>
        </View>
      </View>

      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderCell}>Date</Text>
          <Text style={styles.tableHeaderCell}>Registry Number</Text>
          <Text style={styles.tableHeaderCell}>Dispatched By</Text>
          <Text style={styles.tableHeaderCell}>Mode</Text>
          <Text style={styles.tableHeaderCell}>Recipient</Text>
          <Text style={styles.tableHeaderCell}>Subject</Text>
          <Text style={styles.tableHeaderCell}>Location</Text>
        </View>

        {data.map((item, index) => (
          <View key={index} style={[
            styles.tableRow,
            index % 2 === 0 ? styles.tableRowEven : {}
          ]}>
            <Text style={styles.tableCell}>
              {new Date(item.timestamp).toLocaleDateString()}
            </Text>
            <Text style={styles.tableCell}>{item.registryNumber}</Text>
            <Text style={styles.tableCell}>{item.dispatchBy}</Text>
            <Text style={styles.tableCell}>{item.dispatchMode}</Text>
            <Text style={styles.tableCell}>{item.toWhomSent}</Text>
            <Text style={styles.tableCell}>{item.subject}</Text>
            <Text style={styles.tableCell}>{item.locationOfLetter}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.footer}>
        This report is automatically generated and is confidential.
      </Text>
      
      <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
        `Page ${pageNumber} of ${totalPages}`
      )} fixed />
    </Page>
  </Document>
);
const ReportScreen = () => {
  const db = getFirestore(app);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [dispatchData, setDispatchData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [reportType, setReportType] = useState('daily');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchDispatchData();
  }, []);

  const fetchDispatchData = async () => {
    setIsLoading(true);
    try {
      const querySnapshot = await getDocs(
        query(collection(db, "DispatchEntries"), orderBy("timestamp", "desc"))
      );
      
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp.split('T')[0]
      }));
      
      setDispatchData(data);
      setFilteredData(data);
    } catch (error) {
      console.error("Error fetching dispatch data:", error);
      setError('Failed to fetch report data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilter = () => {
    if (!dateRange.startDate || !dateRange.endDate) {
      alert('Please select both start and end dates');
      return;
    }

    const filtered = dispatchData.filter(item => {
      const itemDate = new Date(item.timestamp);
      const start = new Date(dateRange.startDate);
      const end = new Date(dateRange.endDate);
      return itemDate >= start && itemDate <= end;
    });

    setFilteredData(filtered);
  };

  const resetFilter = () => {
    setDateRange({ startDate: '', endDate: '' });
    setFilteredData(dispatchData);
  };

  const getStats = () => {
    const mostUsedMode = filteredData.length > 0
      ? Object.entries(
          filteredData.reduce((acc, curr) => {
            acc[curr.dispatchMode] = (acc[curr.dispatchMode] || 0) + 1;
            return acc;
          }, {})
        ).sort((a, b) => b[1] - a[1])[0][0]
      : 'N/A';

    return {
      total: filteredData.length,
      uniqueRecipients: new Set(filteredData.map(item => item.toWhomSent)).size,
      mostUsedMode
    };
  };

  const getChartData = () => {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    const monthlyData = Array(12).fill().map(() => ({
      count: 0,
      dispatches: []
    }));
    
    filteredData.forEach(item => {
      const month = new Date(item.timestamp).getMonth();
      monthlyData[month].count++;
      monthlyData[month].dispatches.push(item);
    });
    
    return monthlyData.map((data, index) => ({
      name: monthNames[index],
      value: data.count,
      dispatches: data.dispatches
    }));
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length > 0) {
      const { dispatches } = payload[0].payload;
      return (
        <div className="chart-tooltip">
          <p className="tooltip-label">{label}</p>
          <p className="tooltip-total">Total Dispatches: {payload[0].value}</p>
          
          {dispatches.map((dispatch, index) => (
            <div key={index} className="tooltip-dispatch-item">
              <p>📅 Date: {new Date(dispatch.timestamp).toLocaleDateString('en-US', { 
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</p>
              <p>📝 Subject: {dispatch.subject}</p>
              <p>📬 Mode: {dispatch.dispatchMode}</p>
              <p>👤 Dispatched By: {dispatch.dispatchBy}</p>
              <p>📍 Location: {dispatch.locationOfLetter}</p>
              <p>📋 Registry: {dispatch.registryNumber}</p>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const barColors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', '#FF9999',
    '#88D8B0', '#FF8C94', '#9BB7D4', '#B5EAD7', '#C7CEEA', '#FFB7B2'
  ];

  return (
    <div className="report-container">
      <header className="report-header">
        <h1>📊 Dispatch Reports</h1>
        <button 
          className="filter-toggle-button"
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? '❌ Hide Filters' : '🔍 Show Filters'}
        </button>
      </header>

      {showFilters && (
        <div className="filters-section">
          <div className="date-filters">
            <div className="date-input-group">
              <span>📅</span>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                placeholder="Start Date"
              />
            </div>
            <div className="date-input-group">
              <span>📅</span>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                placeholder="End Date"
              />
            </div>
            <button className="apply-filter-button" onClick={handleFilter}>
              Apply Filter
            </button>
            <button className="reset-filter-button" onClick={resetFilter}>
              Reset
            </button>
          </div>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      <div className="report-content">
        <div className="stats-section">
          <div className="stat-card">
            <h3>Total Dispatches</h3>
            <p>{filteredData.length}</p>
          </div>
          <div className="stat-card">
            <h3>Unique Recipients</h3>
            <p>{new Set(filteredData.map(item => item.toWhomSent)).size}</p>
          </div>
          <div className="stat-card">
            <h3>Mode Of Delivery</h3>
            <p>
              {filteredData.length > 0
                ? Object.entries(
                    filteredData.reduce((acc, curr) => {
                      acc[curr.dispatchMode] = (acc[curr.dispatchMode] || 0) + 1;
                      return acc;
                    }, {})
                  ).sort((a, b) => b[1] - a[1])[0][0]
                : 'N/A'}
            </p>
          </div>
        </div>

        <div className="chart-section">
          <h2>Monthly Dispatch Distribution</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={getChartData()} margin={{ top: 30, right: 30, left: 20, bottom: 100 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={100}
                interval={0}
                stroke="#666"
              />
              <YAxis stroke="#666" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar 
                dataKey="value" 
                name="Number of Dispatches"
                radius={[4, 4, 0, 0]}
              >
                {getChartData().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={barColors[index % 12]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="table-section">
          <div className="table-header">
            <h2>Dispatch Records</h2>
            <PDFDownloadLink
              document={<PDFReport data={filteredData} stats={getStats()} />}
              fileName={`dispatch_report_${new Date().toISOString().split('T')[0]}.pdf`}
              className="download-button"
            >
              {({ blob, url, loading, error }) =>
                loading ? '⏳ Preparing PDF...' : '📥 Download PDF Report'
              }
            </PDFDownloadLink>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th style={{color:'black'}}>Date</th>
                  <th style={{color:'black'}}>Registry Number</th>
                  <th style={{color:'black'}}>Dispatched By</th>
                  <th style={{color:'black'}}>Mode</th>
                  <th style={{color:'black'}}>Recipient</th>
                  <th style={{color:'black'}}>Subject</th>
                  <th style={{color:'black'}}>Location</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map(item => (
                  <tr key={item.id}>
                    <td>{new Date(item.timestamp).toLocaleDateString()}</td>
                    <td>{item.registryNumber}</td>
                    <td>{item.dispatchBy}</td>
                    <td>{item.dispatchMode}</td>
                    <td>{item.toWhomSent}</td>
                    <td>{item.subject}</td>
                    <td>{item.locationOfLetter}</td>
                  </tr>
                ))}
                {filteredData.length === 0 && (
                  <tr>
                    <td colSpan="7" className="no-data">
                      No dispatch records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportScreen;