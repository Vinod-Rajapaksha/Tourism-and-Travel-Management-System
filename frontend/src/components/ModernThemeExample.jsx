import React, { useState } from 'react';

/**
 * Modern Blue-Black Theme Example Component
 * 
 * This component demonstrates both Tailwind CSS classes and CSS variables
 * for the modern blue-black theme with glass effects.
 */
export default function ModernThemeExample() {
  const [activeTab, setActiveTab] = useState('tailwind');
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-800 p-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Modern Blue-Black Theme
          </h1>
          <p className="text-xl text-dark-text-muted max-w-2xl mx-auto">
            A showcase of our modern design system with electric blue accents, 
            glass morphism effects, and responsive design.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="glass-card p-2 mb-8 animate-slide-up">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('tailwind')}
              className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                activeTab === 'tailwind'
                  ? 'bg-gradient-to-r from-electric-blue to-electric-cyan text-dark-950 shadow-electric'
                  : 'text-dark-text-muted hover:text-white hover:bg-dark-800/50'
              }`}
            >
              <i className="fab fa-css3-alt mr-2"></i>
              Tailwind Classes
            </button>
            <button
              onClick={() => setActiveTab('css')}
              className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                activeTab === 'css'
                  ? 'bg-gradient-to-r from-electric-blue to-electric-cyan text-dark-950 shadow-electric'
                  : 'text-dark-text-muted hover:text-white hover:bg-dark-800/50'
              }`}
            >
              <i className="fas fa-code mr-2"></i>
              CSS Variables
            </button>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Tailwind Examples */}
          {activeTab === 'tailwind' && (
            <>
              <div className="space-y-6 animate-slide-up">
                <h2 className="text-2xl font-bold text-white mb-6">
                  <i className="fab fa-css3-alt text-electric-blue mr-3"></i>
                  Tailwind CSS Classes
                </h2>

                {/* Glass Card Example */}
                <div className="glass-card p-6 hover:shadow-electric transition-all duration-300">
                  <h3 className="text-lg font-semibold text-white mb-3">Glass Card</h3>
                  <p className="text-dark-text-muted mb-4">
                    Using Tailwind's backdrop-blur and transparency utilities.
                  </p>
                  <code className="text-sm text-electric-blue bg-dark-800/50 p-2 rounded block">
                    className="bg-dark-900/80 backdrop-blur-md border border-white/10 rounded-xl"
                  </code>
                </div>

                {/* Button Examples */}
                <div className="glass-card p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Modern Buttons</h3>
                  <div className="space-y-4">
                    <button className="w-full bg-gradient-to-r from-primary-500 to-primary-700 text-white py-3 px-6 rounded-lg font-semibold hover:from-primary-400 hover:to-primary-600 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                      Primary Button
                    </button>
                    <button className="w-full bg-gradient-to-r from-electric-blue to-electric-cyan text-dark-950 py-3 px-6 rounded-lg font-semibold hover:shadow-electric transition-all duration-300">
                      Electric Button
                    </button>
                    <button className="w-full bg-primary-500/20 border border-primary-500 text-primary-400 py-3 px-6 rounded-lg font-semibold hover:bg-primary-500/30 hover:-translate-y-0.5 transition-all duration-300">
                      Outline Button
                    </button>
                  </div>
                </div>

                {/* Form Example */}
                <div className="glass-card p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Form Elements</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        placeholder="Enter your email"
                        className="w-full bg-dark-800/60 border border-dark-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-electric-blue focus:ring-2 focus:ring-electric-blue/20 transition-all duration-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Message
                      </label>
                      <textarea
                        placeholder="Your message..."
                        rows={3}
                        className="w-full bg-dark-800/60 border border-dark-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-electric-blue focus:ring-2 focus:ring-electric-blue/20 transition-all duration-300 resize-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Color Palette */}
              <div className="space-y-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <h2 className="text-2xl font-bold text-white mb-6">
                  <i className="fas fa-palette text-electric-blue mr-3"></i>
                  Color Palette
                </h2>

                <div className="glass-card p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Primary Colors</h3>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-primary-500 h-16 rounded-lg flex items-center justify-center">
                      <span className="text-white text-xs font-medium">primary-500</span>
                    </div>
                    <div className="bg-primary-600 h-16 rounded-lg flex items-center justify-center">
                      <span className="text-white text-xs font-medium">primary-600</span>
                    </div>
                    <div className="bg-primary-700 h-16 rounded-lg flex items-center justify-center">
                      <span className="text-white text-xs font-medium">primary-700</span>
                    </div>
                  </div>
                </div>

                <div className="glass-card p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Electric Accents</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gradient-to-r from-electric-blue to-electric-cyan h-16 rounded-lg flex items-center justify-center">
                      <span className="text-dark-950 text-xs font-medium">Electric Gradient</span>
                    </div>
                    <div className="bg-electric-purple h-16 rounded-lg flex items-center justify-center">
                      <span className="text-white text-xs font-medium">Electric Purple</span>
                    </div>
                  </div>
                </div>

                <div className="glass-card p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Dark Theme</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-dark-950 border border-dark-700 h-16 rounded-lg flex items-center justify-center">
                      <span className="text-white text-xs font-medium">dark-950</span>
                    </div>
                    <div className="bg-dark-900 border border-dark-700 h-16 rounded-lg flex items-center justify-center">
                      <span className="text-white text-xs font-medium">dark-900</span>
                    </div>
                    <div className="bg-dark-800 border border-dark-700 h-16 rounded-lg flex items-center justify-center">
                      <span className="text-white text-xs font-medium">dark-800</span>
                    </div>
                    <div className="bg-dark-700 border border-dark-600 h-16 rounded-lg flex items-center justify-center">
                      <span className="text-white text-xs font-medium">dark-700</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* CSS Variables Examples */}
          {activeTab === 'css' && (
            <>
              <div className="space-y-6 animate-slide-up">
                <h2 className="text-2xl font-bold text-white mb-6">
                  <i className="fas fa-code text-electric-blue mr-3"></i>
                  CSS Variables
                </h2>

                {/* CSS Variables Card */}
                <div 
                  className="p-6 transition-all duration-300"
                  style={{
                    background: 'var(--glass-bg)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--glass-shadow)',
                    backdropFilter: 'var(--glass-backdrop)',
                  }}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <h3 className="text-lg font-semibold text-white mb-3">CSS Variables Card</h3>
                  <p style={{ color: 'var(--color-dark-text-muted)' }} className="mb-4">
                    This card uses CSS variables for consistent theming.
                  </p>
                  <code className="text-sm bg-dark-800/50 p-2 rounded block" style={{ color: 'var(--color-electric-blue)' }}>
                    background: var(--glass-bg);<br/>
                    border: 1px solid var(--glass-border);<br/>
                    border-radius: var(--radius-lg);
                  </code>
                </div>

                {/* Spacing Examples */}
                <div 
                  className="p-6"
                  style={{
                    background: 'var(--glass-bg)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--glass-shadow)',
                    backdropFilter: 'var(--glass-backdrop)',
                  }}
                >
                  <h3 className="text-lg font-semibold text-white mb-4">Spacing Scale</h3>
                  <div className="space-y-3">
                    <div style={{ padding: 'var(--space-xs)', background: 'var(--color-primary)', borderRadius: 'var(--radius-sm)' }}>
                      <span className="text-white text-sm">--space-xs (8px)</span>
                    </div>
                    <div style={{ padding: 'var(--space-sm)', background: 'var(--color-primary)', borderRadius: 'var(--radius-sm)' }}>
                      <span className="text-white text-sm">--space-sm (12px)</span>
                    </div>
                    <div style={{ padding: 'var(--space-md)', background: 'var(--color-primary)', borderRadius: 'var(--radius-sm)' }}>
                      <span className="text-white text-sm">--space-md (16px)</span>
                    </div>
                    <div style={{ padding: 'var(--space-lg)', background: 'var(--color-primary)', borderRadius: 'var(--radius-sm)' }}>
                      <span className="text-white text-sm">--space-lg (24px)</span>
                    </div>
                  </div>
                </div>

                {/* Interactive Button */}
                <div 
                  className="p-6"
                  style={{
                    background: 'var(--glass-bg)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--glass-shadow)',
                    backdropFilter: 'var(--glass-backdrop)',
                  }}
                >
                  <h3 className="text-lg font-semibold text-white mb-4">Interactive Elements</h3>
                  <button
                    className="w-full font-semibold transition-all"
                    style={{
                      background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))',
                      color: 'var(--color-dark-text)',
                      padding: 'var(--space-sm) var(--space-lg)',
                      borderRadius: 'var(--radius-sm)',
                      border: 'none',
                      boxShadow: isHovered ? 'var(--shadow-electric)' : 'var(--shadow-sm)',
                      transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
                      transitionDuration: 'var(--transition-normal)',
                    }}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                  >
                    Hover me!
                  </button>
                </div>
              </div>

              {/* CSS Variables Reference */}
              <div className="space-y-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <h2 className="text-2xl font-bold text-white mb-6">
                  <i className="fas fa-list text-electric-blue mr-3"></i>
                  Variables Reference
                </h2>

                <div 
                  className="p-6"
                  style={{
                    background: 'var(--glass-bg)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--glass-shadow)',
                    backdropFilter: 'var(--glass-backdrop)',
                  }}
                >
                  <h3 className="text-lg font-semibold text-white mb-4">Color Variables</h3>
                  <div className="space-y-2 text-sm font-mono">
                    <div style={{ color: 'var(--color-electric-blue)' }}>--color-primary</div>
                    <div style={{ color: 'var(--color-electric-blue)' }}>--color-electric-blue</div>
                    <div style={{ color: 'var(--color-dark-text)' }}>--color-dark-text</div>
                    <div style={{ color: 'var(--color-dark-text-muted)' }}>--color-dark-text-muted</div>
                  </div>
                </div>

                <div 
                  className="p-6"
                  style={{
                    background: 'var(--glass-bg)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--glass-shadow)',
                    backdropFilter: 'var(--glass-backdrop)',
                  }}
                >
                  <h3 className="text-lg font-semibold text-white mb-4">Glass Effect Variables</h3>
                  <div className="space-y-2 text-sm font-mono" style={{ color: 'var(--color-dark-text-muted)' }}>
                    <div>--glass-bg</div>
                    <div>--glass-border</div>
                    <div>--glass-shadow</div>
                    <div>--glass-backdrop</div>
                  </div>
                </div>

                <div 
                  className="p-6"
                  style={{
                    background: 'var(--glass-bg)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--glass-shadow)',
                    backdropFilter: 'var(--glass-backdrop)',
                  }}
                >
                  <h3 className="text-lg font-semibold text-white mb-4">Spacing & Radius</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm font-mono" style={{ color: 'var(--color-dark-text-muted)' }}>
                    <div>
                      <div className="font-semibold text-white mb-2">Spacing</div>
                      <div>--space-xs (8px)</div>
                      <div>--space-sm (12px)</div>
                      <div>--space-md (16px)</div>
                      <div>--space-lg (24px)</div>
                    </div>
                    <div>
                      <div className="font-semibold text-white mb-2">Border Radius</div>
                      <div>--radius-sm (8px)</div>
                      <div>--radius-md (12px)</div>
                      <div>--radius-lg (16px)</div>
                      <div>--radius-xl (24px)</div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <div 
            className="inline-block p-6 rounded-2xl"
            style={{
              background: 'var(--glass-bg)',
              border: '1px solid var(--glass-border)',
              boxShadow: 'var(--glass-shadow)',
              backdropFilter: 'var(--glass-backdrop)',
            }}
          >
            <p className="text-dark-text-muted">
              Modern Blue-Black Theme • Responsive Design • Glass Morphism
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
