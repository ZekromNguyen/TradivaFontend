import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  List,
  Avatar,
  Button,
  Typography,
  Space,
  Tag,
  Progress,
  Tooltip,
  Divider,
  Alert,
  Spin
} from 'antd';
import {
  UserOutlined,
  DollarOutlined,
  RiseOutlined,
  FallOutlined,
  EyeOutlined,
  ReloadOutlined,
  PlusOutlined,
  FileTextOutlined,
  EnvironmentOutlined,
  StarOutlined,
  TeamOutlined,
  ShoppingCartOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
  SettingOutlined,
  BellOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState(null);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Fetch dashboard data from API
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        let fromDate, toDate;

        // Sử dụng giá trị từ API nếu có, nếu không tính mặc định
        const now = new Date();
        fromDate = new Date(now.setMonth(now.getMonth() - 1)).toISOString() // YYYY-MM-DD
        toDate = new Date().toISOString(); // YYYY-MM-DD, có thể thay đổi sau

        // Gửi request với fromDate và toDate
        const response = await fetch('https://tradivabe.felixtien.dev/api/Dashboard/combined-statistics', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Accept': '*/*',
          },
          body: JSON.stringify({
            fromDate,
            toDate,
            statisticType: 1
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP ${response.status}: ${errorText || 'Bad Request'}`);
        }

        const data = await response.json();
        console.log('API Data - fromDate:', data.fromDate, 'toDate:', data.toDate, 'Total Revenue:', data.paymentSummary.totalRevenue); // Debug
        setDashboardData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Handle refresh
  const handleRefresh = () => {
    setLoading(true);
    setError(null);
    setDashboardData(null);
    fetchDashboardData();
  };

  // Format numbers and currency
  const formatNumber = (num) => {
    return new Intl.NumberFormat('vi-VN').format(num);
  };

  const formatCurrency = (amount) => {
    const formatted = new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
    console.log('Formatted Revenue Input:', amount, 'Output:', formatted); // Debug
    return formatted;
  };

  // Calculate trend change
  const calculateTrend = (currentValue, previousValue) => {
    if (!previousValue || previousValue === 0) return 0;
    const change = ((currentValue - previousValue) / previousValue) * 100;
    return Math.round(change * 10) / 10;
  };

  // Dynamically generate stats data from API
  const statsData = dashboardData ? [
    {
      title: 'Tổng số tour',
      value: dashboardData.tourSummary.totalMatches,
      precision: 0,
      prefix: <EnvironmentOutlined className="text-green-500" />,
      suffix: '',
      trend: dashboardData.tourSummary.totalMatches >= (dashboardData.tourSummary.statistics.slice(0, -1).reduce((acc, curr) => acc + curr.totalMatches, 0) || 1) ? 'up' : 'down',
      change: calculateTrend(
        dashboardData.tourSummary.totalMatches,
        dashboardData.tourSummary.statistics.slice(0, -1).reduce((acc, curr) => acc + curr.totalMatches, 0) || 1
      ),
      color: 'green',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      title: 'Tổng yêu cầu thanh toán',
      value: dashboardData.paymentSummary.totalPayments,
      precision: 0,
      prefix: <DollarOutlined className="text-orange-500" />,
      suffix: '',
      trend: dashboardData.paymentSummary.totalPayments >= (dashboardData.paymentSummary.statistics.slice(0, -1).reduce((acc, curr) => acc + curr.totalPayments, 0) || 1) ? 'up' : 'down',
      change: calculateTrend(
        dashboardData.paymentSummary.totalPayments,
        dashboardData.paymentSummary.statistics.slice(0, -1).reduce((acc, curr) => acc + curr.totalPayments, 0) || 1
      ),
      color: 'orange',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    },
    {
      title: 'Yêu cầu chờ xử lý',
      value: dashboardData.paymentSummary.statusDistribution.Pending,
      precision: 0,
      prefix: <ClockCircleOutlined className="text-yellow-500" />,
      suffix: '',
      trend: dashboardData.paymentSummary.statusDistribution.Pending >= (dashboardData.paymentSummary.statistics.slice(0, -1).reduce((acc, curr) => acc + curr.pendingPayments, 0) || 1) ? 'up' : 'down',
      change: calculateTrend(
        dashboardData.paymentSummary.statusDistribution.Pending,
        dashboardData.paymentSummary.statistics.slice(0, -1).reduce((acc, curr) => acc + curr.pendingPayments, 0) || 1
      ),
      color: 'yellow',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200'
    },
    {
      title: 'Doanh thu tổng',
      value: dashboardData.paymentSummary.totalRevenue,
      precision: 0,
      prefix: '',
      trend: dashboardData.paymentSummary.totalRevenue >= (dashboardData.paymentSummary.statistics.slice(0, -1).reduce((acc, curr) => acc + curr.totalAmount, 0) || 1) ? 'up' : 'down',
      change: calculateTrend(
        dashboardData.paymentSummary.totalRevenue,
        dashboardData.paymentSummary.statistics.slice(0, -1).reduce((acc, curr) => acc + curr.totalAmount, 0) || 1
      ),
      color: 'purple',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    }
  ] : [];

  // Dynamically generate recent activities
  const recentActivities = dashboardData ? [
    {
      id: 1,
      type: 'tour',
      title: 'Tour mới được tạo',
      description: `Tour "${dashboardData.tourSummary.statistics[dashboardData.tourSummary.statistics.length - 1]?.period}" có ${dashboardData.tourSummary.totalMatches} matches`,
      time: 'Vừa xong',
      avatar: <EnvironmentOutlined />,
      color: 'green'
    },
    {
      id: 2,
      type: 'payment',
      title: 'Yêu cầu thanh toán mới',
      description: `Tổng ${dashboardData.paymentSummary.totalPayments} yêu cầu, ${dashboardData.paymentSummary.statusDistribution.Pending} đang chờ`,
      time: 'Vừa xong',
      avatar: <DollarOutlined />,
      color: 'orange'
    }
  ] : [];

  const quickActions = [
    {
      key: 'add-user',
      title: 'Thêm người dùng',
      icon: <TeamOutlined className="text-xl" />,
      description: 'Tạo tài khoản mới cho hệ thống',
      color: 'blue'
    },
    {
      key: 'create-tour',
      title: 'Tạo tour mới',
      icon: <PlusOutlined className="text-xl" />,
      description: 'Thêm tour du lịch mới',
      color: 'green'
    },
    {
      key: 'view-reports',
      title: 'Xem báo cáo',
      icon: <FileTextOutlined className="text-xl" />,
      description: 'Xem báo cáo chi tiết hệ thống',
      color: 'purple'
    },
    {
      key: 'settings',
      title: 'Cài đặt hệ thống',
      icon: <SettingOutlined className="text-xl" />,
      description: 'Quản lý cấu hình hệ thống',
      color: 'orange'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert
          message="Lỗi"
          description={`Không thể tải dữ liệu: ${error}`}
          type="error"
          showIcon
          action={
            <Button type="link" onClick={handleRefresh} icon={<ReloadOutlined />}>
              Thử lại
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-2xl p-8 text-white relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-white/20 to-transparent rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-white/10 to-transparent rounded-full translate-y-16 -translate-x-16"></div>
        <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-white/5 rounded-full"></div>
        <div className="relative z-10 flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30">
                <TrophyOutlined className="text-3xl text-white" />
              </div>
              <div>
                <Title level={1} className="text-white m-0 text-4xl font-bold tracking-tight">
                  Chào mừng trở lại! 👋
                </Title>
                <Text className="text-blue-100 text-lg font-medium opacity-90">
                  Tổng quan hệ thống • Cập nhật lúc {currentTime.toLocaleTimeString('vi-VN')}
                </Text>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <Text className="text-white text-sm font-semibold">Hệ thống hoạt động tốt</Text>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-1">
                    <Text className="text-white text-sm font-semibold">Uptime: 99.9%</Text>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-white/80 text-sm font-medium">Hiệu suất hôm nay</div>
              <div className="text-white text-2xl font-bold mt-1">+{statsData[0]?.change || 0}%</div>
            </div>
            <Button
              type="primary"
              size="large"
              icon={<ReloadOutlined />}
              onClick={handleRefresh}
              loading={loading}
              className="bg-white/20 border-white/30 hover:bg-white/30 backdrop-blur-sm h-12 px-6 font-semibold rounded-xl"
            >
              Làm mới
            </Button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[24, 24]}>
        {statsData.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card
              className={`${stat.bgColor} border-0 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group relative overflow-hidden`}
              bodyStyle={{ padding: '28px' }}
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-30 transition-opacity duration-300">
                {stat.prefix}
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-${stat.color}-400 to-${stat.color}-600 flex items-center justify-center text-white shadow-lg`}>
                    {stat.prefix}
                  </div>
                  <div>
                    <Text className="text-gray-600 font-semibold text-sm uppercase tracking-wide">{stat.title}</Text>
                  </div>
                </div>
                <div className="mb-4">
                  <Statistic
                    value={stat.value}
                    precision={stat.precision}
                    prefix=""
                    suffix={stat.suffix}
                    valueStyle={{
                      fontSize: '32px',
                      fontWeight: '800',
                      color: '#1f2937',
                      lineHeight: '1.2'
                    }}
                    formatter={(value) => stat.suffix === '₫' ? formatCurrency(value) : formatNumber(value)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${stat.trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {stat.trend === 'up' ? (
                        <RiseOutlined className="text-xs" />
                      ) : (
                        <FallOutlined className="text-xs" />
                      )}
                      <Text className={`font-bold text-xs ${stat.trend === 'up' ? 'text-green-700' : 'text-red-700'}`}>
                        {stat.change}%
                      </Text>
                    </div>
                    <Text className="text-gray-500 text-xs">vs tháng trước</Text>
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Main Content Grid */}
      <Row gutter={[24, 24]}>
        {/* Recent Activities */}
        <Col xs={24} lg={14}>
          <Card
            title={
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <ClockCircleOutlined className="text-white text-sm" />
                  </div>
                  <span className="text-xl font-bold text-gray-800">Hoạt động gần đây</span>
                </div>
                <Button
                  type="text"
                  icon={<EyeOutlined />}
                  size="small"
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg"
                >
                  Xem tất cả
                </Button>
              </div>
            }
            className="h-full shadow-lg border-0 rounded-2xl"
            bodyStyle={{ padding: '24px' }}
          >
            <List
              itemLayout="horizontal"
              dataSource={recentActivities}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Button type="text" icon={<EyeOutlined />} size="small">
                      Xem
                    </Button>
                  ]}
                  className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 px-6 py-4 rounded-xl transition-all duration-300 border border-transparent hover:border-blue-200 hover:shadow-md"
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        icon={item.avatar}
                        className={`bg-${item.color}-100 text-${item.color}-600 border-${item.color}-200 border-2`}
                      />
                    }
                    title={
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{item.title}</span>
                        <Tag color={item.color} size="small">Mới</Tag>
                      </div>
                    }
                    description={
                      <div>
                        <div className="text-gray-600">{item.description}</div>
                        <div className="flex items-center text-gray-500 text-sm mt-1">
                          <ClockCircleOutlined className="mr-1" />
                          {item.time}
                        </div>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* Quick Actions */}
        <Col xs={24} lg={10}>
          <Card
            title={
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                    <TrophyOutlined className="text-white text-sm" />
                  </div>
                  <span className="text-xl font-bold text-gray-800">Thao tác nhanh</span>
                </div>
                <Tag color="blue" className="px-3 py-1 rounded-lg font-semibold">{quickActions.length} thao tác</Tag>
              </div>
            }
            className="h-full shadow-lg border-0 rounded-2xl"
            bodyStyle={{ padding: '24px' }}
          >
            <div className="space-y-3">
              {quickActions.map((action) => (
                <Button
                  key={action.key}
                  type="text"
                  size="large"
                  className="w-full p-5 h-auto text-left hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 border border-gray-200 hover:border-blue-400 transition-all duration-300 rounded-xl hover:shadow-lg hover:-translate-y-1"
                  onClick={() => console.log('Action:', action.key)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg bg-${action.color}-100 text-${action.color}-600`}>
                      {action.icon}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-semibold text-gray-800">{action.title}</div>
                      <div className="text-sm text-gray-500">{action.description}</div>
                    </div>
                    <div className="text-gray-400">
                      →
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      {/* System Status */}
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Card
            title={
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                  <SettingOutlined className="text-white text-sm" />
                </div>
                <span className="text-xl font-bold text-gray-800">Tình trạng hệ thống</span>
              </div>
            }
            className="h-full shadow-lg border-0 rounded-2xl"
            bodyStyle={{ padding: '24px' }}
          >
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <Text>Hiệu suất máy chủ</Text>
                  <Text className="text-green-600 font-semibold">Tốt</Text>
                </div>
                <Progress percent={85} strokeColor="#10b981" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <Text>Sử dụng database</Text>
                  <Text className="text-blue-600 font-semibold">Bình thường</Text>
                </div>
                <Progress percent={65} strokeColor="#3b82f6" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <Text>Lưu lượng truy cập</Text>
                  <Text className="text-orange-600 font-semibold">Cao</Text>
                </div>
                <Progress percent={92} strokeColor="#f59e0b" />
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card
            title={
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                  <BellOutlined className="text-white text-sm" />
                </div>
                <span className="text-xl font-bold text-gray-800">Thông báo hệ thống</span>
              </div>
            }
            className="h-full shadow-lg border-0 rounded-2xl"
            bodyStyle={{ padding: '24px' }}
          >
            <div className="space-y-3">
              <Alert
                message="Bảo trì hệ thống"
                description="Hệ thống sẽ được bảo trì vào 2:00 AM ngày mai"
                type="info"
                showIcon
                closable
              />
              <Alert
                message="Cập nhật bảo mật"
                description="Phiên bản bảo mật mới đã được cài đặt thành công"
                type="success"
                showIcon
                closable
              />
              <Alert
                message="Sao lưu dữ liệu"
                description="Sao lưu tự động sẽ được thực hiện vào cuối ngày"
                type="warning"
                showIcon
                closable
              />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;