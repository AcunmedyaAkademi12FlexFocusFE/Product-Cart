import { useEffect, useState } from 'react'
import './App.css'

export default function App() {

  const defaulLimit = 30;
  const [limit, setLimit] = useState(defaulLimit);
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState([]);

  useEffect(() => {
    async function getProdutcs() {
      const data = await fetch(`https://dummyjson.com/products?limit=${limit}`).then(r => r.json());
      setProducts(data.products);
      setTotal(data.total);
      setLoading(false);
    }
    getProdutcs();
  }, [limit]);

  function handleClick() {
    setLimit(limit + defaulLimit);
  }

  const filteredProducts = products.filter(x => x.title.toLowerCase().includes(search.toLowerCase()));

  function addToCart(product) {

    const productInCart = cart.find(item => item.id === product.id);
    if(productInCart) {
      // eğer sepette ürün varsa miktarını arttır
      const updatedCart = cart.map(item => item.id === product.id ? 
        {...item, quantity: (item.quantity || 1) + 1} : item
      );
      setCart(updatedCart);
    } else {
      // eğer sepette ürün yoksa sepete ekle
      setCart([...cart, { ...product, quantity: 1 }]);
    }

    // setCart([...cart, product]);
    // burası products dizi ile alakalı değil. Burada fonksiyon çalıştığında ilgili ürünü
    // parametre olarak gönderiyoruz. Aslında ismin bir önemli yok. Biz buraya
    // "herhangibirurunadi" gibi bir adlandırma ya da örneğin "urun-onemsizad" gibi bir şey yazabiliriz
    // sadece gönderdiğimiz ürünü simgeleyen bir ad yazmış olduk.


    // Stok azaltma
    const updatedProducts = products.map(x => 
      x.id === product.id ? {...x, stock: x.stock -1 } : x
    )
    setProducts(updatedProducts);
  }

  function clearCart() {

    const updatedProducts = products.map(product => {
      const cartItem = cart.find(item => item.id === product.id);
      if(cartItem) {
        // ürünün stoğunu geri yükle - ilgili miktar kadar arttır
        return { ...product, stock: product.stock + cartItem.quantity};
      }
      return product; // sepette olmayan ürünleri aynen bırak bro
    });

    // ürün listesini güncelle 
    setProducts(updatedProducts);
    // sepeti sıfırla
    setCart([]);
  }

  return (
    <>
      <div className="search-container">
        <input
          type="text"
          placeholder='Ürün ara...'
          className='search-input'
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      {isLoading && <p>Yükleniyor ...</p>}
      <div className='products'>
        {filteredProducts.map(x =>
          <div className="product-item" key={x.id}>
            <img src={x.thumbnail} alt={x.title} className='product-img' />
            <h2>{x.title}</h2>
            <strong>Açıklama:</strong> {x.description}
            <strong>Kategori:</strong> {x.category}
            <div className='product-info'>
              <strong>Stok: </strong>{x.stock}
              <strong>Fiyat: </strong>{x.price}₺
            </div>
            <button 
              className='add-to-cart-btn' 
              onClick={() => addToCart(x)}
              disabled={x.stock <= 0}
            >
              {x.stock <= 0 ? 'Stok Yok' : 'Sepete Ekle'}
            </button>
          </div>
        )}
      </div>
      {limit < total && <button className='loadmore-btn' onClick={handleClick}>Load More</button>}
      <div className="cart">
        <h2>Sepet</h2>
        {cart.length === 0 ? (
          <p>Sepetiniz boş.</p>
        ) : (
          <>
            <ul>
              {cart.map((x, i) => (
                <li key={i}>
                  {x.title} - {x.quantity} adet - {(x.price * x.quantity).toFixed(2)}₺
                </li>
              ))}
            </ul>
            <div className="cart-total">
              Toplam tutar: {cart.reduce((sum, x) => sum + x.price * (x.quantity || 1), 0).toFixed(2)}₺
            </div>
            <button className='clear-cart-btn' onClick={clearCart}>Sepeti Temizle</button>
          </>
        )}
      </div>
    </>
  )
}

// TODO
/*
Ürün sepete eklendikçe stok miktarı düşecek. Eğer stok kalmazsa kullanıcıya mesaj verilecek/çıkartılacak.
Aynı ürün sepete eklendiğinde alt alta yazmak yerine Örn: Juice x2 - 7.98₺ yazacak.
Sepet bölümü site içinde yukarı aşağı gittiğimizde bizi takip etsin ve sayfanın en altında dursun.(opsiyonel)
Sepetimiz localStorage'a kayıt olacak.
*/
