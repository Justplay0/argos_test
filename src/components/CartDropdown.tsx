import type { FC } from 'react';
import { useCart } from '../context/CartContext';
import './CartDropdown.css';

interface CartDropdownProps {
  onClose?: () => void;
}

export const CartDropdown: FC<CartDropdownProps> = ({ onClose }) => {
  const { cartItems, totalPrice, updateQuantity } = useCart();

  const handleContainerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="cart-dropdown" onClick={handleContainerClick}>
      <div className="cart-dropdown-header">
        <h3>Shopping Cart</h3>
      </div>

      <div className="cart-items-list">
        {cartItems.length === 0 ? (
          <div className="cart-empty-message">Your cart is empty</div>
        ) : (
          cartItems.map(item => (
            <div key={item.product.id} className="cart-item">
              <img
                src={item.product.image}
                alt={item.product.name}
                className="cart-item-image"
              />
              <div className="cart-item-info">
                <p className="cart-item-name">{item.product.name}</p>
                <p className="cart-item-price">
                  ${item.product.price.toFixed(2)}
                </p>
              </div>
              <div className="cart-item-controls">
                <button
                  className="control-btn"
                  onClick={() => updateQuantity(item.product.id, -1)}
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="item-quantity">{item.quantity}</span>
                <button
                  className="control-btn"
                  onClick={() => updateQuantity(item.product.id, 1)}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {cartItems.length > 0 && (
        <div className="cart-dropdown-footer">
          <div className="cart-summary">
            <span className="summary-label">Total Amount:</span>
            <span className="summary-value">${totalPrice.toFixed(2)}</span>
          </div>
          <button className="checkout-btn" onClick={onClose}>
            Checkout Now
          </button>
        </div>
      )}
    </div>
  );
};
