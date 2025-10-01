import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Alert, Button, Card, Col, Form, Input, Modal, Progress, Result, Row, Space, Typography, Upload } from 'antd'
import { InboxOutlined } from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '../store'
import { addAnswer, resetSession, setProfile, setQuestions, setStatus } from '../store/sessionSlice'
import { addCandidate } from '../store/candidatesSlice'
import { extractResumeText, extractFieldsFromText } from '../utils/resume'
import { generateRandomQuestions, scoreAnswerByKeywords } from '../utils/questions'

const DIFFICULTY_TIME: Record<'easy' | 'medium' | 'hard', number> = {
  easy: 20,
  medium: 60,
  hard: 120,
}

// field extraction now handled in utils/resume

// Questions are now randomized from a bank with answer keywords

export const IntervieweeView: React.FC = () => {
  const dispatch = useDispatch()
  const session = useSelector((s: RootState) => s.session)
  const [form] = Form.useForm()
  const [resumeLoading, setResumeLoading] = useState(false)
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const timerRef = useRef<number | null>(null)

  const currentQuestion = session.questions[session.currentQuestionIndex]
  const total = session.questions.length || 6
  const completed = session.answers.length

  const showWelcomeBack = useMemo(() => {
    if (!session.lastActiveAt) return false
    if (session.status === 'completed') return false
    return Date.now() - session.lastActiveAt > 2000
  }, [session.lastActiveAt, session.status])

  useEffect(() => {
    if (currentQuestion) {
      setTimeLeft(DIFFICULTY_TIME[currentQuestion.difficulty])
    } else {
      setTimeLeft(null)
    }
  }, [currentQuestion?.id])

  useEffect(() => {
    if (timeLeft == null) return
    if (timerRef.current) window.clearInterval(timerRef.current)
    timerRef.current = window.setInterval(() => {
      setTimeLeft((t) => {
        if (t == null) return t
        if (t <= 1) {
          window.clearInterval(timerRef.current!)
          form.submit()
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current)
    }
  }, [timeLeft, form])

  const onResume = async (file: File) => {
    setResumeLoading(true)
    try {
      const text = await extractResumeText(file)
      const fields = extractFieldsFromText(text)
      dispatch(setProfile({ ...fields, resumeText: text }))
      form.setFieldsValue(fields)
    } catch (e: any) {
      Modal.error({ title: 'Failed to read resume', content: e.message })
    } finally {
      setResumeLoading(false)
    }
    return false
  }

  const startInterview = async (values: any) => {
    dispatch(setProfile(values))
    const missing = ['name', 'email', 'phone'].filter((k) => !values[k])
    if (missing.length) {
      Modal.warning({ title: 'Missing fields', content: `Please provide: ${missing.join(', ')}` })
      return
    }
    dispatch(setQuestions(generateRandomQuestions()))
  }

  const submitAnswer = (values: { answer?: string }) => {
    if (!currentQuestion) return
    const answer = (values.answer || '').trim()
    const timeTakenSec = DIFFICULTY_TIME[currentQuestion.difficulty] - (timeLeft ?? 0)
    const score = scoreAnswerByKeywords(answer, currentQuestion)
    dispatch(
      addAnswer({ questionId: currentQuestion.id, answer, timeTakenSec: timeTakenSec || 0, score })
    )
    form.resetFields(['answer'])
    const nextIndex = session.currentQuestionIndex + 1
    if (nextIndex >= total) {
      dispatch(setStatus('completed'))
      const scoreTotal = [...session.answers, { questionId: currentQuestion.id, answer, timeTakenSec: timeTakenSec || 0, score }]
        .reduce((s, a) => s + a.score, 0)
      const summary = `Strong ${scoreTotal >= 80 ? 'overall' : 'developing'} skills. React/Node understanding measured through timed Q&A.`
      dispatch(
        addCandidate({
          profile: session.profile,
          answers: [...session.answers, { questionId: currentQuestion.id, answer, timeTakenSec: timeTakenSec || 0, score }],
          questions: session.questions,
          score: scoreTotal,
          summary,
        })
      )
    }
  }

  return (
    <Row gutter={[24, 24]} style={{ maxWidth: 1200, margin: '0 auto' }}>
      <Col xs={24} md={8}>
        <Card title="Candidate Profile" bordered>
          <Upload.Dragger multiple={false} accept=".pdf,.docx" beforeUpload={onResume} disabled={resumeLoading}>
            <p className="ant-upload-drag-icon"><InboxOutlined /></p>
            <p className="ant-upload-text">Upload resume (PDF required, DOCX optional)</p>
          </Upload.Dragger>
          <Form form={form} layout="vertical" style={{ marginTop: 16 }} onFinish={startInterview}>
            <Form.Item name="name" label="Name"><Input placeholder="Full name" /></Form.Item>
            <Form.Item name="email" label="Email"><Input type="email" placeholder="email@example.com" /></Form.Item>
            <Form.Item name="phone" label="Phone"><Input placeholder="+1 555 555 5555" /></Form.Item>
            <Button type="primary" htmlType="submit" block disabled={session.status === 'in_progress'}>
              {session.status === 'in_progress' ? 'Interview in Progress' : 'Start Interview'}
            </Button>
          </Form>
          {showWelcomeBack && session.status !== 'completed' && (
            <Alert style={{ marginTop: 12 }} type="info" message="Welcome Back" description="You have an unfinished session. Continue where you left off." />
          )}
        </Card>
      </Col>
      <Col xs={24} md={16}>
        <Card
          title="Interview Chat"
          styles={{ body: { background: 'var(--chat-bg, #fafcff)' } }}
        >
          {session.status !== 'in_progress' && session.status !== 'completed' && (
            <Typography.Paragraph>Upload your resume and provide missing fields, then click Start Interview.</Typography.Paragraph>
          )}

          {session.status === 'in_progress' && currentQuestion && (
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              <div>
                <Typography.Text strong>{`Question ${session.currentQuestionIndex + 1} of ${total} (${currentQuestion.difficulty})`}</Typography.Text>
                <Progress percent={Math.round(((completed) / total) * 100)} showInfo style={{ marginTop: 8 }} />
              </div>
              <Typography.Paragraph>{currentQuestion.text}</Typography.Paragraph>
              <Alert type="warning" message={`Time left: ${timeLeft ?? 0}s`} showIcon />
              <Form form={form} layout="vertical" onFinish={submitAnswer}>
                <Form.Item name="answer" label="Your Answer">
                  <Input.TextArea rows={6} placeholder="Type your answer here..." autoSize={{ minRows: 6, maxRows: 12 }} />
                </Form.Item>
                <Space>
                  <Button type="primary" htmlType="submit">Submit</Button>
                  <Button onClick={() => form.submit()}>Skip</Button>
                </Space>
              </Form>
              {/* Correct answer is visible only to interviewer in Dashboard */}
            </Space>
          )}

          {session.status === 'completed' && (
            <Result
              status="success"
              title="Interview Completed"
              subTitle="Your responses have been submitted. You can view results in the Dashboard tab."
              extra={<Button onClick={() => dispatch(resetSession())}>Start New</Button>}
            />
          )}
        </Card>
      </Col>
    </Row>
  )
}


