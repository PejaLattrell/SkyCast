/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        cream: '#F5F0E8',
        sand: '#EDE4D3',
        sage: '#B8C4B0',
        blush: '#F0DED6',
        sky: '#D4E4ED',
        dusk: '#C4B5D4',
        charcoal: '#2C2824',
        'warm-gray': '#6B6560',
        'light-gray': '#A09A93',
        terracotta: '#C4957A',
        'sage-accent': '#7A9A6E',
        amber: '#D4A03A',
        'dusty-rose': '#C49B8E',
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        xl: "calc(var(--radius) + 4px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xs: "calc(var(--radius) - 6px)",
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        soft: '0 4px 24px rgba(44, 40, 36, 0.06)',
        card: '0 8px 32px rgba(44, 40, 36, 0.08)',
        elevated: '0 16px 48px rgba(44, 40, 36, 0.12)',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        rain: {
          '0%': { strokeDashoffset: '0' },
          '100%': { strokeDashoffset: '20' },
        },
        snowfall: {
          '0%': { transform: 'translateY(0) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(8px) rotate(45deg)', opacity: '0' },
        },
        lightning: {
          '0%, 90%, 100%': { opacity: '0' },
          '92%, 96%': { opacity: '1' },
        },
        foggypulse: {
          '0%, 100%': { filter: 'blur(0px)' },
          '50%': { filter: 'blur(2px)' },
        },
        spinSlow: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        bounceScroll: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(8px)' },
        },
        pulseRing: {
          '0%': { transform: 'scale(1)', opacity: '0.5' },
          '100%': { transform: 'scale(2)', opacity: '0' },
        },
        floatCircle1: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '33%': { transform: 'translate(20px, -15px)' },
          '66%': { transform: 'translate(-10px, 10px)' },
        },
        floatCircle2: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '33%': { transform: 'translate(-15px, 20px)' },
          '66%': { transform: 'translate(10px, -10px)' },
        },
        floatCircle3: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '33%': { transform: 'translate(10px, 15px)' },
          '66%': { transform: 'translate(-20px, -5px)' },
        },
        compassPulse: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        shimmer: 'shimmer 1.5s infinite',
        float: 'float 3s ease-in-out infinite',
        rain: 'rain 1s linear infinite',
        snowfall: 'snowfall 2s ease-in infinite',
        lightning: 'lightning 3s infinite',
        foggypulse: 'foggypulse 4s ease-in-out infinite',
        'spin-slow': 'spinSlow 20s linear infinite',
        'bounce-scroll': 'bounceScroll 2s ease-in-out infinite',
        'pulse-ring': 'pulseRing 2s ease-out infinite',
        'float-1': 'floatCircle1 8s ease-in-out infinite',
        'float-2': 'floatCircle2 10s ease-in-out infinite',
        'float-3': 'floatCircle3 12s ease-in-out infinite',
        'compass-pulse': 'compassPulse 2s ease-in-out infinite',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
