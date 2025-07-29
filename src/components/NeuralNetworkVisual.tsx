'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Node {
  id: number;
  x: number;
  y: number;
  connections: number[];
  activity: number;
}

interface Connection {
  from: Node;
  to: Node;
  strength: number;
  active: boolean;
  opacity: number;
  dissolving: boolean;
}

interface MovingDot {
  id: string;
  connectionIndex: number;
  progress: number;
  speed: number;
}

const NeuralNetworkVisual = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [movingDots, setMovingDots] = useState<MovingDot[]>([]);
  const [pulseIndex, setPulseIndex] = useState(0);

  // Generate neural network structure
  useEffect(() => {
    const generateNetwork = () => {
      const networkNodes: Node[] = [];
      const layers = [8, 12, 16, 12, 8]; // 5 layers with varying node counts
      const layerSpacing = 100 / (layers.length - 1);
      
      let nodeId = 0;
      layers.forEach((nodeCount, layerIndex) => {
        const nodeSpacing = 80 / (nodeCount - 1);
        for (let i = 0; i < nodeCount; i++) {
          networkNodes.push({
            id: nodeId++,
            x: layerIndex * layerSpacing + 10,
            y: i * nodeSpacing + 10,
            connections: [],
            activity: Math.random()
          });
        }
      });

      // Create connections between adjacent layers
      const networkConnections: Connection[] = [];
      let currentLayerStart = 0;
      
      for (let layerIndex = 0; layerIndex < layers.length - 1; layerIndex++) {
        const currentLayerSize = layers[layerIndex];
        const nextLayerSize = layers[layerIndex + 1];
        const nextLayerStart = currentLayerStart + currentLayerSize;
        
        for (let i = 0; i < currentLayerSize; i++) {
          const currentNode = networkNodes[currentLayerStart + i];
          
          // Connect to 2-4 nodes in the next layer
          const connectionCount = Math.floor(Math.random() * 3) + 2;
          const targetIndices = Array.from({ length: nextLayerSize }, (_, idx) => idx)
            .sort(() => Math.random() - 0.5)
            .slice(0, connectionCount);
          
          targetIndices.forEach(targetIndex => {
            const targetNode = networkNodes[nextLayerStart + targetIndex];
            currentNode.connections.push(targetNode.id);
            
            networkConnections.push({
              from: currentNode,
              to: targetNode,
              strength: Math.random() * 0.8 + 0.2,
              active: false,
              opacity: Math.random() * 0.8 + 0.2,
              dissolving: Math.random() > 0.5
            });
          });
        }
        
        currentLayerStart += currentLayerSize;
      }

      setNodes(networkNodes);
      setConnections(networkConnections);
    };

    generateNetwork();
  }, []);

  // Animate neural pulses, moving dots, and dissolving connections
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseIndex(prev => (prev + 1) % connections.length);
      
      // Update node activities
      setNodes(prevNodes => 
        prevNodes.map(node => ({
          ...node,
          activity: Math.max(0, node.activity + (Math.random() - 0.5) * 0.3)
        }))
      );
      
      // Slowly dissolve and reappear connections
      setConnections(prevConnections =>
        prevConnections.map((conn, index) => {
          let newOpacity = conn.opacity;
          let newDissolving = conn.dissolving;
          
          if (conn.dissolving) {
            newOpacity = Math.max(0.1, newOpacity - 0.02); // Slow dissolve
            if (newOpacity <= 0.1) {
              newDissolving = false; // Start reappearing
            }
          } else {
            newOpacity = Math.min(1, newOpacity + 0.015); // Slow reappear
            if (newOpacity >= 1 && Math.random() > 0.98) {
              newDissolving = true; // Start dissolving again
            }
          }
          
          return {
            ...conn,
            active: Math.random() > 0.7,
            strength: Math.random() * 0.8 + 0.2,
            opacity: newOpacity,
            dissolving: newDissolving
          };
        })
      );
      
      // Update moving dots
      setMovingDots(prevDots => {
        const updatedDots = prevDots.map(dot => ({
          ...dot,
          progress: (dot.progress + dot.speed) % 1
        }));
        
        // Add new dots randomly
        const newDots = [...updatedDots];
        if (Math.random() > 0.85 && connections.length > 0) {
          const randomConnectionIndex = Math.floor(Math.random() * connections.length);
          newDots.push({
            id: `dot-${Date.now()}-${Math.random()}`,
            connectionIndex: randomConnectionIndex,
            progress: 0,
            speed: 0.008 + Math.random() * 0.012 // Varying speeds
          });
        }
        
        // Remove dots that completed their journey and limit total dots
        return newDots.filter(dot => dot.progress < 0.98).slice(-20);
      });
    }, 100); // Faster update for smoother movement

    return () => clearInterval(interval);
  }, [connections.length]);

  return (
    <div className="absolute top-1/2 right-0 transform -translate-y-1/2 w-2/3 h-full flex items-center justify-center">
      <div className="relative w-full h-full max-w-4xl max-h-[600px] p-8">
        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-cyan-500/10 rounded-3xl blur-3xl"></div>
        
        {/* Neural Network Container */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
          <defs>
            {/* Gradients for connections */}
            <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.8" />
            </linearGradient>
            
            <linearGradient id="activeConnectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fbbf24" stopOpacity="1" />
              <stop offset="50%" stopColor="#f59e0b" stopOpacity="1" />
              <stop offset="100%" stopColor="#d97706" stopOpacity="1" />
            </linearGradient>

            {/* Glow filter */}
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Render connections */}
          {connections.map((connection, index) => (
            <motion.line
              key={`${connection.from.id}-${connection.to.id}`}
              x1={connection.from.x}
              y1={connection.from.y}
              x2={connection.to.x}
              y2={connection.to.y}
              stroke={connection.active ? "url(#activeConnectionGradient)" : "url(#connectionGradient)"}
              strokeWidth={connection.active ? connection.strength * 0.8 : connection.strength * 0.3}
              strokeOpacity={connection.opacity * (connection.active ? 0.9 : 0.4)}
              filter={connection.active ? "url(#glow)" : "none"}
              initial={{ pathLength: 0 }}
              animate={{ 
                pathLength: 1,
                strokeOpacity: connection.opacity * (connection.active ? 0.9 : 0.4)
              }}
              transition={{ 
                pathLength: { duration: 2, delay: index * 0.02 },
                strokeOpacity: { duration: 2, ease: "easeInOut" }
              }}
            />
          ))}
          
          {/* Render moving dots along connections */}
          {movingDots.map((dot) => {
            const connection = connections[dot.connectionIndex];
            if (!connection) return null;
            
            // Calculate position along the connection
            const x = connection.from.x + (connection.to.x - connection.from.x) * dot.progress;
            const y = connection.from.y + (connection.to.y - connection.from.y) * dot.progress;
            
            return (
              <motion.circle
                key={dot.id}
                cx={x}
                cy={y}
                r={0.4}
                fill="#fbbf24"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: [0, 1.2, 1, 1.2, 0],
                  opacity: [0, 1, 1, 1, 0]
                }}
                transition={{
                  duration: 1,
                  ease: "easeInOut"
                }}
                filter="url(#glow)"
              />
            );
          })}
          
          {/* Render nodes */}
          {nodes.map((node, index) => (
            <motion.g key={node.id}>
              {/* Node glow */}
              <motion.circle
                cx={node.x}
                cy={node.y}
                r={node.activity * 2 + 1}
                fill="url(#connectionGradient)"
                opacity={0.3}
                filter="url(#glow)"
                animate={{
                  r: [node.activity * 2 + 1, node.activity * 2 + 2, node.activity * 2 + 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: index * 0.1
                }}
              />
              
              {/* Main node */}
              <motion.circle
                cx={node.x}
                cy={node.y}
                r={node.activity + 0.5}
                fill={node.activity > 0.7 ? "#fbbf24" : "#06b6d4"}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: 1, 
                  opacity: 1,
                  r: [node.activity + 0.5, node.activity + 0.8, node.activity + 0.5]
                }}
                transition={{ 
                  scale: { duration: 0.5, delay: index * 0.05 },
                  opacity: { duration: 0.5, delay: index * 0.05 },
                  r: { duration: 1.5, repeat: Infinity, delay: index * 0.1 }
                }}
              />
              
              {/* Node core */}
              <motion.circle
                cx={node.x}
                cy={node.y}
                r={0.3}
                fill="white"
                opacity={0.9}
                animate={{
                  opacity: node.activity > 0.8 ? [0.9, 1, 0.9] : 0.9
                }}
                transition={{
                  duration: 0.3,
                  repeat: node.activity > 0.8 ? Infinity : 0
                }}
              />
            </motion.g>
          ))}
        </svg>

        {/* Data flow indicators */}
        <div className="absolute top-4 left-4 space-y-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 }}
            className="bg-black/40 backdrop-blur-md rounded-lg p-3 border border-cyan-400/30"
          >
            <div className="text-xs text-cyan-300 mb-1">Neural Activity</div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-white font-mono">
                {Math.floor(nodes.filter(n => n.activity > 0.7).length / nodes.length * 100)}%
              </span>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2 }}
            className="bg-black/40 backdrop-blur-md rounded-lg p-3 border border-purple-400/30"
          >
            <div className="text-xs text-purple-300 mb-1">Processing</div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-white font-mono">
                {connections.filter(c => c.active).length} signals
              </span>
            </div>
          </motion.div>
        </div>

        {/* Floating data particles */}
        {[...Array(12)].map((_, i) => {
          const paths = [
            { startX: 10, startY: 20, endX: 90, endY: 25 },
            { startX: 15, startY: 40, endX: 85, endY: 45 },
            { startX: 10, startY: 60, endX: 90, endY: 65 },
            { startX: 15, startY: 80, endX: 85, endY: 75 },
            { startX: 10, startY: 30, endX: 90, endY: 35 },
            { startX: 15, startY: 50, endX: 85, endY: 55 },
            { startX: 10, startY: 70, endX: 90, endY: 70 },
            { startX: 15, startY: 15, endX: 85, endY: 20 },
            { startX: 10, startY: 35, endX: 90, endY: 40 },
            { startX: 15, startY: 55, endX: 85, endY: 60 },
            { startX: 10, startY: 75, endX: 90, endY: 80 },
            { startX: 15, startY: 25, endX: 85, endY: 30 }
          ];
          
          return (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-yellow-400 rounded-full"
              style={{
                left: `${paths[i].startX}%`,
                top: `${paths[i].startY}%`
              }}
              animate={{
                x: [`0%`, `${paths[i].endX - paths[i].startX}%`],
                y: [`0%`, `${paths[i].endY - paths[i].startY}%`],
                opacity: [0, 1, 1, 0],
                scale: [0, 1, 1, 0]
              }}
              transition={{
                duration: 3,
                delay: i * 0.25,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          );
        })}

        {/* Neural network title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
          className="absolute bottom-4 right-4 text-right"
        >
          <div className="text-xs text-gray-400 mb-1">AI NEURAL NETWORK</div>
          <div className="text-lg font-bold text-white">Deep Learning</div>
          <div className="text-sm text-cyan-400">Real-time Processing</div>
        </motion.div>
      </div>
    </div>
  );
};

export default NeuralNetworkVisual;