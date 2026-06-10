import React, { useState, useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Form, Button, Badge, Accordion, Alert, Spinner } from 'react-bootstrap'
import {
  Search,
  BookOpen,
  Plus,
  RefreshCw,
  Star,
  Eye,
  ThumbsUp,
  ThumbsDown,
  HelpCircle,
  Wrench,
  CreditCard,
  Sparkles,
  GraduationCap,
  X,
  MessageCircleQuestion
} from 'lucide-react'
import {
  fetchFAQs,
  setCurrentFAQ,
  setModal,
  markFAQHelpful
} from '../../store/slices/supportSlice'
import TableActionsCell from '../TableActionsCell'
import { buildTableActions, runTableAction } from '../../utils/tableActions'
import './FAQSection.scss'

const CATEGORIES = [
  { key: 'GENERAL', label: 'General', Icon: HelpCircle, tone: 'general' },
  { key: 'TECHNICAL', label: 'Technical', Icon: Wrench, tone: 'technical' },
  { key: 'BILLING', label: 'Billing', Icon: CreditCard, tone: 'billing' },
  { key: 'FEATURES', label: 'Features', Icon: Sparkles, tone: 'features' },
  { key: 'TRAINING', label: 'Training', Icon: GraduationCap, tone: 'training' }
]

const getCategoryMeta = (category) =>
  CATEGORIES.find((c) => c.key === category) || CATEGORIES[0]

