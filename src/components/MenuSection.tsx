import React, { useState, useMemo } from 'react';
import { MenuItem } from '../types/index.ts';
import { Search, Sparkles, Leaf, Eye, X } from 'lucide-react';

interface MenuSectionProps {
  categories: string[];
  items: MenuItem[];
  onReserveClick: () => void;
}

export const MenuSection: React.FC<MenuSectionProps> = ({ categories, items, onReserveClick }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dietFilter, setDietFilter] = useState<'All' | 'Veg' | 'NonVeg'>('All');
  const [selectedItemModal, setSelectedItemModal] = useState<MenuItem | null>(null);
  const [showFullMenu, setShowFullMenu] = useState<boolean>(false);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
      const matchesSearch =
        searchQuery.trim() === '' ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDiet =
        dietFilter === 'All' ||
        (dietFilter === 'Veg' && item.isVegetarian) ||
        (dietFilter === 'NonVeg' && !item.isVegetarian);

      return matchesCategory && matchesSearch && matchesDiet;
    });
  }, [items, activeCategory, searchQuery, dietFilter]);

  const displayedItems = showFullMenu ? filteredItems : filteredItems.slice(0, 8);

  const signatureList = [
    'Tiramisu',
    'Biscoff Cheesecake',
    'Brownie',
    'Mocha',
    'Hot Chocolate',
    'Pesto Pasta',
    'Fruit Entremets',
    'Cream Cheese Dim Sum',
  ];

  return (
    <section id="menu" className="py-20 sm:py-28 bg-[#F8F4EC] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3">
          <div className="inline-flex items-center justify-center gap-2 text-xs uppercase tracking-[0.25em] text-[#304A3A] font-semibold">
            <span className="w-8 h-[1px] bg-[#8FA58A]" />
            <span>Culinary Offerings</span>
            <span className="w-8 h-[1px] bg-[#8FA58A]" />
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#304A3A] font-normal">
            The Bloom Menu
          </h2>
          <p className="text-sm sm:text-base text-[#4A3428]/80 leading-relaxed font-light">
            Thoughtfully crafted beverages, delicate European patisserie, and comfort dining prepared fresh daily.
          </p>
        </div>

        {/* Signature Highlights Ribbon */}
        <div className="mb-10 bg-white/60 backdrop-blur-xs p-4 sm:p-5 rounded-2xl border border-[#D8C8B4]/60">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#304A3A] mb-3">
            <Sparkles className="w-4 h-4 text-[#8FA58A]" />
            <span>Signature Guest Favorites:</span>
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-[#4A3428]">
            {signatureList.map((sig, idx) => (
              <span
                key={sig}
                className="bg-[#F8F4EC] border border-[#D8C8B4]/60 px-3 py-1.5 rounded-full font-medium"
              >
                {sig}
              </span>
            ))}
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8">
          {/* Dietary toggle */}
          <div className="flex items-center gap-1.5 p-1 bg-[#EAE2D5]/70 rounded-full w-full md:w-auto">
            {(['All', 'Veg', 'NonVeg'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setDietFilter(mode)}
                className={`flex-1 md:flex-initial px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  dietFilter === mode
                    ? 'bg-[#304A3A] text-white shadow-xs'
                    : 'text-[#4A3428]/80 hover:text-[#304A3A]'
                }`}
              >
                {mode === 'All' ? 'All Items' : mode === 'Veg' ? 'Vegetarian' : 'Non-Veg'}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4A3428]/50" />
            <input
              type="text"
              placeholder="Search coffee, desserts, pasta..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white/80 border border-[#D8C8B4]/60 rounded-full text-xs text-[#4A3428] placeholder-[#4A3428]/50 focus:outline-none focus:ring-2 focus:ring-[#8FA58A]/50 focus:border-[#8FA58A]"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 scrollbar-none">
          <button
            onClick={() => setActiveCategory('All')}
            className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === 'All'
                ? 'bg-[#304A3A] text-white'
                : 'bg-white/70 text-[#4A3428] border border-[#D8C8B4]/40 hover:bg-white'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#304A3A] text-white'
                  : 'bg-white/70 text-[#4A3428] border border-[#D8C8B4]/40 hover:bg-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Menu Items Grid */}
        {displayedItems.length === 0 ? (
          <div className="text-center py-16 bg-white/40 rounded-2xl border border-[#D8C8B4]/40">
            <p className="font-serif text-lg text-[#4A3428]">No menu items found</p>
            <p className="text-xs text-[#4A3428]/60 mt-1">Try another category or search term.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedItemModal(item)}
                className="group bg-white/80 hover:bg-white rounded-2xl p-5 border border-[#D8C8B4]/50 shadow-xs hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center shrink-0 ${
                          item.isVegetarian
                            ? 'border-emerald-600'
                            : 'border-red-600'
                        }`}
                        title={item.isVegetarian ? 'Vegetarian' : 'Non-Vegetarian'}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            item.isVegetarian ? 'bg-emerald-600' : 'bg-red-600'
                          }`}
                        />
                      </span>
                      <h4 className="font-serif text-lg text-[#304A3A] font-medium group-hover:text-[#6D8469] transition-colors leading-snug">
                        {item.name}
                      </h4>
                    </div>

                    {/* Price display with zero-assumptions rule */}
                    <div className="text-right shrink-0">
                      {item.price ? (
                        <span className="font-mono text-sm font-semibold text-[#304A3A] tabular-nums">
                          {item.price}
                        </span>
                      ) : (
                        <span className="text-[11px] font-medium text-[#8FA58A] bg-[#8FA58A]/10 px-2 py-0.5 rounded-full whitespace-nowrap">
                          View current menu
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex items-center gap-2 mb-3 text-[11px] text-[#4A3428]/60">
                    <span>{item.category}</span>
                    {item.isBestseller && (
                      <>
                        <span>·</span>
                        <span className="text-[#304A3A] font-medium">Bestseller</span>
                      </>
                    )}
                    {item.isSeasonal && (
                      <>
                        <span>·</span>
                        <span className="text-[#D9A7A0] font-medium">Seasonal</span>
                      </>
                    )}
                  </div>

                  <p className="text-xs text-[#4A3428]/70 leading-relaxed font-light line-clamp-2 mb-3">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#D8C8B4]/30 flex items-center justify-between text-xs text-[#304A3A]/70 group-hover:text-[#304A3A]">
                  <span className="text-[11px] font-medium">Details &amp; Ingredients</span>
                  <Eye className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View Full Menu / Collapse Button */}
        {filteredItems.length > 8 && (
          <div className="text-center mt-12">
            <button
              onClick={() => setShowFullMenu(!showFullMenu)}
              className="px-8 py-3.5 rounded-full border border-[#304A3A] text-[#304A3A] hover:bg-[#304A3A] hover:text-[#F8F4EC] text-xs font-semibold tracking-wider uppercase transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md"
            >
              {showFullMenu ? 'Show Less' : `View Full Menu (${filteredItems.length} items)`}
            </button>
          </div>
        )}

        {/* Bottom Banner to Reserve */}
        <div className="mt-16 bg-[#304A3A] text-[#F8F4EC] rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-serif text-2xl text-white font-normal">
              Planning a visit for lunch, coffee or dinner?
            </h3>
            <p className="text-xs sm:text-sm text-white/80 font-light">
              Reserve your table ahead of time to ensure indoor, outdoor, or balcony availability.
            </p>
          </div>
          <button
            onClick={onReserveClick}
            className="px-6 py-3 rounded-full bg-[#8FA58A] hover:bg-[#7D9478] text-[#22372A] font-semibold text-xs tracking-wider uppercase transition-all shrink-0 cursor-pointer shadow-md"
          >
            Reserve a Table
          </button>
        </div>
      </div>

      {/* Item Detail Modal */}
      {selectedItemModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-[#F8F4EC] rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#D8C8B4] relative">
            <button
              onClick={() => setSelectedItemModal(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white text-[#4A3428] shadow-md transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {selectedItemModal.image && (
              <div className="relative aspect-16/9 bg-[#D8C8B4]/30 overflow-hidden">
                <img
                  src={selectedItemModal.image}
                  alt={selectedItemModal.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`w-3 h-3 rounded-sm border flex items-center justify-center shrink-0 ${
                        selectedItemModal.isVegetarian ? 'border-emerald-600' : 'border-red-600'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          selectedItemModal.isVegetarian ? 'bg-emerald-600' : 'bg-red-600'
                        }`}
                      />
                    </span>
                    <span className="text-xs uppercase tracking-wider text-[#304A3A] font-semibold">
                      {selectedItemModal.category}
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl text-[#304A3A] font-medium">
                    {selectedItemModal.name}
                  </h3>
                </div>

                <div className="text-right">
                  {selectedItemModal.price ? (
                    <span className="font-mono text-xl font-bold text-[#304A3A]">
                      {selectedItemModal.price}
                    </span>
                  ) : (
                    <span className="text-xs text-[#8FA58A] bg-[#8FA58A]/10 px-2.5 py-1 rounded-full font-medium">
                      View current menu
                    </span>
                  )}
                </div>
              </div>

              <p className="text-sm text-[#4A3428]/80 leading-relaxed font-light">
                {selectedItemModal.description}
              </p>

              <div className="pt-4 border-t border-[#D8C8B4]/40 flex items-center justify-between">
                <span className="text-xs text-[#4A3428]/60">
                  {selectedItemModal.isVegetarian ? 'Vegetarian Friendly' : 'Contains Poultry/Meat'}
                </span>
                <button
                  onClick={() => {
                    setSelectedItemModal(null);
                    onReserveClick();
                  }}
                  className="px-4 py-2 rounded-full bg-[#304A3A] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#22372A] transition-colors cursor-pointer"
                >
                  Book Table for This
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
