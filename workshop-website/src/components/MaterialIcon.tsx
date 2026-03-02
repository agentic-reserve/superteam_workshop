interface MaterialIconProps {
  icon: string;
  filled?: boolean;
  className?: string;
  size?: number;
}

export default function MaterialIcon({ 
  icon, 
  filled = false, 
  className = '',
  size = 24 
}: MaterialIconProps) {
  return (
    <span 
      className={`material-symbols-${filled ? 'filled' : 'outlined'} ${className}`}
      style={{ fontSize: `${size}px` }}
    >
      {icon}
    </span>
  );
}
