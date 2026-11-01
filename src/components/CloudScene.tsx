"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Billboard, OrbitControls, Sparkles, useTexture } from "@react-three/drei";
import { Suspense, useRef } from "react";
import * as THREE from "three";

function Portrait() {
  const texture = useTexture("/ashan-3d-portrait.png");
  texture.colorSpace = THREE.SRGBColorSpace;
  return <Billboard follow position={[0,0.14,0.45]}>
    <mesh renderOrder={4}>
      <planeGeometry args={[4.1,3.75]}/>
      <meshBasicMaterial map={texture} transparent alphaTest={0.04} depthWrite={false} toneMapped={false} side={THREE.DoubleSide}/>
    </mesh>
  </Billboard>;
}

function Stage() {
  const ring = useRef<THREE.Mesh>(null);
  useFrame(({clock})=>{if(ring.current)ring.current.rotation.z=clock.elapsedTime*0.065;});
  return <group>
    <mesh position={[0,-1.55,0]}><cylinderGeometry args={[3.0,3.2,0.32,96]}/><meshStandardMaterial color="#101d36" metalness={0.8} roughness={0.23}/></mesh>
    <mesh position={[0,-1.35,0]}><cylinderGeometry args={[2.65,2.8,0.12,96]}/><meshStandardMaterial color="#173969" metalness={0.7} roughness={0.27}/></mesh>
    <mesh position={[0,-1.28,0]} rotation={[-Math.PI/2,0,0]}><ringGeometry args={[2.52,2.62,96]}/><meshBasicMaterial color="#54cfff" transparent opacity={0.8} side={THREE.DoubleSide}/></mesh>
    <mesh position={[0,-1.70,0]} rotation={[-Math.PI/2,0,0]}><ringGeometry args={[2.96,3.03,96]}/><meshBasicMaterial color="#686efe" transparent opacity={0.85} side={THREE.DoubleSide}/></mesh>
    <mesh ref={ring} position={[0,-1.24,0]} rotation={[-Math.PI/2,0,0]}><ringGeometry args={[1.6,1.63,64]}/><meshBasicMaterial color="#42d5f1" transparent opacity={0.43} side={THREE.DoubleSide}/></mesh>
    <pointLight position={[0,-0.7,1.2]} color="#25bdfb" intensity={13} distance={5}/>
    <Sparkles count={35} scale={[8,4,5]} size={1.7} speed={0.17} color="#81cfff"/>
  </group>;
}

function Ring({count,radius,y,speed,major}:{count:number;radius:number;y:number;speed:number;major:boolean}) {
  const group=useRef<THREE.Group>(null);
  useFrame(({clock})=>{if(group.current)group.current.rotation.y=clock.elapsedTime*speed;});
  return <group ref={group}>
    <mesh rotation={[-Math.PI/2,0,0]} position={[0,y-0.16,0]}>
      <ringGeometry args={[radius-0.025,radius+0.025,120]}/>
      <meshBasicMaterial color={major?"#398fff":"#7873fb"} side={THREE.DoubleSide} transparent opacity={major?0.8:0.63}/>
    </mesh>
    {Array.from({length:count},(_,i)=>{
      const angle=i*2*Math.PI/count+(major?0.4:0.1);
      const x=Math.cos(angle)*radius;
      const z=Math.sin(angle)*radius;
      return <group key={i} position={[x,y,z]}>
        <mesh><sphereGeometry args={[major?0.07:0.05,12,12]}/><meshBasicMaterial color={major?"#48ddff":"#ad9aff"}/></mesh>
        <pointLight position={[0,0,0]} intensity={1.4} color={major?"#48bbff":"#937fff"} distance={1.3}/>
      </group>;
    })}
  </group>;
}

function World() {
  return <group>
    <Stage/>
    <Suspense fallback={null}><Portrait/></Suspense>
    <Ring count={20} radius={3.42} y={0.26} speed={0.08} major/>
    <Ring count={18} radius={2.82} y={-1.08} speed={-0.046} major={false}/>
  </group>;
}

export default function CloudScene() {
  return <div className="h-full w-full" aria-label="Interactive engineering scene with Ashan's portrait and rotating technology rings.">
    <Canvas dpr={[1,1.6]} camera={{position:[0,2.2,11.5],fov:42}} gl={{alpha:true,antialias:true}}>
      <ambientLight intensity={1.8}/><hemisphereLight args={["#a7dfff","#10142e",1.7]}/>
      <directionalLight position={[4,6,5]} intensity={2.6} color="#d9eeff"/>
      <pointLight position={[-3,2,4]} color="#38c7f3" intensity={17} distance={11}/>
      <pointLight position={[4,1,-2]} color="#aa85ff" intensity={12} distance={9}/>
      <Suspense fallback={null}><World/></Suspense>
      <OrbitControls enablePan={false} enableZoom={false} minPolarAngle={0.92} maxPolarAngle={1.32} minAzimuthAngle={-0.36} maxAzimuthAngle={0.36} rotateSpeed={0.3} enableDamping dampingFactor={0.06}/>
    </Canvas>
  </div>;
}
