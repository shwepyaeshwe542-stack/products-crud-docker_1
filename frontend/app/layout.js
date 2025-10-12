import './globals.css'

export const metadata = {
  title: 'Products Manager - ShopHub',
  description: 'Full CRUD Products Management System',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}