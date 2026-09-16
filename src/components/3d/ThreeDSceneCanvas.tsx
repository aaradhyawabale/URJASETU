import React, { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Html } from '@react-three/drei';
import * as THREE from 'three';
import { IPlacedComponent } from '../../types/site';

interface ThreeDSceneCanvasProps {
  components: IPlacedComponent[];
  plotAreaSqm: number;
  plotGeometry?: number[][][] | null;
  solarElevation: number;
  rotation: number;
  pitch: number;
  scale: number;
  selectedComponentId?: string | null;
  onSelectComponent?: (comp: IPlacedComponent) => void;
}

// Procedural 3D Mesh: Solar Canopy Array
const SolarCanopyMesh: React.FC<{
  comp: IPlacedComponent;
  isSelected: boolean;
  onSelect?: () => void;
}> = ({ comp, isSelected, onSelect }) => {
  const width = Math.max(4, comp.widthMeters);
  const length = Math.max(3, comp.lengthMeters);
  const rotRad = ((comp.rotationDegrees || 0) * Math.PI) / 180;

  return (
    <group
      position={[comp.xMeters, 0, -comp.yMeters]}
      rotation={[0, rotRad, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.();
      }}
    >
      {/* Support Pillars (4 steel posts) */}
      <mesh position={[-width / 2 + 0.5, 1.8, -length / 2 + 0.5]} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 3.6, 8]} />
        <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[width / 2 - 0.5, 1.8, -length / 2 + 0.5]} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 3.6, 8]} />
        <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[-width / 2 + 0.5, 1.8, length / 2 - 0.5]} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 3.6, 8]} />
        <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[width / 2 - 0.5, 1.8, length / 2 - 0.5]} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 3.6, 8]} />
        <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Tilted Solar Panel Array Plane */}
      <group position={[0, 3.6, 0]} rotation={[0.26, 0, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[width, 0.18, length]} />
          <meshStandardMaterial
            color={isSelected ? '#f59e0b' : '#0369a1'}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>

        {/* PV Cell Grid Accents */}
        <mesh position={[0, 0.1, 0]}>
          <planeGeometry args={[width * 0.95, length * 0.95]} />
          <meshStandardMaterial color="#0284c7" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>

      {/* Floating 3D Badge */}
      <Html position={[0, 4.5, 0]} center distanceFactor={25}>
        <div
          className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono shadow-md border pointer-events-none whitespace-nowrap transition-transform ${
            isSelected
              ? 'bg-amber-500 text-white border-amber-300 scale-110'
              : 'bg-slate-900/90 text-amber-300 border-amber-500/50'
          }`}
        >
          ☀️ {comp.specs?.capacityKwp || 24} kWp Solar Array
        </div>
      </Html>
    </group>
  );
};

// Procedural 3D Mesh: EV Fast Charger Station
const EVChargerMesh: React.FC<{
  comp: IPlacedComponent;
  isSelected: boolean;
  onSelect?: () => void;
}> = ({ comp, isSelected, onSelect }) => {
  const rotRad = ((comp.rotationDegrees || 0) * Math.PI) / 180;

  return (
    <group
      position={[comp.xMeters, 0, -comp.yMeters]}
      rotation={[0, rotRad, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.();
      }}
    >
      {/* Pedestal Base */}
      <mesh position={[0, 0.1, 0]} castShadow>
        <boxGeometry args={[2.2, 0.2, 1.4]} />
        <meshStandardMaterial color="#334155" roughness={0.5} />
      </mesh>

      {/* Charger Kiosk Body */}
      <mesh position={[0, 1.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.4, 2.0, 0.9]} />
        <meshStandardMaterial
          color={isSelected ? '#f59e0b' : '#0284c7'}
          metalness={0.5}
          roughness={0.3}
        />
      </mesh>

      {/* Glowing LED Status Indicator Ring */}
      <mesh position={[0, 1.8, 0.46]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial
          color="#10b981"
          emissive="#10b981"
          emissiveIntensity={1.2}
        />
      </mesh>

      {/* Floating 3D Badge */}
      <Html position={[0, 2.6, 0]} center distanceFactor={25}>
        <div
          className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono shadow-md border pointer-events-none whitespace-nowrap transition-transform ${
            isSelected
              ? 'bg-amber-500 text-white border-amber-300 scale-110'
              : 'bg-sky-950/90 text-sky-200 border-sky-400/50'
          }`}
        >
          🔌 DC Fast Charger ({comp.specs?.ports || 2} Ports)
        </div>
      </Html>
    </group>
  );
};

