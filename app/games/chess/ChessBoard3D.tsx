/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useRef, useState, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Text } from '@react-three/drei'
import * as THREE from 'three'
import { Chess, PieceSymbol, Color } from 'chess.js'

interface ChessBoard3DProps {
  game: Chess
  selectedSquare: string | null
  possibleMoves: string[]
  lastMove: { from: string, to: string } | null
  focusedSquare: string
  animatingMove: { from: string, to: string } | null
  onSquareClick: (square: string) => void
  onSquareFocus: (square: string) => void
  theme: 'light' | 'dark'
}

const Square: React.FC<{
  position: [number, number, number]
  color: string
  isSelected: boolean
  isPossibleMove: boolean
  isLastMove: boolean
  isFocused: boolean
  onClick: () => void
  onPointerOver: () => void
}> = ({ position, color, isSelected, isPossibleMove, isLastMove, isFocused, onClick, onPointerOver }) => {
  const meshRef = useRef<THREE.Mesh>(null!)
  const ringRef = useRef<THREE.Mesh>(null!)
  const particleRef = useRef<THREE.Group>(null!)

  useFrame((state) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.MeshStandardMaterial
      material.emissive.setHex(
        isSelected ? 0x0000ff :
        isPossibleMove ? 0x00ff00 :
        isLastMove ? 0xffff00 :
        isFocused ? 0x800080 : 0x000000
      )
      material.emissiveIntensity = isSelected || isPossibleMove || isLastMove || isFocused ? 0.3 : 0
    }
    if (ringRef.current) {
      ringRef.current.visible = isPossibleMove
      ringRef.current.rotation.y += 0.01
    }
    if (particleRef.current && isPossibleMove) {
      particleRef.current.children.forEach((child, i) => {
        child.position.y = Math.sin(state.clock.elapsedTime * 2 + i) * 0.1
      })
    }
  })

  return (
    <group>
      <mesh
        ref={meshRef}
        position={position}
        onClick={onClick}
        onPointerOver={onPointerOver}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[0.95, 0.15, 0.95]} />
        <meshStandardMaterial
          color={color}
          metalness={0.05}
          roughness={0.9}
          envMapIntensity={0.1}
        />
      </mesh>
      {isPossibleMove && (
        <>
          <mesh ref={ringRef} position={[position[0], position[1] + 0.06, position[2]]}>
            <torusGeometry args={[0.4, 0.05, 8, 16]} />
            <meshStandardMaterial color="#00ff00" emissive="#004400" emissiveIntensity={0.5} />
          </mesh>
          <group ref={particleRef}>
            {Array.from({ length: 3 }, (_, i) => (
              <mesh key={i} position={[position[0] + (i - 1) * 0.2, position[1] + 0.2, position[2] + (i - 1) * 0.2]}>
                <sphereGeometry args={[0.02]} />
                <meshStandardMaterial color="#00ff00" emissive="#004400" emissiveIntensity={0.8} />
              </mesh>
            ))}
          </group>
        </>
      )}
    </group>
  )
}