const FAQSection = () => {
  const dispatch = useDispatch()
  const { faqs, faqsLoading, error } = useSelector((state) => state.support)
  const { user } = useSelector((state) => state.auth)

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [filteredFAQs, setFilteredFAQs] = useState([])
  const [activeAccordion, setActiveAccordion] = useState('0')

  const isStaff =
    user?.roles?.includes('ADMIN') || user?.roles?.includes('SUPPORT_STAFF')

  useEffect(() => {
    dispatch(fetchFAQs())
  }, [dispatch])

  useEffect(() => {
    if (!faqs) {
      setFilteredFAQs([])
      return
    }

    let filtered = faqs

    if (searchTerm) {
      const q = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (faq) =>
          faq.question.toLowerCase().includes(q) ||
          faq.answer.toLowerCase().includes(q) ||
          (faq.tags &&
            Array.isArray(faq.tags) &&
            faq.tags.some((tag) => tag.toLowerCase().includes(q)))
      )
    }

    if (selectedCategory) {
      filtered = filtered.filter((faq) => faq.category === selectedCategory)
    }

    setFilteredFAQs(filtered)
    if (filtered.length) setActiveAccordion('0')
  }, [faqs, searchTerm, selectedCategory])

  const popularFAQs = useMemo(() => {
    if (!faqs?.length) return []
    return [...faqs]
      .sort((a, b) => {
        const aScore = (a.viewCount || 0) + (a.helpfulCount || 0)
        const bScore = (b.viewCount || 0) + (b.helpfulCount || 0)
        return bScore - aScore
      })
      .slice(0, 4)
  }, [faqs])

  const categoryCounts = useMemo(() => {
    const counts = {}
    ;(faqs || []).forEach((f) => {
      counts[f.category] = (counts[f.category] || 0) + 1
    })
    return counts
  }, [faqs])

  const handleCategoryFilter = (category) => {
    setSelectedCategory(selectedCategory === category ? '' : category)
  }

  const handleClearFilters = () => {
    setSearchTerm('')
    setSelectedCategory('')
  }

  const handleViewFAQ = (faq) => {
    dispatch(setCurrentFAQ(faq))
    dispatch(setModal({ modal: 'showFAQView', show: true }))
  }

  const handleEditFAQ = (faq) => {
    dispatch(setCurrentFAQ(faq))
    dispatch(setModal({ modal: 'showEditFAQ', show: true }))
  }

  const handleCreateFAQ = () => {
    dispatch(setModal({ modal: 'showCreateFAQ', show: true }))
  }

  const handleHelpfulFeedback = (faqId, helpful) => {
    dispatch(markFAQHelpful({ id: faqId, helpful }))
  }

  const renderCategoryBadge = (category) => {
    const meta = getCategoryMeta(category)
    const Icon = meta.Icon
    return (
      <span className={`faq-hub__cat-badge faq-hub__cat-badge--${meta.tone}`}>
        <Icon size={12} />
        {meta.label}
      </span>
    )
  }

  if (faqsLoading && (!faqs || faqs.length === 0)) {
    return (
      <div className="faq-hub__loading">
        <Spinner animation="border" variant="primary" size="sm" />
        <p className="mt-3 mb-0 small">Loading knowledge base…</p>
      </div>
    )
  }

  if (error && (!faqs || faqs.length === 0)) {
    return (
      <Alert variant="danger" className="m-3">
        <Alert.Heading className="h6">Error loading FAQs</Alert.Heading>
        <p className="small mb-3">{typeof error === 'string' ? error : error?.message}</p>
        <Button size="sm" variant="primary" onClick={() => dispatch(fetchFAQs())}>
          <RefreshCw size={14} className="me-2" />
          Try again
        </Button>
      </Alert>
    )
  }

  if (!faqsLoading && (!faqs || faqs.length === 0)) {
    return (
      <div className="faq-hub__empty">
        <MessageCircleQuestion size={48} strokeWidth={1.25} />
        <h5>No FAQs yet</h5>
        <p>Knowledge base articles will appear here once published by your support team.</p>
        {isStaff && (
          <Button variant="primary" size="sm" onClick={handleCreateFAQ}>
            <Plus size={16} className="me-2" />
            Add first FAQ
          </Button>
        )}
      </div>
    )
  }

  const hasFilters = Boolean(searchTerm || selectedCategory)
  const showPopular = !hasFilters && popularFAQs.length > 0

  return (
    <div className="faq-hub">
      <div className="faq-hub__hero">
        <div className="faq-hub__hero-main">
          <div className="faq-hub__hero-icon" aria-hidden>
            <BookOpen size={22} />
          </div>
          <div>
            <h2 className="faq-hub__title">Frequently asked questions</h2>
            <p className="faq-hub__subtitle">
              Search the knowledge base or browse by topic to learn how Tender360 works.
            </p>
          </div>
        </div>
        <div className="d-flex flex-column align-items-end gap-2">
          <div className="faq-hub__chips">
            <span className="faq-hub__chip">{faqs?.length ?? 0} articles</span>
            <span className="faq-hub__chip">{CATEGORIES.length} topics</span>
            {hasFilters && (
              <span className="faq-hub__chip">{filteredFAQs.length} matching</span>
            )}
          </div>
          {isStaff && (
            <Button variant="primary" size="sm" onClick={handleCreateFAQ}>
              <Plus size={16} className="me-2" />
              Add FAQ
            </Button>
          )}
        </div>
      </div>

      <div className="faq-hub__toolbar">
        <div className="faq-hub__search">
          <Search size={18} className="faq-hub__search-icon" />
          <Form.Control
            type="search"
            placeholder="Search questions, answers, or tags…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search FAQs"
          />
        </div>

        <div className="faq-hub__categories">
          {CATEGORIES.map(({ key, label, Icon }) => (
            <button
              key={key}
              type="button"
              className={`faq-hub__cat-pill ${selectedCategory === key ? 'is-active' : ''}`}
              onClick={() => handleCategoryFilter(key)}
            >
              <Icon size={15} />
              {label}
              {categoryCounts[key] ? (
                <Badge bg={selectedCategory === key ? 'light' : 'secondary'} text="dark" pill className="ms-1">
                  {categoryCounts[key]}
                </Badge>
              ) : null}
            </button>
          ))}
        </div>

        {hasFilters && (
          <Button
            variant="link"
            className="faq-hub__clear text-decoration-none p-0"
            onClick={handleClearFilters}
          >
            <X size={14} className="me-1" />
            Clear filters
          </Button>
        )}
      </div>

      {showPopular && (
        <section className="faq-hub__section">
          <div className="faq-hub__section-head">
            <h3>
              <Star size={18} className="text-warning" />
              Popular questions
            </h3>
            <span className="text-muted">Most viewed &amp; helpful</span>
          </div>
          <div className="faq-hub__popular-grid">
            {popularFAQs.map((faq) => {
              const meta = getCategoryMeta(faq.category)
              const CatIcon = meta.Icon
              return (
                <button
                  key={faq._id}
                  type="button"
                  className="faq-hub__popular-card"
                  onClick={() => handleViewFAQ(faq)}
                >
                  <div className="faq-hub__popular-icon">
                    <CatIcon size={20} />
                  </div>
                  <div className="faq-hub__popular-body">
                    <p className="faq-hub__popular-q">{faq.question}</p>
                    <div className="faq-hub__popular-meta">
                      {renderCategoryBadge(faq.category)}
                      <span>
                        <Eye size={12} className="me-1" />
                        {faq.viewCount || 0}
                      </span>
                      <span>
                        <ThumbsUp size={12} className="me-1" />
                        {faq.helpfulCount || 0}
                      </span>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </section>
      )}

      <section className="faq-hub__section">
        <div className="faq-hub__section-head">
          <h3>
            {hasFilters ? 'Search results' : 'All questions'}
            <span className="text-muted fw-normal ms-2">({filteredFAQs.length})</span>
          </h3>
          <span className="text-muted">Expand to read full answers</span>
        </div>

        {filteredFAQs.length > 0 ? (
          <Accordion
            activeKey={activeAccordion}
            onSelect={(k) => setActiveAccordion(k ?? '')}
            className="faq-hub__accordion"
            flush
          >
            {filteredFAQs.map((faq, index) => (
              <Accordion.Item key={faq._id} eventKey={String(index)}>
                <Accordion.Header>
                  <div className="faq-hub__acc-head">
                    <div className="d-flex flex-wrap gap-2 align-items-center">
                      {renderCategoryBadge(faq.category)}
                      {faq.tags?.slice(0, 2).map((tag) => (
                        <span key={tag} className="faq-hub__tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className="faq-hub__acc-question">{faq.question}</span>
                    <div className="faq-hub__acc-stats">
                      <span>
                        <Eye size={12} className="me-1" />
                        {faq.viewCount || 0}
                      </span>
                      <span>
                        <ThumbsUp size={12} className="me-1" />
                        {faq.helpfulCount || 0}
                      </span>
                      {isStaff && (
                        <span onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
                          <TableActionsCell
                            actions={buildTableActions({ onEdit: true })}
                            onAction={(action) =>
                              runTableAction(action, faq, { onEdit: handleEditFAQ })
                            }
                          />
                        </span>
                      )}
                    </div>
                  </div>
                </Accordion.Header>
                <Accordion.Body>
                  <p className="faq-hub__answer">{faq.answer}</p>
                  <div className="faq-hub__feedback">
                    <div className="faq-hub__feedback-actions">
                      <Button
                        variant="outline-success"
                        size="sm"
                        onClick={() => handleHelpfulFeedback(faq._id, true)}
                      >
                        <ThumbsUp size={14} className="me-2" />
                        Helpful ({faq.helpfulCount || 0})
                      </Button>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => handleHelpfulFeedback(faq._id, false)}
                      >
                        <ThumbsDown size={14} className="me-2" />
                        Not helpful ({faq.notHelpfulCount || 0})
                      </Button>
                    </div>
                    <span className="faq-hub__author">
                      By {faq.createdBy?.name || 'Support team'}
                    </span>
                  </div>
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        ) : (
          <div className="faq-hub__empty">
            <Search size={44} strokeWidth={1.25} />
            <h5>No matches found</h5>
            <p>Try different keywords or pick another category.</p>
            <Button variant="outline-primary" size="sm" onClick={handleClearFilters}>
              Clear filters
            </Button>
          </div>
        )}
      </section>
    </div>
  )
}

export default FAQSection
