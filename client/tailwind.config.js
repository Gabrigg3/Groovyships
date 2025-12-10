module.exports = {
    darkMode: ["class"],
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                border: "hsl(0, 0%, 87%)",
                input: "hsl(0, 0%, 87%)",
                ring: "hsl(280, 70%, 55%)",
                background: "hsl(0, 0%, 100%)",
                foreground: "hsl(210, 15%, 20%)",
                primary: {
                    DEFAULT: "hsl(280, 70%, 55%)",
                    foreground: "hsl(0, 0%, 100%)",
                },
                secondary: {
                    DEFAULT: "hsl(320, 65%, 60%)",
                    foreground: "hsl(0, 0%, 100%)",
                },
                tertiary: {
                    DEFAULT: "hsl(180, 70%, 50%)",
                    foreground: "hsl(0, 0%, 100%)",
                },
                friendship: {
                    DEFAULT: "hsl(45, 90%, 55%)",
                    foreground: "hsl(0, 0%, 8%)",
                },
                neutral: {
                    DEFAULT: "hsl(0, 0%, 98%)",
                    foreground: "hsl(210, 15%, 20%)",
                },
                success: {
                    DEFAULT: "hsl(148, 48%, 40%)",
                    foreground: "hsl(0, 0%, 100%)",
                },
                warning: {
                    DEFAULT: "hsl(36, 90%, 60%)",
                    foreground: "hsl(0, 0%, 8%)",
                },
                destructive: {
                    DEFAULT: "hsl(0, 84%, 60%)",
                    foreground: "hsl(0, 0%, 100%)",
                },
                muted: {
                    DEFAULT: "hsl(0, 0%, 93%)",
                    foreground: "hsl(0, 0%, 38%)",
                },
                accent: {
                    DEFAULT: "hsl(0, 0%, 93%)",
                    foreground: "hsl(210, 15%, 20%)",
                },
                popover: {
                    DEFAULT: "hsl(0, 0%, 100%)",
                    foreground: "hsl(210, 15%, 20%)",
                },
                card: {
                    DEFAULT: "hsl(0, 0%, 100%)",
                    foreground: "hsl(210, 15%, 20%)",
                },
                gray: {
                    50: "hsl(0, 0%, 98%)",
                    100: "hsl(0, 0%, 93%)",
                    200: "hsl(0, 0%, 87%)",
                    300: "hsl(0, 0%, 80%)",
                    400: "hsl(0, 0%, 65%)",
                    500: "hsl(0, 0%, 50%)",
                    600: "hsl(0, 0%, 38%)",
                    700: "hsl(0, 0%, 26%)",
                    800: "hsl(0, 0%, 16%)",
                    900: "hsl(0, 0%, 8%)",
                },
            },
            borderRadius: {
                lg: "16px",
                md: "12px",
                sm: "8px",
            },
            fontFamily: {
                sans: ["Poppins", "sans-serif"],
                body: ['"Nunito Sans"', "sans-serif"],
            },
            spacing: {
                '4': '1rem',
                '8': '2rem',
                '12': '3rem',
                '16': '4rem',
                '24': '6rem',
                '32': '8rem',
                '48': '12rem',
                '64': '16rem',
            },
            backgroundImage: {
                'gradient-1': 'linear-gradient(135deg, hsl(280, 70%, 55%), hsl(320, 65%, 60%))',
                'gradient-2': 'linear-gradient(135deg, hsl(180, 70%, 50%), hsl(280, 70%, 55%))',
                'gradient-friendship': 'linear-gradient(135deg, hsl(45, 90%, 55%), hsl(30, 85%, 60%))',
                'gradient-both': 'linear-gradient(135deg, hsl(280, 70%, 55%), hsl(45, 90%, 55%))',
                'button-border-gradient': 'linear-gradient(90deg, hsl(280, 70%, 55%), hsl(180, 70%, 50%))',
            },
            ringColor: {
                'gradient-both': 'linear-gradient(135deg, hsl(280, 70%, 55%), hsl(45, 90%, 55%))',
            },
        },
    },
    plugins: [],
}
