import fs from 'fs';

function generatePageHTML(title, price, description, highlights, images, optionsHtml, badgeStr) {
    let imagesHtml = '';
    let navHtml = '';
    let thumbHtml = '';
    
    images.forEach((img, idx) => {
        const opc = idx === 0 ? 'opacity-100' : 'opacity-0';
        imagesHtml += '<img class="carousel-img absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ' + opc + '" src="' + img + '" alt="">';
        
        const dotOpc = idx === 0 ? 'opacity-100' : 'opacity-50';
        navHtml += '<div class="w-2 h-2 rounded-full bg-surface transition-opacity ' + dotOpc + '"></div>';
        
        const border = idx === 0 ? 'border-primary' : 'border-transparent hover:border-primary/50';
        thumbHtml += '<button onclick="goToSlide(' + idx + ')" class="aspect-[4/5] w-full rounded-lg overflow-hidden border-2 focus:outline-none ' + border + '"><img class="w-full h-full object-cover" src="' + img + '"></button>';
    });

    return `<!DOCTYPE html>
<html class="light" lang="en">
<head>
    <meta charset="utf-8"/>
    <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
    <title>` + title + ` | THE DIGITAL LOOM</title>
    <link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800&family=Noto+Serif:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet"/>
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
    <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
    <script id="tailwind-config">
          tailwind.config = {
            darkMode: "class",
            theme: {
              extend: {
                colors: {
                  "surface-container": "#efeeea",
                  "surface-tint": "#8a4f34",
                  "primary": "#874d32",
                  "primary-container": "#a46448",
                  "on-surface": "#1b1c1a",
                  "on-surface-variant": "#53433e",
                  "surface-variant": "#e4e2de",
                  "background": "#fbf9f5",
                  "outline": "#85736c",
                  "on-primary": "#ffffff",
                  "tertiary": "#785253"
                },
                fontFamily: {
                  "headline": ["Newsreader", "serif"],
                  "body": ["Noto Serif", "serif"],
                  "label": ["Noto Serif", "serif"]
                },
                borderRadius: {"DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "full": "9999px"},
              },
            },
          }
    </script>
    <link rel="stylesheet" href="./style.css">
</head>
<body class="text-on-surface selection:bg-primary/20 selection:text-primary grain-overlay bg-background">
    <!-- SVG Noise -->
    <svg style="display: none;">
        <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
            <feColorMatrix type="saturate" values="0"/>
        </filter>
    </svg>
    <style>
        .grain-overlay::before {
            background-image: none !important;
            filter: url(#noiseFilter);
            opacity: 0.15;
        }
        .carousel-img {
            pointer-events: none;
        }
        .carousel-img.opacity-100 {
            pointer-events: auto;
        }
    </style>

    <!-- TopNavBar -->
    <nav class="fixed top-0 w-full z-50 bg-[#fbf9f5]/90 backdrop-blur-md transition-all duration-500 border-b border-outline/5">
        <div class="flex justify-between items-center w-full px-12 py-6 max-w-screen-2xl mx-auto">
            <a href="./index.html" class="text-2xl font-bold tracking-tighter text-primary uppercase font-serif italic hover:opacity-80 transition-opacity">
                THE DIGITAL LOOM
            </a>
            <div class="hidden md:flex items-center gap-12">
                <a class="text-[#53433e] opacity-80 hover:opacity-100 hover:text-primary transition-opacity duration-300 font-serif italic tracking-tight" href="./index.html#collections">Collections</a>
                <a class="text-[#53433e] opacity-80 hover:opacity-100 hover:text-primary transition-opacity duration-300 font-serif italic tracking-tight" href="./index.html#craft">The Craft</a>
                <a class="text-[#53433e] opacity-80 hover:opacity-100 hover:text-primary transition-opacity duration-300 font-serif italic tracking-tight" href="./index.html#archive">Archive</a>
                <a class="text-[#53433e] opacity-80 hover:opacity-100 hover:text-primary transition-opacity duration-300 font-serif italic tracking-tight" href="./index.html#studio">Studio</a>
                <a class="text-[#53433e] opacity-80 hover:opacity-100 hover:text-primary transition-opacity duration-300 font-serif italic tracking-tight" href="./index.html#journal">Journal</a>
            </div>
            <div class="flex items-center gap-6">
                <button onclick="toggleCart()" class="text-primary hover:scale-110 active:scale-95 transition-transform duration-200 cursor-pointer">
                    <span class="material-symbols-outlined" data-icon="shopping_bag">shopping_bag</span>
                </button>
            </div>
        </div>
    </nav>

    <main class="pt-32 max-w-screen-2xl mx-auto px-6 md:px-12 mb-40">
        <!-- Breadcrumb -->
        <div class="py-4 mb-8 text-sm font-body text-on-surface-variant flex items-center gap-2">
            <a href="./index.html" class="hover:text-primary transition-colors">Home</a>
            <span>/</span>
            <a href="./index.html#collections" class="hover:text-primary transition-colors">Collections</a>
            <span>/</span>
            <span class="text-primary italic">` + title + `</span>
        </div>

        <!-- Product Layout -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-start relative">
            
            <!-- Left: Image Carousel -->
            <div class="md:col-span-7 relative group" id="product-carousel">
                <div class="aspect-[4/5] rounded-xl overflow-hidden bg-surface-container shadow-sm relative">
                    <!-- Images -->
                    ` + imagesHtml + `
                    
                    <!-- Navigation Arrows -->
                    <button onclick="prevSlide()" class="absolute left-4 top-1/2 -translate-y-1/2 bg-surface/80 p-3 rounded-full text-on-surface shadow-lg hover:bg-surface transition-colors backdrop-blur-sm opacity-0 group-hover:opacity-100 duration-300 z-10 focus:outline-none">
                        <span class="material-symbols-outlined">arrow_back</span>
                    </button>
                    <button onclick="nextSlide()" class="absolute right-4 top-1/2 -translate-y-1/2 bg-surface/80 p-3 rounded-full text-on-surface shadow-lg hover:bg-surface transition-colors backdrop-blur-sm opacity-0 group-hover:opacity-100 duration-300 z-10 focus:outline-none">
                        <span class="material-symbols-outlined">arrow_forward</span>
                    </button>
                    
                    <!-- Indicators -->
                    <div class="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10" id="carousel-indicators">
                        ` + navHtml + `
                    </div>
                </div>
                
                <!-- Thumbnails -->
                <div class="grid grid-cols-3 gap-4 mt-4">
                    ` + thumbHtml + `
                </div>
            </div>

            <!-- Right: Sticky Product Info -->
            <div class="md:col-span-5 md:sticky md:top-32 space-y-10">
                <div>
                    <h1 class="font-headline text-5xl md:text-6xl text-primary leading-tight mb-2">` + title + `</h1>
                    <p class="font-body text-on-surface-variant italic text-lg mb-6">` + badgeStr + `</p>
                    <p class="text-2xl font-headline text-on-surface font-bold">$` + price + `</p>
                </div>
                
                <div class="stitch-line"></div>

                <div class="space-y-4">
                    <p class="text-on-surface-variant leading-relaxed font-body">
                        ` + description + `
                    </p>
                    <ul class="text-sm font-body text-on-surface-variant opacity-80 list-disc list-inside space-y-2 pt-4">
                        ` + highlights.map(h => '<li>' + h + '</li>').join('') + `
                    </ul>
                </div>

                ` + optionsHtml + `

                <div class="pt-4">
                    <button onclick="showToast('` + title + ` added to bag!')" class="w-full bg-primary text-on-primary py-5 rounded-lg font-label uppercase tracking-widest text-sm hover:bg-primary-container active:scale-[0.98] transition-all shadow-xl shadow-primary/10">
                        Add to Bag — $` + price + `
                    </button>
                    <p class="text-center text-xs text-on-surface-variant font-label uppercase tracking-widest mt-4 opacity-50">Free shipping on global orders</p>
                </div>

                <div class="stitch-line mt-8"></div>
                
                <div class="pt-4 flex flex-col gap-4">
                    <div class="flex items-center gap-4 text-sm font-label text-on-surface">
                        <span class="material-symbols-outlined text-primary">eco</span>
                        Ethically Sourced Materials
                    </div>
                    <div class="flex items-center gap-4 text-sm font-label text-on-surface">
                        <span class="material-symbols-outlined text-primary">verified</span>
                        Lifetime Mend Guarantee
                    </div>
                </div>
            </div>
        </div>
    </main>

    <!-- Footer -->
    <footer id="archive" class="bg-[#2b221f] w-full pt-20 pb-12 transition-all">
        <div class="flex flex-col md:flex-row justify-between items-center px-12 w-full gap-8 max-w-screen-2xl mx-auto">
            <div class="text-lg font-bold text-[#fbf9f5] opacity-90 font-serif tracking-widest uppercase">
                THE DIGITAL LOOM
            </div>
            <div class="flex flex-wrap justify-center gap-8">
                <a class="text-[#d8c2ba] opacity-60 hover:opacity-100 hover:text-[#ffffff] transition-all font-serif text-sm tracking-wide" href="#" onclick="showToast('Opening page...')">Sustainability</a>
                <a class="text-[#d8c2ba] opacity-60 hover:opacity-100 hover:text-[#ffffff] transition-all font-serif text-sm tracking-wide" href="#" onclick="showToast('Opening page...')">Wholesale</a>
                <a class="text-[#d8c2ba] opacity-60 hover:opacity-100 hover:text-[#ffffff] transition-all font-serif text-sm tracking-wide" href="#" onclick="showToast('Opening page...')">Shipping & Returns</a>
            </div>
            <div class="text-[#fbf9f5] font-serif text-sm tracking-wide opacity-50">
                © 2024 THE DIGITAL LOOM. CRAFTED BY HAND.
            </div>
        </div>
    </footer>
    <script type="module" src="/main.js"></script>
</body>
</html>`;
}

// Data for Heirloom Cardigan
const cardiganImgs = [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAOVLbhFpJa5S4QFXiD83ycHu_Q0Gn4TgQ3256LWSFFK7Apivjr9Hnf3Ss1197ItUOQ94nq9cwi80cgdSkJgVToAyzgNQII7IK5wuPmDR7OT0OU-4tAwI1sFCyMcnoE3ZqHidvZbbcAYecbGOgezXwPo7H4kRfeYaGtUel4lSiqNrHtl0SnTWCT9qQCLjZhLcGSQoXmjjLxkyNVUNwSo4rf5SCnuLe64yOZmbcyR3TQm_rsPQpn2-2fyUhgkYfYzJvyFmVDaGOXvOMW',
    './model1.png',
    './detail.png'
];
const cardiganOptions = `
<div class="space-y-4 pt-4">
    <div class="flex justify-between items-center text-sm font-label uppercase tracking-widest text-on-surface-variant mb-2">
        <span>Select Size</span>
        <a href="#" onclick="showToast('Size guide opening...')" class="border-b border-on-surface-variant pb-0.5 hover:text-primary transition-colors">Size Guide</a>
    </div>
    <div class="grid grid-cols-4 gap-3">
        <button onclick="this.parentElement.querySelectorAll('button').forEach(b => b.classList.remove('ring-2', 'ring-primary')); this.classList.add('ring-2', 'ring-primary')" class="border border-outline/30 rounded py-3 font-body hover:border-primary transition-colors focus:outline-none">XS</button>
        <button onclick="this.parentElement.querySelectorAll('button').forEach(b => b.classList.remove('ring-2', 'ring-primary')); this.classList.add('ring-2', 'ring-primary')" class="border border-outline/30 rounded py-3 font-body hover:border-primary transition-colors focus:outline-none ring-2 ring-primary">S</button>
        <button onclick="this.parentElement.querySelectorAll('button').forEach(b => b.classList.remove('ring-2', 'ring-primary')); this.classList.add('ring-2', 'ring-primary')" class="border border-outline/30 rounded py-3 font-body hover:border-primary transition-colors focus:outline-none">M</button>
        <button onclick="this.parentElement.querySelectorAll('button').forEach(b => b.classList.remove('ring-2', 'ring-primary')); this.classList.add('ring-2', 'ring-primary')" class="border border-outline/30 rounded py-3 font-body hover:border-primary transition-colors focus:outline-none">L</button>
    </div>
</div>
`;

// Data for Linens
const linensImgs = [
    'https://images.unsplash.com/photo-1596431969426-5ab9475ab5ec?q=80&w=1200&auto=format&fit=crop', 
    'https://images.unsplash.com/photo-1615529182904-14819c35db37?q=80&w=1200&auto=format&fit=crop', 
    './linens_detail.png' 
];
const linensOptions = `
<div class="space-y-4 pt-4">
    <div class="flex justify-between items-center text-sm font-label uppercase tracking-widest text-on-surface-variant mb-2">
        <span>Select Color</span>
    </div>
    <div class="grid grid-cols-3 gap-3">
        <button onclick="this.parentElement.querySelectorAll('button').forEach(b => b.classList.remove('ring-2', 'ring-primary')); this.classList.add('ring-2', 'ring-primary'); goToSlide(1);" class="border border-outline/30 rounded py-3 font-body hover:border-primary transition-colors focus:outline-none ring-2 ring-primary">Sage Green</button>
        <button onclick="this.parentElement.querySelectorAll('button').forEach(b => b.classList.remove('ring-2', 'ring-primary')); this.classList.add('ring-2', 'ring-primary'); goToSlide(0);" class="border border-outline/30 rounded py-3 font-body hover:border-primary transition-colors focus:outline-none">Oatmeal</button>
        <button onclick="this.parentElement.querySelectorAll('button').forEach(b => b.classList.remove('ring-2', 'ring-primary')); this.classList.add('ring-2', 'ring-primary'); goToSlide(2);" class="border border-outline/30 rounded py-3 font-body hover:border-primary transition-colors focus:outline-none">Charcoal</button>
    </div>
</div>
`;

// Data for Tapestry
const tapestryImgs = [
    './tapestry_detail.png',
    'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1200&auto=format&fit=crop', 
    'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1200&auto=format&fit=crop'  
];
const tapestryOptions = ``;

fs.writeFileSync('product.html', generatePageHTML(
    'The Heirloom Cardigan', '280', 
    'Designed to be a companion for crisp mornings and slow weekends. The Heirloom Cardigan is hand-knitted by our master artisans using un-dyed, wild Icelandic wool. Each piece takes approximately 24 hours to craft, featuring our signature textured honeycomb stitch that gracefully traps warmth while remaining light on the shoulders.',
    ['100% Naturally sourced Icelandic Wool', 'Handmade in a rural Italian studio', 'Oversized, relaxed drape', 'Corozo nut buttons'],
    cardiganImgs, cardiganOptions, 'Wild Icelandic Wool'
));

fs.writeFileSync('product-linens.html', generatePageHTML(
    'Dining Linens Set', '145', 
    'Elevate your everyday dining with our organic linen set. Woven on traditional wooden looms in our coastal studio, these naturally dyed flax linens grow softer with every wash. The beautiful raw fringed edges add a touch of rustic elegance to any table setting.',
    ['100% Organic European Flax', 'Woven on heritage wooden looms', 'Set of 4 large dinner napkins', 'Natural frayed edge finishing'],
    linensImgs, linensOptions, 'Pure European Flax'
));

fs.writeFileSync('product-tapestry.html', generatePageHTML(
    'Basalt Wall Tapestry', '420', 
    'A bold statement piece for the modern interior. The Basalt Wall Tapestry explores the intersection of raw nature and contemporary design. Completely hand-woven over three weeks, it combines chunky un-dyed wool with stark, basalt-toned accents to create deep, shadow-catching texture on your wall.',
    ['Sustainably sourced wool, cotton, and jute', 'Hand-woven abstract composition', 'Dimensions: 3ft wide x 4.5ft tall', 'Includes hand-carved walnut hanging beam'],
    tapestryImgs, tapestryOptions, 'Mixed Fiber Art'
));

console.log("Assets and path logic fixed.");
