/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      maxHeight: {
        '192px': '192px'
      },
      width: {            // カスタムの幅を追加（w-1 あたり 0.25rem）
        '11': '2.75rem',
        '46': '11.5rem',
        '53': '13.25rem',
        '54': '13.50rem',
        '61': '15.25rem',
      },
      margin: {
        '8.5': '2.125rem',
        '38': '9.5rem',
      },
      userSelect: {
        none: 'none',
      },
      animation: {
        slideIn: 'slideIn 0.4s ease-out forwards',
        slideOut: 'slideOut 0.4s ease-out forwards',
        footerSlideIn: 'footerSlideIn 0.6s ease-out forwards',
        footerSlideOut: 'footerSlideOut 0.6s ease-out forwards',
        arrowRotateIn: 'arrowRotateIn 0.3s ease-in-out forwards',
        arrowRotateOut: 'arrowRotateOut 0.3s ease-in-out forwards'
      },
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateY(-120%)' },
          '100%': { transform: 'translateY(0)' },
        },
        slideOut: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-120%)' },
        },
        footerSlideIn: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        footerSlideOut: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(100%)' },
        },
        arrowRotateIn: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(180deg)' },
        },
        arrowRotateOut: {
          '0%': { transform: 'rotate(180deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
    }
  },
  variants: {
    userSelect: ['responsive', 'hover', 'focus'],
  },
  safelist: [
    'bg-red-100', 
    'bg-yellow-100', 
    'bg-fuchsia-100', 
    'bg-green-100', 
    'bg-amber-100', 
    'bg-cyan-100', 
    'bg-indigo-100', 
    'border-b-slate-500',
    'p-3',
    'w-6',
    'text-gray-400',
    // 使用するすべてのクラスをリスト化
  ],
}

