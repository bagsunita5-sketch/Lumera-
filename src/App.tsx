import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  Menu,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  X,
} from 'lucide-react'
import { CircularTestimonials } from '@/components/ui/circular-testimonials'
import { lumeraTestimonials } from '@/data/testimonials'

type Product = {
  id: number
  name: string
  category: string
  price: number
  description: string
  material: string
  dimensions: string
  availability: string
  image: string
  imageAlt: string
  gallery: { image: string; alt: string }[]
  details: string
  care: string
}

type CartLine = { productId: number; quantity: number }
type Panel = { kind: 'product'; product: Product } | { kind: 'checkout' } | { kind: 'info'; title: string; content: string } | null

const image = (photo: string, width = 1400) =>
  `https://images.unsplash.com/${photo}?auto=format&fit=crop&w=${width}&q=85`

const products: Product[] = [
  {
    id: 1,
    name: 'Computer Table',
    category: 'Workspace',
    price: 48500,
    description: 'A considered place to think, make and get lost in the work.',
    material: 'Solid American oak, brushed brass detail',
    dimensions: 'W 120 × D 60 × H 75 cm',
    availability: 'In stock · Dispatches in 3–5 days',
    image: image('photo-1683582448281-fb82b0fd803b'),
    imageAlt: 'Warm wood computer table with a monitor in a bright home office',
    gallery: [
      { image: image('photo-1683582448281-fb82b0fd803b', 1600), alt: 'Computer table in a calm, light-filled workspace' },
      { image: image('photo-1575318634028-6a0cfcb60c59', 1400), alt: 'Walnut desk and monitor in a quiet home workspace' },
    ],
    details: 'A generous work surface and a discreet cable channel keep the everyday essentials close, while the clean-lined silhouette gives the room room to breathe.',
    care: 'Dust with a soft, dry cloth. For a deeper clean, use a slightly damp cloth and dry immediately. Avoid prolonged direct sunlight and standing water.',
  },
  {
    id: 2,
    name: 'Dining Table',
    category: 'Dining',
    price: 118000,
    description: 'An inviting centre for long lunches and everything after.',
    material: 'Solid European oak, hand-finished oil',
    dimensions: 'W 180 × D 90 × H 75 cm',
    availability: 'In stock · Dispatches in 5–7 days',
    image: image('photo-1758977403826-01e2c8a3f68f'),
    imageAlt: 'Warm wooden dining table with upholstered chairs, shown in natural light',
    gallery: [
      { image: image('photo-1758977403826-01e2c8a3f68f', 1600), alt: 'Solid wood dining table with upholstered chairs' },
      { image: image('photo-1740759546556-ff8aaf35ecf9', 1400), alt: 'Dining table set for a meal in a warmly lit room' },
    ],
    details: 'Designed for gathering without ceremony. A softly eased edge, quietly tapered legs and a substantial oak top make this a piece to live around for years.',
    care: 'Wipe spills promptly with a soft cloth. Use coasters and placemats for hot or damp objects. Renew the oil finish as needed with a furniture-safe hardwax oil.',
  },
  {
    id: 3,
    name: 'Study Table',
    category: 'Workspace',
    price: 42500,
    description: 'A pared-back desk that makes space for a slower kind of focus.',
    material: 'White oak veneer, solid oak frame',
    dimensions: 'W 110 × D 55 × H 74 cm',
    availability: 'In stock · Dispatches in 3–5 days',
    image: image('photo-1759986452774-be47f7db2362'),
    imageAlt: 'Warm wood study desk and chair beside a softly lit window',
    gallery: [
      { image: image('photo-1759986452774-be47f7db2362', 1600), alt: 'Study table and writing chair in a quiet room' },
      { image: image('photo-1715007270258-740aa9900603', 1400), alt: 'A wood writing desk with generous work surface' },
    ],
    details: 'Thoughtful proportions make room for a notebook, a lamp and the day ahead. A shallow drawer keeps the small things close and the tabletop clear.',
    care: 'Wipe with a soft, dry cloth. Avoid abrasive cleaners and prolonged exposure to moisture. Use a desk mat when writing directly on the surface.',
  },
  {
    id: 4,
    name: 'Computer & Study Chair',
    category: 'Seating',
    price: 32500,
    description: 'Supportive, sculptural seating made for the hours that matter.',
    material: 'Solid beech, textural upholstered seat and back',
    dimensions: 'W 54 × D 55 × H 78 cm · Seat 46 cm',
    availability: 'In stock · Dispatches in 3–5 days',
    image: image('photo-1598300056393-4aac492f4344'),
    imageAlt: 'Sculptural upholstered chair with warm wood legs on a neutral backdrop',
    gallery: [
      { image: image('photo-1598300056393-4aac492f4344', 1600), alt: 'Computer and study chair with a softly curved profile' },
      { image: image('photo-1748975026839-e68da17878b3', 1400), alt: 'Light wooden chair with a clean, considered form' },
    ],
    details: 'A gently curved back and a considered seat angle bring comfort to a clean, architectural form. Made to move easily between the desk and the rest of the home.',
    care: 'Dust the frame regularly. Blot upholstery spills immediately with a clean, dry cloth. Avoid saturating the fabric or using chemical cleaners.',
  },
  {
    id: 5,
    name: 'Dining Chair',
    category: 'Dining',
    price: 21500,
    description: 'A graceful everyday chair, at ease around any table.',
    material: 'Solid light oak, clear matte finish',
    dimensions: 'W 48 × D 52 × H 79 cm · Seat 46 cm',
    availability: 'In stock · Dispatches in 3–5 days',
    image: image('photo-1748975026839-e68da17878b3'),
    imageAlt: 'A light oak dining chair with a quiet, timeless silhouette',
    gallery: [
      { image: image('photo-1748975026839-e68da17878b3', 1600), alt: 'Dining chair with a clean, refined silhouette' },
      { image: image('photo-1598300056393-4aac492f4344', 1400), alt: 'An upholstered chair with warm-toned wood legs' },
    ],
    details: 'The softly upholstered seat and curved back offer comfort without visual weight. Its quiet profile feels just as natural pulled up to a desk.',
    care: 'Dust with a soft cloth. Wipe spills promptly and dry the surface after cleaning. Avoid abrasive cleaners and prolonged direct sunlight.',
  },
]

