import { API_URL } from "./config";
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "./ProductDetailPage.css";

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [urun, setUrun] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState("description");
  const [zoomStyle, setZoomStyle] = useState({});

  useEffect(() => {
    fetch(`${API_URL}/products/${id}`)
      .then((r) => r.json())
      .then((data) => setUrun(data));
  }, [id]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch(`${API_URL}/favorites/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          if (Array.isArray(data)) {
            setIsFavorite(data.some((f) => f.product.id === Number(id)));
          }
        });
    }
  }, [id]);

  const sepeteEkle = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Sepete eklemek için giriş yapmalısın.");
      navigate("/login");
      return;
    }
    fetch(`${API_URL}/cart/items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ product_id: urun.id, quantity }),
    })
      .then((r) => r.json())
      .then(() => alert("Ürün sepete eklendi!"));
  };

  const toggleFavorite = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Favorilere eklemek için giriş yapmalısın.");
      navigate("/login");
      return;
    }
    if (isFavorite) {
      fetch(`${API_URL}/favorites/${urun.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }).then(() => setIsFavorite(false));
    } else {
      fetch(`${API_URL}/favorites/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ product_id: urun.id }),
      }).then(() => setIsFavorite(true));
    }
  };

  const shareUrl = window.location.href;
  const shareText = urun ? `${urun.name} - ${urun.price} TL` : "";

  const shareWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}`, "_blank");
  };
  const shareTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, "_blank");
  };
  const shareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, "_blank");
  };
  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    alert("Link kopyalandı!");
  };

  const decreaseQty = () => { if (quantity > 1) setQuantity(quantity - 1); };
  const increaseQty = () => { if (urun && quantity < urun.stock) setQuantity(quantity + 1); };

  const toggleAccordion = (key) => {
    setOpenAccordion(openAccordion === key ? null : key);
  };

  const isTouchDevice = typeof window !== "undefined" && window.matchMedia("(hover: none)").matches;

  const handleZoomMove = (e) => {
    if (isTouchDevice) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomStyle({ transformOrigin: `${x}% ${y}%`, transform: "scale(2.5)" });
  };

  const handleZoomLeave = () => {
    setZoomStyle({});
  };

  if (!urun) return <p className="loading">Yükleniyor...</p>;

  const categoryName = urun.category?.name || "Ürünler";

  return (
    <div className="page">
      {/* 1. Breadcrumb */}
      <nav className="breadcrumb">
        <Link to="/">Ana Sayfa</Link>
        <span className="breadcrumb-sep">/</span>
        <Link to={urun.category ? `/?category_id=${urun.category.id}` : "/"}>{categoryName}</Link>
        <span className="breadcrumb-sep">/</span>
        <span className="breadcrumb-current">{urun.name}</span>
      </nav>

      <div className="detail-layout">

        {/* Sol: Görsel Alanı */}
        <div className="detail-image-area">
          {urun.image_url ? (
            <div
              className="detail-zoom-container"
              onMouseMove={handleZoomMove}
              onMouseLeave={handleZoomLeave}
            >
              <img
                className="detail-main-img"
                src={urun.image_url}
                alt={urun.name}
                style={zoomStyle}
                draggable={false}
              />
            </div>
          ) : (
            <div className="detail-img-placeholder">Görsel yok</div>
          )}
          <div className="detail-img-actions">
            <button
              className={`detail-action-btn${isFavorite ? " active" : ""}`}
              onClick={toggleFavorite}
              title="Favorilere Ekle"
            >
              <svg viewBox="0 0 24 24" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
            <button
              className="detail-action-btn"
              onClick={() => setShareOpen(!shareOpen)}
              title="Paylaş"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                <polyline points="16 6 12 2 8 6" />
                <line x1="12" y1="2" x2="12" y2="15" />
              </svg>
            </button>
          </div>

          {/* 2. Thumbnail Galerisi (demo — tek görsel) */}
          <div className="detail-thumbnails">
            {[0, 1, 2, 3].map((i) => (
              <div className={`detail-thumb${i === 0 ? " active" : ""}`} key={i}>
                {urun.image_url ? (
                  <img src={urun.image_url} alt={`${urun.name} - ${i + 1}`} />
                ) : (
                  <div className="detail-thumb-placeholder" />
                )}
              </div>
            ))}
          </div>

          {shareOpen && (
            <>
              <div className="share-overlay" onClick={() => setShareOpen(false)} />
              <div className="share-modal">
                <button className="share-modal-close" onClick={() => setShareOpen(false)}>✕</button>
                <h2 className="share-modal-title">Sevdiklerinle Paylaş</h2>
                <p className="share-modal-desc">Bu ürünü sevdiklerinizle paylaşabilirsiniz.</p>
                <div className="share-modal-icons">
                  <button className="share-circle" onClick={shareFacebook} title="Facebook">
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  </button>
                  <button className="share-circle" onClick={shareTwitter} title="X">
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  </button>
                  <button className="share-circle" onClick={shareWhatsApp} title="WhatsApp">
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.019-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12.05 21.785h-.01a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.981.998-3.648-.235-.374A9.86 9.86 0 0 1 2.18 12.01C2.18 6.58 6.61 2.15 12.05 2.15c2.634 0 5.11 1.027 6.972 2.893a9.82 9.82 0 0 1 2.888 6.987c-.003 5.43-4.434 9.845-9.86 9.845v-.09zM20.52 3.449C18.247 1.226 15.237 0 12.05 0 5.463 0 .104 5.334.1 11.892c-.001 2.096.547 4.142 1.588 5.945L0 24l6.305-1.654a11.88 11.88 0 0 0 5.683 1.448h.005c6.585 0 11.946-5.336 11.949-11.896a11.83 11.83 0 0 0-3.48-8.449z"/></svg>
                  </button>
                </div>
                <div className="share-modal-link" onClick={copyLink}>
                  <span className="share-modal-url">{shareUrl}</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Sağ: Ürün Bilgileri */}
        <div className="detail-info">
          <h1 className="detail-name">{urun.name}</h1>

          {/* 3. Yıldız Rating (statik placeholder) */}
          <div className="detail-rating">
            <div className="detail-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg key={star} viewBox="0 0 24 24" fill={star <= 4 ? "#f59e0b" : "none"} stroke="#f59e0b" strokeWidth="1.5">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              ))}
            </div>
            <span className="detail-rating-text">Henüz değerlendirme yok</span>
          </div>

          <p className="detail-price">
            {Number(urun.price).toLocaleString("tr-TR", { minimumFractionDigits: 2 })} TL
          </p>

          <div className="detail-cart-row">
            <div className="detail-qty">
              <button className="detail-qty-btn" onClick={decreaseQty} disabled={quantity <= 1}>−</button>
              <span className="detail-qty-value">{quantity}</span>
              <button className="detail-qty-btn" onClick={increaseQty} disabled={quantity >= urun.stock}>+</button>
            </div>
            <button className="detail-add-btn" onClick={sepeteEkle}>Sepete Ekle</button>
          </div>

          {urun.stock > 0 ? (
            <p className="detail-stock in-stock">Stokta mevcut</p>
          ) : (
            <p className="detail-stock out-of-stock">Stokta yok</p>
          )}

          {/* 4. Kargo / İade / Garanti Rozetleri (statik) */}
          <div className="detail-badges">
            <div className="detail-badge">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="3" width="15" height="13" rx="2" />
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
              <span>Ücretsiz Kargo</span>
            </div>
            <div className="detail-badge">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="1 4 1 10 7 10" />
                <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
              </svg>
              <span>Kolay İade</span>
            </div>
            <div className="detail-badge">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <span>Garanti</span>
            </div>
          </div>

          {/* 5. Accordion — sağ sütun içinde */}
          <div className="detail-accordions">
            <div className={`detail-accordion${openAccordion === "description" ? " open" : ""}`}>
              <button className="detail-accordion-header" onClick={() => toggleAccordion("description")}>
                <svg className="accordion-icon-left" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
                <span>Ürün Detayı</span>
                <span className="accordion-toggle">{openAccordion === "description" ? "−" : "+"}</span>
              </button>
              <div className="detail-accordion-body">
                <p>{urun.description || "Bu ürün için henüz açıklama eklenmemiştir."}</p>
                <table className="detail-specs-table">
                  <tbody>
                    {urun.category && <tr><td>Kategori</td><td>{urun.category.name}</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>

            <div className={`detail-accordion${openAccordion === "care" ? " open" : ""}`}>
              <button className="detail-accordion-header" onClick={() => toggleAccordion("care")}>
                <svg className="accordion-icon-left" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="1" width="22" height="18" rx="3"/><circle cx="12" cy="10" r="4"/><path d="M12 14v2"/><path d="M5 19v2"/><path d="M19 19v2"/></svg>
                <span>Bakım</span>
                <span className="accordion-toggle">{openAccordion === "care" ? "−" : "+"}</span>
              </button>
              <div className="detail-accordion-body">
                <p>Ürünü kuru bir bezle silin. Direkt güneş ışığından ve nemden uzak tutun. Orijinal ambalajında saklayın.</p>
              </div>
            </div>

            <div className={`detail-accordion${openAccordion === "returns" ? " open" : ""}`}>
              <button className="detail-accordion-header" onClick={() => toggleAccordion("returns")}>
                <svg className="accordion-icon-left" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
                <span>İade ve Değişim</span>
                <span className="accordion-toggle">{openAccordion === "returns" ? "−" : "+"}</span>
              </button>
              <div className="detail-accordion-body">
                <p>Ürünlerimizi teslim aldığınız tarihten itibaren 14 gün içinde, kullanılmamış ve orijinal ambalajında olmak koşuluyla ücretsiz iade edebilirsiniz.</p>
              </div>
            </div>

            <div className={`detail-accordion${openAccordion === "installment" ? " open" : ""}`}>
              <button className="detail-accordion-header" onClick={() => toggleAccordion("installment")}>
                <svg className="accordion-icon-left" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                <span>Taksit Seçenekleri</span>
                <span className="accordion-toggle">{openAccordion === "installment" ? "−" : "+"}</span>
              </button>
              <div className="detail-accordion-body">
                <table className="detail-specs-table">
                  <tbody>
                    <tr><td>Tek Çekim</td><td>{Number(urun.price).toLocaleString("tr-TR", { minimumFractionDigits: 2 })} TL</td></tr>
                    <tr><td>3 Taksit</td><td>{(urun.price / 3).toLocaleString("tr-TR", { minimumFractionDigits: 2 })} TL x 3</td></tr>
                    <tr><td>6 Taksit</td><td>{(urun.price / 6).toLocaleString("tr-TR", { minimumFractionDigits: 2 })} TL x 6</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className={`detail-accordion${openAccordion === "reviews" ? " open" : ""}`}>
              <button className="detail-accordion-header" onClick={() => toggleAccordion("reviews")}>
                <svg className="accordion-icon-left" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                <span>Yorumlar</span>
                <span className="accordion-toggle">{openAccordion === "reviews" ? "−" : "+"}</span>
              </button>
              <div className="detail-accordion-body">
                <p>Bu ürün için henüz yorum yapılmamıştır.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;
