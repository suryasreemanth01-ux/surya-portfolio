import { useState, Suspense, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { portfolioData } from './data/portfolioData';
import Hero3D from './components/Hero3D';

export default function App() {
  const [showLinkedInModal, setShowLinkedInModal] = useState(false);
  const [selectedCert, setSelectedCert] = useState<string | null>(null);

  // Audio effect on first interaction
  useEffect(() => {
    let context: AudioContext | null = null;
    
    const playSound = () => {
      if (context) return; // Prevent double playing

      // Initialize Web Audio API
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      context = new AudioContextClass();

      // 1. The Engine Rev (Sawtooth wave sweeping up and down)
      const osc = context.createOscillator();
      const gain = context.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(40, context.currentTime); // Low rumble
      osc.frequency.exponentialRampToValueAtTime(120, context.currentTime + 0.4); // Rev up
      osc.frequency.exponentialRampToValueAtTime(60, context.currentTime + 0.8); // Rev down
      
      gain.gain.setValueAtTime(0, context.currentTime);
      gain.gain.linearRampToValueAtTime(0.15, context.currentTime + 0.1); // Fade in
      gain.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 1); // Fade out
      
      osc.connect(gain);
      gain.connect(context.destination);
      osc.start();
      osc.stop(context.currentTime + 1);

      // 2. The Synthwave Startup Chime (Sine wave chord)
      const chimeOsc = context.createOscillator();
      const chimeGain = context.createGain();
      chimeOsc.type = 'sine';
      chimeOsc.frequency.setValueAtTime(440, context.currentTime + 0.2); // A4 note
      chimeOsc.frequency.exponentialRampToValueAtTime(880, context.currentTime + 0.6); // A5 note
      
      chimeGain.gain.setValueAtTime(0, context.currentTime + 0.2);
      chimeGain.gain.linearRampToValueAtTime(0.08, context.currentTime + 0.3);
      chimeGain.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.8);
      
      chimeOsc.connect(chimeGain);
      chimeGain.connect(context.destination);
      chimeOsc.start(context.currentTime + 0.2);
      chimeOsc.stop(context.currentTime + 0.8);

      // Remove listeners so it only plays once
      window.removeEventListener('click', playSound);
      window.removeEventListener('scroll', playSound);
    };

    // Listen for the first interaction
    window.addEventListener('click', playSound);
    window.addEventListener('scroll', playSound);

    return () => {
      window.removeEventListener('click', playSound);
      window.removeEventListener('scroll', playSound);
      if (context) context.close();
    };
  }, []);

  const { scrollYProgress } = useScroll();

  // Animations based on scroll
  const introOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const introScale = useTransform(scrollYProgress, [0, 0.1], [1, 0.8]);

  return (
    <div className="scanlines relative min-h-screen overflow-hidden">
      
      {/* PERSISTENT TOP NAV */}
      <nav className="fixed top-0 w-full p-4 flex justify-between items-center z-50 bg-gta-dark/80 backdrop-blur-md border-b border-gta-cyan/30">
        <h1 className="text-2xl text-gta-pink tracking-widest">SURYA'S PORTFOLIO</h1>
        <a 
          href="/resume.pdf" 
          target="_blank" 
          className="px-4 py-2 bg-gta-cyan text-gta-dark font-bold rounded hover:bg-white transition-colors"
        >
          DOWNLOAD RESUME
        </a>
      </nav>

      {/* 1. INTRO SECTION - 3D SCENE */}
      <motion.section 
        style={{ opacity: introOpacity, scale: introScale }}
        className="h-screen relative"
      >
        <Suspense fallback={
          <div className="flex h-screen items-center justify-center text-gta-cyan text-2xl font-bold animate-pulse">
            Loading 3D Engine...
          </div>
        }>
          <Hero3D />
        </Suspense>
        
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
          className="absolute bottom-10 w-full text-center z-20 pointer-events-none"
        >
          <p className="text-gta-cyan text-xl mb-4 font-bold tracking-widest">SCROLL DOWN TO START THE ENGINE</p>
          <div className="animate-bounce text-3xl text-white">↓</div>
        </motion.div>
      </motion.section>

      {/* 2. LINKEDIN STOP */}
      <section className="h-[60vh] flex justify-center items-center">
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="cursor-pointer bg-gradient-to-br from-blue-900 to-black p-10 rounded-2xl border border-blue-500 shadow-[0_0_30px_rgba(0,119,181,0.5)] text-center"
          onClick={() => setShowLinkedInModal(true)}
        >
          <h2 className="text-4xl text-white mb-2">CONNECT WITH ME</h2>
          <p className="text-blue-300">Click to view LinkedIn Profile</p>
        </motion.div>
      </section>

      {/* 3. SUMMARY STOP */}
      <section className="min-h-[60vh] flex justify-center items-center px-4 py-20">
        <motion.div 
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl bg-black/60 p-8 md:p-12 rounded-3xl border border-gta-pink/50 shadow-[0_0_20px_rgba(255,62,154,0.3)]"
        >
          <h2 className="text-4xl text-gta-pink mb-6 border-b border-gta-pink/30 pb-2">SUMMARY</h2>
          <p className="text-lg leading-relaxed text-gray-300">
            {portfolioData.summary}
          </p>
        </motion.div>
      </section>

      {/* --- LINKEDIN POPUP MODAL --- */}
      <AnimatePresence>
        {showLinkedInModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              className="bg-gta-dark p-8 rounded-xl border border-blue-500 shadow-2xl max-w-md w-full relative"
            >
              <h3 className="text-2xl text-white mb-4">LinkedIn Profile</h3>
              <p className="text-gray-400 break-all mb-8 text-sm bg-black/50 p-3 rounded">
                {portfolioData.linkedin}
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setShowLinkedInModal(false)}
                  className="flex-1 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
                <a 
                  href={portfolioData.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setShowLinkedInModal(false)}
                  className="flex-1 py-2 bg-[#0077B5] text-white text-center rounded hover:bg-blue-600 font-bold"
                >
                  Open Link
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. EDUCATION SECTION */}
      <section className="min-h-[60vh] flex flex-col justify-center items-center px-4 py-20 relative">
        <h2 className="text-5xl text-gta-cyan mb-12 drop-shadow-[0_0_10px_rgba(0,240,255,0.8)]">EDUCATION ROAD</h2>
        
        <div className="flex flex-col md:flex-row gap-8 max-w-6xl w-full">
          {/* School */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1 bg-black/50 border border-gta-pink/30 p-6 rounded-xl relative overflow-hidden group hover:border-gta-pink transition-colors"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gta-pink group-hover:h-2 transition-all"></div>
            <h3 className="text-2xl text-white mb-2">SRI SAI SIDDHARTHA SCHOOL</h3>
            <p className="text-gta-cyan font-bold mb-4">SSC (10th Grade)</p>
            <p className="text-gray-400 text-sm mb-4">2010 - 2022 | Hyderabad, Telangana</p>
            <div className="bg-gta-pink/20 inline-block px-3 py-1 rounded text-gta-pink font-bold">CGPA: 8.3</div>
          </motion.div>

          {/* Intermediate */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex-1 bg-black/50 border border-gta-orange/30 p-6 rounded-xl relative overflow-hidden group hover:border-gta-orange transition-colors"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gta-orange group-hover:h-2 transition-all"></div>
            <h3 className="text-2xl text-white mb-2">SRI CHAITANYA</h3>
            <p className="text-gta-cyan font-bold mb-4">Intermediate (12th Grade)</p>
            <p className="text-gray-400 text-sm mb-4">2022 - 2024 | Hyderabad, Telangana</p>
            <div className="bg-gta-orange/20 inline-block px-3 py-1 rounded text-gta-orange font-bold">Percentage: 87%</div>
          </motion.div>

          {/* B.Tech */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1 bg-black/50 border border-gta-cyan/30 p-6 rounded-xl relative overflow-hidden group hover:border-gta-cyan transition-colors"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gta-cyan group-hover:h-2 transition-all"></div>
            <h3 className="text-2xl text-white mb-2">KLH UNIVERSITY</h3>
            <p className="text-gta-cyan font-bold mb-4">B.Tech Computer Science</p>
            <p className="text-gray-400 text-sm mb-4">2024 - Present | Hyderabad, Telangana</p>
            <div className="bg-gta-cyan/20 inline-block px-3 py-1 rounded text-gta-cyan font-bold">3rd Year</div>
          </motion.div>
        </div>
      </section>

      {/* 5. SKILLS SECTION */}
      <section className="min-h-[60vh] flex flex-col justify-center items-center px-4 py-20 bg-gradient-to-b from-transparent to-black/40">
        <motion.h2 
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          className="text-6xl text-gta-orange mb-16 drop-shadow-[0_0_15px_rgba(255,107,53,0.8)]"
        >
          SKILLS
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
          {portfolioData.skills.map((skill, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="bg-black/60 border-l-4 border-gta-pink p-6 rounded-r-xl shadow-lg hover:bg-black/80 transition-all"
            >
              <h4 className="text-xl text-white mb-2">{skill.category}</h4>
              <p className="text-gta-cyan font-mono">{skill.items}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 6. PROJECTS SECTION */}
      <section className="min-h-[60vh] flex flex-col justify-center items-center px-4 py-20">
        <motion.h2 
          initial={{ y: -50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          className="text-6xl text-gta-pink mb-16 drop-shadow-[0_0_15px_rgba(255,62,154,0.8)]"
        >
          PROJECTS GROUND
        </motion.h2>

        <div className="flex flex-col gap-12 max-w-5xl w-full">
          {portfolioData.projects.map((project, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-black/70 border border-white/10 p-8 rounded-2xl hover:border-gta-cyan transition-colors group"
            >
              <h3 className="text-3xl text-white mb-4 group-hover:text-gta-cyan transition-colors">{project.title}</h3>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {project.tools.split(',').map((tool, i) => (
                  <span key={i} className="px-3 py-1 bg-gta-pink/10 text-gta-pink text-sm rounded-full border border-gta-pink/30">
                    {tool.trim()}
                  </span>
                ))}
              </div>

              <p className="text-gray-400 leading-relaxed mb-8">
                {project.description}
              </p>

              <div className="flex gap-4">
                <a 
                  href={project.live} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-6 py-2 bg-gta-cyan text-gta-dark font-bold rounded hover:bg-white transition-colors"
                >
                  Live App
                </a>
                <a 
                  href={project.github} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-6 py-2 bg-transparent border border-white text-white font-bold rounded hover:bg-white hover:text-gta-dark transition-colors"
                >
                  GitHub Code
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 7. CERTIFICATES SECTION */}
      <section className="min-h-[60vh] flex flex-col justify-center items-center px-4 py-20 bg-gradient-to-b from-black/40 to-transparent">
        <motion.h2 
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-5xl md:text-7xl text-gta-cyan mb-16 drop-shadow-[0_0_15px_rgba(0,240,255,0.8)] font-bebas tracking-widest text-center"
        >
          CERTIFICATES
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full">
          {portfolioData.certificates.map((cert, index) => (
            <motion.div 
              key={index}
              onClick={() => setSelectedCert(cert.image)} // Opens the image modal
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-black/60 border border-white/10 p-4 rounded-xl hover:border-gta-cyan transition-all group flex flex-col items-center justify-center text-center h-24 cursor-pointer hover:scale-105 hover:bg-black/80"
            >
              <p className="text-gray-300 group-hover:text-white font-bold text-sm transition-colors tracking-wide">
                {cert.title}
              </p>
              <p className="text-[10px] text-gta-cyan mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                Click to view
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- CERTIFICATE IMAGE LIGHTBOX --- */}
      <AnimatePresence>
        {selectedCert && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCert(null)} // Click outside to close
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-[200] flex items-center justify-center p-4 cursor-zoom-out"
          >
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative max-w-5xl w-full max-h-[90vh] flex justify-center"
            >
              <img 
                src={selectedCert} 
                alt="Certificate" 
                className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-[0_0_50px_rgba(0,240,255,0.3)] border border-gta-cyan/30"
              />
              
              {/* Close Button */}
              <button 
                onClick={(e) => { e.stopPropagation(); setSelectedCert(null); }}
                className="absolute -top-12 right-0 text-white hover:text-gta-pink text-4xl font-bold transition-colors"
              >
                ×
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FOOTER */}
      <footer className="py-10 text-center border-t border-white/10 text-gray-500">
        <p>© 2026 Devineni Surya Sreemanth. All Rights Reserved.</p>
        <p className="text-sm mt-2">Built with React, Vite & Framer Motion.</p>
      </footer>
    </div>
  );
}