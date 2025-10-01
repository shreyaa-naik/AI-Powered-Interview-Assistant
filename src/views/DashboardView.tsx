import React, { useMemo, useState } from 'react'
import { Card, Col, Descriptions, Input, Modal, Row, Space, Table, Tag, Typography } from 'antd'
import { useSelector } from 'react-redux'
import type { RootState } from '../store'

export const DashboardView: React.FC = () => {
  const candidates = useSelector((s: RootState) => s.candidates.list)
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const data = useMemo(() => {
    const filtered = candidates.filter((c) => {
      const hay = `${c.profile.name} ${c.profile.email} ${c.profile.phone}`.toLowerCase()
      return hay.includes(query.toLowerCase())
    })
    return filtered.sort((a, b) => b.score - a.score)
  }, [candidates, query])

  const selected = candidates.find((c) => c.id === selectedId) || null

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      <Row gutter={[24, 24]} style={{ maxWidth: 1200, margin: '0 auto' }}>
        <Col span={24}>
          <Input.Search placeholder="Search by name/email/phone" value={query} onChange={(e) => setQuery(e.target.value)} />
        </Col>
        <Col span={24}>
          <Card title="Candidates" styles={{ body: { background: '#ffffff' } }}>
            <Table
              rowKey="id"
              dataSource={data}
              pagination={{ pageSize: 5 }}
              onRow={(r) => ({ onClick: () => setSelectedId(r.id) })}
              columns={[
                { title: 'Name', dataIndex: ['profile', 'name'] },
                { title: 'Email', dataIndex: ['profile', 'email'] },
                { title: 'Phone', dataIndex: ['profile', 'phone'] },
                {
                  title: 'Score',
                  dataIndex: 'score',
                  sorter: (a, b) => a.score - b.score,
                  render: (v: number) => <Tag color={v >= 80 ? 'green' : v >= 60 ? 'gold' : 'red'}>{v}</Tag>,
                },
                { title: 'Date', dataIndex: 'createdAt', render: (v: number) => new Date(v).toLocaleString() },
              ]}
            />
          </Card>
        </Col>
      </Row>

      <Modal open={!!selected} onCancel={() => setSelectedId(null)} onOk={() => setSelectedId(null)} width={900} title="Candidate Details">
        {selected && (
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="Name">{selected.profile.name}</Descriptions.Item>
              <Descriptions.Item label="Email">{selected.profile.email}</Descriptions.Item>
              <Descriptions.Item label="Phone">{selected.profile.phone}</Descriptions.Item>
              <Descriptions.Item label="Score">{selected.score}</Descriptions.Item>
              <Descriptions.Item label="Summary">{selected.summary}</Descriptions.Item>
            </Descriptions>
            <Card title="Q&A (includes reference answers)">
              {selected.questions.map((q) => {
                const ans = selected.answers.find((a) => a.questionId === q.id)
                return (
                  <Card key={q.id} type="inner" title={`${q.difficulty.toUpperCase()}: ${q.text}`} style={{ marginBottom: 12 }}>
                    <Typography.Paragraph>{ans?.answer || '(no answer)'}</Typography.Paragraph>
                    <Typography.Paragraph type="secondary">Reference: {q.referenceAnswer}</Typography.Paragraph>
                    <Typography.Text type="secondary">Time: {ans?.timeTakenSec ?? 0}s | Score: {ans?.score ?? 0}</Typography.Text>
                  </Card>
                )
              })}
            </Card>
          </Space>
        )}
      </Modal>
    </Space>
  )
}


