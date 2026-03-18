'use client';

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import type { Message, Player, RoomState } from '@/lib/types';

interface GameContextType {
  socketId: string | null;
  room: RoomState | null;
  messages: Message[];
  currentPlayer: Player | null;
  isConnected: boolean;
  error: string | null;
  createRoom: (name: string) => void;
  joinRoom: (roomId: string, name: string) => void;
  sendMessage: (text: string) => void;
  clearError: () => void;
}

const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const socketRef = useRef<Socket | null>(null);
  const [socketId, setSocketId] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [room, setRoom] = useState<RoomState | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const socket = io('', { path: '/socket.io' });
    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      setSocketId(socket.id ?? null);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('room-created', ({ roomId }: { roomId: string }) => {
      // Room will be updated on game-start; just redirect
      // We push navigation from the component that called createRoom
      // by dispatching a custom event
      window.dispatchEvent(new CustomEvent('room-ready', { detail: { roomId } }));
    });

    socket.on('room-error', ({ message }: { message: string }) => {
      setError(message);
    });

    socket.on('game-start', ({ room }: { room: RoomState }) => {
      setRoom(room);
    });

    socket.on('message-received', ({ message, room }: { message: Message; room: RoomState }) => {
      setMessages(prev => [...prev, message]);
      setRoom(room);
    });

    socket.on('player-left', ({ playerName }: { playerName: string }) => {
      setError(`${playerName} さんが退出しました`);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const createRoom = useCallback((name: string) => {
    if (!socketRef.current) return;
    setCurrentPlayer({ id: socketRef.current.id ?? '', name });
    setMessages([]);
    socketRef.current.emit('create-room', { name });
  }, []);

  const joinRoom = useCallback((roomId: string, name: string) => {
    if (!socketRef.current) return;
    setCurrentPlayer({ id: socketRef.current.id ?? '', name });
    setMessages([]);
    socketRef.current.emit('join-room', { roomId, name });
  }, []);

  const sendMessage = useCallback((text: string) => {
    if (!socketRef.current) return;
    socketRef.current.emit('send-message', { text });
  }, []);

  const clearError = useCallback(() => setError(null), []);

  // Update currentPlayer id when socket connects
  useEffect(() => {
    if (socketId && currentPlayer && currentPlayer.id !== socketId) {
      setCurrentPlayer(prev => prev ? { ...prev, id: socketId } : null);
    }
  }, [socketId, currentPlayer]);

  return (
    <GameContext.Provider value={{
      socketId,
      room,
      messages,
      currentPlayer,
      isConnected,
      error,
      createRoom,
      joinRoom,
      sendMessage,
      clearError,
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}
