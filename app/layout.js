import './globals.css';

export const metadata = {
  title: 'Burst Interactive Test',
  description: 'Prototype for an interactive film microsite with timed hotspots and return-to-main-video behavior.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
