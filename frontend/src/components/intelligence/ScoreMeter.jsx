import React from 'react'

const ScoreMeter = ({ label, value = 0, tone = 'primary', suffix = '' }) => {
  const safeValue = Math.max(0, Math.min(100, Number(value) || 0))

  return (
    <div className={`intel-score-meter tone-${tone}`}>
      <div className="intel-score-meter__head">
        <span>{label}</span>
        <strong>
          {safeValue}
          {suffix}
        </strong>
      </div>
      <div className="intel-score-meter__track">
        <span style={{ width: `${safeValue}%` }} />
      </div>
    </div>
  )
}

export default ScoreMeter