const Piece3D: React.FC<{
  type: PieceSymbol
  color: Color
  position: [number, number, number]
  isAnimating: boolean
  targetPosition?: [number, number, number]
  isInCheck?: boolean
}> = ({ type, color, position, isAnimating, targetPosition, isInCheck = false }) => {
  const groupRef = useRef<THREE.Group>(null)
  const [currentPosition, setCurrentPosition] = useState(position)
  const materialColor = color === 'w' ? '#f0f0f0' : '#333333'
  const scale = type === 'k' ? 1.2 : type === 'q' ? 1.0 : type === 'b' ? 0.9 : type === 'n' ? 0.8 : type === 'r' ? 0.7 : 0.6
  const material = (
    <meshStandardMaterial
      color={materialColor}
      emissive={isInCheck ? '#ff0000' : '#000000'}
      emissiveIntensity={isInCheck ? 0.2 : 0}
      metalness={0.05}
      roughness={0.9}
    />
  )

  useFrame((state: any, delta: number) => {
    if (groupRef.current) {
      if (isAnimating && targetPosition) {
        const speed = 2
        const newX = THREE.MathUtils.lerp(currentPosition[0], targetPosition[0], delta * speed)
        const newY = THREE.MathUtils.lerp(currentPosition[1], targetPosition[1], delta * speed)
        const newZ = THREE.MathUtils.lerp(currentPosition[2], targetPosition[2], delta * speed)
        setCurrentPosition([newX, newY, newZ])
        groupRef.current.position.set(newX, newY, newZ)

        if (Math.abs(newX - targetPosition[0]) < 0.01 && Math.abs(newY - targetPosition[1]) < 0.01 && Math.abs(newZ - targetPosition[2]) < 0.01) {
          setCurrentPosition(targetPosition)
          groupRef.current.position.set(...targetPosition)
        }
      } else if (!isAnimating) {
        groupRef.current.position.set(position[0], position[1], position[2])
      }
    }
  })

  const renderPiece = () => {
    switch (type) {
      case 'p':
        return (
          <>
            <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.25, 0.25, 0.2]} />
              {material}
            </mesh>
            <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.15, 0.15, 0.4]} />
              {material}
            </mesh>
            <mesh position={[0, 0.7, 0]} castShadow receiveShadow>
              <sphereGeometry args={[0.2]} />
              {material}
            </mesh>
          </>
        )
      case 'r':
        return (
          <>
            <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.5, 0.4, 0.5]} />
              {material}
            </mesh>
            <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.4, 0.4, 0.4]} />
              {material}
            </mesh>
            <mesh position={[-0.15, 0.8, -0.15]} castShadow receiveShadow>
              <boxGeometry args={[0.1, 0.1, 0.1]} />
              {material}
            </mesh>
            <mesh position={[0.15, 0.8, -0.15]} castShadow receiveShadow>
              <boxGeometry args={[0.1, 0.1, 0.1]} />
              {material}
            </mesh>
            <mesh position={[-0.15, 0.8, 0.15]} castShadow receiveShadow>
              <boxGeometry args={[0.1, 0.1, 0.1]} />
              {material}
            </mesh>
            <mesh position={[0.15, 0.8, 0.15]} castShadow receiveShadow>
              <boxGeometry args={[0.1, 0.1, 0.1]} />
              {material}
            </mesh>
          </>
        )
      case 'n':
        return (
          <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.4, 0.9, 0.3]} />
            {material}
          </mesh>
        )
      case 'b':
        return (
          <>
            <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.25, 0.25, 0.4]} />
              {material}
            </mesh>
            <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
              <coneGeometry args={[0.2, 0.4]} />
              {material}
            </mesh>
          </>
        )
      case 'q':
        return (
          <>
            <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.3, 0.3, 0.4]} />
              {material}
            </mesh>
            <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.2, 0.2, 0.4]} />
              {material}
            </mesh>
            <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
              <sphereGeometry args={[0.15]} />
              {material}
            </mesh>
          </>
        )
      case 'k':
        return (
          <>
            <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.4, 0.4, 0.4]} />
              {material}
            </mesh>
            <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.3, 0.4, 0.3]} />
              {material}
            </mesh>
            <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.2, 0.2, 0.2]} />
              {material}
            </mesh>
          </>
        )
    }
  }

  return <group ref={groupRef} scale={scale}>{renderPiece()}</group>
}

// Board Model loader
const BoardModel: React.FC<{ theme: 'light' | 'dark' }> = ({ theme }) => {
  return (
    <mesh position={[0, -0.03, 0]} receiveShadow castShadow>
      <boxGeometry args={[9.8, 0.1, 9.8]} />
      <meshStandardMaterial color={theme === 'dark' ? '#5a5a5a' : '#a0856a'} />
    </mesh>
  )
}

