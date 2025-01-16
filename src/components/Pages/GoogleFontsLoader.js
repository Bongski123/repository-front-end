import { useEffect } from 'react';

const GoogleFontsLoader = () => {
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Arial&family=Georgia&family=Courier+New&family=Tahoma&family=Verdana&family=Times+New+Roman&family=Comic+Sans+MS&family=Trebuchet+MS&family=Lucida+Console&display=swap';
    document.head.appendChild(link);

    // Cleanup the link when the component unmounts
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return null;
};

export default GoogleFontsLoader;
