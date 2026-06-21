import React, { useState, useEffect } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';

const defaultMenuItems = [
    {
        name: "The Dola Classic",
        desc: "Double Angus beef patty, melted cheddar cheese, pickles, red onion, tomato, lettuce on toasted brioche bun.",
        price: 14.99,
        category: "burgers",
        badge: "popular",
        badgeText: "⭐ Best Seller",
        tags: ["Angus Beef", "Cheddar", "Brioche"],
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=350&fit=crop"
    },
    {
        name: "Smoky BBQ Burger",
        desc: "Smoked beef patty with house BBQ sauce, crispy onion rings, pepper jack cheese, and jalapeños.",
        price: 16.99,
        category: "burgers",
        badge: "spicy",
        badgeText: "🌶️ Spicy",
        tags: ["Smoked", "BBQ", "Jalapeño"],
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=500&h=350&fit=crop"
    },
    {
        name: "Truffle Mushroom Burger",
        desc: "Wagyu beef patty topped with sautéed mushrooms, truffle aioli, Swiss cheese on a pretzel bun.",
        price: 19.99,
        category: "burgers",
        badge: "new",
        badgeText: "✨ New",
        tags: ["Wagyu", "Truffle", "Mushroom"],
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=500&h=350&fit=crop"
    },
    {
        name: "Crispy Chicken Burger",
        desc: "Buttermilk fried chicken breast, coleslaw, pickles, spicy mayo on a potato bun.",
        price: 13.99,
        category: "burgers",
        badge: "",
        badgeText: "",
        tags: ["Chicken", "Crispy", "Coleslaw"],
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=500&h=350&fit=crop"
    },
    {
        name: "Loaded Cheese Fries",
        desc: "Crispy golden fries loaded with melted cheese, bacon bits, jalapeños, and ranch drizzle.",
        price: 8.99,
        category: "sides",
        badge: "popular",
        badgeText: "⭐ Popular",
        tags: ["Cheese", "Bacon", "Fries"],
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&h=350&fit=crop"
    },
    {
        name: "Onion Rings Tower",
        desc: "Beer-battered onion rings stacked high, served with smoky chipotle dipping sauce.",
        price: 7.99,
        category: "sides",
        badge: "",
        badgeText: "",
        tags: ["Crispy", "Beer Battered"],
        rating: 4.6,
        image: "https://images.unsplash.com/photo-1639024471283-03518883512d?w=500&h=350&fit=crop"
    },
    {
        name: "Craft Milkshake",
        desc: "Thick and creamy hand-spun milkshake. Choose from vanilla, chocolate, strawberry, or Oreo.",
        price: 6.99,
        category: "drinks",
        badge: "popular",
        badgeText: "⭐ Favorite",
        tags: ["Creamy", "Hand-spun"],
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500&h=350&fit=crop"
    },
    {
        name: "Fresh Lemonade",
        desc: "House-made lemonade with fresh mint, a hint of ginger, and a touch of honey.",
        price: 4.99,
        category: "drinks",
        badge: "new",
        badgeText: "✨ New",
        tags: ["Fresh", "Natural"],
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=500&h=350&fit=crop"
    },
    {
        name: "Chocolate Lava Cake",
        desc: "Warm chocolate cake with a molten center, served with vanilla ice cream and berry compote.",
        price: 9.99,
        category: "desserts",
        badge: "popular",
        badgeText: "⭐ Must Try",
        tags: ["Chocolate", "Warm", "Ice Cream"],
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=500&h=350&fit=crop"
    }
];

