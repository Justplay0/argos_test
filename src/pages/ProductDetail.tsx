import { Link, useParams } from 'react-router-dom';
import { ActionButton } from '../components/ActionButton';
import { TagBadge } from '../components/TagBadge';
import { useCart } from '../context/CartContext';
import { getProductById } from '../data/products';
import './ProductDetail.css';

export default function ProductDetail() {
  const { id } = useParams();
  const product = getProductById(id || '');
  const { addToCart } = useCart();

  if (!product) {
    return (
      <div className="not-found-container">
        <h2>Product not found</h2>
        <Link to="/" className="not-found-link">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="detail-back-container">
        <Link to="/" className="detail-back-link">
          ← Back to Products
        </Link>
      </div>

      <div
        className="detail-container"
        data-testid={`detail-page-${product.id}`}
      >
        <img src={product.image} alt={product.name} className="detail-image" />

        <div className="detail-info">
          <div className="detail-tags">
            {product.tags.map(tag => (
              <TagBadge
                key={tag}
                label={tag}
                variant={tag === 'Sale' ? 'danger' : 'default'}
              />
            ))}
          </div>

          <h1 className="detail-title">{product.name}</h1>
          <p className="detail-price">${product.price.toFixed(2)}</p>

          <div className="detail-divider" />

          <p className="detail-description">{product.description}</p>

          <div className="detail-footer">
            <ActionButton
              label={product.inStock ? 'Add to Cart' : 'Out of Stock'}
              onClick={() => addToCart(product)}
              disabled={!product.inStock}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
