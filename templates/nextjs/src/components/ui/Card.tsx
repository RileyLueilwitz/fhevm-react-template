import React from 'react'

interface CardProps {
  children: React.ReactNode
  title?: string
  className?: string
}

export const Card: React.FC<CardProps> = ({ children, title, className = '' }) => {
  return (
    <div className={`card ${className}`.trim()}>
      {title && <h2 className="card-title">{title}</h2>}
      {children}
    </div>
  )
}