export default function Home({ menuItems: initialMenuItems = [], restaurantSettings = null }) {
    const { props } = usePage();

    useEffect(() => {
        try {
            const user = props?.auth?.user;
            if (user) {
                const dashboard = user.dashboard || '/dashboard';
                Inertia.visit(dashboard, { replace: true });
            }
        } catch (e) {
            // ignore
        }
    }, [props]);
    
    const [cartItems, setCartItems] = useState(0);
    const [activeCategory, setActiveCategory] = useState('all');
    const [isLightMode, setIsLightMode] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [notification, setNotification] = useState({ show: false, text: '' });
    const [showPreloader, setShowPreloader] = useState(true);
    const [preloaderUnmount, setPreloaderUnmount] = useState(false);

    // Dynamic branding from database
    const brandName = restaurantSettings?.name || 'Dola Grill';
    const brandLogo = restaurantSettings?.logo || '🍔';
    const isImageLogo = typeof brandLogo === 'string' && (brandLogo.startsWith('http') || brandLogo.startsWith('restaurant_logos/') || brandLogo.startsWith('/'));
    const logoSrc = isImageLogo ? (brandLogo.startsWith('http') || brandLogo.startsWith('/') ? brandLogo : `/storage/${brandLogo}`) : null;
    const sections = restaurantSettings?.sections || {};

    const specialsHeading = sections?.specials?.heading || sections?.specialsHeading || "Today's Specials";
    const specialsTitle = sections?.specials?.title || sections?.specialsTitle || "Chef's Recommendations";
    const specialsDescription = sections?.specials?.description || sections?.specialsDescription || 'Limited-time offers crafted by our head chef using seasonal ingredients.';
    const specialsItems = sections?.specials?.items || (Array.isArray(sections?.specials) ? sections.specials : [
        { icon: '🍔', title: 'The Dola Classic', desc: 'Double Angus patty, melted cheddar, caramelized onions, pickles, secret sauce on brioche bun.', price: '$14.99', oldPrice: '$19.99' },
        { icon: '🥩', title: 'Smoky BBQ Burger', desc: 'Smoked beef patty, BBQ sauce, crispy onion rings, pepper jack cheese, jalapeños.', price: '$16.99', oldPrice: '$22.99' },
        { icon: '🌿', title: 'Garden Veggie Burger', desc: 'Plant-based patty, avocado, sprouts, tomato, red onion, herb aioli on whole grain bun.', price: '$12.99', oldPrice: '$17.99' }
    ]);

    const aboutData = {
        image: sections?.about?.image || sections?.aboutImage || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=700&fit=crop',
        years: sections?.about?.years || sections?.aboutYears || '15+',
        storyTitle: sections?.about?.title || sections?.aboutTitle || 'Crafted With Love Since 2009',
        storyText: sections?.about?.text || sections?.aboutText || "At Dola Grill House, we believe that a great burger is more than just food — it's an experience. We source the finest Angus beef, bake our brioche buns fresh daily, and craft every sauce from scratch.",
        features: sections?.about?.features || sections?.aboutFeatures || [
            { icon: '🥩', label: 'Premium Angus Beef' },
            { icon: '🍞', label: 'Fresh Baked Buns' },
            { icon: '🌿', label: 'Farm Fresh Veggies' },
            { icon: '👨‍🍳', label: 'Expert Chefs' },
        ]
    };

    const testimonialsHeading = sections?.testimonials?.heading || sections?.testimonialsHeading || 'Testimonials';
    const testimonialsTitle = sections?.testimonials?.title || sections?.testimonialsTitle || 'What Our Guests Say';
    const testimonialsItems = sections?.testimonials?.items || (Array.isArray(sections?.testimonials) ? sections.testimonials : [
        { stars: '⭐⭐⭐⭐⭐', text: "The best burger I've ever had! The cheese was perfectly melted and the patty was so juicy.", name: 'James Davidson', role: 'Food Blogger', avatar: 'JD' },
        { stars: '⭐⭐⭐⭐⭐', text: "Amazing atmosphere and even better food. The Dola Classic is out of this world.", name: 'Sarah Mitchell', role: 'Regular Customer', avatar: 'SM' },
        { stars: '⭐⭐⭐⭐⭐', text: "I've tried burgers all over the city and nothing comes close to Dola Grill House.", name: 'Robert Kim', role: 'Food Critic', avatar: 'RK' },
    ]);

    const reservationData = sections.reservation || {
        titleSmall: 'Reservation',
        titleLarge: 'Book Your Table Today',
        text: 'Reserve your spot at Dola Grill House and enjoy an unforgettable dining experience with family and friends.',
        info: [
            { icon: '📍', label: 'Location', value: '123 Grill Street, Food City, FC 10001' },
            { icon: '🕐', label: 'Hours', value: 'Mon–Sun: 11:00 AM – 11:00 PM' },
            { icon: '📞', label: 'Phone', value: '+1 (555) 123-4567' },
            { icon: '✉️', label: 'Email', value: 'hello@dolagrillhouse.com' },
        ]
    };

    const normalizeTags = (tags) => {
        if (Array.isArray(tags)) return tags;
        if (typeof tags === 'string') {
            try {
                const parsedTags = JSON.parse(tags);
                return Array.isArray(parsedTags) ? parsedTags : [];
            } catch { return tags.split(',').map((tag) => tag.trim()).filter(Boolean); }
        }
        return [];
    };

    const databaseMenuItems = initialMenuItems.map((item) => ({
        ...item,
        desc: item.desc ?? item.description ?? '',
        price: Number(item.price ?? 0),
        rating: Number(item.rating ?? 5),
        tags: normalizeTags(item.tags),
    }));

    const displayedMenuItems = databaseMenuItems.length > 0 ? databaseMenuItems : defaultMenuItems;
    const filteredMenu = activeCategory === 'all' ? displayedMenuItems : displayedMenuItems.filter(i => i.category === activeCategory);

    const getImageUrl = (image) => {
        if (!image) return '';
        if (image.startsWith('http') || image.startsWith('/')) return image;
        return `/storage/${image}`;
    };

    // Inject Enhanced CSS
    useEffect(() => {
        const styleId = 'dola-grill-styles';
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.innerHTML = `
                /* ===== ENHANCED UI & PREMIUM STYLES ===== */
                *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

                :root {
                    --primary: #e63946;
                    --primary-dark: #c1121f;
                    --primary-glow: rgba(230, 57, 70, 0.35);
                    --gold: #ffb703;
                    --gold-dark: #fb8500;
                    --gold-light: #ffd166;
                    --dark: #121212;
                    --darker: #0a0a0a;
                    --card-bg: #161616;
                    --card-border: rgba(255, 255, 255, 0.06);
                    --cream: #fdf6ec;
                    --brown: #3e2723;
                    --orange: #f4a261;
                    --text-light: #f8f9fa;
                    --text-muted: #9ca3af;
                    --glass-bg: rgba(18, 18, 18, 0.75);
                    --glass-border: rgba(255, 255, 255, 0.08);
                    --shadow-sm: 0 2px 8px rgba(0,0,0,0.1);
                    --shadow-md: 0 8px 24px rgba(0,0,0,0.15);
                    --shadow-lg: 0 20px 40px rgba(0,0,0,0.25);
                    --radius-sm: 8px;
                    --radius-md: 16px;
                    --radius-lg: 24px;
                    --radius-full: 9999px;
                    --transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                }

                html { scroll-behavior: smooth; }

                body {
                    font-family: 'Poppins', sans-serif;
                    background: var(--darker);
                    color: var(--text-light);
                    overflow-x: hidden;
                    -webkit-font-smoothing: antialiased;
                    -moz-osx-font-smoothing: grayscale;
                    line-height: 1.6;
                }

                /* ===== PRELOADER ===== */
                .preloader {
                    position: fixed; inset: 0;
                    background: var(--darker);
                    display: flex; align-items: center; justify-content: center;
                    z-index: 99999;
                    transition: opacity 0.6s ease, visibility 0.6s ease;
                }
                .preloader.hidden { opacity: 0; visibility: hidden; pointer-events: none; }
                .preloader-burger {
                    font-size: 64px;
                    animation: pulse-bounce 1.2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
                    filter: drop-shadow(0 0 20px var(--primary-glow));
                }
                @keyframes pulse-bounce {
                    0%, 100% { transform: translateY(0) scale(1); }
                    50% { transform: translateY(-20px) scale(1.1); }
                }
                .preloader-text {
                    font-family: 'Dancing Script', cursive;
                    font-size: 32px; color: var(--gold);
                    margin-top: 24px; letter-spacing: 1px;
                }

                /* ===== NAVBAR ===== */
                .navbar {
                    position: fixed; top: 0; left: 0; width: 100%;
                    padding: 20px 5%; display: flex; align-items: center; justify-content: space-between;
                    z-index: 1000; transition: var(--transition); background: transparent;
                }
                .navbar.scrolled {
                    background: var(--glass-bg);
                    backdrop-filter: blur(16px) saturate(180%);
                    -webkit-backdrop-filter: blur(16px) saturate(180%);
                    padding: 14px 5%;
                    border-bottom: 1px solid var(--glass-border);
                    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
                }
                .navbar.scrolled .logo-text { color: var(--text-light); }
                .navbar.scrolled .logo-sub { color: var(--text-muted); }
                .navbar.scrolled .nav-links a { color: var(--text-light); }
                .navbar.scrolled .btn-reserve { color: #fff !important; }
                .navbar.scrolled .hamburger span { background: var(--text-light); }

                .theme-toggle {
                    width: 44px; height: 44px; border-radius: 50%;
                    border: 1px solid var(--glass-border);
                    background: rgba(255, 255, 255, 0.05);
                    color: var(--text-light); font-size: 20px; cursor: pointer;
                    display: grid; place-items: center; transition: var(--transition);
                    backdrop-filter: blur(8px);
                }
                .theme-toggle:hover { background: var(--primary); border-color: var(--primary); transform: rotate(15deg) scale(1.05); }
                .navbar.scrolled .theme-toggle { background: rgba(255,255,255,0.1); color: var(--text-light); }

                .logo { display: flex; align-items: center; gap: 14px; text-decoration: none; }
                .logo-icon { font-size: 38px; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3)); }
                .logo-text {
                    font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 900;
                    color: var(--gold); letter-spacing: 0.5px; transition: color 0.3s;
                }
                .logo-sub {
                    font-size: 10px; color: var(--text-muted); letter-spacing: 4px;
                    text-transform: uppercase; display: block; margin-top: -4px; transition: color 0.3s;
                }

                .nav-links { display: flex; list-style: none; gap: 32px; align-items: center; }
                .nav-links a {
                    text-decoration: none; color: var(--text-light); font-size: 14px;
                    font-weight: 500; letter-spacing: 1px; text-transform: uppercase;
                    position: relative; transition: color 0.3s;
                }
                .nav-links a::after {
                    content: ''; position: absolute; bottom: -6px; left: 0; width: 0; height: 2px;
                    background: var(--primary); transition: width 0.3s ease; border-radius: 2px;
                }
                .nav-links a:hover { color: var(--primary); }
                .nav-links a:hover::after { width: 100%; }

                .btn-reserve {
                    background: linear-gradient(135deg, var(--primary), var(--primary-dark));
                    color: #fff !important; padding: 12px 28px; border-radius: var(--radius-full);
                    font-weight: 600; letter-spacing: 1px; transition: var(--transition);
                    border: none; box-shadow: 0 4px 15px var(--primary-glow);
                }
                .btn-reserve:hover { transform: translateY(-2px); box-shadow: 0 8px 25px var(--primary-glow); }
                .btn-reserve::after { display: none !important; }

                .hamburger {
                    display: none; flex-direction: column; gap: 6px; cursor: pointer;
                    z-index: 1001; background: transparent; border: none; padding: 8px;
                }
                .hamburger span {
                    width: 28px; height: 2.5px; background: var(--text-light);
                    border-radius: 3px; transition: var(--transition);
                }
                .hamburger.active span:nth-child(1) { transform: rotate(45deg) translate(6px, 6px); }
                .hamburger.active span:nth-child(2) { opacity: 0; transform: translateX(-10px); }
                .hamburger.active span:nth-child(3) { transform: rotate(-45deg) translate(6px, -6px); }

                /* Light Mode Overrides */
                body.light-mode {
                    --dark: #f8f9fa; --darker: #ffffff; --card-bg: #ffffff;
                    --card-border: rgba(0, 0, 0, 0.06); --text-light: #111827;
                    --text-muted: #6b7280; --glass-bg: rgba(255, 255, 255, 0.85);
                    --glass-border: rgba(0, 0, 0, 0.05); --gold: #d97706; --primary: #dc2626;
                    background: #f9fafb; color: #111827;
                }
                body.light-mode .navbar.scrolled { background: rgba(255,255,255,0.9); border-bottom: 1px solid rgba(0,0,0,0.05); box-shadow: 0 4px 20px rgba(0,0,0,0.03); }
                body.light-mode .logo-text, body.light-mode .navbar.scrolled .logo-text { color: var(--primary); }
                body.light-mode .nav-links a, body.light-mode .navbar.scrolled .nav-links a { color: #374151; }
                body.light-mode .hamburger span, body.light-mode .navbar.scrolled .hamburger span { background: #374151; }
                body.light-mode .theme-toggle { background: #f3f4f6; color: #374151; border-color: #e5e7eb; }
                body.light-mode .menu-card, body.light-mode .testimonial-card, body.light-mode .special-card, body.light-mode .reservation-form {
                    background: var(--card-bg); border-color: var(--card-border); box-shadow: 0 4px 20px rgba(0,0,0,0.04);
                }
                body.light-mode .menu-card:hover { box-shadow: 0 20px 40px rgba(0,0,0,0.08); }
                body.light-mode .tag { background: #f3f4f6; border-color: #e5e7eb; color: #4b5563; }
                body.light-mode .tag:hover { background: #fef3c7; border-color: #f59e0b; color: #b45309; }
                body.light-mode .tab-btn { background: #fff; border-color: #e5e7eb; color: #4b5563; }
                body.light-mode .form-group input, body.light-mode .form-group select, body.light-mode .form-group textarea {
                    background: #f9fafb; border-color: #e5e7eb; color: #111827;
                }
                body.light-mode .form-group input:focus, body.light-mode .form-group select:focus, body.light-mode .form-group textarea:focus {
                    background: #fff; border-color: var(--gold); box-shadow: 0 0 0 4px rgba(217, 119, 6, 0.1);
                }
                body.light-mode .hero-overlay { background: linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(0,0,0,0.5) 100%); }
                body.light-mode .menu-card-image::after { background: linear-gradient(to top, #ffffff, transparent); }

                /* ===== HERO ===== */
                .hero { min-height: 100vh; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; background: #000; }
                .hero-bg-video { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); min-width: 100%; min-height: 100%; object-fit: cover; z-index: 0; pointer-events: none; }
                .hero-overlay { position: absolute; inset: 0; background: linear-gradient(135deg, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0.6) 50%, rgba(10,10,10,0.9) 100%); z-index: 1; }
                .hero-particles { position: absolute; inset: 0; z-index: 2; pointer-events: none; }
                .particle { position: absolute; width: 4px; height: 4px; background: var(--gold); border-radius: 50%; opacity: 0; animation: float-particle 8s ease-in-out infinite; filter: blur(1px); }
                @keyframes float-particle { 0%, 100% { opacity: 0; transform: translateY(100vh) scale(0); } 50% { opacity: 0.4; transform: translateY(-10vh) scale(1.5); } }

                .hero-content { display: flex; align-items: center; justify-content: center; gap: 80px; max-width: 1300px; padding: 0 5%; position: relative; z-index: 3; }
                .hero-text { flex: 1; max-width: 600px; }
                .hero-badge {
                    display: inline-flex; align-items: center; gap: 10px;
                    background: rgba(230, 57, 70, 0.15); border: 1px solid rgba(230, 57, 70, 0.3);
                    padding: 8px 20px; border-radius: var(--radius-full); font-size: 13px;
                    color: #fff; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 28px;
                    animation: fadeInUp 0.8s ease 0.2s both; backdrop-filter: blur(4px);
                }
                .hero-title {
                    font-family: 'Playfair Display', serif; font-size: clamp(42px, 6vw, 76px);
                    font-weight: 900; line-height: 1.1; margin-bottom: 24px; color: #ffffff;
                    animation: fadeInUp 0.8s ease 0.4s both; text-shadow: 0 4px 24px rgba(0, 0, 0, 0.4);
                }
                .hero-title span { color: var(--primary); position: relative; }
                .hero-title .script { font-family: 'Dancing Script', cursive; color: var(--gold); font-size: 0.85em; }
                .hero-desc { font-size: 18px; color: rgba(255, 255, 255, 0.85); line-height: 1.8; margin-bottom: 40px; animation: fadeInUp 0.8s ease 0.6s both; }
                .hero-buttons { display: flex; gap: 20px; animation: fadeInUp 0.8s ease 0.8s both; flex-wrap: wrap; }

                .btn-primary, .btn-secondary {
                    padding: 16px 36px; border-radius: var(--radius-full); font-size: 15px;
                    font-weight: 600; letter-spacing: 0.5px; cursor: pointer; transition: var(--transition);
                    text-decoration: none; display: inline-flex; align-items: center; gap: 10px; border: 2px solid transparent;
                }
                .btn-primary { background: linear-gradient(135deg, var(--primary), var(--primary-dark)); color: #fff; border-color: var(--primary); box-shadow: 0 8px 24px var(--primary-glow); }
                .btn-primary:hover { transform: translateY(-4px); box-shadow: 0 12px 32px var(--primary-glow); }
                .btn-secondary { background: rgba(255,255,255,0.05); color: #fff; border-color: rgba(255, 255, 255, 0.2); backdrop-filter: blur(8px); }
                .btn-secondary:hover { border-color: var(--gold); color: var(--gold); transform: translateY(-4px); background: rgba(255,255,255,0.1); }

                .hero-image { flex: 1; display: flex; align-items: center; justify-content: center; position: relative; animation: fadeInRight 1s ease 0.5s both; }
                .burger-showcase { position: relative; width: 100%; max-width: 500px; aspect-ratio: 1/1; }
                .burger-glow { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 80%; height: 80%; background: radial-gradient(circle, rgba(255, 183, 3, 0.15) 0%, transparent 70%); border-radius: 50%; animation: pulse-glow 4s ease-in-out infinite; }
                @keyframes pulse-glow { 0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; } 50% { transform: translate(-50%, -50%) scale(1.1); opacity: 1; } }
                .burger-img { width: 100%; height: 100%; object-fit: contain; position: relative; z-index: 2; filter: drop-shadow(0 30px 60px rgba(0, 0, 0, 0.5)); animation: float 6s ease-in-out infinite; }
                @keyframes float { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-20px) rotate(2deg); } }

                .hero-stats { display: flex; gap: 40px; margin-top: 50px; animation: fadeInUp 0.8s ease 1s both; }
                .stat { text-align: center; }
                .stat-number { font-family: 'Playfair Display', serif; font-size: 40px; font-weight: 900; color: var(--gold); line-height: 1; }
                .stat-label { font-size: 12px; color: rgba(255, 255, 255, 0.6); text-transform: uppercase; letter-spacing: 1.5px; margin-top: 8px; }

                .scroll-indicator { position: absolute; bottom: 40px; left: 50%; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; gap: 12px; color: rgba(255, 255, 255, 0.5); font-size: 11px; letter-spacing: 3px; text-transform: uppercase; animation: fadeInUp 0.8s ease 1.2s both; z-index: 3; }
                .scroll-line { width: 1px; height: 50px; background: linear-gradient(to bottom, var(--primary), transparent); animation: scroll-anim 2.5s ease-in-out infinite; }
                @keyframes scroll-anim { 0% { transform: scaleY(0); transform-origin: top; } 50% { transform: scaleY(1); transform-origin: top; } 51% { transform-origin: bottom; } 100% { transform: scaleY(0); transform-origin: bottom; } }

                /* ===== SECTIONS ===== */
                section { padding: 120px 5%; position: relative; }
                .section-header { text-align: center; margin-bottom: 80px; }
                .section-tag { font-family: 'Dancing Script', cursive; color: var(--gold); font-size: 26px; margin-bottom: 12px; display: block; }
                .section-title { font-family: 'Playfair Display', serif; font-size: clamp(32px, 4vw, 52px); font-weight: 900; margin-bottom: 20px; letter-spacing: -0.5px; }
                .section-line { width: 60px; height: 4px; background: linear-gradient(90deg, var(--primary), var(--gold)); margin: 0 auto 24px; border-radius: 4px; }
                .section-desc { color: var(--text-muted); font-size: 17px; max-width: 650px; margin: 0 auto; line-height: 1.8; }

                /* ===== MENU ===== */
                .menu-section { background: var(--dark); }
                .category-tabs { display: flex; justify-content: center; gap: 12px; margin-bottom: 60px; flex-wrap: wrap; }
                .tab-btn {
                    padding: 12px 28px; border: 1.5px solid var(--card-border); background: var(--card-bg);
                    color: var(--text-muted); border-radius: var(--radius-full); font-size: 14px;
                    font-weight: 500; cursor: pointer; transition: var(--transition); font-family: 'Poppins', sans-serif;
                }
                .tab-btn:hover { border-color: var(--primary); color: var(--primary); transform: translateY(-2px); }
                .tab-btn.active { background: var(--primary); border-color: var(--primary); color: #fff; box-shadow: 0 8px 20px var(--primary-glow); }

                .menu-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 32px; max-width: 1300px; margin: 0 auto; }
                .menu-card {
                    background: var(--card-bg); border-radius: var(--radius-lg); overflow: hidden;
                    border: 1px solid var(--card-border); transition: var(--transition);
                    position: relative; opacity: 0; transform: translateY(30px); display: flex; flex-direction: column;
                }
                .menu-card.visible { opacity: 1; transform: translateY(0); }
                .menu-card:hover { transform: translateY(-12px); border-color: rgba(255, 183, 3, 0.3); box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); }
                
                .menu-card-image { width: 100%; height: 240px; background-size: cover; background-position: center; position: relative; overflow: hidden; transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1); }
                .menu-card:hover .menu-card-image { transform: scale(1.08); }
                .menu-card-image::after { content: ''; position: absolute; bottom: 0; left: 0; width: 100%; height: 50%; background: linear-gradient(to top, var(--card-bg), transparent); pointer-events: none; }
                
                .menu-card-badge {
                    position: absolute; top: 16px; left: 16px; background: var(--primary); color: #fff;
                    padding: 6px 16px; border-radius: var(--radius-full); font-size: 11px; font-weight: 600;
                    letter-spacing: 1px; text-transform: uppercase; z-index: 2; box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                }
                .menu-card-badge.popular { background: var(--gold); color: var(--dark); }
                .menu-card-badge.new { background: #10b981; }
                .menu-card-badge.spicy { background: var(--orange); }

                .menu-card-body { padding: 28px; display: flex; flex-direction: column; flex: 1; }
                .menu-card-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; gap: 16px; }
                .menu-card-name { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 700; line-height: 1.3; }
                .menu-card-price { font-family: 'Playfair Display', serif; font-size: 26px; font-weight: 900; color: var(--gold); white-space: nowrap; }
                .menu-card-desc { color: var(--text-muted); font-size: 14px; line-height: 1.7; margin-bottom: 20px; flex: 1; }
                
                .menu-card-tags { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 24px; }
                .tag {
                    background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.06);
                    padding: 5px 14px; border-radius: var(--radius-full); font-size: 11px; font-weight: 500;
                    color: var(--text-muted); letter-spacing: 0.5px; text-transform: uppercase; transition: var(--transition);
                }
                .tag:hover { background: rgba(255, 183, 3, 0.1); border-color: var(--gold); color: var(--gold); }

                .menu-card-footer { display: flex; justify-content: space-between; align-items: center; margin-top: auto; padding-top: 20px; border-top: 1px solid var(--card-border); }
                .menu-card-rating { display: flex; align-items: center; gap: 2px; font-size: 14px; }
                .star-icon { transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1); display: inline-block; }
                .star-icon:hover { transform: scale(1.4) rotate(15deg); filter: drop-shadow(0 0 8px var(--gold)); }
                
                .btn-add {
                    background: transparent; color: var(--primary); border: 1.5px solid var(--primary);
                    padding: 10px 22px; border-radius: var(--radius-full); font-size: 13px; font-weight: 600;
                    cursor: pointer; transition: var(--transition); font-family: 'Poppins', sans-serif;
                }
                .btn-add:hover { background: var(--primary); color: #fff; box-shadow: 0 8px 20px var(--primary-glow); transform: translateY(-2px); }

                /* ===== SPECIALS ===== */
                .specials-section { background: var(--darker); position: relative; overflow: hidden; }
                .specials-section::before { content: ''; position: absolute; top: -200px; right: -200px; width: 600px; height: 600px; background: radial-gradient(circle, rgba(230, 57, 70, 0.05), transparent 70%); border-radius: 50%; pointer-events: none; }
                .specials-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 32px; max-width: 1300px; margin: 0 auto; }
                .special-card {
                    background: var(--card-bg); border-radius: var(--radius-lg); padding: 48px 32px;
                    text-align: center; border: 1px solid var(--card-border); transition: var(--transition);
                    position: relative; overflow: hidden;
                }
                .special-card::before { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 4px; background: linear-gradient(90deg, var(--primary), var(--gold)); transform: scaleX(0); transition: transform 0.5s ease; transform-origin: left; }
                .special-card:hover::before { transform: scaleX(1); }
                .special-card:hover { transform: translateY(-10px); box-shadow: var(--shadow-lg); border-color: rgba(255,183,3,0.2); }
                .special-icon { font-size: 56px; margin-bottom: 24px; display: block; filter: drop-shadow(0 8px 16px rgba(0,0,0,0.2)); }
                .special-title { font-family: 'Playfair Display', serif; font-size: 24px; font-weight: 700; margin-bottom: 12px; }
                .special-desc { color: var(--text-muted); font-size: 14px; line-height: 1.7; margin-bottom: 24px; }
                .special-price { font-family: 'Playfair Display', serif; font-size: 32px; font-weight: 900; color: var(--gold); }
                .special-price small { font-size: 16px; color: var(--text-muted); text-decoration: line-through; margin-left: 12px; font-weight: 400; }

                /* ===== ABOUT ===== */
                .about-section { background: var(--dark); }
                .about-content { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; max-width: 1300px; margin: 0 auto; align-items: center; }
                .about-image { position: relative; }
                .about-img-main { width: 100%; border-radius: var(--radius-lg); box-shadow: var(--shadow-lg); object-fit: cover; aspect-ratio: 4/5; }
                .about-experience {
                    position: absolute; bottom: -30px; right: -30px;
                    background: linear-gradient(135deg, var(--primary), var(--primary-dark));
                    padding: 28px 36px; border-radius: var(--radius-lg); text-align: center;
                    box-shadow: 0 15px 40px var(--primary-glow); border: 4px solid var(--dark);
                }
                .about-experience .number { font-family: 'Playfair Display', serif; font-size: 52px; font-weight: 900; color: #fff; line-height: 1; }
                .about-experience .label { font-size: 12px; color: rgba(255, 255, 255, 0.9); text-transform: uppercase; letter-spacing: 2px; margin-top: 4px; }
                .about-text h3 { font-family: 'Dancing Script', cursive; color: var(--gold); font-size: 28px; margin-bottom: 12px; }
                .about-text h2 { font-family: 'Playfair Display', serif; font-size: clamp(28px, 4vw, 44px); font-weight: 900; margin-bottom: 24px; line-height: 1.2; }
                .about-text p { color: var(--text-muted); font-size: 16px; line-height: 1.8; margin-bottom: 36px; }
                .about-features { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 40px; }
                .about-feature { display: flex; align-items: center; gap: 16px; }
                .about-feature-icon { width: 52px; height: 52px; background: rgba(255, 183, 3, 0.1); border: 1px solid rgba(255, 183, 3, 0.2); border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 24px; flex-shrink: 0; }
                .about-feature span { font-size: 15px; font-weight: 500; }

                /* ===== TESTIMONIALS ===== */
                .testimonials-section { background: var(--darker); }
                .testimonials-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 32px; max-width: 1300px; margin: 0 auto; }
                .testimonial-card {
                    background: var(--card-bg); border-radius: var(--radius-lg); padding: 40px;
                    border: 1px solid var(--card-border); transition: var(--transition); position: relative;
                }
                .testimonial-card::before { content: '"'; position: absolute; top: 20px; right: 30px; font-family: 'Playfair Display', serif; font-size: 80px; color: var(--primary); opacity: 0.1; line-height: 1; }
                .testimonial-card:hover { border-color: rgba(255,183,3,0.2); transform: translateY(-8px); box-shadow: var(--shadow-lg); }
                .testimonial-stars { color: var(--gold); font-size: 18px; margin-bottom: 20px; letter-spacing: 2px; }
                .testimonial-text { color: var(--text-muted); font-size: 15px; line-height: 1.8; font-style: italic; margin-bottom: 32px; position: relative; z-index: 1; }
                .testimonial-author { display: flex; align-items: center; gap: 16px; }
                .testimonial-avatar { width: 56px; height: 56px; border-radius: 50%; background: linear-gradient(135deg, var(--primary), var(--gold)); display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 700; color: #fff; box-shadow: 0 4px 12px rgba(0,0,0,0.2); }
                .testimonial-name { font-weight: 600; font-size: 16px; color: var(--text-light); }
                .testimonial-role { font-size: 13px; color: var(--text-muted); }

                /* ===== RESERVATION ===== */
                .reservation-section { background: var(--dark); position: relative; }
                .reservation-content { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; max-width: 1200px; margin: 0 auto; align-items: center; }
                .reservation-info h3 { font-family: 'Dancing Script', cursive; color: var(--gold); font-size: 28px; margin-bottom: 12px; }
                .reservation-info h2 { font-family: 'Playfair Display', serif; font-size: clamp(28px, 4vw, 44px); font-weight: 900; margin-bottom: 24px; }
                .reservation-info p { color: var(--text-muted); line-height: 1.8; margin-bottom: 40px; font-size: 16px; }
                .info-items { display: flex; flex-direction: column; gap: 24px; }
                .info-item { display: flex; align-items: center; gap: 20px; }
                .info-icon { width: 56px; height: 56px; background: rgba(255, 183, 3, 0.1); border: 1px solid rgba(255, 183, 3, 0.2); border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 24px; flex-shrink: 0; }
                .info-label { font-size: 12px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 4px; }
                .info-value { font-weight: 600; font-size: 16px; color: var(--text-light); }

                .reservation-form { background: var(--card-bg); border-radius: var(--radius-lg); padding: 48px; border: 1px solid var(--card-border); box-shadow: var(--shadow-lg); }
                .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
                .form-group { margin-bottom: 20px; }
                .form-group label { display: block; font-size: 13px; color: var(--text-muted); margin-bottom: 10px; text-transform: uppercase; letter-spacing: 1px; font-weight: 500; }
                .form-group input, .form-group select, .form-group textarea {
                    width: 100%; padding: 16px 20px; background: rgba(255, 255, 255, 0.03);
                    border: 1.5px solid rgba(255, 255, 255, 0.08); border-radius: var(--radius-md);
                    color: var(--text-light); font-size: 15px; font-family: 'Poppins', sans-serif;
                    transition: var(--transition); outline: none;
                }
                .form-group input::placeholder, .form-group textarea::placeholder { color: var(--text-muted); opacity: 0.6; }
                .form-group input:focus, .form-group select:focus, .form-group textarea:focus { border-color: var(--gold); background: rgba(255, 183, 3, 0.03); box-shadow: 0 0 0 4px rgba(255, 183, 3, 0.1); }
                .form-group select option { background: var(--dark); color: var(--text-light); }
                
                .btn-submit {
                    width: 100%; padding: 18px; background: linear-gradient(135deg, var(--primary), var(--primary-dark));
                    color: #fff; border: none; border-radius: var(--radius-md); font-size: 16px; font-weight: 600;
                    letter-spacing: 1px; cursor: pointer; transition: var(--transition); font-family: 'Poppins', sans-serif;
                    margin-top: 12px; box-shadow: 0 8px 24px var(--primary-glow);
                }
                .btn-submit:hover { transform: translateY(-3px); box-shadow: 0 12px 32px var(--primary-glow); }

                /* ===== FOOTER ===== */
                .footer { background: #050505; padding: 100px 5% 40px; border-top: 1px solid var(--card-border); }
                .footer-content { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 60px; max-width: 1300px; margin: 0 auto 80px; }
                .footer-brand .logo-text { font-size: 32px; margin-bottom: 20px; display: block; }
                .footer-brand p { color: var(--text-muted); font-size: 15px; line-height: 1.8; margin-bottom: 28px; max-width: 320px; }
                .social-links { display: flex; gap: 14px; }
                .social-link {
                    width: 44px; height: 44px; border-radius: 12px; background: rgba(255, 255, 255, 0.05);
                    border: 1px solid var(--card-border); display: flex; align-items: center; justify-content: center;
                    text-decoration: none; font-size: 20px; transition: var(--transition);
                }
                .social-link:hover { background: var(--primary); border-color: var(--primary); transform: translateY(-4px); box-shadow: 0 8px 20px var(--primary-glow); }
                .footer-col h4 { font-family: 'Playfair Display', serif; font-size: 20px; margin-bottom: 24px; color: var(--gold); }
                .footer-col ul { list-style: none; }
                .footer-col ul li { margin-bottom: 14px; }
                .footer-col ul li a { color: var(--text-muted); text-decoration: none; font-size: 14px; transition: var(--transition); display: inline-block; }
                .footer-col ul li a:hover { color: var(--text-light); transform: translateX(4px); }
                .footer-bottom { text-align: center; padding-top: 40px; border-top: 1px solid var(--card-border); color: var(--text-muted); font-size: 14px; max-width: 1300px; margin: 0 auto; }

                /* ===== CART FLOATING ===== */
                .cart-float {
                    position: fixed; bottom: 32px; right: 32px; width: 64px; height: 64px;
                    background: linear-gradient(135deg, var(--primary), var(--primary-dark));
                    border-radius: 50%; display: flex; align-items: center; justify-content: center;
                    font-size: 28px; cursor: pointer; z-index: 999;
                    box-shadow: 0 12px 28px var(--primary-glow); transition: var(--transition); border: none; color: #fff;
                }
                .cart-float:hover { transform: scale(1.1) rotate(8deg); box-shadow: 0 16px 40px var(--primary-glow); }
                .cart-count {
                    position: absolute; top: -6px; right: -6px; width: 26px; height: 26px;
                    background: var(--gold); color: var(--dark); border-radius: 50%; font-size: 13px;
                    font-weight: 800; display: flex; align-items: center; justify-content: center;
                    border: 3px solid var(--darker); box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                }

                /* ===== ANIMATIONS ===== */
                @keyframes fadeInUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes fadeInRight { from { opacity: 0; transform: translateX(60px); } to { opacity: 1; transform: translateX(0); } }
                .fade-in { opacity: 0; transform: translateY(40px); transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1); }
                .fade-in.visible { opacity: 1; transform: translateY(0); }

                /* ===== NOTIFICATION ===== */
                .notification {
                    position: fixed; top: 100px; right: 32px; background: #10b981; color: #fff;
                    padding: 18px 28px; border-radius: var(--radius-md); font-size: 15px; font-weight: 500;
                    z-index: 9999; transform: translateX(150%); transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
                    box-shadow: 0 12px 32px rgba(16, 185, 129, 0.3); display: flex; align-items: center; gap: 12px;
                    border: 1px solid rgba(255,255,255,0.1);
                }
                .notification.show { transform: translateX(0); }

                /* ===== RESPONSIVE ===== */
                @media (max-width: 1024px) {
                    .hero-content { flex-direction: column; text-align: center; gap: 50px; }
                    .hero-text { max-width: 100%; }
                    .hero-buttons { justify-content: center; }
                    .hero-stats { justify-content: center; }
                    .about-content { grid-template-columns: 1fr; gap: 60px; }
                    .about-image { max-width: 500px; margin: 0 auto; }
                    .reservation-content { grid-template-columns: 1fr; gap: 60px; }
                    .footer-content { grid-template-columns: 1fr 1fr; gap: 40px; }
                }

                @media (max-width: 768px) {
                    section { padding: 80px 20px; }
                    .navbar { padding: 16px 20px; }
                    .navbar.scrolled { padding: 12px 20px; }
                    
                    .nav-links {
                        position: fixed; top: 0; right: -100%; width: 85%; max-width: 360px; height: 100vh;
                        background: var(--glass-bg); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
                        flex-direction: column; justify-content: center; padding: 40px; gap: 24px;
                        transition: right 0.4s cubic-bezier(0.4, 0, 0.2, 1); border-left: 1px solid var(--glass-border);
                    }
                    body.light-mode .nav-links { background: rgba(255,255,255,0.95); }
                    .nav-links.active { right: 0; }
                    .hamburger { display: flex; }
                    .menu-grid { grid-template-columns: 1fr; }
                    .form-row { grid-template-columns: 1fr; }
                    .footer-content { grid-template-columns: 1fr; text-align: center; }
                    .footer-brand p { margin: 0 auto 28px; }
                    .social-links { justify-content: center; }
                    .hero-buttons { flex-direction: column; align-items: center; width: 100%; }
                    .btn-primary, .btn-secondary { width: 100%; justify-content: center; }
                    .about-features { grid-template-columns: 1fr; }
                    .about-experience { right: 10px; bottom: -20px; padding: 20px 24px; }
                    .about-experience .number { font-size: 40px; }
                    .reservation-form { padding: 32px 24px; }
                }
            `;
            document.head.appendChild(style);
        }

        const linkId = 'dola-grill-fonts';
        if (!document.getElementById(linkId)) {
            const link = document.createElement('link');
            link.id = linkId;
            link.rel = 'stylesheet';
            link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Poppins:wght@300;400;500;600;700&family=Dancing+Script:wght@700&display=swap';
            document.head.appendChild(link);
        }

        return () => {
            const style = document.getElementById(styleId);
            if (style) document.head.removeChild(style);
            const link = document.getElementById(linkId);
            if (link) document.head.removeChild(link);
        };
    }, []);

    // Theme initialization and application
    useEffect(() => {
        const savedTheme = localStorage.getItem('dolaTheme');
        if (savedTheme === 'light') {
            setIsLightMode(true);
        }
    }, []);

    useEffect(() => {
        if (isLightMode) {
            document.body.classList.add('light-mode');
        } else {
            document.body.classList.remove('light-mode');
        }
        localStorage.setItem('dolaTheme', isLightMode ? 'light' : 'dark');
    }, [isLightMode]);

    // Scroll listener for navbar
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Intersection Observer for fade-in animations
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        const elements = document.querySelectorAll('.fade-in');
        elements.forEach(el => observer.observe(el));

        return () => {
            elements.forEach(el => observer.unobserve(el));
        };
    }, []);

    // Menu cards animation
    useEffect(() => {
        const cards = document.querySelectorAll('.menu-card');
        cards.forEach((card, index) => {
            card.classList.remove('visible');
            setTimeout(() => {
                card.classList.add('visible');
            }, 50 + index * 80);
        });
    }, [activeCategory]);

    // Counter animation
    useEffect(() => {
        let countersAnimated = false;
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !countersAnimated) {
                    countersAnimated = true;
                    document.querySelectorAll('.stat-number').forEach(counter => {
                        const target = parseInt(counter.dataset.count);
                        const duration = 2000;
                        const step = target / (duration / 16);
                        let current = 0;

                        const timer = setInterval(() => {
                            current += step;
                            if (current >= target) {
                                counter.textContent = target + (target === 98 ? '%' : '+');
                                clearInterval(timer);
                            } else {
                                counter.textContent = Math.floor(current);
                            }
                        }, 16);
                    });
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        const heroStats = document.querySelector('.hero-stats');
        if (heroStats) statsObserver.observe(heroStats);

        return () => {
            if (heroStats) statsObserver.unobserve(heroStats);
        };
    }, []);

    // Particles generation
    useEffect(() => {
        const container = document.getElementById('particles');
        if (!container) return;
        container.innerHTML = '';
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 6 + 's';
            particle.style.animationDuration = (4 + Math.random() * 4) + 's';
            container.appendChild(particle);
        }
    }, []);

    // Preloader timeout
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowPreloader(false);
            setTimeout(() => setPreloaderUnmount(true), 800);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    const showNotification = (text) => {
        setNotification({ show: true, text });
        setTimeout(() => {
            setNotification({ show: false, text: '' });
        }, 3000);
    };

    const addToCart = (name) => {
        setCartItems(prev => prev + 1);
        showNotification(`🍔 "${name}" added to cart!`);
    };

    const handleRate = (itemId, stars) => {
        if (!itemId) {
            showNotification('⚠️ Cannot rate local demo items');
            return;
        }
        router.post(`/menu-items/${itemId}/rate`, { rating: stars }, {
            preserveScroll: true,
            onSuccess: () => {
                showNotification(`⭐ Rated this item ${stars} stars! Thank you!`);
            },
        });
    };

    const handleReservationSubmit = (e) => {
        e.preventDefault();
        showNotification('✅ Reservation confirmed! See you soon!');
        e.target.reset();
    };

    return (
        <>
            {!preloaderUnmount && (
                <div className={`preloader ${!showPreloader ? 'hidden' : ''}`} id="preloader">
                    <div style={{ textAlign: 'center' }}>
                        <div className="preloader-burger">🍔</div>
                        <div className="preloader-text">Firing up the grill...</div>
                    </div>
                </div>
            )}

            <div className={`notification ${notification.show ? 'show' : ''}`} id="notification">
                ✅ <span id="notif-text">{notification.text}</span>
            </div>

            <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`} id="navbar">
                <Link href="/" className="logo">
                    {logoSrc ? (
                        <img src={logoSrc} alt={brandName} style={{ width: 36, height: 36, objectFit: 'contain', borderRadius: 8 }} onError={(e) => { e.target.style.display='none'; }} />
                    ) : (
                        <span className="logo-icon">{brandLogo}</span>
                    )}
                    <div>
                        <span className="logo-text">{brandName}</span>
                        <span className="logo-sub">House</span>
                    </div>
                </Link>
                <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`} id="navLinks">
                    <li><a href="#home" onClick={() => setIsMenuOpen(false)}>Home</a></li>
                    <li><a href="#menu" onClick={() => setIsMenuOpen(false)}>Menu</a></li>
                    <li><a href="#specials" onClick={() => setIsMenuOpen(false)}>Specials</a></li>
                    <li><a href="#about" onClick={() => setIsMenuOpen(false)}>About</a></li>
                    <li><a href="#reviews" onClick={() => setIsMenuOpen(false)}>Reviews</a></li>
                    <li>
                        <a href="/register" onClick={(e) => { e.preventDefault(); setIsMenuOpen(false); router.get('/register'); }}>Register</a>
                    </li>
                    <li>
                        <a href="/login" onClick={(e) => { e.preventDefault(); setIsMenuOpen(false); router.get('/login'); }}>Login</a>
                    </li>
                    <li><a href="#reserve" className="btn-reserve" onClick={() => setIsMenuOpen(false)}>Reserve</a></li>
                </ul>
                <button 
                    className="theme-toggle" 
                    id="themeToggle" 
                    type="button" 
                    aria-label={isLightMode ? "Switch to dark mode" : "Switch to light mode"}
                    onClick={() => setIsLightMode(!isLightMode)}
                >
                    {isLightMode ? '☾' : '☀'}
                </button>
                <button 
                    className={`hamburger ${isMenuOpen ? 'active' : ''}`} 
                    id="hamburger" 
                    type="button" 
                    aria-label="Toggle navigation menu"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    <span></span><span></span><span></span>
                </button>
            </nav>

            <section className="hero" id="home">
                <video className="hero-bg-video" autoPlay muted loop playsInline poster="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1920&h=1080&fit=crop" aria-hidden="true">
                    <source src="burger.mp4" type="video/mp4" />
                </video>
                <div className="hero-overlay"></div>
                <div className="hero-particles" id="particles"></div>
                <div className="hero-content">
                    <div className="hero-text">
                        <div className="hero-badge">🔥 #1 Burger in Town</div>
                        <h1 className="hero-title">
                            Taste The<br />
                            <span>Perfect</span> <span className="script">Burger</span>
                        </h1>
                        <p className="hero-desc">
                            Hand-crafted with premium Angus beef, melted cheddar cheese,
                            fresh vegetables, and our secret sauce — all on a toasted brioche bun.
                            Every bite is a masterpiece.
                        </p>
                        <div className="hero-buttons">
                            <a href="#menu" className="btn-primary">🍔 View Menu</a>
                            <a href="#reserve" className="btn-secondary">📅 Book a Table</a>
                        </div>
                        <div className="hero-stats">
                            <div className="stat">
                                <div className="stat-number" data-count="50">0</div>
                                <div className="stat-label">Menu Items</div>
                            </div>
                            <div className="stat">
                                <div className="stat-number" data-count="15">0</div>
                                <div className="stat-label">Years Experience</div>
                            </div>
                            <div className="stat">
                                <div className="stat-number" data-count="98">0</div>
                                <div className="stat-label">% Happy Clients</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="scroll-indicator">
                    <span>Scroll</span>
                    <div className="scroll-line"></div>
                </div>
            </section>

            <section className="menu-section" id="menu">
                <div className="section-header fade-in">
                    <div className="section-tag">Our Menu</div>
                    <h2 className="section-title">Explore Our Dishes</h2>
                    <div className="section-line"></div>
                    <p className="section-desc">From our signature burgers to handcrafted sides, every dish is made with passion and the finest ingredients.</p>
                </div>

                <div className="category-tabs fade-in">
                    <button className={`tab-btn ${activeCategory === 'all' ? 'active' : ''}`} onClick={() => setActiveCategory('all')}>🍽️ All</button>
                    <button className={`tab-btn ${activeCategory === 'burgers' ? 'active' : ''}`} onClick={() => setActiveCategory('burgers')}>🍔 Burgers</button>
                    <button className={`tab-btn ${activeCategory === 'sides' ? 'active' : ''}`} onClick={() => setActiveCategory('sides')}>🍟 Sides</button>
                    <button className={`tab-btn ${activeCategory === 'drinks' ? 'active' : ''}`} onClick={() => setActiveCategory('drinks')}>🥤 Drinks</button>
                    <button className={`tab-btn ${activeCategory === 'desserts' ? 'active' : ''}`} onClick={() => setActiveCategory('desserts')}>🍰 Desserts</button>
                </div>

                <div className="menu-grid" id="menuGrid">
                    {filteredMenu.map((item, index) => {
                        const imageUrl = getImageUrl(item.image);

                        return (
                        <div className="menu-card" key={item.id ?? index} data-category={item.category}>
                            <div className="menu-card-image" style={{ backgroundImage: imageUrl ? `url('${imageUrl}')` : 'none', backgroundColor: '#333' }}>
                                {item.badge && <span className={`menu-card-badge ${item.badge}`}>{item.badgeText}</span>}
                            </div>
                            <div className="menu-card-body">
                                <div className="menu-card-top">
                                    <h3 className="menu-card-name">{item.name}</h3>
                                    <span className="menu-card-price">${Number(item.price ?? 0).toFixed(2)}</span>
                                </div>
                                <p className="menu-card-desc">{item.desc}</p>
                                <div className="menu-card-tags">
                                    {(item.tags ?? []).map((t, i) => <span className="tag" key={i}>{t}</span>)}
                                </div>
                                <div className="menu-card-footer">
                                    <div className="menu-card-rating">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <span 
                                                key={star}
                                                onClick={() => handleRate(item.id, star)}
                                                style={{ 
                                                    cursor: 'pointer', 
                                                    color: star <= Math.round(item.rating) ? 'var(--gold)' : 'var(--text-muted)',
                                                    fontSize: '18px',
                                                }}
                                                title={`Rate ${star} stars`}
                                                className="star-icon"
                                            >
                                                ★
                                            </span>
                                        ))}
                                        <span style={{ marginLeft: '6px', fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500 }}>
                                            ({parseFloat(item.rating).toFixed(1)})
                                        </span>
                                    </div>
                                    <button className="btn-add" onClick={() => addToCart(item.name)}>+ Add</button>
                                </div>
                            </div>
                        </div>
                        );
                    })}
                </div>
            </section>

            <section className="specials-section" id="specials">
                <div className="section-header fade-in">
                    <div className="section-tag">{specialsHeading}</div>
                    <h2 className="section-title">{specialsTitle}</h2>
                    <div className="section-line"></div>
                    <p className="section-desc">{specialsDescription}</p>
                </div>

                <div className="specials-grid">
                    {specialsItems.map((s, i) => (
                        <div className="special-card fade-in" key={i}>
                            <span className="special-icon">{s.icon}</span>
                            <h3 className="special-title">{s.title}</h3>
                            <p className="special-desc">{s.desc}</p>
                            <div className="special-price">{s.price} {s.oldPrice ? (<small>{s.oldPrice}</small>) : null}</div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="about-section" id="about">
                <div className="about-content">
                    <div className="about-image fade-in">
                        <img 
                            src={aboutData.image}
                            alt="Restaurant Interior" 
                            className="about-img-main" 
                            loading="lazy"
                            onError={(e) => { e.target.onerror = null; e.target.src='https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=700&fit=crop'; }}
                        />
                        <div className="about-experience">
                            <div className="number">{aboutData.years}</div>
                            <div className="label">Years</div>
                        </div>
                    </div>
                        <div className="about-text fade-in">
                        <h3>{sections?.about?.heading || sections?.aboutHeading || 'Our Story'}</h3>
                        <h2>{aboutData.storyTitle}</h2>
                        <p>{aboutData.storyText}</p>
                        <div className="about-features">
                            {(aboutData.features || []).map((f, i) => (
                                <div className="about-feature" key={i}>
                                    <div className="about-feature-icon">{f.icon}</div>
                                    <span>{f.label}</span>
                                </div>
                            ))}
                        </div>
                        <a href="#menu" className="btn-primary">Explore Menu →</a>
                    </div>
                </div>
            </section>

            <section className="testimonials-section" id="reviews">
                <div className="section-header fade-in">
                    <div className="section-tag">{testimonialsHeading}</div>
                    <h2 className="section-title">{testimonialsTitle}</h2>
                    <div className="section-line"></div>
                </div>

                <div className="testimonials-grid">
                    {testimonialsItems.map((t, i) => (
                        <div className="testimonial-card fade-in" key={i}>
                            <div className="testimonial-stars">{t.stars}</div>
                            <p className="testimonial-text">"{t.text}"</p>
                            <div className="testimonial-author">
                                <div className="testimonial-avatar">{t.avatar}</div>
                                <div>
                                    <div className="testimonial-name">{t.name}</div>
                                    <div className="testimonial-role">{t.role}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="reservation-section" id="reserve">
                <div className="reservation-content">
                    <div className="reservation-info fade-in">
                        <h3>{reservationData.titleSmall}</h3>
                        <h2>{reservationData.titleLarge}</h2>
                        <p>{reservationData.text}</p>
                        <div className="info-items">
                            {(reservationData.info || []).map((it, i) => (
                                <div className="info-item" key={i}>
                                    <div className="info-icon">{it.icon}</div>
                                    <div>
                                        <div className="info-label">{it.label}</div>
                                        <div className="info-value">{it.value}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="reservation-form fade-in">
                        <form id="reservationForm" onSubmit={handleReservationSubmit}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Your Name</label>
                                    <input type="text" placeholder="John Doe" required />
                                </div>
                                <div className="form-group">
                                    <label>Phone</label>
                                    <input type="tel" placeholder="+1 (555) 000-0000" required />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Date</label>
                                    <input type="date" required />
                                </div>
                                <div className="form-group">
                                    <label>Time</label>
                                    <input type="time" required />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Guests</label>
                                    <select required>
                                        <option value="">Select guests</option>
                                        <option>1 Person</option>
                                        <option>2 People</option>
                                        <option>3 People</option>
                                        <option>4 People</option>
                                        <option>5 People</option>
                                        <option>6+ People</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Occasion</label>
                                    <select>
                                        <option value="">Select occasion</option>
                                        <option>Birthday</option>
                                        <option>Anniversary</option>
                                        <option>Business</option>
                                        <option>Casual</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Special Requests</label>
                                <textarea rows="3" placeholder="Any dietary requirements or special requests..."></textarea>
                            </div>
                            <button type="submit" className="btn-submit">🍽️ Reserve My Table</button>
                        </form>
                    </div>
                </div>
            </section>

            <footer className="footer">
                <div className="footer-content">
                    <div className="footer-brand">
                        <span className="logo-text" style={{ fontFamily: "'Playfair Display', serif", color: 'var(--gold)' }}>{logoSrc ? '' : brandLogo} {brandName} House</span>
                        <p>Premium burgers crafted with passion. Every bite tells a story of quality, flavor, and dedication to the art of grilling.</p>
                        <div className="social-links">
                            <a href="#" className="social-link" aria-label="Facebook">📘</a>
                            <a href="#" className="social-link" aria-label="Instagram">📸</a>
                            <a href="#" className="social-link" aria-label="Twitter">🐦</a>
                            <a href="#" className="social-link" aria-label="YouTube">📺</a>
                        </div>
                    </div>
                    <div className="footer-col">
                        <h4>Quick Links</h4>
                        <ul>
                            <li><a href="#home">Home</a></li>
                            <li><a href="#menu">Menu</a></li>
                            <li><a href="#specials">Specials</a></li>
                            <li><a href="#about">About Us</a></li>
                            <li><a href="#reserve">Reservations</a></li>
                            <li>
                                <a href="/register" onClick={(e) => { e.preventDefault(); router.get('/register'); }}>Register</a>
                            </li>
                            <li>
                                <a href="/login" onClick={(e) => { e.preventDefault(); router.get('/login'); }}>Login</a>
                            </li>
                        </ul>
                    </div>
                    <div className="footer-col">
                        <h4>Menu</h4>
                        <ul>
                            <li><a href="#menu">Burgers</a></li>
                            <li><a href="#menu">Sides</a></li>
                            <li><a href="#menu">Drinks</a></li>
                            <li><a href="#menu">Desserts</a></li>
                            <li><a href="#menu">Kids Menu</a></li>
                        </ul>
                    </div>
                    <div className="footer-col">
                        <h4>Hours</h4>
                        <ul>
                            <li><a href="#">Mon–Fri: 11AM–11PM</a></li>
                            <li><a href="#">Saturday: 10AM–12AM</a></li>
                            <li><a href="#">Sunday: 10AM–10PM</a></li>
                            <li><a href="#">Happy Hour: 4–6PM</a></li>
                        </ul>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>© 2024 {brandName} House. All rights reserved. Made with ❤️ and 🍔</p>
                </div>
            </footer>

            <button 
                className="cart-float" 
                id="cartFloat" 
                aria-label="View Cart" 
                onClick={() => showNotification('🛒 Cart feature coming soon!')}
            >
                🛒
                <span className="cart-count" id="cartCount">{cartItems}</span>
            </button>
        </>
    );
}