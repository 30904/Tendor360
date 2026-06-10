import React from 'react'
import RFPModuleTemplate from './RFPModuleTemplate'

const TeamCollaboration = () => (
  <RFPModuleTemplate
    title="Team Collaboration"
    description="Coordinate multiple teams with ownership, due dates, and contribution tracking."
    features={[
      'Section-level owner assignment',
      'Team progress board with status chips',
      'Mentions, comments, and task reminders'
    ]}
  />
)

export default TeamCollaboration
