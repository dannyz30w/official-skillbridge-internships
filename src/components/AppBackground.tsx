import { useLocation } from 'react-router-dom';
import EtheralShadow from '@/components/ui/etheral-shadow';

const AppBackground = () => {
  const { pathname } = useLocation();

  if (pathname === '/') return null;

  return (
    <div className="app-bg-root" aria-hidden="true">
      <EtheralShadow
        className="app-ethereal-bg"
        color="rgba(8, 15, 31, 0.98)"
        animation={{ scale: 58, speed: 58 }}
        noise={{ opacity: 0.22, scale: 0.9 }}
        sizing="fill"
      />
    </div>
  );
};

export default AppBackground;