// Procedural 3D Mesh: BESS Storage Container
const BESSContainerMesh: React.FC<{
  comp: IPlacedComponent;
  isSelected: boolean;
  onSelect?: () => void;
}> = ({ comp, isSelected, onSelect }) => {
  const width = Math.max(5, comp.widthMeters);
  const length = Math.max(2.4, comp.lengthMeters);
  const rotRad = ((comp.rotationDegrees || 0) * Math.PI) / 180;

  return (
    <group
      position={[comp.xMeters, 0, -comp.yMeters]}
      rotation={[0, rotRad, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.();
      }}
    >
      {/* Container Body */}
      <mesh position={[0, 1.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, 2.6, length]} />
        <meshStandardMaterial
          color={isSelected ? '#f59e0b' : '#6b21a8'}
          metalness={0.6}
          roughness={0.3}
        />
      </mesh>

      {/* HVAC Cooling Vents */}
      <mesh position={[width / 2 - 0.6, 2.0, 0]} castShadow>
        <boxGeometry args={[0.8, 0.6, length * 0.8]} />
        <meshStandardMaterial color="#334155" metalness={0.8} />
      </mesh>

      {/* Floating 3D Badge */}
      <Html position={[0, 3.2, 0]} center distanceFactor={25}>
        <div
          className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono shadow-md border pointer-events-none whitespace-nowrap transition-transform ${
            isSelected
              ? 'bg-amber-500 text-white border-amber-300 scale-110'
              : 'bg-purple-950/90 text-purple-200 border-purple-400/50'
          }`}
        >
          🔋 BESS Container ({comp.specs?.capacityKwh || 250} kWh)
        </div>
      </Html>
    </group>
  );
};

// Procedural 3D Mesh: Transformer Interconnect Kiosk
const TransformerMesh: React.FC<{
  comp: IPlacedComponent;
  isSelected: boolean;
  onSelect?: () => void;
}> = ({ comp, isSelected, onSelect }) => {
  const rotRad = ((comp.rotationDegrees || 0) * Math.PI) / 180;

  return (
    <group
      position={[comp.xMeters, 0, -comp.yMeters]}
      rotation={[0, rotRad, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.();
      }}
    >
      {/* Transformer Housing */}
      <mesh position={[0, 1.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.8, 2.5, 2.8]} />
        <meshStandardMaterial
          color={isSelected ? '#f59e0b' : '#991b1b'}
          metalness={0.5}
          roughness={0.4}
        />
      </mesh>

      {/* Bushing Insulators on roof */}
      <mesh position={[-0.7, 2.7, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.15, 0.5, 8]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.2} />
      </mesh>
      <mesh position={[0, 2.7, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.15, 0.5, 8]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.2} />
      </mesh>
      <mesh position={[0.7, 2.7, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.15, 0.5, 8]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.2} />
      </mesh>

      {/* Floating 3D Badge */}
      <Html position={[0, 3.2, 0]} center distanceFactor={25}>
        <div
          className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono shadow-md border pointer-events-none whitespace-nowrap transition-transform ${
            isSelected
              ? 'bg-amber-500 text-white border-amber-300 scale-110'
              : 'bg-red-950/90 text-red-200 border-red-400/50'
          }`}
        >
          ⚡ Transformer ({comp.specs?.ratingKva || 500} kVA)
        </div>
      </Html>
    </group>
  );
};

