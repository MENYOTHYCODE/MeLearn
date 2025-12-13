import logoSvg from '../assets/melearn.png';

const MLLogo = ({ className = "", size = "medium", variant = "default" }) => {
  const sizeClasses = {
    small: "h-36",
    medium: "h-38", 
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