const ChessBoard3D: React.FC<ChessBoard3DProps> = ({
  game,
  selectedSquare,
  possibleMoves,
  lastMove,
  focusedSquare,
  animatingMove,
  onSquareClick,
  onSquareFocus,
  theme
}) => {
  const boardSquares = []
  const pieces = []

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const square = String.fromCharCode(97 + col) + (8 - row)
      const isLight = (row + col) % 2 === 0
      const color = isLight
        ? (theme === 'dark' ? '#f0d9b5' : '#ffffe0')
        : (theme === 'dark' ? '#b58863' : '#8b4513')
      const position: [number, number, number] = [col - 3.5, 0, row - 3.5]

      const isSelected = selectedSquare === square
      const isPossibleMove = possibleMoves.includes(square)
      const isLastMove = lastMove?.to === square
      const isFocused = focusedSquare === square

      boardSquares.push(
        <Square
          key={square}
          position={position}
          color={color}
          isSelected={isSelected}
          isPossibleMove={isPossibleMove}
          isLastMove={isLastMove}
          isFocused={isFocused}
          onClick={() => onSquareClick(square)}
          onPointerOver={() => onSquareFocus(square)}
        />
      )

      const piece = game.get(square as any)
      if (piece) {
        const isInCheck = game.inCheck() && piece.type === 'k' && piece.color === game.turn()
        // Don't render the piece that's currently animating from this square
        if (animatingMove && animatingMove.from === square) {
          // Render the animating piece at target position
          const toCol = animatingMove.to.charCodeAt(0) - 97
          const toRow = parseInt(animatingMove.to[1]) - 1
          const targetPosition: [number, number, number] = [toCol - 3.5, 0, toRow - 3.5]
          pieces.push(
            <Piece3D
              key={`animating-${piece.type}-${piece.color}`}
              type={piece.type}
              color={piece.color}
              position={[col - 3.5, 0, row - 3.5]}
              isAnimating={true}
              targetPosition={targetPosition}
              isInCheck={isInCheck}
            />
          )
        } else {
          // Normal piece rendering
          const piecePosition: [number, number, number] = [col - 3.5, 0, row - 3.5]
          pieces.push(
            <Piece3D
              key={`${square}-${piece.type}-${piece.color}`}
              type={piece.type}
              color={piece.color}
              position={piecePosition}
              isAnimating={false}
              isInCheck={isInCheck}
            />
          )
        }
      }
    }
  }

  return (
    <Canvas
      camera={{ position: [0, 14.2, 14.2], fov: 45 }}
      shadows
      gl={{ antialias: true }}
    >
      <ambientLight intensity={0.7} />
      <directionalLight
        position={[8, 12, 8]}
        intensity={1.0}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={20}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-camera-near={1}
        shadow-bias={-0.0001}
      />
      <directionalLight position={[-6, 8, -6]} intensity={0.4} />
      <pointLight position={[0, 10, 0]} intensity={0.4} />
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={10}
        maxDistance={22}
        minPolarAngle={Math.PI / 8}
        maxPolarAngle={Math.PI / 2.2}
        target={[0, 0, 0]}
        maxAzimuthAngle={Math.PI / 4}
        minAzimuthAngle={-Math.PI / 4}
      />
      <Suspense fallback={
        <group scale={1.2}>
          {/* Fallback board while loading */}
          <mesh position={[0, -0.03, 0]} receiveShadow castShadow>
            <boxGeometry args={[9.8, 0.1, 9.8]} />
            <meshStandardMaterial color={theme === 'dark' ? '#5a5a5a' : '#a0856a'} />
          </mesh>
          {boardSquares}
        </group>
      }>
        <group scale={1.2}>
          {/* 3D Board Model */}
          <BoardModel theme={theme} />
          {boardSquares}
          {pieces}
          {/* File labels */}
          {Array.from({ length: 8 }, (_, i) => (
            <Text
              key={`file-${i}`}
              position={[i - 3.5, 0.2, -6.0]}
              fontSize={0.35}
              color={theme === 'dark' ? '#cccccc' : '#333333'}
              anchorX="center"
              anchorY="middle"
            >
              {String.fromCharCode(97 + i)}
            </Text>
          ))}
          {/* Rank labels */}
          {Array.from({ length: 8 }, (_, i) => (
            <Text
              key={`rank-${i}`}
              position={[-6.0, 0.2, i - 3.5]}
              fontSize={0.35}
              color={theme === 'dark' ? '#cccccc' : '#333333'}
              anchorX="center"
              anchorY="middle"
            >
              {8 - i}
            </Text>
          ))}
        </group>
      </Suspense>
    </Canvas>
  )
}

export default ChessBoard3D