export const ThreeDSceneCanvas: React.FC<ThreeDSceneCanvasProps> = ({
  components,
  plotAreaSqm,
  solarElevation,
  selectedComponentId,
  onSelectComponent,
}) => {
  const sunRad = (Math.max(10, solarElevation) * Math.PI) / 180;
  const sunY = Math.sin(sunRad) * 70;
  const sunZ = Math.cos(sunRad) * 70;

  // Compute 3D plot dimensions based on plotAreaSqm
  const sideLength = Math.sqrt(plotAreaSqm || 2450);
  const plotWidth = Math.max(30, Math.min(120, sideLength * 0.95));
  const plotDepth = Math.max(20, Math.min(90, sideLength * 0.65));

  return (
    <div className="w-full h-full relative select-none">
      <Canvas
        shadows
        camera={{ position: [35, 40, 45], fov: 45 }}
        style={{ width: '100%', height: '100%', background: '#020617' }}
      >
        {/* Lighting setup simulating Solar Elevation */}
        <ambientLight intensity={0.65} />
        <directionalLight
          position={[25, sunY, sunZ]}
          intensity={1.4}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-near={0.5}
          shadow-camera-far={200}
          shadow-camera-left={-60}
          shadow-camera-right={60}
          shadow-camera-top={60}
          shadow-camera-bottom={-60}
        />
        <directionalLight position={[-25, 20, -25]} intensity={0.3} color="#38bdf8" />

        {/* Orbit Camera Controls */}
        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.05}
          maxPolarAngle={Math.PI / 2 - 0.05}
          minDistance={10}
          maxDistance={220}
        />

        {/* 3D Ground Plane Grid (Spatial 100m x 100m Mesh) */}
        <Grid
          infiniteGrid
          cellSize={2}
          cellThickness={0.6}
          cellColor="#334155"
          sectionSize={10}
          sectionThickness={1.2}
          sectionColor="#0ea5e9"
          fadeDistance={180}
          fadeStrength={1}
        />

        {/* Confirmed 2D Plot Boundary Polygon Base Mesh */}
        <group position={[0, 0.05, 0]}>
          {/* Glassmorphism Ground Pad */}
          <mesh receiveShadow castShadow>
            <boxGeometry args={[plotWidth, 0.15, plotDepth]} />
            <meshStandardMaterial
              color="#065f46"
              opacity={0.65}
              transparent
              metalness={0.2}
              roughness={0.4}
            />
          </mesh>

          {/* Plot Boundary Border Ring */}
          <lineSegments>
            <edgesGeometry args={[new THREE.BoxGeometry(plotWidth + 0.4, 0.2, plotDepth + 0.4)]} />
            <lineBasicMaterial color="#34d399" linewidth={2} />
          </lineSegments>
        </group>

        {/* Render Procedural 3D Infrastructure Components */}
        {components.map((comp) => {
          const isSelected = comp.id === selectedComponentId;
          const handleSelect = () => onSelectComponent?.(comp);

          if (comp.type === 'SOLAR_CANOPY') {
            return (
              <SolarCanopyMesh
                key={comp.id}
                comp={comp}
                isSelected={isSelected}
                onSelect={handleSelect}
              />
            );
          }

          if (comp.type === 'EV_CHARGER' || comp.type === 'CHARGING_BAY') {
            return (
              <EVChargerMesh
                key={comp.id}
                comp={comp}
                isSelected={isSelected}
                onSelect={handleSelect}
              />
            );
          }

          if (comp.type === 'BESS_CONTAINER') {
            return (
              <BESSContainerMesh
                key={comp.id}
                comp={comp}
                isSelected={isSelected}
                onSelect={handleSelect}
              />
            );
          }

          return (
            <TransformerMesh
              key={comp.id}
              comp={comp}
              isSelected={isSelected}
              onSelect={handleSelect}
            />
          );
        })}
      </Canvas>
    </div>
  );
};
