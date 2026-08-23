'use client';

import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import * as THREE from 'three';

export default function Home() {
  const [destination, setDestination] = useState('Japan');
  const [budget, setBudget] = useState('9000');
  const [days, setDays] = useState('7');
  const [travelStyle, setTravelStyle] = useState('Luxury');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tripData, setTripData] = useState<any>(null);
  const [loadStep, setLoadStep] = useState(0);
  const [toastMsg, setToastMsg] = useState('');
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const recRef = useRef<HTMLElement>(null);

  // Three.js Background
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 7);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // Wireframe globe
    const globeGeo = new THREE.SphereGeometry(2.4, 48, 48);
    const globeMat = new THREE.MeshBasicMaterial({
      color: 0x4ADBC8,
      wireframe: true,
      transparent: true,
      opacity: 0.08,
    });
    globeGroup.add(new THREE.Mesh(globeGeo, globeMat));

    // Dots on globe surface
    const dotCount = 1800;
    const dotPositions = [];
    const dotColors = [];
    for (let i = 0; i < dotCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / dotCount);
      const theta = Math.sqrt(dotCount * Math.PI) * phi;
      const r = 2.42;
      const x = r * Math.cos(theta) * Math.sin(phi);
      const y = r * Math.sin(theta) * Math.sin(phi);
      const z = r * Math.cos(phi);

      const noise = Math.sin(x * 1.5) * Math.cos(y * 1.5) * Math.sin(z * 1.5);
      if (noise > -0.1) {
        dotPositions.push(x, y, z);
        if (noise > 0.3) dotColors.push(1, 0.42, 0.29);
        else if (noise > 0.1) dotColors.push(1, 0.72, 0.27);
        else dotColors.push(0.29, 0.86, 0.78);
      }
    }
    const dotsGeo = new THREE.BufferGeometry();
    dotsGeo.setAttribute('position', new THREE.Float32BufferAttribute(dotPositions, 3));
    dotsGeo.setAttribute('color', new THREE.Float32BufferAttribute(dotColors, 3));
    const dotsMat = new THREE.PointsMaterial({
      size: 0.045,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    globeGroup.add(new THREE.Points(dotsGeo, dotsMat));

    // Stars
    const starCount = 800;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const r = 12 + Math.random() * 20;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      starPos[i*3] = r * Math.sin(phi) * Math.cos(theta);
      starPos[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
      starPos[i*3+2] = r * Math.cos(phi);
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.03,
      transparent: true,
      opacity: 0.5,
    }));
    scene.add(stars);

    function positionGlobe() {
      if (window.innerWidth < 1024) {
        globeGroup.position.set(0, -0.5, -2);
        globeGroup.scale.setScalar(0.65);
      } else {
        globeGroup.position.set(2.8, 0.5, -1);
        globeGroup.scale.setScalar(0.95);
      }
    }
    positionGlobe();

    let mouseX = 0, mouseY = 0;
    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouseMove);

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      positionGlobe();
    };
    window.addEventListener('resize', onResize);

    const clock = new THREE.Clock();
    let reqId: number;
    const animate = () => {
      const t = clock.getElapsedTime();
      globeGroup.rotation.y += 0.0015;
      globeGroup.rotation.x += (mouseY * 0.15 - globeGroup.rotation.x) * 0.02;
      camera.position.x += (mouseX * 0.3 - camera.position.x) * 0.03;
      camera.position.y += (-mouseY * 0.2 - camera.position.y) * 0.03;
      camera.lookAt(0, 0, 0);
      stars.rotation.y = t * 0.01;
      renderer.render(scene, camera);
      reqId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(reqId);
      renderer.dispose();
    };
  }, []);

  // Intersection Observer for .reveal
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('in');
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  });

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination || !budget || !days) return;
    
    setLoading(true);
    setError(null);
    setTripData(null);
    setLoadStep(1);

    // Simulate loading steps animation
    setTimeout(() => setLoadStep(2), 1500);
    setTimeout(() => setLoadStep(3), 3000);

    try {
      const saveRes = await fetch('http://localhost:8000/api/v1/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination,
          budget: parseFloat(budget),
          days: parseInt(days),
          travel_style: travelStyle,
        }),
      });

      if (!saveRes.ok) throw new Error('Failed to save trip');
      const trip = await saveRes.json();

      const genRes = await fetch(`http://localhost:8000/api/v1/trips/${trip.id}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ travel_style: travelStyle }),
      });

      if (!genRes.ok) throw new Error('Failed to generate AI recommendation');
      const generatedTrip = await genRes.json();
      
      setTripData(generatedTrip);
      setLoadStep(4);
      showToast(`AI itinerary generated for ${destination}!`);
      
      setTimeout(() => {
        if (recRef.current) recRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 500);
      
    } catch (err: any) {
      setError('Unable to generate itinerary. Please try again.');
      console.error(err);
      setLoadStep(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      {/* Aurora background */}
      <div className="aurora-bg">
        <div className="aurora-orb orb-1"></div>
        <div className="aurora-orb orb-2"></div>
        <div className="aurora-orb orb-3"></div>
      </div>

      {/* 3D Canvas */}
      <canvas id="bgCanvas" ref={canvasRef}></canvas>

      {/* Navbar */}
      <header className="nav-glass fixed top-0 left-0 right-0 z-50">
        <nav className="max-w-7xl mx-auto px-6 lg:px-10 py-4 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B4A] to-[#FFB845] rounded-xl rotate-45 group-hover:rotate-[225deg] transition-transform duration-700"></div>
              <div className="absolute inset-1.5 bg-[#08111C] rounded-md rotate-45 group-hover:rotate-[225deg] transition-transform duration-700"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <i className="fa-solid fa-compass text-[#FF6B4A] text-sm group-hover:rotate-180 transition-transform duration-700"></i>
              </div>
            </div>
            <span className="font-display font-bold text-xl">KelanaAI</span>
          </a>
          {/* Navigation menus hidden for now based on user request */}
          {/* <div className="hidden lg:flex items-center gap-9 text-sm">
            <a href="#" className="text-[#7B8395] hover:text-white transition-colors">Destinations</a>
            <a href="#form" className="text-[#7B8395] hover:text-white transition-colors">Plan Trip</a>
            <a href="#recommendation" className="text-[#7B8395] hover:text-white transition-colors">Sample</a>
          </div>
          <div className="flex items-center gap-3">
            <button className="hidden md:inline-flex btn-ghost text-sm" onClick={() => showToast('Opening sign in...')}>Sign In</button>
            <button className="btn-primary text-sm flex items-center gap-2" onClick={() => showToast('Welcome to KelanaAI!')}>
              Get Started <i className="fa-solid fa-arrow-right text-xs"></i>
            </button>
          </div> */}
        </nav>
      </header>

      {/* Hero + Form */}
      <section id="form" className="relative min-h-screen pt-32 pb-20 z-10">
        <div className="float-tag hidden lg:flex" style={{ top: '22%', left: '4%' }}>
          <i className="fa-solid fa-plane"></i> 247 Destinations
        </div>
        <div className="float-tag hidden lg:flex" style={{ top: '35%', right: '4%', animationDelay: '1.5s' }}>
          <i className="fa-solid fa-globe"></i> AI-Powered
        </div>
        <div className="float-tag hidden lg:flex" style={{ bottom: '28%', left: '6%', animationDelay: '3s' }}>
          <i className="fa-solid fa-star"></i> 4.9/5 Rating
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            <div className="reveal">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[rgba(74,219,200,0.1)] border border-[rgba(74,219,200,0.25)] text-xs text-[#4ADBC8] mb-8">
                <span className="pulse-dot"></span>
                AI Trip Planner · v2.0
              </div>
              <h1 className="font-display font-bold text-[clamp(3rem,8vw,7rem)] leading-[0.92] tracking-tight hero-title">
                <span className="text-stroke">Plan</span> your<br/>
                next <span className="gradient-text">adventure</span><br/>
                with <span className="italic font-light">AI.</span>
              </h1>
              <p className="mt-8 text-lg lg:text-xl text-[#7B8395] max-w-xl">
                Tell us where, when, and how you love to travel. KelanaAI crafts a personalized itinerary in seconds — built around your budget, your style, your pace.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-[#7B8395]">
                <div className="flex items-center gap-2"><i className="fa-solid fa-bolt text-[#FFB845]"></i> Generates in 8 seconds</div>
                <div className="flex items-center gap-2"><i className="fa-solid fa-shield-halved text-[#4ADBC8]"></i> Free to try</div>
                <div className="flex items-center gap-2"><i className="fa-solid fa-language text-[#FF6B4A]"></i> 50+ languages</div>
              </div>
            </div>

            <div className="reveal" style={{ transitionDelay: '0.15s' }}>
              <div className="glass-strong p-7 lg:p-9 relative">
                <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-[#FF6B4A] to-transparent"></div>
                <div className="flex items-center justify-between mb-7">
                  <div>
                    <h2 className="font-display text-2xl font-bold">Plan Your Trip</h2>
                    <p className="text-xs text-[#7B8395] mt-1">Fill in your preferences below</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[rgba(255,107,74,0.1)] border border-[rgba(255,107,74,0.3)] flex items-center justify-center">
                    <i className="fa-solid fa-wand-magic-sparkles text-[#FF6B4A]"></i>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#7B8395] mb-2 font-medium">Destination</label>
                    <div className="input-wrap relative">
                      <i className="input-icon fa-solid fa-location-dot"></i>
                      <input type="text" value={destination} onChange={e => setDestination(e.target.value)} required className="input-field" placeholder="Where to?" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#7B8395] mb-2 font-medium">Budget (USD)</label>
                      <div className="input-wrap relative">
                        <i className="input-icon fa-solid fa-dollar-sign"></i>
                        <input type="number" value={budget} onChange={e => setBudget(e.target.value)} required className="input-field" placeholder="0" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#7B8395] mb-2 font-medium">Days</label>
                      <div className="input-wrap relative">
                        <i className="input-icon fa-solid fa-calendar-days"></i>
                        <input type="number" value={days} onChange={e => setDays(e.target.value)} required className="input-field" placeholder="0" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#7B8395] mb-2 font-medium">Travel Style</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['Luxury', 'Adventure', 'Cultural', 'Budget', 'Romantic', 'Foodie'].map(style => (
                        <button 
                          key={style}
                          type="button" 
                          onClick={() => setTravelStyle(style)}
                          className={`style-pill ${travelStyle === style ? 'active' : ''}`}
                        >
                          {style}
                        </button>
                      ))}
                    </div>
                  </div>

                  {error && <div className="text-red-400 text-sm">{error}</div>}

                  <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2.5 mt-2">
                    {loading ? (
                       <span className="flex items-center gap-2">
                         <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                         Crafting itinerary...
                       </span>
                    ) : (
                      <>
                        <i className="fa-solid fa-wand-magic-sparkles"></i>
                        Generate AI Trip
                        <i className="fa-solid fa-arrow-right text-xs"></i>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recommendation Section */}
      <section id="recommendation" ref={recRef} className="relative py-24 z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          
          {loading && (
            <div className="glass-strong mb-12">
              <div className="ai-loader">
                <div className="loader-ring"></div>
                <div className="text-center">
                  <div className="font-display text-xl font-semibold">Crafting your itinerary...</div>
                  <div className="text-sm text-[#7B8395] mt-2">Analyzing destinations, optimizing routes, matching your style</div>
                </div>
                <div className="flex flex-wrap justify-center gap-4 text-xs">
                  <span className={`load-step ${loadStep >= 1 ? 'done' : ''}`}>
                    {loadStep >= 1 ? '✓ Researched destination' : '· Researching destination'}
                  </span>
                  <span className={`load-step ${loadStep >= 2 ? 'done' : ''}`}>
                    {loadStep >= 2 ? '✓ Budget optimized' : '· Optimizing budget'}
                  </span>
                  <span className={`load-step ${loadStep >= 3 ? 'done' : ''}`}>
                    {loadStep >= 3 ? '✓ Experiences curated' : '· Curating experiences'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {tripData && !loading && (
            <div className="space-y-8 reveal in">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-8 h-px bg-[#FF6B4A]"></span>
                    <span className="text-xs tracking-widest uppercase text-[#FF6B4A]">AI Recommendation</span>
                  </div>
                  <h2 className="font-display font-bold text-4xl lg:text-6xl leading-[0.95]">
                    Your <span className="gradient-text">{tripData.days}-day</span><br/>
                    {tripData.destination} adventure
                  </h2>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <button className="btn-ghost text-sm flex items-center gap-2" onClick={() => showToast('Saved!')}><i className="fa-solid fa-bookmark"></i> Save</button>
                  <button className="btn-ghost text-sm flex items-center gap-2" onClick={() => showToast('Shared!')}><i className="fa-solid fa-share-nodes"></i> Share</button>
                </div>
              </div>

              {/* Hero Banner with Dynamic Data */}
              <div className="glass-strong overflow-hidden">
                <div className="relative h-64 lg:h-80 img-japan">
                  <div className="absolute inset-0 grid-bg opacity-30"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#08111C] via-transparent to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-end justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <i className="fa-solid fa-location-dot text-[#FF6B4A]"></i>
                        <span className="text-sm text-[#F0F4F8]/80">Custom Generated</span>
                      </div>
                      <h3 className="font-display text-4xl lg:text-5xl font-bold">{tripData.destination}</h3>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <span className="px-3 py-1.5 rounded-full bg-[rgba(255,107,74,0.2)] border border-[rgba(255,107,74,0.4)] text-xs text-[#FF8A5C]"><i className="fa-solid fa-crown mr-1.5"></i> {tripData.category}</span>
                      <span className="px-3 py-1.5 rounded-full bg-[rgba(74,219,200,0.15)] border border-[rgba(74,219,200,0.35)] text-xs text-[#4ADBC8]"><i className="fa-solid fa-calendar mr-1.5"></i> {tripData.days} Days</span>
                      <span className="px-3 py-1.5 rounded-full bg-[rgba(255,184,69,0.15)] border border-[rgba(255,184,69,0.35)] text-xs text-[#FFB845]"><i className="fa-solid fa-dollar-sign mr-1.5"></i> ${tripData.budget}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Generated Markdown inside Glass Card */}
              <div className="glass p-8 lg:p-12">
                <div className="markdown-content prose-invert">
                  <ReactMarkdown>{tripData.ai_recommendation}</ReactMarkdown>
                </div>
              </div>
              
              {/* Refine CTA */}
              <div className="glass-strong p-8 lg:p-12 text-center relative overflow-hidden mt-8">
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-[#FF6B4A] opacity-10 blur-[100px]"></div>
                </div>
                <div className="relative">
                  <h3 className="font-display text-3xl lg:text-4xl font-bold mb-3">Ready to make this real?</h3>
                  <p className="text-[#7B8395] mb-6 max-w-md mx-auto">Save your itinerary, share with travel companions, or let our AI refine it further.</p>
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <button className="btn-primary flex items-center gap-2" onClick={() => showToast('Saved to account!')}><i className="fa-solid fa-bookmark"></i> Save Trip</button>
                    <button className="btn-ghost flex items-center gap-2" onClick={() => showToast('Opening AI refinement...')}><i className="fa-solid fa-pen-to-square"></i> Refine with AI</button>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-[#7B8395]">
            <div className="flex items-center gap-2.5">
              <div className="relative w-7 h-7">
                <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B4A] to-[#FFB845] rounded-lg rotate-45"></div>
                <div className="absolute inset-1 bg-[#08111C] rounded-sm rotate-45"></div>
              </div>
              <span className="font-display font-bold text-white">KelanaAI</span>
            </div>
            <p>© 2026 KelanaAI · Plan your next adventure with AI</p>
          </div>
        </div>
      </footer>

      {/* Toast Notification */}
      <div 
        className={`fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 bg-[#142236] border border-[var(--border-2)] rounded-full text-sm transition-all duration-300 z-[100] flex items-center gap-3 ${toastMsg ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
      >
        <i className="fa-solid fa-circle-check text-[#4ADBC8]"></i>
        <span>{toastMsg}</span>
      </div>
    </div>
  );
}
