import { Link, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { CartDropdown } from '../components/CartDropdown';
import { CartProvider, useCart } from '../context/CartContext';
import '../index.css';

const Header = () => {
  const { cartCount } = useCart();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDropdownOpen(prev => !prev);
  };

  useEffect(() => {
    const closeDropdown = () => setIsDropdownOpen(false);
    if (isDropdownOpen) {
      window.addEventListener('click', closeDropdown);
    }
    return () => window.removeEventListener('click', closeDropdown);
  }, [isDropdownOpen]);

  return (
    <header className="header">
      <Link to="/" className="header-logo" data-testid="nav-home">
        GadgetStore
      </Link>
      <div style={{ position: 'relative' }}>
        <div
          className="cart-badge"
          onClick={toggleDropdown}
          data-testid="cart-badge"
        >
          <span>🛒 Cart</span>
          <span className="cart-count" data-testid="cart-count">
            {cartCount}
          </span>
        </div>
        {isDropdownOpen && (
          <CartDropdown onClose={() => setIsDropdownOpen(false)} />
        )}
      </div>
    </header>
  );
};

export default function MainLayout() {
  return (
    <CartProvider>
      <div className="layout-container">
        <Header />
        <main className="layout-main">
          <Outlet />
        </main>
      </div>
    </CartProvider>
  );
}
