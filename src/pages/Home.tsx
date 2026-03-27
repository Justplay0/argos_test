import { ProductCard } from '../components/ProductCard';
import { mockProducts } from '../data/products';
import './Home.css';

export default function Index() {
  return (
    <div className="index-container">
      <div className="index-header">
        <h1 className="index-title">Latest Products</h1>
        <p className="index-subtitle">
          Discover our new arrivals and best sellers.
        </p>
      </div>

      <div className="index-grid">
        {mockProducts.map(product => (
          <ProductCard 
            key={product.id} 
            product={product} 
          />
        ))}
      </div>
    </div>
  );
}
