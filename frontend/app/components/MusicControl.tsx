"use client";

import { useState, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Music } from "lucide-react";
import { audioManager, AudioState } from "../audioManager";

export default function MusicControl() {
    const [audioState, setAudioState] = useState<AudioState>({
        isPlaying: false,
        isMuted: false,
        volume: 0.35,
        isLoaded: false,
        error: null,
    });

    const [showVolumeSlider, setShowVolumeSlider] = useState(false);

    useEffect(() => {
        const unsubscribe = audioManager.subscribe((state) => {
            setAudioState(state);
        });
        return () => unsubscribe();
    }, []);

    const handleTogglePlay = () => {
        audioManager.togglePlay();
    };

    const handleToggleMute = () => {
        audioManager.toggleMute();
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVol = parseFloat(e.target.value);
        audioManager.setVolume(newVol);
    };

    const volumePercent = Math.round((audioState.isMuted ? 0 : audioState.volume) * 100);

    return (
        <div 
            className="relative flex items-center space-x-2 bg-slate-50 dark:bg-navy-800 border border-slate-200/80 dark:border-cyan/30 px-3 py-1.5 rounded-xl shadow-2xs group transition-all"
            onMouseEnter={() => setShowVolumeSlider(true)}
            onMouseLeave={() => setShowVolumeSlider(false)}
        >
            {/* Title & Icon */}
            <div className="flex items-center space-x-1.5 cursor-pointer select-none" onClick={handleTogglePlay}>
                <div className={`flex items-center justify-center w-5 h-5 rounded-lg transition-colors ${
                    audioState.isPlaying 
                        ? "bg-cyan/20 text-cyan border border-cyan/40 shadow-[0_0_10px_rgba(24,213,208,0.4)]" 
                        : "bg-slate-200 dark:bg-navy-900 text-slate-400"
                }`}>
                    <Music className={`w-3 h-3 ${audioState.isPlaying ? "animate-pulse text-cyan" : ""}`} />
                </div>
                <span className="text-[11px] font-black tracking-tight text-navy-900 dark:text-white flex items-center space-x-1">
                    <span>♫</span>
                    <span className="hidden sm:inline">Farm Theme</span>
                </span>
            </div>

            {/* Play / Pause Toggle Button */}
            <button
                type="button"
                onClick={handleTogglePlay}
                title={audioState.isPlaying ? "Pause Farm Theme" : "Play Farm Theme"}
                className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-navy-900 text-navy-900 dark:text-cyan transition-colors cursor-pointer"
            >
                {audioState.isPlaying ? (
                    <Pause className="w-3.5 h-3.5 text-cyan" />
                ) : (
                    <Play className="w-3.5 h-3.5 text-slate-400 dark:text-slate-300" />
                )}
            </button>

            {/* Mute / Unmute Toggle Button */}
            <button
                type="button"
                onClick={handleToggleMute}
                title={audioState.isMuted ? "Unmute Audio" : "Mute Audio"}
                className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-navy-900 text-navy-900 dark:text-cyan transition-colors cursor-pointer"
            >
                {audioState.isMuted || audioState.volume === 0 ? (
                    <VolumeX className="w-3.5 h-3.5 text-red-400" />
                ) : (
                    <Volume2 className="w-3.5 h-3.5 text-teal-700 dark:text-lime" />
                )}
            </button>

            {/* Volume Percentage Indicator */}
            <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 w-7 text-right">
                {volumePercent}%
            </span>

            {/* Futuristic Hover / Expanded Volume Slider Popup */}
            <div className={`flex items-center transition-all duration-200 ${
                showVolumeSlider ? "w-20 opacity-100 ml-1.5" : "w-0 opacity-0 overflow-hidden"
            }`}>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={audioState.isMuted ? 0 : audioState.volume}
                    onChange={handleVolumeChange}
                    aria-label="Farm Theme Volume"
                    className="w-20 h-1.5 bg-slate-200 dark:bg-navy-950 rounded-lg appearance-none cursor-pointer accent-cyan focus:outline-none"
                />
            </div>
        </div>
    );
}