const formatPrice = (amount: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount)

function Logo({ light = false, onClick }: { light?: boolean; onClick?: () => void }) {
  return (
    <a className={`wordmark${light ? ' wordmark--light' : ''}`} href="#home" aria-label="LUMÉRA home" onClick={onClick}>
      LUM<span className="wordmark-e">É</span>RA
    </a>
  )
}

function SectionHeading({ eyebrow, title, note, id }: { eyebrow: string; title: ReactNode; note?: string; id?: string }) {
  return (
    <div className="section-heading" data-reveal>
      <p className="eyebrow">{eyebrow}</p>
      <div className="section-heading__row">
        <h2 id={id}>{title}</h2>
        {note && <p className="section-heading__note">{note}</p>}
      </div>
    </div>
  )
}

function ProductCard({ product, onOpen }: { product: Product; onOpen: (product: Product) => void }) {
  return (
    <article className="product-card" data-reveal>
      <button className="product-card__image-wrap" type="button" onClick={() => onOpen(product)} aria-label={`View ${product.name}`}>
        <img src={product.image} alt={product.imageAlt} loading="lazy" />
        <span className="product-card__view">View piece <ArrowUpRight size={15} aria-hidden="true" /></span>
      </button>
      <div className="product-card__meta">
        <div>
          <p className="product-card__category">{product.category}</p>
          <h3><button type="button" onClick={() => onOpen(product)}>{product.name}</button></h3>
        </div>
        <span className="product-card__price">{formatPrice(product.price)}</span>
      </div>
      <button className="text-link product-card__link" type="button" onClick={() => onOpen(product)}>
        View product <ArrowUpRight size={14} aria-hidden="true" />
      </button>
    </article>
  )
}

function ProductGrid({ onOpen }: { onOpen: (product: Product) => void }) {
  return <div className="product-grid">{products.map((product) => <ProductCard key={product.id} product={product} onOpen={onOpen} />)}</div>
}

function QuantityStepper({ quantity, onChange, label = 'Quantity' }: { quantity: number; onChange: (quantity: number) => void; label?: string }) {
  return (
    <div className="quantity-stepper" aria-label={label}>
      <button type="button" aria-label="Decrease quantity" onClick={() => onChange(Math.max(1, quantity - 1))}><Minus size={14} /></button>
      <span aria-live="polite">{quantity}</span>
      <button type="button" aria-label="Increase quantity" onClick={() => onChange(Math.min(10, quantity + 1))}><Plus size={14} /></button>
    </div>
  )
}

