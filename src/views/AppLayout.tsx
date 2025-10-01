import React from 'react'
import { Layout, Menu, Typography, Switch, Space, Button } from 'antd'
import { UserOutlined, DashboardOutlined, DownloadOutlined, DeleteOutlined } from '@ant-design/icons'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '../store'
import { toggleTheme } from '../store/uiSlice'
import { store } from '../store'
import { saveAs } from 'file-saver'

const { Header, Content } = Layout

export const AppLayout: React.FC = () => {
  const location = useLocation()
  const selectedKey = location.pathname.startsWith('/dashboard') ? 'dashboard' : 'interview'
  const dispatch = useDispatch()
  const theme = useSelector((s: RootState) => s.ui.theme)

  const exportCsv = () => {
    const rows = store.getState().candidates.list || []
    const headers = ['Name','Email','Phone','Score','Date']
    const lines = [headers.join(',')].concat(
      rows.map((r: any) => [r.profile.name, r.profile.email, r.profile.phone, r.score, new Date(r.createdAt).toISOString()].map((v) => `"${(v ?? '').toString().replace(/"/g,'""')}"`).join(','))
    )
    const csv = '\uFEFF' + lines.join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
    saveAs(blob, 'candidates.csv')
  }

  const clearData = () => {
    localStorage.clear()
    window.location.reload()
  }

  return (
    <Layout style={{ minHeight: '100vh', background: 'radial-gradient(1200px 600px at 20% 0%, #e6f4ff 0%, #ffffff 55%)' }}>
      <Header style={{ position: 'sticky', top: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'linear-gradient(135deg,#001529,#003a8c)', boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}>
        <Typography.Title level={4} style={{ color: 'white', margin: 0, marginRight: 24 }}>
          AI Interview Assistant
        </Typography.Title>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[selectedKey]}
          items={[
            { key: 'interview', icon: <UserOutlined />, label: <Link to="/interview">Interviewee</Link> },
            { key: 'dashboard', icon: <DashboardOutlined />, label: <Link to="/dashboard">Interviewer</Link> },
          ]}
        />
        <Space>
          <Switch checkedChildren="Dark" unCheckedChildren="Light" checked={theme === 'dark'} onChange={() => dispatch(toggleTheme())} />
          <Button size="small" icon={<DownloadOutlined />} onClick={exportCsv}>Export</Button>
          <Button size="small" danger icon={<DeleteOutlined />} onClick={clearData}>Clear</Button>
        </Space>
      </Header>
      <Content style={{ padding: '24px 32px', margin: 0, width: '100%', minHeight: 'calc(100vh - 64px)' }}>
        <Outlet />
      </Content>
    </Layout>
  )
}


