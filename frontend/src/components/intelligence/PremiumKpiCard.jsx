import React from 'react'
import AnimatedCounter from './AnimatedCounter'

const PremiumKpiCard = ({
  label,
  value,
  hint,
  tone = 'intel',
  trend,
  trendDirection = 'up',
  icon = null,
  suffix = '',
  displayValue = null
}) => {
  const spark = [3, 5, 4, 6, 5, 7, 6]
  const max = Math.max(...spark, 1)

  return (
    <div className={`intel-premium-kpi tone-${tone}`}>
      <div className="intel-premium-kpi__head">
        <div className="intel-premium-kpi__label">{label}</div>
        {icon ? <div className="intel-premium-kpi__icon" aria-hidden="true">{icon}</div> : null}
      </div>
      <div className="intel-premium-kpi__value">
        {displayValue != null ? (
          <span>{displayValue}</span>
        ) : (
          <AnimatedCounter value={value} suffix={suffix} />
        )}
      </div>
      {hint ? <div className="intel-premium-kpi__hint">{hint}</div> : null}
      <div className="intel-premium-kpi__meta">
        {trend ? (
          <span className={`intel-trend ${trendDirection === 'down' ? 'down' : 'up'}`}>{trend}</span>
        ) : null}
        <div className="intel-sparkline" aria-hidden="true">
          {spark.map((point, index) => (
            <span key={`${label}-${index}`} style={{ height: `${(point / max) * 100}%` }} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default PremiumKpiCard
