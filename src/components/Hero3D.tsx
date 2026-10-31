import { Canvas } from '@react-three/fiber';

export default function Hero3D() {
  return (
    <div className="relative w-full h-screen absolute top-0 left-0 z-10">
      
      <div className="absolute inset-0 z-0">
        {/* Empty 3D Canvas ready for future effects */}
        <Canvas camera={{ position: [0, 1.5, 7.5], fov: 45 }}>
          <ambientLight intensity={1.5} />
        </Canvas>
      </div>

      {/* Title Overlay - Single Line, Centered */}
      <div className="absolute top-[20%] left-0 w-full text-center z-20 pointer-events-none px-4">
        <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold text-white drop-shadow-[0_0_20px_rgba(255,62,154,1)] font-bebas tracking-widest whitespace-nowrap">
          SURYA'S PORTFOLIO
        </h1>
      </div>

      {/* Scroll indicator positioned at the bottom center */}
      <div className="absolute bottom-10 w-full text-center z-20 pointer-events-none">
        <p className="text-gta-cyan text-xl mb-4 font-bold tracking-widest">SCROLL DOWN TO START THE ENGINE</p>
        <div className="animate-bounce text-3xl text-white">↓</div>
      </div>
    </div>
  );
}
