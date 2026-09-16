import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Html } from '@react-three/drei';
import * as THREE from 'three';
import { IPlacedComponent } from '../../types/site';

export interface OSMBuildingFeature {
  id: string;
  name: string;
  heightMeters: number;
  distanceMeters: number;
  coordinates: number[][]; // [lng, lat][]
}

interface ThreeDSceneCanvasProps {
  components: IPlacedComponent[];
  plotAreaSqm: number;
  plotGeometry?: number[][][] | null;
  solarElevation: number;
  rotation: number;
  pitch: number;
  scale: number;
  centerLat?: number;
  centerLng?: number;
  buildings?: OSMBuildingFeature[];
  selectedComponentId?: string | null;
  onSelectComponent?: (comp: IPlacedComponent | null) => void;
  onUpdateComponent?: (comp: IPlacedComponent) => void;
}

// 3D Building Extrusion Mesh from OSM Polygon Footprints
const BuildingExtrusionMesh: React.FC<{
  bldg: OSMBuildingFeature;
  centerLat: number;
  centerLng: number;
}> = ({ bldg, centerLat, centerLng }) => {
  const geom = React.useMemo(() => {
    if (!bldg.coordinates || bldg.coordinates.length < 3) return null;

    const deg2rad = Math.PI / 180;
    const cosLat = Math.cos(centerLat * deg2rad);
    const R = 6371000;

    const shape = new THREE.Shape();
    bldg.coordinates.forEach(([lng, lat], i) => {
      const x = (lng - centerLng) * deg2rad * R * cosLat;
      const z = -(lat - centerLat) * deg2rad * R;
      if (i === 0) shape.moveTo(x, z);
      else shape.lineTo(x, z);
    });

    const extrudeSettings = {
      depth: bldg.heightMeters,
      bevelEnabled: true,
      bevelThickness: 0.3,
      bevelSize: 0.2,
      bevelSegments: 2,
    };

    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }, [bldg, centerLat, centerLng]);

  if (!geom) return null;

  const deg2rad = Math.PI / 180;
  const cosLat = Math.cos(centerLat * deg2rad);
  const labelX = (bldg.coordinates[0][0] - centerLng) * deg2rad * 6371000 * cosLat;
  const labelZ = -(bldg.coordinates[0][1] - centerLat) * deg2rad * 6371000;

  return (
    <group>
      <mesh geometry={geom} rotation={[-Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#475569" metalness={0.4} roughness={0.6} />
      </mesh>

      {/* Building 3D Name & Height Badge */}
      <Html position={[labelX, bldg.heightMeters + 3, labelZ]} center distanceFactor={35}>
        <div className="bg-slate-900/90 text-slate-200 border border-slate-700 px-2 py-0.5 rounded text-[9px] font-mono shadow-md whitespace-nowrap pointer-events-none">
          <span className="font-bold text-white">{bldg.name}</span>
          <span className="text-amber-400 font-semibold ml-1">({bldg.heightMeters}m)</span>
        </div>
      </Html>
    </group>
  );
};

// 3D Candidate Plot Boundary Mesh
const PlotBoundaryMesh: React.FC<{
  plotGeometry?: number[][][] | null;
  plotAreaSqm: number;
  centerLat: number;
  centerLng: number;
}> = ({ plotGeometry, plotAreaSqm, centerLat, centerLng }) => {
  const geom = React.useMemo(() => {
    if (!plotGeometry || !plotGeometry[0] || plotGeometry[0].length < 3) return null;

    const deg2rad = Math.PI / 180;
    const cosLat = Math.cos(centerLat * deg2rad);
    const R = 6371000;

    const shape = new THREE.Shape();
    plotGeometry[0].forEach(([lng, lat], i) => {
      const x = (lng - centerLng) * deg2rad * R * cosLat;
      const z = -(lat - centerLat) * deg2rad * R;
      if (i === 0) shape.moveTo(x, z);
      else shape.lineTo(x, z);
    });

    const extrudeSettings = {
      depth: 0.2,
      bevelEnabled: false,
    };

    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }, [plotGeometry, centerLat, centerLng]);

  if (geom) {
    return (
      <group position={[0, 0.05, 0]}>
        <mesh geometry={geom} rotation={[-Math.PI / 2, 0, 0]} receiveShadow castShadow>
          <meshStandardMaterial color="#065f46" opacity={0.6} transparent metalness={0.2} roughness={0.4} />
        </mesh>
      </group>
    );
  }

  // Fallback box base if plotGeometry is not yet drawn
  const sideLength = Math.sqrt(plotAreaSqm || 2450);
  const plotWidth = Math.max(30, Math.min(120, sideLength * 0.95));
  const plotDepth = Math.max(20, Math.min(90, sideLength * 0.65));

  return (
    <group position={[0, 0.05, 0]}>
      <mesh receiveShadow castShadow>
        <boxGeometry args={[plotWidth, 0.15, plotDepth]} />
        <meshStandardMaterial color="#065f46" opacity={0.65} transparent metalness={0.2} roughness={0.4} />
      </mesh>
    </group>
  );
};

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
  plotGeometry,
  solarElevation,
  centerLat = 19.9975,
  centerLng = 73.7898,
  buildings = [],
  selectedComponentId,
  onSelectComponent,
}) => {
  const sunRad = (Math.max(10, solarElevation) * Math.PI) / 180;
  const sunY = Math.sin(sunRad) * 70;
  const sunZ = Math.cos(sunRad) * 70;

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
        <PlotBoundaryMesh
          plotGeometry={plotGeometry}
          plotAreaSqm={plotAreaSqm}
          centerLat={centerLat}
          centerLng={centerLng}
        />

        {/* Extruded Spatially Filtered Nearby OSM 3D Buildings (<500m) */}
        {buildings.map((bldg) => (
          <BuildingExtrusionMesh
            key={bldg.id}
            bldg={bldg}
            centerLat={centerLat}
            centerLng={centerLng}
          />
        ))}

        {/* Render Procedural 3D Infrastructure Components */}
        {components.map((comp) => {
          const isSelected = comp.id === selectedComponentId;
          const handleSelect = () => onSelectComponent?.(comp);
          const maxDim = Math.max(comp.widthMeters || 4, comp.lengthMeters || 3);

          return (
            <group key={comp.id}>
              {/* Pulsing Highlight Ring around Selected Component */}
              {isSelected && (
                <group position={[comp.xMeters, 0.1, -comp.yMeters]} rotation={[-Math.PI / 2, 0, 0]}>
                  <mesh>
                    <ringGeometry args={[maxDim / 2 + 0.3, maxDim / 2 + 0.7, 32]} />
                    <meshBasicMaterial color="#f59e0b" side={THREE.DoubleSide} transparent opacity={0.85} />
                  </mesh>
                </group>
              )}

              {comp.type === 'SOLAR_CANOPY' && (
                <SolarCanopyMesh
                  comp={comp}
                  isSelected={isSelected}
                  onSelect={handleSelect}
                />
              )}

              {(comp.type === 'EV_CHARGER' || comp.type === 'CHARGING_BAY') && (
                <EVChargerMesh
                  comp={comp}
                  isSelected={isSelected}
                  onSelect={handleSelect}
                />
              )}

              {comp.type === 'BESS_CONTAINER' && (
                <BESSContainerMesh
                  comp={comp}
                  isSelected={isSelected}
                  onSelect={handleSelect}
                />
              )}

              {comp.type === 'TRANSFORMER' && (
                <TransformerMesh
                  comp={comp}
                  isSelected={isSelected}
                  onSelect={handleSelect}
                />
              )}
            </group>
          );
        })}
      </Canvas>
    </div>
  );
};