function ImageGallery({ product }: { product: Product }) {
  const [active, setActive] = useState(0)
  const selected = product.gallery[active]
  return (
    <div className="gallery">
      <div className="gallery__main">
        <img src={selected.image} alt={selected.alt} />
        <span className="gallery__index">0{active + 1} <span>/</span> 0{product.gallery.length}</span>
      </div>
      <div className="gallery__thumbs" aria-label="Product images">
        {product.gallery.map((item, index) => (
          <button className={index === active ? 'is-active' : ''} key={item.image} type="button" onClick={() => setActive(index)} aria-label={`Show image ${index + 1}: ${item.alt}`} aria-pressed={index === active}>
            <img src={item.image} alt="" />
          </button>
        ))}
      </div>
    </div>
  )
}

function App() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const [heroVideoReady, setHeroVideoReady] = useState(false)
  const [heroVideoFailed, setHeroVideoFailed] = useState(false)
  const heroRef = useRef<HTMLElement>(null)
  const heroVideoRef = useRef<HTMLVideoElement>(null)
  const heroContentRef = useRef<HTMLDivElement>(null)
  const scrollCueRef = useRef<HTMLAnchorElement>(null)
  const [cart, setCart] = useState<CartLine[]>(() => {
    try {
      const saved = localStorage.getItem('lumera-cart-v1')
      return saved ? JSON.parse(saved) as CartLine[] : []
    } catch {
      return []
    }
  })
  const [cartOpen, setCartOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [panel, setPanel] = useState<Panel>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [compactNav, setCompactNav] = useState(false)
  const [orderPreviewed, setOrderPreviewed] = useState(false)

  useEffect(() => {
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updateMotionPreference = () => {
      setPrefersReducedMotion(motionPreference.matches)
      if (motionPreference.matches) setHeroVideoReady(false)
    }
    motionPreference.addEventListener('change', updateMotionPreference)
    return () => motionPreference.removeEventListener('change', updateMotionPreference)
  }, [])

  useEffect(() => {
    const section = heroRef.current
    const video = heroVideoRef.current
    if (!section || !video || prefersReducedMotion || heroVideoFailed) return

    let frameRequest = 0
    let latestTargetTime = 0
    let seekInFlight = false
    const frameStep = 1 / 30
    const seekToLatestFrame = () => {
      if (seekInFlight || !Number.isFinite(video.duration) || video.duration <= 0 || video.readyState < 1) return
      if (Math.abs(video.currentTime - latestTargetTime) < frameStep) return
      seekInFlight = true
      video.currentTime = latestTargetTime
    }
    const updateFrame = () => {
      frameRequest = 0
      const sectionTop = window.scrollY + section.getBoundingClientRect().top
      const scrollRange = Math.max(1, section.offsetHeight - window.innerHeight)
      const progress = Math.max(0, Math.min(1, (window.scrollY - sectionTop) / scrollRange))
      section.style.setProperty('--scrub-progress', String(progress))

      if (Number.isFinite(video.duration) && video.duration > 0 && video.readyState >= 1) {
        const lastFrame = Math.max(0, video.duration - frameStep)
        latestTargetTime = Math.min(progress * video.duration, lastFrame)
        seekToLatestFrame()
      }

      const copyOpacity = 1 - Math.min(1, progress / 0.2)
      if (heroContentRef.current) heroContentRef.current.style.opacity = String(copyOpacity)
      if (scrollCueRef.current) {
        scrollCueRef.current.style.opacity = String(copyOpacity)
        scrollCueRef.current.style.pointerEvents = copyOpacity > 0 ? 'auto' : 'none'
      }
    }
    const scheduleUpdate = () => {
      if (!frameRequest) frameRequest = window.requestAnimationFrame(updateFrame)
    }
    const handleSeeked = () => {
      seekInFlight = false
      seekToLatestFrame()
    }

    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate)
    video.addEventListener('loadedmetadata', scheduleUpdate)
    video.addEventListener('seeked', handleSeeked)
    scheduleUpdate()
    return () => {
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
      video.removeEventListener('loadedmetadata', scheduleUpdate)
      video.removeEventListener('seeked', handleSeeked)
      if (frameRequest) window.cancelAnimationFrame(frameRequest)
    }
  }, [prefersReducedMotion, heroVideoFailed])

  useEffect(() => {
    try {
      localStorage.setItem('lumera-cart-v1', JSON.stringify(cart))
    } catch {
      // The current session still works if browser storage is unavailable.
    }
  }, [cart])

  useEffect(() => {
    const handleScroll = () => setCompactNav(window.scrollY > 36)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.12 })
    document.querySelectorAll('[data-reveal]').forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [panel, cartOpen, searchOpen])

  useEffect(() => {
    if (!panel && !cartOpen && !searchOpen) return
    const previousFocus = document.activeElement as HTMLElement | null
    const dialog = document.querySelector<HTMLElement>('[role="dialog"]')
    if (!dialog) return
    const getFocusable = () => Array.from(dialog.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'))
      .filter((element) => element.offsetWidth || element.offsetHeight || element === document.activeElement)
    const initialFocus = dialog.querySelector<HTMLElement>('[autofocus], [data-autofocus]') ?? getFocusable()[0] ?? dialog
    initialFocus.focus()
    const keepFocusInside = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return
      const elements = getFocusable()
      if (elements.length === 0) return
      const first = elements[0]
      const last = elements[elements.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    dialog.addEventListener('keydown', keepFocusInside)
    return () => {
      dialog.removeEventListener('keydown', keepFocusInside)
      if (previousFocus?.isConnected) previousFocus.focus()
    }
  }, [panel, cartOpen, searchOpen])

  useEffect(() => {
    const isOpen = Boolean(panel || cartOpen || searchOpen || mobileMenuOpen)
    document.body.classList.toggle('has-open-overlay', isOpen)
    if (!isOpen) return
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setPanel(null)
        setCartOpen(false)
        setSearchOpen(false)
        setMobileMenuOpen(false)
      }
    }
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.body.classList.remove('has-open-overlay')
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [panel, cartOpen, searchOpen, mobileMenuOpen])

  const cartCount = cart.reduce((total, line) => total + line.quantity, 0)
  const subtotal = cart.reduce((total, line) => {
    const product = products.find((item) => item.id === line.productId)
    return total + (product?.price ?? 0) * line.quantity
  }, 0)
  const searchResults = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()
    if (!query) return products
    return products.filter((product) => `${product.name} ${product.category} ${product.description}`.toLowerCase().includes(query))
  }, [searchTerm])

  const addToCart = (product: Product, quantity = 1) => {
    setCart((current) => {
      const found = current.find((line) => line.productId === product.id)
      return found
        ? current.map((line) => line.productId === product.id ? { ...line, quantity: Math.min(10, line.quantity + quantity) } : line)
        : [...current, { productId: product.id, quantity }]
    })
  }

  const updateQuantity = (productId: number, quantity: number) => {
    setCart((current) => current.map((line) => line.productId === productId ? { ...line, quantity } : line))
  }

  const removeFromCart = (productId: number) => setCart((current) => current.filter((line) => line.productId !== productId))
  const openProduct = (product: Product) => setPanel({ kind: 'product', product })
  const quickBuy = (product: Product, quantity: number) => {
    addToCart(product, quantity)
    setPanel({ kind: 'checkout' })
    setOrderPreviewed(false)
  }
  const closePanels = () => {
    setPanel(null)
    setCartOpen(false)
    setSearchOpen(false)
  }

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <header className={`site-header${compactNav ? ' site-header--compact' : ' site-header--top'}`}>
        <Logo onClick={() => setMobileMenuOpen(false)} />
        <nav className="desktop-nav" aria-label="Main navigation">
          <a href="#home">Home</a><a href="#collection">Collection</a><a href="#about">About</a><a href="#contact">Contact</a>
        </nav>
        <div className="header-actions">
          <button className="icon-button search-trigger" type="button" aria-label="Search collection" onClick={() => { setSearchOpen(true); setSearchTerm('') }}><Search size={18} strokeWidth={1.5} /></button>
          <button className="icon-button cart-trigger" type="button" aria-label={`Open shopping bag${cartCount ? `, ${cartCount} items` : ''}`} onClick={() => setCartOpen(true)}>
            <ShoppingBag size={19} strokeWidth={1.5} /><span className="cart-count">{cartCount}</span>
          </button>
          <button className="icon-button mobile-menu-trigger" type="button" aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'} aria-expanded={mobileMenuOpen} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>{mobileMenuOpen ? <X size={21} /> : <Menu size={21} />}</button>
        </div>
        {mobileMenuOpen && <nav className="mobile-nav" aria-label="Mobile navigation">
          <a onClick={() => setMobileMenuOpen(false)} href="#home">Home <ArrowUpRight size={16} /></a>
          <a onClick={() => setMobileMenuOpen(false)} href="#collection">Collection <ArrowUpRight size={16} /></a>
          <a onClick={() => setMobileMenuOpen(false)} href="#about">About <ArrowUpRight size={16} /></a>
          <a onClick={() => setMobileMenuOpen(false)} href="#contact">Contact <ArrowUpRight size={16} /></a>
        </nav>}
      </header>

      <main id="main">
        <section className={`hero${prefersReducedMotion ? ' hero--static' : ''}`} id="home" aria-labelledby="hero-title" ref={heroRef}>
          <div className="hero__stage">
          {!prefersReducedMotion && !heroVideoFailed && <video
            ref={heroVideoRef}
            className={`hero__video${heroVideoReady ? ' is-ready' : ''}`}
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
            tabIndex={-1}
            onLoadedData={() => setHeroVideoReady(true)}
            onError={() => { setHeroVideoFailed(true); setHeroVideoReady(false) }}
          >
            <source src="/lumera-hero.mp4" type="video/mp4" />
          </video>}
          <div className="hero__veil" />
          <div className="hero__copy-glow" aria-hidden="true" />
          <div className="hero__content" ref={heroContentRef}>
            <p className="eyebrow hero__eyebrow">A quieter kind of home</p>
            <h1 id="hero-title">Designed for<br />the Way You Live<span>.</span></h1>
            <p className="hero__subline">Timeless furniture for modern spaces.</p>
            <div className="hero__actions">
              <a className="button button--light" href="#collection">Explore Collection <ArrowRight size={16} /></a>
              <a className="hero__story-link" href="#about">View Our Story <ArrowUpRight size={15} /></a>
            </div>
          </div>
          <a href="#collection" className="scroll-cue" aria-label="Scroll to collection" ref={scrollCueRef}><span>Scroll</span><i aria-hidden="true" /></a>
          </div>
        </section>

        <div className="quiet-note" aria-label="Our approach">
          <span>Made with intention</span><i /><span>Thoughtful by nature</span><i /><span>At home for years</span>
        </div>

        <section className="collection section-shell" id="collection" aria-labelledby="collection-title">
          <div className="collection__intro">
          <SectionHeading id="collection-title" eyebrow="The LUMÉRA collection · 01—05" title={<>Familiar forms.<br /><em>Considered anew.</em></>} note="Pieces for the everyday moments that make a home feel like yours. Made to be lived with, and lived around." />
          </div>
          <ProductGrid onOpen={openProduct} />
        </section>

        <section className="about section-shell" id="about" aria-labelledby="about-title">
          <div className="about__image-frame" data-reveal>
            <img src={image('photo-1600607687920-4e2a09cf159d', 1600)} alt="Soft daylight across a warm, minimal living and dining space" loading="lazy" />
          </div>
          <div className="about__copy" data-reveal>
            <p className="eyebrow">The house of LUMÉRA</p>
            <h2 id="about-title">Furniture with<br />a <em>sense of place.</em></h2>
            <p className="about__body">We believe the best things in a home are the ones that simply belong. LUMÉRA brings together timeless design, honest materials and everyday function to make pieces that feel right from the very first day.</p>
            <p className="about__body">Made with care. Chosen to stay.</p>
            <a href="#testimonials" className="text-link">What our customers say <ArrowRight size={15} /></a>
            <div className="about__monogram" aria-hidden="true">L<span>M</span></div>
          </div>
        </section>

        <section className="testimonial-section" id="testimonials" aria-labelledby="testimonial-title">
          <div className="testimonial-section__inner section-shell">
            <div className="testimonial-section__intro" data-reveal>
              <p className="eyebrow">Illustrative customer notes</p>
              <h2 id="testimonial-title">Pieces that become<br /><em>part of the story.</em></h2>
            </div>
            <div className="testimonial-section__carousel" data-reveal>
              <CircularTestimonials
                testimonials={lumeraTestimonials}
                autoplay
                colors={{
                  name: '#f5f2ec',
                  designation: '#c6a76a',
                  testimony: '#e9e5dd',
                  arrowBackground: '#171715',
                  arrowForeground: '#f5f2ec',
                  arrowHoverBackground: '#c6a76a',
                }}
                fontSizes={{ name: '1.35rem', designation: '.65rem', quote: 'clamp(1.2rem, 2vw, 1.65rem)' }}
              />
            </div>
          </div>
        </section>

        <section className="closing section-shell" aria-labelledby="closing-title">
          <div className="closing__rule" data-reveal><span /></div>
          <p className="eyebrow" data-reveal>A little more room to be</p>
          <h2 id="closing-title" data-reveal>Let home feel<br /><em>like you.</em></h2>
          <a className="button button--dark" href="#collection" data-reveal>Find your piece <ArrowRight size={16} /></a>
          <p className="closing__aside" data-reveal>Designed for the Way You Live.</p>
        </section>
      </main>

      <footer className="site-footer" id="contact">
        <div className="site-footer__top">
          <div className="site-footer__brand"><Logo /><p>Designed for the Way You Live.</p><span>Furniture for a life well lived.</span></div>
          <div className="site-footer__column"><p className="footer-label">Explore</p><a href="#home">Home</a><a href="#collection">Collection</a><a href="#about">About</a><a href="#contact">Contact</a></div>
          <div className="site-footer__column"><p className="footer-label">The details</p>
            <button onClick={() => setPanel({ kind: 'info', title: 'Shipping & delivery', content: 'We take care to bring each piece to your door. In-stock pieces are prepared within 3–7 business days. Our delivery partner will contact you to arrange a convenient delivery window. Shipping details are confirmed before checkout in this demo.' })}>Shipping</button>
            <button onClick={() => setPanel({ kind: 'info', title: 'Returns', content: 'If a piece is not quite right, contact our studio within 14 days of delivery. Items should be unused and in their original packaging. Made-to-order pieces are not eligible for return. This demo does not process real purchases.' })}>Returns</button>
            <button onClick={() => setPanel({ kind: 'info', title: 'Care guide', content: 'Keep furniture away from prolonged direct sunlight and heat. Dust wood with a soft, dry cloth and wipe spills promptly. For upholstery, blot gently and follow the care notes on each product page.' })}>Care Guide</button>
          </div>
          <div className="site-footer__column"><p className="footer-label">Follow along</p><a href="https://www.instagram.com/" target="_blank" rel="noreferrer">Instagram <ArrowUpRight size={13} /></a><a href="https://www.pinterest.com/" target="_blank" rel="noreferrer">Pinterest <ArrowUpRight size={13} /></a><p className="footer-contact">A question about a piece?<br /><a href="mailto:studio@lumera.example">Write to the studio <ArrowUpRight size={13} /></a></p></div>
        </div>
        <div className="site-footer__bottom"><span>© {new Date().getFullYear()} LUMÉRA. All rights reserved.</span><span>Prices, images, specifications, and contact details are illustrative. Checkout is a demo.</span><a href="#home">Back to top ↑</a></div>
      </footer>

      {cartOpen && <>
        <button className="overlay-scrim" aria-label="Close shopping bag" onClick={() => setCartOpen(false)} />
        <aside className="cart-drawer" role="dialog" aria-modal="true" aria-labelledby="cart-title">
          <div className="drawer-header"><div><p className="eyebrow">A place for good things</p><h2 id="cart-title">Your bag <span>({cartCount})</span></h2></div><button className="icon-button" aria-label="Close shopping bag" onClick={() => setCartOpen(false)}><X size={20} /></button></div>
          {cart.length === 0 ? <div className="cart-empty"><span className="cart-empty__mark"><ShoppingBag size={24} strokeWidth={1.2} /></span><h3>A little room for something lovely.</h3><p>Your bag is waiting for a piece to call its own.</p><button className="button button--dark" onClick={() => { setCartOpen(false); document.querySelector('#collection')?.scrollIntoView({ behavior: 'smooth' }) }}>Explore the collection <ArrowRight size={15} /></button></div> : <>
            <div className="cart-list">{cart.map((line) => {
              const product = products.find((item) => item.id === line.productId)
              if (!product) return null
              return <div className="cart-item" key={line.productId}>
                <button className="cart-item__image" onClick={() => { setCartOpen(false); openProduct(product) }} aria-label={`View ${product.name}`}><img src={product.image} alt="" /></button>
                <div className="cart-item__details"><div className="cart-item__title"><div><p>{product.category}</p><h3>{product.name}</h3></div><strong>{formatPrice(product.price * line.quantity)}</strong></div>
                  <div className="cart-item__controls"><QuantityStepper quantity={line.quantity} onChange={(quantity) => updateQuantity(product.id, quantity)} label={`Quantity of ${product.name}`} /><button className="remove-link" onClick={() => removeFromCart(product.id)}>Remove</button></div>
                </div>
              </div>
            })}</div>
            <div className="cart-bottom"><div className="subtotal-row"><span>Subtotal</span><strong>{formatPrice(subtotal)}</strong></div><p>Delivery is complimentary on every order.</p><div className="subtotal-row cart-total-row"><span>Total</span><strong>{formatPrice(subtotal)}</strong></div><button className="button button--dark button--full" onClick={() => { setCartOpen(false); setPanel({ kind: 'checkout' }); setOrderPreviewed(false) }}>Proceed to checkout <ArrowRight size={16} /></button><button className="continue-link" onClick={() => { setCartOpen(false); document.querySelector('#collection')?.scrollIntoView({ behavior: 'smooth' }) }}><ArrowLeft size={14} /> Continue shopping</button></div>
          </>}
        </aside>
      </>}

      {searchOpen && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSearchOpen(false) }}>
        <section className="search-panel" role="dialog" aria-modal="true" aria-labelledby="search-title">
          <div className="search-panel__top"><p className="eyebrow" id="search-title">Find your piece</p><button className="icon-button" aria-label="Close search" onClick={() => setSearchOpen(false)}><X size={20} /></button></div>
          <label className="search-input"><Search size={19} strokeWidth={1.4} /><input autoFocus data-autofocus value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="What are you looking for?" /><kbd>ESC</kbd></label>
          <p className="search-panel__count">{searchTerm ? `${searchResults.length} result${searchResults.length === 1 ? '' : 's'}` : 'The collection'}</p>
          <div className="search-results">{searchResults.map((product) => <button key={product.id} onClick={() => { setSearchOpen(false); openProduct(product) }}><img src={product.image} alt="" /><span><small>{product.category}</small><strong>{product.name}</strong></span><span className="search-result__price">{formatPrice(product.price)}</span><ArrowUpRight size={15} /></button>)}
            {searchResults.length === 0 && <p className="search-empty">No pieces found. Try another search.</p>}
          </div>
        </section>
      </div>}

      {panel && <div className="modal-backdrop panel-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closePanels() }}>
        <section className={`content-panel content-panel--${panel.kind}`} role="dialog" aria-modal="true" aria-label={panel.kind === 'product' ? panel.product.name : panel.kind === 'checkout' ? 'Checkout' : panel.title}>
          <button className="panel-close icon-button" aria-label="Close panel" onClick={() => setPanel(null)}><X size={20} /></button>
          {panel.kind === 'product' && <ProductDetail key={panel.product.id} product={panel.product} onAdd={(product, quantity) => { addToCart(product, quantity); setPanel(null); setCartOpen(true) }} onBuy={quickBuy} />}
          {panel.kind === 'checkout' && <Checkout cart={cart} subtotal={subtotal} orderPreviewed={orderPreviewed} onSubmit={() => setOrderPreviewed(true)} onContinue={() => { setPanel(null); document.querySelector('#collection')?.scrollIntoView({ behavior: 'smooth' }) }} />}
          {panel.kind === 'info' && <div className="info-panel"><p className="eyebrow">LUMÉRA · The details</p><h2>{panel.title}</h2><p>{panel.content}</p><button className="button button--dark" onClick={() => setPanel(null)}>Understood <Check size={15} /></button></div>}
        </section>
      </div>}
    </>
  )
}

