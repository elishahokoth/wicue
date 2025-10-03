import React from 'react';
interface NotificationBadgeProps {
  count: number;
  max?: number;
}
const NotificationBadge: React.FC<NotificationBadgeProps> = ({
  count,
  max = 99
}) => {
  if (count <= 0) return null;
  const displayCount = count > max ? `${max}+` : count;
  return <span className="notification-badge">{displayCount}</span>;
};
export default NotificationBadge;