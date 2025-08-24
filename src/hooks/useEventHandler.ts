
import { useEffect } from 'react';


export const useEventHandler = (
  listen: string, 
  callback: EventListener
) => {
  useEffect(() => {
    window.addEventListener(listen, callback);
    return () => {
      window.removeEventListener(listen, callback);
    };
  }, [listen, callback]);  
}

// export const useOnClick = (callback) => {
//   useEffect(() => {
//     window.addEventListener('click', callback);
//     return () => {
//       window.removeEventListener('click', callback);
//   }, [callback]);
// };

// export const useClickOutside = (callback) => {
//   useEffect(() => {
//     document.addEventListener('mousedown', callback);
//     return () => {
//       document.removeEventListener('mousedown', callback);
//     };
//   }, [callback]);
// }

// export const useOnScroll = (callback) => {
//   useEffect(() => {
//     document.addEventListener('scroll', callback);
//     return () => {
//       document.removeEventListener('scroll', callback);
//     };
//   }, [callback]);
// }