function ProductDetail({ product, onAdd, onBuy }: { product: Product; onAdd: (product: Product, quantity: number) => void; onBuy: (product: Product, quantity: number) => void }) {
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState<'details' | 'specifications' | 'delivery' | 'care'>('details')
  return (
    <div className="product-detail">
      <div className="product-detail__back"><span><button className="text-link" onClick={() => document.querySelector('#collection')?.scrollIntoView({ behavior: 'smooth' })}><ArrowLeft size={14} /> Collection</button></span><span>{product.category} <i>·</i> 0{product.id} / 05</span></div>
      <div className="product-detail__main">
        <ImageGallery product={product} />
        <div className="product-detail__info">
          <p className="eyebrow">{product.category} · LUMÉRA collection</p>
          <h1>{product.name}</h1>
          <p className="product-detail__price">{formatPrice(product.price)}</p>
          <p className="product-detail__desc">{product.description}</p>
          <div className="product-detail__availability"><span className="availability-dot" />{product.availability}</div>
          <div className="product-detail__quick-specs"><div><span>Material</span><p>{product.material}</p></div><div><span>Dimensions</span><p>{product.dimensions}</p></div></div>
          <div className="product-detail__buy-row"><QuantityStepper quantity={quantity} onChange={setQuantity} /><span className="product-detail__qty-label">Qty</span></div>
          <div className="product-detail__buttons"><button className="button button--dark button--full" onClick={() => onAdd(product, quantity)}>Add to Cart <ShoppingBag size={16} /></button><button className="button button--outline button--full" onClick={() => onBuy(product, quantity)}>Buy Now <ArrowRight size={16} /></button></div>
          <p className="product-detail__note">Complimentary delivery on every order.</p>
        </div>
      </div>
      <div className="product-information">
        <div className="product-information__tabs" aria-label="Product information sections">
          {(['details', 'specifications', 'delivery', 'care'] as const).map((tab) => <button type="button" aria-pressed={activeTab === tab} className={activeTab === tab ? 'is-active' : ''} key={tab} onClick={() => setActiveTab(tab)}>{tab}</button>)}
        </div>
        <div className="product-information__body">
          {activeTab === 'details' && <p>{product.details}</p>}
          {activeTab === 'specifications' && <dl><div><dt>Materials</dt><dd>{product.material}</dd></div><div><dt>Dimensions</dt><dd>{product.dimensions}</dd></div><div><dt>Availability</dt><dd>{product.availability}</dd></div></dl>}
          {activeTab === 'delivery' && <p>Carefully packed for safe delivery to your door. In-stock pieces dispatch within the timeframe shown above. Our delivery team will contact you to arrange a suitable day.</p>}
          {activeTab === 'care' && <p>{product.care}</p>}
        </div>
      </div>
    </div>
  )
}

