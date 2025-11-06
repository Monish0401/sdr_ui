"use client";

// Removed type import: ToasterProps
import { Toaster as Sonner } from "sonner";

// Removed interface declaration:
// interface CustomToasterProps extends Omit<ToasterProps, 'theme'> {
//   theme?: 'dark' | 'light';
// }

// Removed type annotation for props: CustomToasterProps
const Toaster = ({ theme = "dark", ...props }) => {
  return (
    <Sonner
      theme={theme}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: theme === 'dark' 
            ? 'bg-slate-900 border-slate-800 text-white' 
            : 'bg-white border-gray-200 text-gray-900',
          description: theme === 'dark' ? 'text-slate-400' : 'text-gray-600',
          actionButton: 'bg-blue-600 text-white',
          cancelButton: theme === 'dark' ? 'bg-slate-800' : 'bg-gray-100',
          closeButton: theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-gray-100 border-gray-200',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };