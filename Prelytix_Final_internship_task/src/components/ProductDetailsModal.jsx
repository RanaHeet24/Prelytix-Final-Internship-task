import React, { useEffect, useRef, useState } from 'react';
import { X, Flame, ShoppingCart, Info, Award, HelpCircle } from 'lucide-react';
import Button from './UI/Button';

// Extended metadata database for catalog items to keep data clean and decoupled
const PRODUCT_METADATA = {
  p1: {
    description: "Active noise-cancelling wireless earbuds featuring custom spatial audio, adaptive EQ, and up to 30 hours of high-fidelity listening time with the companion smart charging case.",
    features: [
      "Active Noise Cancellation (ANC) with transparency mode",
      "Custom Spatial Audio with dynamic head tracking",
      "IPX4 sweat and water resistance for sports",
      "Smart Qi wireless charging case with magnetic latch"
    ],
    whyBuy: "Ideal for audiophiles and remote professionals seeking immersive sound isolation and crystal-clear microphone performance on calls."
  },
  p2: {
    description: "Premium hot-swappable mechanical keyboard equipped with custom lubricated linear switches, customizable per-key RGB backlighting, and a solid anodized aluminum top frame.",
    features: [
      "Hot-swappable mechanical switches (3/5-pin compatible)",
      "Dynamic per-key RGB lighting with custom profiles",
      "Anodized aluminum alloy top plate for structural rigidity",
      "Detachable USB-C high-speed braided cable"
    ],
    whyBuy: "A great upgrade for developers, gamers, and writers who value premium tactile keystroke responsiveness and deep workspace customization."
  },
  p3: {
    description: "Luxury titanium smartwatch featuring an always-on AMOLED display, comprehensive biometric monitoring (heart rate, blood oxygen, sleep quality), and up to 14 days of battery life.",
    features: [
      "Ultra-bright always-on AMOLED screen",
      "Grade 5 titanium alloy case with sapphire glass",
      "All-day heart rate, SpO2, and sleep tracking",
      "5ATM water resistance rated for swimming"
    ],
    whyBuy: "For active users needing a premium wearable that balances elegant watch aesthetics with powerful sport and health data telemetry."
  },
  p4: {
    description: "Home cinema projector delivering native 4K UHD resolution, 2500 ANSI lumens, HDR10 decoding support, and integrated Harman Kardon stereo sound.",
    features: [
      "Native 4K UHD resolution (3840 x 2160)",
      "Ultra-bright 2,500 ANSI lumens projection",
      "HDR10 and HLG high dynamic range support",
      "Built-in Harman Kardon dual stereo speakers"
    ],
    whyBuy: "Transform any living space into a cinema. Perfect for movie enthusiasts and sports fans wanting high brightness and color fidelity."
  },
  p5: {
    description: "Extra-large desk pad crafted from natural merino felt wool and premium micro-textured rubber backing, designed to shield your setup and enhance mouse tracking precision.",
    features: [
      "100% natural soft merino felt wool",
      "Anti-slip micro-textured rubber base layer",
      "Reinforced anti-fray stitched border edges",
      "Water-repellent protective top coating"
    ],
    whyBuy: "Shields your desktop workspace while providing premium warmth, acoustic dampening, and smooth mouse tracking gliding surface."
  },
  p6: {
    description: "Professional studio-grade suspension mic arm featuring internal springs, integrated cable management guides, and a robust 360-degree rotation clamp.",
    features: [
      "Premium internal tension spring mechanics",
      "Integrated hidden cable routing channels",
      "360-degree fluid rotation with lock keys",
      "Heavy-duty C-clamp for stable desktop desk mounting"
    ],
    whyBuy: "Essential for podcasters, streamers, and audio professionals who want an organized, vibration-isolated desk with flexible mic placement."
  }
};

export default function ProductDetailsModal({ product, onClose, onAddToCart, buttonState }) {
  const modalRef = useRef(null);
  const [isClosing, setIsClosing] = useState(false);

  // Retrieve metadata or generate dynamically for fallback/new products
  const meta = PRODUCT_METADATA[product.id] || {
    description: `Premium high-performance ${product.name} custom-engineered for optimal workspace productivity and modern aesthetics in the ${product.category} category.`,
    features: [
      `Premium ${product.category} industrial engineering`,
      "Ergonomic workspace optimization design",
      "Highly durable premium construction materials",
      "Plug-and-play compatibility layout"
    ],
    whyBuy: `A fantastic choice to elevate your daily routine with high-quality ${product.category} performance, reliability, and modern aesthetics.`
  };

  // Close with animation helper
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 200); // matches transition timing
  };

  // Escape key listener for accessibility
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    
    // Disable scroll on body when modal is open
    document.body.style.overflow = 'hidden';

    // Focus management: focus the modal container
    if (modalRef.current) {
      modalRef.current.focus();
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Click outside backdrop detector
  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      handleClose();
    }
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/70 backdrop-blur-sm transition-opacity duration-200 ${
        isClosing ? 'opacity-0' : 'opacity-100'
      }`}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        ref={modalRef}
        tabIndex={-1}
        className={`relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-white/5 rounded-3xl p-6 sm:p-8 shadow-2xl focus:outline-none transition-transform duration-200 ${
          isClosing ? 'scale-95 translate-y-4' : 'scale-100 translate-y-0'
        }`}
      >
        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all border border-transparent hover:border-white/5 cursor-pointer"
          aria-label="Close details dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Responsive Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Column 1: Image & Category Label */}
          <div className="space-y-4">
            <div className="w-full aspect-[4/3] rounded-2xl bg-slate-950 border border-white/5 overflow-hidden relative">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-3 left-3 bg-black/50 backdrop-blur-md text-[10px] font-bold text-indigo-300 px-3 py-1 rounded-lg uppercase tracking-wider border border-white/5">
                {product.category}
              </span>
              {product.stock <= 0 && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center">
                  <span className="bg-rose-500/15 border border-rose-500/30 text-rose-400 font-bold text-xs tracking-widest uppercase px-3 py-1.5 rounded-lg animate-pulse">
                    Out of Stock
                  </span>
                </div>
              )}
            </div>

            {/* Why Buy This Product Card */}
            <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-2xl p-5 space-y-2">
              <div className="flex items-center space-x-2 text-indigo-400">
                <Award className="w-4 h-4" />
                <h4 className="text-xs font-bold uppercase tracking-wider">Why Buy This Product?</h4>
              </div>
              <p className="text-xs text-indigo-200/80 leading-relaxed font-medium">
                {meta.whyBuy}
              </p>
            </div>
          </div>

          {/* Column 2: Product info */}
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 id="modal-title" className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                {product.name}
              </h2>
              <div className="flex items-center space-x-4">
                <span className="text-2xl font-black text-indigo-400">₹{product.price.toFixed(2)}</span>
                <span className={`text-xs px-2.5 py-1 rounded-lg font-semibold border ${
                  product.stock > 0 
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                    : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                }`}>
                  {product.stock > 0 ? `In Stock: ${product.stock}` : 'Out of Stock'}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5" />
                Product Overview
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {meta.description}
              </p>
            </div>

            {/* Key Features */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5" />
                Key Specifications
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-400">
                {meta.features.map((feature, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-indigo-400 mt-0.5">•</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={() => {
                  onAddToCart(product);
                  // Keep modal open unless they choose to close it
                }}
                disabled={buttonState.disabled}
                className="flex-grow font-bold text-xs tracking-wider uppercase py-3.5 flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>{buttonState.text}</span>
              </Button>
              <Button 
                variant="outline" 
                onClick={handleClose}
                className="font-bold text-xs tracking-wider uppercase py-3.5"
              >
                Close Details
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
