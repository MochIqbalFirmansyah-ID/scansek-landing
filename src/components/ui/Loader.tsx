import { Loader2 } from 'lucide-react';

interface LoaderProps {
  size?: number;
  fullScreen?: boolean;
  text?: string;
}

const Loader = ({ size = 24, fullScreen = false, text = 'Loading...' }: LoaderProps) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center flex-col z-50">
        <Loader2 size={40} className="text-primary-600 animate-spin" />
        <p className="mt-4 text-gray-600 font-medium">{text}</p>
      </div>
    );
  }
  
  return (
    <div className="flex items-center justify-center">
      <Loader2 size={size} className="text-primary-600 animate-spin" />
      {text && <span className="ml-2 text-gray-600">{text}</span>}
    </div>
  );
};

export default Loader;