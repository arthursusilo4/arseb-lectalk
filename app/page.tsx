import React from 'react'

interface BuddyCardProps {
  ID: string;
  name: string;
  topic: string;
  subject: string;
  duration: number;
  color: string;
}

const BuddyCard: React.FC<BuddyCardProps> = ({ 
  ID, 
  name, 
  topic, 
  subject, 
  duration, 
  color 
}) => {
  return (
    <div 
      className="buddy-card"
      style={{ '--buddy-color': color } as React.CSSProperties}
    >
      {/* Card Header with Subject Badge and Bookmark */}
      <div className="flex justify-between items-start">
        <span className="subject-badge">
          {subject}
        </span>
        <div className="buddy-bookmark">
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
          </svg>
        </div>
      </div>

      {/* Card Content */}
      <div className="flex flex-col gap-3">
        <h3 className="buddy-card-text text-xl font-bold">
          {name}
        </h3>
        <p className="buddy-card-text text-sm opacity-80">
          {topic}
        </p>
      </div>

      {/* Card Footer with Duration */}
      <div className="flex justify-between items-center">
        <span className="buddy-card-text text-sm">
          {duration} menit
        </span>
        <div className="w-2 h-2 rounded-full bg-current opacity-60"></div>
      </div>
    </div>
  )
}

export default BuddyCard