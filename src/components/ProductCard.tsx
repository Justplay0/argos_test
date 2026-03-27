import { useNavigate } from 'react-router-dom';
import type { FC } from 'react';
import { useCart } from '../context/CartContext';
import type { Product } from '../data/products';
import { ActionButton } from './ActionButton';
import { TagBadge } from './TagBadge';
import './ProductCard.css';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // 阻止冒泡到卡片点击
    addToCart(product);
  };

  return (
    <div
      className="product-card"
      onClick={handleCardClick}
      data-testid={`product-card-${product.id}`}
    >
      <img
        src={product.image}
        alt={product.name}
        className="product-card-image"
      />
      <div className="product-card-content">
        <div className="product-card-tags">
          {product.tags.map(tag => (
            <TagBadge
              key={tag}
              label={tag}
              variant={tag === 'Sale' ? 'danger' : 'default'}
            />
          ))}
          {!product.inStock && (
            <TagBadge label="Out of Stock" variant="danger" />
          )}
        </div>
        <h3 className="product-card-title" title={product.name}>
          {product.name}
        </h3>
        <p className="product-card-price">${product.price.toFixed(2)}</p>
        <div className="product-card-footer">
          <ActionButton
            label={product.inStock ? 'Add to Cart' : 'Notify Me'}
            onClick={handleAddToCart}
            disabled={!product.inStock}
          />
        </div>
      </div>
    </div>
  );
};
