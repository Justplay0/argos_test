import { ProductCard } from '../components/ProductCard';
import { mockProducts } from '../data/products';
import './Home.css';

export default function Index() {
  return (
    <div className="index-container">
      <div className="index-header">
        <h1 className="index-title" style={{ color: '#ff4d4f' }}>🔥 超级新品首发 (2024) 🔥</h1>
        <p className="index-subtitle" style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
          探索我们最新的爆款商品，全场包邮！
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