function Checkout({ cart, subtotal, orderPreviewed, onSubmit, onContinue }: { cart: CartLine[]; subtotal: number; orderPreviewed: boolean; onSubmit: () => void; onContinue: () => void }) {
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSubmit()
  }
  return (
    <div className="checkout">
      <div className="checkout__heading"><p className="eyebrow">The final details</p><h1>{orderPreviewed ? 'A lovely choice.' : 'Checkout'}</h1><p>{orderPreviewed ? 'Your order preview is ready.' : 'A few details, and your pieces are on their way.'}</p></div>
      {orderPreviewed ? <div className="order-confirmation"><span><Check size={23} /></span><h2>Your order preview is complete.</h2><p>This is a storefront demo. No payment was processed and no order was sent. Your bag is saved on this device.</p><button className="button button--dark" onClick={onContinue}>Continue browsing <ArrowRight size={15} /></button></div> : <div className="checkout__layout">
        <form className="checkout-form" onSubmit={submit}>
          <fieldset><legend><span>01</span> Contact</legend><label>Email address<input type="email" name="email" autoComplete="email" required placeholder="you@example.com" /></label><label>Phone number<input type="tel" name="phone" autoComplete="tel" required placeholder="+91" /></label></fieldset>
          <fieldset><legend><span>02</span> Delivery address</legend><div className="form-row"><label>First name<input name="firstName" autoComplete="given-name" required /></label><label>Last name<input name="lastName" autoComplete="family-name" required /></label></div><label>Address<input name="address" autoComplete="street-address" required /></label><div className="form-row"><label>City<input name="city" autoComplete="address-level2" required /></label><label>PIN code<input name="postalCode" autoComplete="postal-code" inputMode="numeric" required /></label></div><label>State<input name="state" autoComplete="address-level1" required /></label></fieldset>
          <fieldset><legend><span>03</span> Payment</legend><div className="payment-placeholder"><span className="payment-placeholder__icon">01</span><div><strong>Payment on delivery</strong><p>Payment options will be confirmed by the LUMÉRA studio.</p></div><span className="payment-selected" /></div></fieldset>
          <button className="button button--dark button--full" type="submit">Place Order <ArrowRight size={16} /></button>
          <p className="checkout-form__note">Demo checkout only. This form does not send or store personal information. No payment is processed.</p>
        </form>
        <aside className="checkout-summary"><p className="eyebrow">In your bag · {cart.reduce((sum, line) => sum + line.quantity, 0)} pieces</p>
          {cart.length === 0 ? <p className="checkout-summary__empty">Your bag is empty. Add a piece to begin.</p> : cart.map((line) => { const product = products.find((item) => item.id === line.productId); return product ? <div className="checkout-summary__item" key={line.productId}><img src={product.image} alt="" /><div><strong>{product.name}</strong><span>Qty {line.quantity}</span></div><b>{formatPrice(product.price * line.quantity)}</b></div> : null })}
          <div className="checkout-summary__total"><div><span>Subtotal</span><b>{formatPrice(subtotal)}</b></div><div><span>Delivery</span><span>Complimentary</span></div><div className="checkout-summary__grand"><span>Total</span><strong>{formatPrice(subtotal)}</strong></div></div>
        </aside>
      </div>}
    </div>
  )
}

export default App
