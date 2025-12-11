import logoSvg from '../assets/melearn.png';

const MLLogo = ({ className = "", size = "medium", variant = "default" }) => {
  const sizeClasses = {
    small: "h-46",
    medium: "h-48", 
    large: "h-50"
  };

  return (
    <div className={`flex items-center ${className}`}>
      <img 
        src={logoSvg} 
        alt="ML MeLearn Logo" 
        className={`${sizeClasses[size]} w-auto`}
      />
    </div>
  );
};

export default MLLogo;