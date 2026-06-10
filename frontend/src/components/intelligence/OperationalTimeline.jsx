import React from 'react'

const OperationalTimeline = ({ items = [] }) => (
  <div className="intel-operational-timeline">
    {items.map((item) => (
      <div key={item.label} className={`intel-operational-timeline__item status-${item.status || 'pending'}`}>
        <div className="intel-operational-timeline__rail">
          <span className="dot" />
        </div>
        <div className="intel-operational-timeline__content">
          <div className="label">{item.label}</div>
          <div className="meta">{item.at ? new Date(item.at).toLocaleString() : item.status}</div>
        </div>
      </div>
    ))}
  </div>
)

export default OperationalTimeline
