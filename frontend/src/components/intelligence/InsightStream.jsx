import React from 'react'

const InsightStream = ({ items = [] }) => {
  if (!items.length) return null

  return (
    <div className="intel-insight-stream">
      <div className="intel-insight-stream__head">
        <span className="intel-insight-stream__badge">AI insight stream</span>
        <span className="intel-insight-stream__meta">Live portfolio intelligence</span>
      </div>
      <div className="intel-insight-stream__list">
        {items.map((item) => (
          <div key={item.title || item} className={`intel-insight-stream__item tone-${item.tone || 'info'}`}>
            <strong>{item.title || item}</strong>
            {item.detail ? <p>{item.detail}</p> : null}
          </div>
        ))}
      </div>
    </div>
  )
}

export default InsightStream
