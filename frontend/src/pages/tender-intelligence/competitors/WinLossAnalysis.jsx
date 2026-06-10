import React from 'react'
import { Container, Row, Col, Card } from 'react-bootstrap'
import { ArrowLeft, TrendingUp, BarChart, Target, Users, DollarSign, Award } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import ComingSoon from '../../ComingSoon'

const WinLossAnalysis = () => {
  const navigate = useNavigate()

  const features = [
    'Analyze win/loss patterns against specific competitors',
    'Track competitive performance metrics and trends',
    'Identify winning strategies and losing factors',
    'Generate competitor-specific win/loss reports',
    'Monitor competitive bid success rates',
    'Analyze pricing strategies of successful competitors',
    'Track market share changes over time',
    'Generate strategic recommendations based on analysis'
  ]

  return (
    <div className="win-loss-analysis-page">
      <Container fluid>
        {/* Breadcrumb */}
        <Row className="mb-3">
          <Col>
            <div className="breadcrumb-nav">
              <button 
                className="breadcrumb-back"
                onClick={() => navigate('/tender-intelligence/competitors')}
              >
                <ArrowLeft size={16} className="me-2" />
                Back to Competitor Intelligence
              </button>
            </div>
          </Col>
        </Row>

        {/* Coming Soon Component */}
        <Row>
          <Col>
            <ComingSoon
              title="Win/Loss Analysis by Competitor"
              description="Analyze win/loss patterns and performance against specific competitors with detailed insights and strategic recommendations."
              features={features}
              estimatedDelivery="Q2 2024"
              icon={TrendingUp}
            />
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default WinLossAnalysis
