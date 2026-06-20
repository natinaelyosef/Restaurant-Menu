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

    // Specials: support both nested `{ specials: { heading,title,description,items:[...] } }`
    // and the flat legacy `{ specials: [ ...items ] , specialsHeading: ..., specialsTitle: ... }
    const specialsHeading = sections?.specials?.heading || sections?.specialsHeading || "Today's Specials";
    const specialsTitle = sections?.specials?.title || sections?.specialsTitle || "Chef's Recommendations";
    const specialsDescription = sections?.specials?.description || sections?.specialsDescription || 'Limited-time offers crafted by our head chef using seasonal ingredients.';
    const specialsItems = sections?.specials?.items || (Array.isArray(sections?.specials) ? sections.specials : [
        {
            icon: '🍔',
            title: 'The Dola Classic',
            desc: 'Double Angus patty, melted cheddar, caramelized onions, pickles, secret sauce on brioche bun.',
            price: '$14.99',
            oldPrice: '$19.99'
        },
        {
            icon: '🥩',
            title: 'Smoky BBQ Burger',
            desc: 'Smoked beef patty, BBQ sauce, crispy onion rings, pepper jack cheese, jalapeños.',
            price: '$16.99',
            oldPrice: '$22.99'
        },
        {
            icon: '🌿',
            title: 'Garden Veggie Burger',
            desc: 'Plant-based patty, avocado, sprouts, tomato, red onion, herb aioli on whole grain bun.',
            price: '$12.99',
            oldPrice: '$17.99'
        }
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
        if (Array.isArray(tags)) {
            return tags;
        }

        if (typeof tags === 'string') {
            try {
                const parsedTags = JSON.parse(tags);
                return Array.isArray(parsedTags) ? parsedTags : [];
            } catch {
                return tags.split(',').map((tag) => tag.trim()).filter(Boolean);
            }
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

    const filteredMenu = activeCategory === 'all'
        ? displayedMenuItems
        : displayedMenuItems.filter(i => i.category === activeCategory);

    const getImageUrl = (image) => {
        if (!image) {
            return '';
        }

        if (image.startsWith('http') || image.startsWith('/')) {
            return image;
        }

        return `/storage/${image}`;
    };

    // Inject CSS
    useEffect(() => {
        const styleId = 'dola-grill-styles';
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.innerHTML = `
                /* ===== RESET & BASE ===== */
                *,
                *::before,
                *::after {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }

                :root {
                    --primary: #c8102e;
                    --primary-dark: #a00d24;
                    --gold: #d4a017;
                    --gold-light: #f0c040;
                    --dark: #1a1a1a;
                    --darker: #111;
                    --cream: #fdf6ec;
                    --brown: #3e2723;
                    --orange: #e65100;
                    --text-light: #f5f5f5;
                    --text-muted: #aaa;
                }

                html {
                    scroll-behavior: smooth;
                }

                body {
                    font-family: 'Poppins', sans-serif;
                    background: var(--darker);
                    color: var(--text-light);
                    overflow-x: hidden;
                }

                /* ===== PRELOADER ===== */
                .preloader {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: #fff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 99999;
                    transition: opacity 0.8s ease, visibility 0.8s ease;
                }

                .preloader.hidden {
                    opacity: 0;
                    visibility: hidden;
                }

                .preloader-burger {
                    font-size: 60px;
                    animation: bounce 0.6s ease infinite alternate;
                }

                @keyframes bounce {
                    to {
                        transform: translateY(-20px) scale(1.1);
                    }
                }

                .preloader-text {
                    font-family: 'Dancing Script', cursive;
                    font-size: 28px;
                    color: var(--primary);
                    margin-top: 20px;
                }

                /* ===== NAVBAR ===== */
                .navbar {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    padding: 18px 60px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    z-index: 1000;
                    transition: all 0.4s ease;
                    background: transparent;
                }

                .navbar.scrolled {
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(20px);
                    padding: 12px 60px;
                    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.05);
                }

                .navbar.scrolled .logo-text { color: var(--dark); }
                .navbar.scrolled .logo-sub { color: #666; }
                .navbar.scrolled .nav-links a { color: var(--dark); }
                .navbar.scrolled .btn-reserve { color: #fff !important; }
                .navbar.scrolled .hamburger span { background: var(--dark); }

                .theme-toggle {
                    width: 44px;
                    height: 44px;
                    border-radius: 50%;
                    border: 1px solid rgba(255, 255, 255, 0.28);
                    background: rgba(0, 0, 0, 0.32);
                    color: #fff;
                    font-size: 19px;
                    cursor: pointer;
                    display: grid;
                    place-items: center;
                    transition: all 0.3s ease;
                    backdrop-filter: blur(14px);
                }

                .theme-toggle:hover {
                    background: var(--primary);
                    border-color: var(--primary);
                    transform: translateY(-2px);
                }
                
                .theme-toggle:focus-visible {
                    outline: 2px solid var(--gold);
                    outline-offset: 2px;
                }

                .navbar.scrolled .theme-toggle {
                    background: #f1f1f1;
                    color: var(--dark);
                    border-color: #dedede;
                }

                .logo {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    text-decoration: none;
                }

                .logo-icon { font-size: 36px; }

                .logo-text {
                    font-family: 'Playfair Display', serif;
                    font-size: 28px;
                    font-weight: 900;
                    color: var(--gold);
                    letter-spacing: 1px;
                    transition: color 0.3s;
                }

                .logo-sub {
                    font-size: 10px;
                    color: rgba(255, 255, 255, 0.7);
                    letter-spacing: 4px;
                    text-transform: uppercase;
                    display: block;
                    margin-top: -4px;
                    transition: color 0.3s;
                }

                .nav-links {
                    display: flex;
                    list-style: none;
                    gap: 35px;
                    align-items: center;
                }

                .nav-links a {
                    text-decoration: none;
                    color: var(--text-light);
                    font-size: 14px;
                    font-weight: 500;
                    letter-spacing: 1.5px;
                    text-transform: uppercase;
                    position: relative;
                    transition: color 0.3s;
                }

                .nav-links a::after {
                    content: '';
                    position: absolute;
                    bottom: -6px;
                    left: 0;
                    width: 0;
                    height: 2px;
                    background: var(--primary);
                    transition: width 0.3s ease;
                }

                .nav-links a:hover { color: var(--primary); }
                .nav-links a:hover::after { width: 100%; }

                .btn-reserve {
                    background: var(--primary);
                    color: #fff !important;
                    padding: 12px 28px;
                    border-radius: 50px;
                    font-weight: 600;
                    letter-spacing: 1px;
                    transition: all 0.3s ease;
                    border: 2px solid var(--primary);
                }

                .btn-reserve:hover {
                    background: transparent;
                    border-color: var(--primary);
                    color: var(--primary) !important;
                }

                .btn-reserve::after { display: none !important; }

                .hamburger {
                    display: none;
                    flex-direction: column;
                    gap: 6px;
                    cursor: pointer;
                    z-index: 1001;
                    background: transparent;
                    border: none;
                }

                .hamburger span {
                    width: 30px;
                    height: 3px;
                    background: #fff;
                    border-radius: 3px;
                    transition: all 0.3s ease;
                }

                .hamburger.active span:nth-child(1) { transform: rotate(45deg) translate(6px, 6px); }
                .hamburger.active span:nth-child(2) { opacity: 0; }
                .hamburger.active span:nth-child(3) { transform: rotate(-45deg) translate(7px, -7px); }

                /* Light Mode Variables */
                body.light-mode {
                    --dark: #f2f2f2;
                    --darker: #fafafa;
                    --text-light: #181818;
                    --text-muted: #626262;
                    background: #fafafa;
                    color: #181818;
                }

                body.light-mode .navbar.scrolled { background: rgba(255, 255, 255, 0.96); }
                body.light-mode .logo-text,
                body.light-mode .navbar.scrolled .logo-text { color: var(--primary); }
                body.light-mode .logo-sub,
                body.light-mode .navbar.scrolled .logo-sub { color: #777; }
                
                body.light-mode .nav-links a,
                body.light-mode .navbar.scrolled .nav-links a { color: #242424; }
                body.light-mode .nav-links a:hover,
                body.light-mode .navbar.scrolled .nav-links a:hover { color: var(--primary); }
                body.light-mode .btn-reserve { color: #fff !important; }
                
                body.light-mode .hamburger span,
                body.light-mode .navbar.scrolled .hamburger span { background: #242424; }
                
                body.light-mode .theme-toggle {
                    background: #eeeeee;
                    color: #181818;
                    border-color: #dddddd;
                }

                body.light-mode .hero-overlay {
                    background: linear-gradient(135deg, rgba(255, 255, 255, 0.28) 0%, rgba(0, 0, 0, 0.46) 100%);
                }

                body.light-mode .menu-card,
                body.light-mode .testimonial-card,
                body.light-mode .reservation-form {
                    background: #ffffff;
                    border-color: #e5e5e5;
                    box-shadow: 0 18px 45px rgba(0, 0, 0, 0.08);
                }

                body.light-mode .special-card {
                    background: #ffffff;
                    border-color: #e5e5e5;
                }

                body.light-mode .tab-btn,
                body.light-mode .form-group input,
                body.light-mode .form-group select,
                body.light-mode .form-group textarea {
                    background: #ffffff;
                    border-color: #dcdcdc;
                    color: #181818;
                }

                body.light-mode .form-group select option {
                    background: #ffffff;
                    color: #181818;
                }

                /* ===== HERO SECTION ===== */
                .hero {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    overflow: hidden;
                    background: #000;
                }

                .hero-bg-video {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    min-width: 100%;
                    min-height: 100%;
                    width: auto;
                    height: auto;
                    object-fit: cover;
                    z-index: 0;
                    opacity: 1;
                    pointer-events: none;
                }

                .hero-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.62);
                    z-index: 1;
                }

                .hero-particles {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    z-index: 2;
                    pointer-events: none;
                }

                .particle {
                    position: absolute;
                    width: 6px;
                    height: 6px;
                    background: var(--primary);
                    border-radius: 50%;
                    opacity: 0;
                    animation: float-particle 6s ease-in-out infinite;
                }

                @keyframes float-particle {
                    0%, 100% { opacity: 0; transform: translateY(100vh) scale(0); }
                    50% { opacity: 0.3; transform: translateY(-10vh) scale(1); }
                }

                .hero-content {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 80px;
                    max-width: 1300px;
                    padding: 0 40px;
                    position: relative;
                    z-index: 3;
                }

                .hero-text {
                    flex: 1;
                    max-width: 550px;
                }

                .hero-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    background: rgba(200, 16, 46, 0.2);
                    border: 1px solid rgba(200, 16, 46, 0.4);
                    padding: 8px 20px;
                    border-radius: 50px;
                    font-size: 13px;
                    color: #fff;
                    letter-spacing: 2px;
                    text-transform: uppercase;
                    margin-bottom: 25px;
                    animation: fadeInUp 1s ease 0.3s both;
                }

                .hero-title {
                    font-family: 'Playfair Display', serif;
                    font-size: 72px;
                    font-weight: 900;
                    line-height: 1.05;
                    margin-bottom: 20px;
                    color: #ffffff;
                    animation: fadeInUp 1s ease 0.5s both;
                    text-shadow: 0 2px 20px rgba(0, 0, 0, 0.5);
                }

                .hero-title span { color: var(--primary); position: relative; }
                .hero-title .script { font-family: 'Dancing Script', cursive; color: var(--gold); font-size: 60px; }

                .hero-desc {
                    font-size: 17px;
                    color: rgba(255, 255, 255, 0.85);
                    line-height: 1.8;
                    margin-bottom: 35px;
                    animation: fadeInUp 1s ease 0.7s both;
                }

                .hero-buttons {
                    display: flex;
                    gap: 20px;
                    animation: fadeInUp 1s ease 0.9s both;
                }

                .btn-primary, .btn-secondary {
                    padding: 16px 40px;
                    border-radius: 50px;
                    font-size: 15px;
                    font-weight: 600;
                    letter-spacing: 1px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    text-decoration: none;
                    display: inline-flex;
                    align-items: center;
                    gap: 10px;
                    border: 2px solid transparent;
                }

                .btn-primary {
                    background: var(--primary);
                    color: #fff;
                    border-color: var(--primary);
                    box-shadow: 0 8px 30px rgba(200, 16, 46, 0.3);
                }

                .btn-primary:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 12px 40px rgba(200, 16, 46, 0.5);
                }

                .btn-secondary {
                    background: transparent;
                    color: #fff;
                    border-color: rgba(255, 255, 255, 0.35);
                }

                .btn-secondary:hover {
                    border-color: var(--primary);
                    color: var(--primary);
                    transform: translateY(-3px);
                    background: rgba(255, 255, 255, 0.05);
                }

                .hero-image {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    animation: fadeInRight 1.2s ease 0.5s both;
                }

                .burger-showcase { position: relative; width: 500px; height: 500px; }

                .burger-glow {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 400px;
                    height: 400px;
                    background: radial-gradient(circle, rgba(212, 160, 23, 0.2) 0%, transparent 70%);
                    border-radius: 50%;
                    animation: pulse-glow 3s ease-in-out infinite;
                }

                @keyframes pulse-glow {
                    0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
                    50% { transform: translate(-50%, -50%) scale(1.15); opacity: 1; }
                }

                .burger-img {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                    position: relative;
                    z-index: 2;
                    filter: drop-shadow(0 30px 60px rgba(0, 0, 0, 0.35));
                    animation: float 4s ease-in-out infinite;
                }

                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-20px); }
                }

                .hero-stats {
                    display: flex;
                    gap: 40px;
                    margin-top: 40px;
                    animation: fadeInUp 1s ease 1.1s both;
                }

                .stat { text-align: center; }

                .stat-number {
                    font-family: 'Playfair Display', serif;
                    font-size: 36px;
                    font-weight: 900;
                    color: var(--gold);
                }

                .stat-label {
                    font-size: 12px;
                    color: rgba(255, 255, 255, 0.7);
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                .scroll-indicator {
                    position: absolute;
                    bottom: 30px;
                    left: 50%;
                    transform: translateX(-50%);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 8px;
                    color: rgba(255, 255, 255, 0.7);
                    font-size: 11px;
                    letter-spacing: 2px;
                    text-transform: uppercase;
                    animation: fadeInUp 1s ease 1.5s both;
                    z-index: 3;
                }

                .scroll-line {
                    width: 1px;
                    height: 40px;
                    background: linear-gradient(to bottom, var(--primary), transparent);
                    animation: scroll-anim 2s ease-in-out infinite;
                }

                @keyframes scroll-anim {
                    0% { transform: scaleY(0); transform-origin: top; }
                    50% { transform: scaleY(1); transform-origin: top; }
                    51% { transform-origin: bottom; }
                    100% { transform: scaleY(0); transform-origin: bottom; }
                }

                /* ===== SECTION STYLES ===== */
                section { padding: 100px 60px; }

                .section-header { text-align: center; margin-bottom: 70px; }

                .section-tag {
                    font-family: 'Dancing Script', cursive;
                    color: var(--gold);
                    font-size: 22px;
                    margin-bottom: 10px;
                }

                .section-title {
                    font-family: 'Playfair Display', serif;
                    font-size: 52px;
                    font-weight: 900;
                    margin-bottom: 15px;
                }

                .section-line {
                    width: 60px;
                    height: 3px;
                    background: var(--primary);
                    margin: 0 auto 20px;
                    border-radius: 3px;
                }

                .section-desc {
                    color: var(--text-muted);
                    font-size: 16px;
                    max-width: 600px;
                    margin: 0 auto;
                    line-height: 1.7;
                }

                /* ===== CATEGORY TABS ===== */
                .menu-section { background: var(--dark); }

                .category-tabs {
                    display: flex;
                    justify-content: center;
                    gap: 15px;
                    margin-bottom: 60px;
                    flex-wrap: wrap;
                }

                .tab-btn {
                    padding: 12px 30px;
                    border: 2px solid rgba(255, 255, 255, 0.1);
                    background: transparent;
                    color: var(--text-muted);
                    border-radius: 50px;
                    font-size: 14px;
                    font-weight: 500;
                    letter-spacing: 1px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-family: 'Poppins', sans-serif;
                }

                .tab-btn:hover, .tab-btn.active {
                    background: var(--primary);
                    border-color: var(--primary);
                    color: #fff;
                    box-shadow: 0 5px 20px rgba(200, 16, 46, 0.4);
                }

                /* ===== MENU GRID ===== */
                .menu-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
                    gap: 30px;
                    max-width: 1300px;
                    margin: 0 auto;
                }

                .menu-card {
                    background: linear-gradient(145deg, #222, #1a1a1a);
                    border-radius: 20px;
                    overflow: hidden;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    transition: all 0.4s ease;
                    position: relative;
                    opacity: 0;
                    transform: translateY(30px);
                }

                .menu-card.visible { opacity: 1; transform: translateY(0); }

                .menu-card:hover {
                    transform: translateY(-10px);
                    border-color: rgba(212, 160, 23, 0.3);
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                }

                .menu-card-image {
                    width: 100%;
                    height: 220px;
                    background-size: cover;
                    background-position: center;
                    position: relative;
                    overflow: hidden;
                }

                .menu-card-image::after {
                    content: '';
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    height: 50%;
                    background: linear-gradient(to top, #1a1a1a, transparent);
                }

                body.light-mode .menu-card-image::after {
                    background: linear-gradient(to top, #ffffff, transparent);
                }

                .menu-card-badge {
                    position: absolute;
                    top: 15px;
                    left: 15px;
                    background: var(--primary);
                    color: #fff;
                    padding: 5px 14px;
                    border-radius: 50px;
                    font-size: 11px;
                    font-weight: 600;
                    letter-spacing: 1px;
                    text-transform: uppercase;
                    z-index: 2;
                }

                .menu-card-badge.popular { background: var(--gold); color: var(--dark); }
                .menu-card-badge.new { background: #2e7d32; }
                .menu-card-badge.spicy { background: var(--orange); }

                .menu-card-body { padding: 25px; }

                .menu-card-top {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 10px;
                }

                .menu-card-name {
                    font-family: 'Playfair Display', serif;
                    font-size: 22px;
                    font-weight: 700;
                }

                .menu-card-price {
                    font-family: 'Playfair Display', serif;
                    font-size: 26px;
                    font-weight: 900;
                    color: var(--gold);
                    white-space: nowrap;
                }

                .menu-card-desc {
                    color: var(--text-muted);
                    font-size: 14px;
                    line-height: 1.6;
                    margin-bottom: 18px;
                }

                .menu-card-tags {
                    display: flex;
                    gap: 8px;
                    flex-wrap: wrap;
                    margin-bottom: 18px;
                }

                .tag {
                    background: rgba(255, 255, 255, 0.05);
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-size: 11px;
                    color: var(--text-muted);
                }

                body.light-mode .tag {
                    background: rgba(0, 0, 0, 0.05);
                }

                .menu-card-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .menu-card-rating {
                    display: flex;
                    align-items: center;
                    gap: 2px;
                    font-size: 14px;
                }

                .star-icon:hover {
                    transform: scale(1.25);
                    color: var(--gold-light) !important;
                }

                .btn-add {
                    background: var(--primary);
                    color: #fff;
                    border: none;
                    padding: 10px 24px;
                    border-radius: 50px;
                    font-size: 13px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-family: 'Poppins', sans-serif;
                }

                .btn-add:hover {
                    background: var(--gold);
                    color: var(--dark);
                    transform: scale(1.05);
                }

                /* ===== SPECIALS SECTION ===== */
                .specials-section {
                    background: var(--darker);
                    position: relative;
                    overflow: hidden;
                }

                .specials-section::before {
                    content: '';
                    position: absolute;
                    top: -200px;
                    right: -200px;
                    width: 500px;
                    height: 500px;
                    background: radial-gradient(circle, rgba(200, 16, 46, 0.08), transparent 70%);
                    border-radius: 50%;
                }

                .specials-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 30px;
                    max-width: 1300px;
                    margin: 0 auto;
                }

                .special-card {
                    background: linear-gradient(135deg, #1e1e1e, #252525);
                    border-radius: 24px;
                    padding: 40px 30px;
                    text-align: center;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    transition: all 0.4s ease;
                    position: relative;
                    overflow: hidden;
                }

                .special-card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 4px;
                    background: linear-gradient(90deg, var(--primary), var(--gold));
                    transform: scaleX(0);
                    transition: transform 0.4s ease;
                }

                .special-card:hover::before { transform: scaleX(1); }

                .special-card:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
                }

                .special-icon { font-size: 60px; margin-bottom: 20px; display: block; }

                .special-title {
                    font-family: 'Playfair Display', serif;
                    font-size: 24px;
                    font-weight: 700;
                    margin-bottom: 10px;
                }

                .special-desc {
                    color: var(--text-muted);
                    font-size: 14px;
                    line-height: 1.7;
                    margin-bottom: 20px;
                }

                .special-price {
                    font-family: 'Playfair Display', serif;
                    font-size: 32px;
                    font-weight: 900;
                    color: var(--gold);
                }

                .special-price small {
                    font-size: 14px;
                    color: var(--text-muted);
                    text-decoration: line-through;
                    margin-left: 10px;
                }

                /* ===== ABOUT SECTION ===== */
                .about-section { background: var(--dark); }

                .about-content {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 80px;
                    max-width: 1300px;
                    margin: 0 auto;
                    align-items: center;
                }

                .about-image { position: relative; }

                .about-img-main {
                    width: 100%;
                    border-radius: 20px;
                    box-shadow: 0 30px 60px rgba(0, 0, 0, 0.5);
                }

                .about-experience {
                    position: absolute;
                    bottom: -30px;
                    right: -30px;
                    background: var(--primary);
                    padding: 25px 30px;
                    border-radius: 20px;
                    text-align: center;
                    box-shadow: 0 15px 40px rgba(200, 16, 46, 0.4);
                }

                .about-experience .number {
                    font-family: 'Playfair Display', serif;
                    font-size: 48px;
                    font-weight: 900;
                    color: #fff;
                }

                .about-experience .label {
                    font-size: 12px;
                    color: rgba(255, 255, 255, 0.8);
                    text-transform: uppercase;
                    letter-spacing: 2px;
                }

                .about-text h3 {
                    font-family: 'Dancing Script', cursive;
                    color: var(--gold);
                    font-size: 24px;
                    margin-bottom: 10px;
                }

                .about-text h2 {
                    font-family: 'Playfair Display', serif;
                    font-size: 44px;
                    font-weight: 900;
                    margin-bottom: 20px;
                    line-height: 1.2;
                }

                .about-text p {
                    color: var(--text-muted);
                    font-size: 16px;
                    line-height: 1.8;
                    margin-bottom: 30px;
                }

                .about-features {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                    margin-bottom: 35px;
                }

                .about-feature {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .about-feature-icon {
                    width: 45px;
                    height: 45px;
                    background: rgba(212, 160, 23, 0.1);
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 20px;
                    flex-shrink: 0;
                }

                .about-feature span { font-size: 14px; font-weight: 500; }

                /* ===== TESTIMONIALS ===== */
                .testimonials-section { background: var(--darker); }

                .testimonials-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 30px;
                    max-width: 1300px;
                    margin: 0 auto;
                }

                .testimonial-card {
                    background: linear-gradient(145deg, #222, #1a1a1a);
                    border-radius: 20px;
                    padding: 35px;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    transition: all 0.3s ease;
                }

                .testimonial-card:hover {
                    border-color: rgba(212, 160, 23, 0.2);
                    transform: translateY(-5px);
                }

                .testimonial-stars { color: var(--gold); font-size: 18px; margin-bottom: 15px; }

                .testimonial-text {
                    color: var(--text-muted);
                    font-size: 15px;
                    line-height: 1.7;
                    font-style: italic;
                    margin-bottom: 25px;
                }

                .testimonial-author {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                }

                .testimonial-avatar {
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, var(--primary), var(--gold));
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 20px;
                    font-weight: 700;
                    color: #fff;
                }

                .testimonial-name { font-weight: 600; font-size: 15px; }
                .testimonial-role { font-size: 12px; color: var(--text-muted); }

                /* ===== RESERVATION ===== */
                .reservation-section {
                    background: var(--dark);
                    position: relative;
                }

                .reservation-content {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 60px;
                    max-width: 1200px;
                    margin: 0 auto;
                    align-items: center;
                }

                .reservation-info h3 {
                    font-family: 'Dancing Script', cursive;
                    color: var(--gold);
                    font-size: 24px;
                    margin-bottom: 10px;
                }

                .reservation-info h2 {
                    font-family: 'Playfair Display', serif;
                    font-size: 44px;
                    font-weight: 900;
                    margin-bottom: 20px;
                }

                .reservation-info p {
                    color: var(--text-muted);
                    line-height: 1.8;
                    margin-bottom: 30px;
                }

                .info-items {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }

                .info-item {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                }

                .info-icon {
                    width: 50px;
                    height: 50px;
                    background: rgba(212, 160, 23, 0.1);
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 22px;
                    flex-shrink: 0;
                }

                .info-label {
                    font-size: 12px;
                    color: var(--text-muted);
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                .info-value { font-weight: 600; font-size: 16px; }

                .reservation-form {
                    background: linear-gradient(145deg, #222, #1a1a1a);
                    border-radius: 24px;
                    padding: 40px;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                }

                .form-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 15px;
                    margin-bottom: 15px;
                }

                .form-group { margin-bottom: 15px; }

                .form-group label {
                    display: block;
                    font-size: 13px;
                    color: var(--text-muted);
                    margin-bottom: 8px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                .form-group input,
                .form-group select,
                .form-group textarea {
                    width: 100%;
                    padding: 14px 18px;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                    color: var(--text-light);
                    font-size: 15px;
                    font-family: 'Poppins', sans-serif;
                    transition: border-color 0.3s;
                    outline: none;
                }

                .form-group input:focus,
                .form-group select:focus,
                .form-group textarea:focus { border-color: var(--gold); }

                .form-group select option { background: var(--dark); }

                .btn-submit {
                    width: 100%;
                    padding: 16px;
                    background: var(--primary);
                    color: #fff;
                    border: none;
                    border-radius: 12px;
                    font-size: 16px;
                    font-weight: 600;
                    letter-spacing: 1px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-family: 'Poppins', sans-serif;
                    margin-top: 10px;
                }

                .btn-submit:hover {
                    background: var(--gold);
                    color: var(--dark);
                    transform: translateY(-2px);
                    box-shadow: 0 10px 30px rgba(212, 160, 23, 0.3);
                }

                /* ===== FOOTER ===== */
                .footer {
                    background: var(--darker);
                    padding: 80px 60px 30px;
                    border-top: 1px solid rgba(255, 255, 255, 0.05);
                }

                .footer-content {
                    display: grid;
                    grid-template-columns: 2fr 1fr 1fr 1fr;
                    gap: 50px;
                    max-width: 1300px;
                    margin: 0 auto 60px;
                }

                .footer-brand .logo-text {
                    font-size: 32px;
                    margin-bottom: 15px;
                    display: block;
                }

                .footer-brand p {
                    color: var(--text-muted);
                    font-size: 14px;
                    line-height: 1.8;
                    margin-bottom: 20px;
                }

                .social-links { display: flex; gap: 12px; }

                .social-link {
                    width: 42px;
                    height: 42px;
                    border-radius: 12px;
                    background: rgba(255, 255, 255, 0.05);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    text-decoration: none;
                    font-size: 18px;
                    transition: all 0.3s ease;
                }

                .social-link:hover {
                    background: var(--primary);
                    transform: translateY(-3px);
                }

                .footer-col h4 {
                    font-family: 'Playfair Display', serif;
                    font-size: 18px;
                    margin-bottom: 20px;
                    color: var(--gold);
                }

                .footer-col ul { list-style: none; }
                .footer-col ul li { margin-bottom: 12px; }

                .footer-col ul li a {
                    color: var(--text-muted);
                    text-decoration: none;
                    font-size: 14px;
                    transition: color 0.3s;
                }

                .footer-col ul li a:hover { color: var(--gold); }

                .footer-bottom {
                    text-align: center;
                    padding-top: 30px;
                    border-top: 1px solid rgba(255, 255, 255, 0.05);
                    color: var(--text-muted);
                    font-size: 13px;
                    max-width: 1300px;
                    margin: 0 auto;
                }

                /* ===== CART FLOATING ===== */
                .cart-float {
                    position: fixed;
                    bottom: 30px;
                    right: 30px;
                    width: 60px;
                    height: 60px;
                    background: var(--primary);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 24px;
                    cursor: pointer;
                    z-index: 999;
                    box-shadow: 0 8px 30px rgba(200, 16, 46, 0.5);
                    transition: all 0.3s ease;
                    border: none;
                    color: #fff;
                }

                .cart-float:hover {
                    transform: scale(1.1);
                    background: var(--gold);
                }

                .cart-count {
                    position: absolute;
                    top: -5px;
                    right: -5px;
                    width: 24px;
                    height: 24px;
                    background: var(--gold);
                    color: var(--dark);
                    border-radius: 50%;
                    font-size: 12px;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                /* ===== ANIMATIONS ===== */
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(40px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @keyframes fadeInRight {
                    from { opacity: 0; transform: translateX(60px); }
                    to { opacity: 1; transform: translateX(0); }
                }

                .fade-in {
                    opacity: 0;
                    transform: translateY(30px);
                    transition: all 0.8s ease;
                }

                .fade-in.visible { opacity: 1; transform: translateY(0); }

                /* ===== NOTIFICATION ===== */
                .notification {
                    position: fixed;
                    top: 100px;
                    right: 30px;
                    background: #2e7d32;
                    color: #fff;
                    padding: 16px 28px;
                    border-radius: 12px;
                    font-size: 14px;
                    font-weight: 500;
                    z-index: 9999;
                    transform: translateX(150%);
                    transition: transform 0.4s ease;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .notification.show { transform: translateX(0); }

                /* ===== RESPONSIVE ===== */
                @media (max-width: 1024px) {
                    .hero-content { flex-direction: column; text-align: center; gap: 40px; }
                    .hero-text { max-width: 100%; }
                    .hero-title { font-size: 52px; }
                    .hero-buttons { justify-content: center; }
                    .hero-stats { justify-content: center; }
                    .burger-showcase { width: 350px; height: 350px; }
                    .about-content { grid-template-columns: 1fr; gap: 40px; }
                    .reservation-content { grid-template-columns: 1fr; }
                    .specials-grid { grid-template-columns: 1fr 1fr; }
                    .testimonials-grid { grid-template-columns: 1fr 1fr; }
                    .footer-content { grid-template-columns: 1fr 1fr; }
                }

                @media (max-width: 768px) {
                    section { padding: 70px 20px; }
                    .navbar { padding: 15px 20px; }
                    .navbar.scrolled { padding: 10px 20px; }
                    
                    .nav-links {
                        position: fixed;
                        top: 0;
                        right: -100%;
                        width: 80%;
                        height: 100vh;
                        background: rgba(26, 26, 26, 0.98);
                        flex-direction: column;
                        justify-content: center;
                        padding: 40px;
                        transition: right 0.4s ease;
                        backdrop-filter: blur(10px);
                    }
                    body.light-mode .nav-links {
                        background: rgba(255, 255, 255, 0.98);
                    }
                    .nav-links.active { right: 0; }
                    .hamburger { display: flex; }
                    .hero-title { font-size: 38px; }
                    .hero-title .script { font-size: 36px; }
                    .section-title { font-size: 36px; }
                    .menu-grid { grid-template-columns: 1fr; }
                    .specials-grid { grid-template-columns: 1fr; }
                    .testimonials-grid { grid-template-columns: 1fr; }
                    .form-row { grid-template-columns: 1fr; }
                    .footer-content { grid-template-columns: 1fr; }
                    .hero-buttons { flex-direction: column; align-items: center; }
                    .about-features { grid-template-columns: 1fr; }
                    .footer { padding: 60px 20px 20px; }
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
                                                    color: star <= Math.round(item.rating) ? '#d4a017' : '#555',
                                                    fontSize: '18px',
                                                    transition: 'all 0.2s ease',
                                                    display: 'inline-block'
                                                }}
                                                title={`Rate ${star} stars`}
                                                className="star-icon"
                                            >
                                                ★
                                            </span>
                                        ))}
                                        <span style={{ marginLeft: '4px', fontSize: '12px', color: 'var(--text-muted)' }}>
                                            ({parseFloat(item.rating).toFixed(1)})
                                        </span>
                                    </div>
                                    <button className="btn-add" onClick={() => addToCart(item.name)}>+ Add to Cart</button>
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
