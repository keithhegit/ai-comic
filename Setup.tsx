
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import { GENRES, LANGUAGES, Persona } from './types';

interface SetupProps {
    show: boolean;
    isTransitioning: boolean;
    hero: Persona | null;
    friends: Persona[];
    comicTitle: string;
    pageCount: number;
    plotGuidance: string;
    selectedGenre: string;
    selectedLanguage: string;
    customPremise: string;
    richMode: boolean;
    onHeroUpload: (file: File) => void;
    onFriendUpload: (file: File) => void;
    onFriendsChange: (friends: Persona[]) => void;
    onTitleChange: (val: string) => void;
    onPageCountChange: (val: number) => void;
    onPlotGuidanceChange: (val: string) => void;
    onGenreChange: (val: string) => void;
    onLanguageChange: (val: string) => void;
    onPremiseChange: (val: string) => void;
    onRichModeChange: (val: boolean) => void;
    onLaunch: () => void;
}

const Footer = () => {
  const [remixIndex, setRemixIndex] = useState(0);
  const remixes = [
    "为画格添加音效",
    "使用 Veo 3 让画格动起来",
    "本地化为克林贡语",
    "添加反派生成器",
    "打印实体副本",
    "添加语音旁白",
    "创建一个共享宇宙"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setRemixIndex(prev => (prev + 1) % remixes.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black text-white py-3 px-6 flex flex-col md:flex-row justify-between items-center z-[300] border-t-4 border-yellow-400 font-comic">
        <div className="flex items-center gap-2 text-lg md:text-xl">
            <span className="text-yellow-400 font-bold">灵感闪现:</span>
            <span className="animate-pulse">{remixes[remixIndex]}</span>
        </div>
        <div className="flex items-center gap-4 mt-2 md:mt-0">
            <span className="text-gray-500 text-sm hidden md:inline">基于 Gemini 构建</span>
            <a href="https://x.com/ammaar" target="_blank" rel="noopener noreferrer" className="text-white hover:text-yellow-400 transition-colors text-xl">由 @ammaar 创建</a>
        </div>
    </div>
  );
};

export const Setup: React.FC<SetupProps> = (props) => {
    if (!props.show && !props.isTransitioning) return null;

    const removeFriend = (index: number) => {
        const newFriends = [...props.friends];
        newFriends.splice(index, 1);
        props.onFriendsChange(newFriends);
    };

    return (
        <>
        <style>{`
             @keyframes knockout-exit {
                0% { transform: scale(1) rotate(1deg); }
                15% { transform: scale(1.1) rotate(-5deg); }
                100% { transform: translateY(-200vh) rotate(1080deg) scale(0.5); opacity: 1; }
             }
             @keyframes pow-enter {
                 0% { transform: translate(-50%, -50%) scale(0) rotate(-45deg); opacity: 0; }
                 30% { transform: translate(-50%, -50%) scale(1.5) rotate(10deg); opacity: 1; }
                 100% { transform: translate(-50%, -50%) scale(1.8) rotate(0deg); opacity: 0; }
             }
          `}</style>
        {props.isTransitioning && (
            <div className="fixed top-1/2 left-1/2 z-[210] pointer-events-none" style={{ animation: 'pow-enter 1s forwards ease-out' }}>
                <svg viewBox="0 0 200 150" className="w-[500px] h-[400px] drop-shadow-[0_10px_0_rgba(0,0,0,0.5)]">
                    <path d="M95.7,12.8 L110.2,48.5 L148.5,45.2 L125.6,74.3 L156.8,96.8 L119.4,105.5 L122.7,143.8 L92.5,118.6 L60.3,139.7 L72.1,103.2 L34.5,108.8 L59.9,79.9 L24.7,57.3 L62.5,54.4 L61.2,16.5 z" fill="#FFD700" stroke="black" strokeWidth="4"/>
                    <text x="100" y="95" textAnchor="middle" fontFamily="'Bangers', cursive" fontSize="70" fill="#DC2626" stroke="black" strokeWidth="2" transform="rotate(-5 100 75)">POW!</text>
                </svg>
            </div>
        )}
        
        <div className={`fixed inset-0 z-[200] overflow-y-auto`}
             style={{
                 background: props.isTransitioning ? 'transparent' : 'rgba(0,0,0,0.85)', 
                 backdropFilter: props.isTransitioning ? 'none' : 'blur(6px)',
                 animation: props.isTransitioning ? 'knockout-exit 1s forwards cubic-bezier(.6,-0.28,.74,.05)' : 'none',
                 pointerEvents: props.isTransitioning ? 'none' : 'auto'
             }}>
          <div className="min-h-full flex items-center justify-center p-4 pb-32 md:pb-24">
            {/* Compacted width and internal spacing */}
            <div className="max-w-[900px] w-full bg-white p-4 md:p-5 rotate-1 border-[6px] border-black shadow-[12px_12px_0px_rgba(0,0,0,0.6)] text-center relative">
                
                <h1 className="font-comic text-5xl text-red-600 leading-none mb-1 tracking-wide inline-block mr-3" style={{textShadow: '2px 2px 0px black'}}>无尽</h1>
                <h1 className="font-comic text-5xl text-yellow-400 leading-none mb-4 tracking-wide inline-block" style={{textShadow: '2px 2px 0px black'}}>英雄</h1>
                
                <div className="flex flex-col md:flex-row gap-4 mb-4 text-left">
                    
                    {/* Left Column: Cast */}
                    <div className="flex-1 flex flex-col gap-2">
                        <div className="font-comic text-xl text-black border-b-4 border-black mb-1">1. 角色阵容</div>
                        
                        {/* HERO UPLOAD */}
                        <div className={`p-3 border-4 border-dashed ${props.hero ? 'border-green-500 bg-green-50' : 'border-blue-300 bg-blue-50'} transition-colors relative group`}>
                            <div className="flex justify-between items-center mb-1">
                                <p className="font-comic text-lg uppercase font-bold text-blue-900">主角 (必填)</p>
                                {props.hero && <span className="text-green-600 font-bold font-comic text-sm animate-pulse">✓ 已就绪</span>}
                            </div>
                            
                            {props.hero ? (
                                <div className="flex gap-3 items-center mt-1">
                                     <img src={`data:image/jpeg;base64,${props.hero.base64}`} alt="Hero Preview" className="w-20 h-20 object-cover border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,0.2)] bg-white rotate-[-2deg]" />
                                     <label className="cursor-pointer comic-btn bg-yellow-400 text-black text-sm px-3 py-1 hover:bg-yellow-300 transition-transform active:scale-95 uppercase">
                                         更换
                                         <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && props.onHeroUpload(e.target.files[0])} />
                                     </label>
                                </div>
                            ) : (
                                <label className="comic-btn bg-blue-500 text-white text-lg px-3 py-3 block w-full hover:bg-blue-400 cursor-pointer text-center">
                                    上传主角图片
                                    <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && props.onHeroUpload(e.target.files[0])} />
                                </label>
                            )}
                        </div>

                        {/* CO-STARS UPLOAD */}
                        <div className={`p-3 border-4 border-dashed ${props.friends.length > 0 ? 'border-green-500 bg-green-50' : 'border-purple-300 bg-purple-50'} transition-colors`}>
                            <div className="flex justify-between items-center mb-2">
                                <p className="font-comic text-lg uppercase font-bold text-purple-900">配角 ({props.friends.length})</p>
                                <label className="cursor-pointer comic-btn bg-purple-500 text-white text-xs px-2 py-1 hover:bg-purple-400 uppercase shadow-sm">
                                    + 添加
                                    <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && props.onFriendUpload(e.target.files[0])} />
                                </label>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                {props.friends.map((f, idx) => (
                                    <div key={idx} className="relative group w-16 h-16">
                                        <img src={`data:image/jpeg;base64,${f.base64}`} className="w-full h-full object-cover border-2 border-black shadow-sm" />
                                        <button onClick={() => removeFriend(idx)} className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs border border-black hover:scale-110 font-bold z-10">X</button>
                                    </div>
                                ))}
                                {props.friends.length === 0 && <p className="text-sm text-gray-500 italic w-full text-center py-2">暂无配角。添加配角让故事更精彩！</p>}
                            </div>
                        </div>
                        
                        {/* Privacy Policy Text */}
                        <p className="text-[10px] text-gray-500 leading-tight mt-1 px-1">
                            适用禁止使用政策。请勿生成侵犯他人隐私权的内容。
                        </p>
                    </div>

                    {/* Right Column: Settings */}
                    <div className="flex-1 flex flex-col gap-2">
                        <div className="font-comic text-xl text-black border-b-4 border-black mb-1">2. 故事设定</div>
                        
                        <div className="bg-yellow-50 p-3 border-4 border-black h-full flex flex-col gap-3">
                            <div>
                                <div className="flex gap-3 mb-2">
                                    <div className="flex-1">
                                        <p className="font-comic text-base mb-1 font-bold text-gray-800">漫画标题</p>
                                        <input 
                                            type="text" 
                                            value={props.comicTitle} 
                                            onChange={(e) => props.onTitleChange(e.target.value)} 
                                            className="w-full p-1 border-2 border-black font-comic text-lg uppercase bg-white shadow-[3px_3px_0px_rgba(0,0,0,0.2)] focus:outline-none focus:translate-x-[1px] focus:translate-y-[1px] focus:shadow-none transition-all"
                                            placeholder="输入标题..."
                                        />
                                    </div>
                                    <div className="w-24">
                                        <p className="font-comic text-base mb-1 font-bold text-gray-800">页数</p>
                                        <input 
                                            type="number" 
                                            min="1" 
                                            max="50" 
                                            value={props.pageCount} 
                                            onChange={(e) => props.onPageCountChange(parseInt(e.target.value) || 1)} 
                                            className="w-full p-1 border-2 border-black font-comic text-lg text-center bg-white shadow-[3px_3px_0px_rgba(0,0,0,0.2)] focus:outline-none focus:translate-x-[1px] focus:translate-y-[1px] focus:shadow-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-3 mb-2">
                                    <div className="flex-1">
                                        <p className="font-comic text-base mb-1 font-bold text-gray-800">风格</p>
                                        <select value={props.selectedGenre} onChange={(e) => props.onGenreChange(e.target.value)} className="w-full font-comic text-lg p-1 border-2 border-black uppercase bg-white text-black cursor-pointer shadow-[3px_3px_0px_rgba(0,0,0,0.2)] focus:outline-none focus:translate-x-[1px] focus:translate-y-[1px] focus:shadow-none transition-all">
                                            {GENRES.map(g => <option key={g} value={g} className="text-black">{g}</option>)}
                                        </select>
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-comic text-base mb-1 font-bold text-gray-800">语言</p>
                                        <select value={props.selectedLanguage} onChange={(e) => props.onLanguageChange(e.target.value)} className="w-full font-comic text-lg p-1 border-2 border-black uppercase bg-white text-black cursor-pointer shadow-[3px_3px_0px_rgba(0,0,0,0.2)]">
                                            {LANGUAGES.map(l => <option key={l.code} value={l.code} className="text-black">{l.name}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div className="mb-2">
                                    <p className="font-comic text-base mb-1 font-bold text-gray-800">故事前提</p>
                                    <textarea value={props.customPremise} onChange={(e) => props.onPremiseChange(e.target.value)} placeholder="输入你的故事前提..." className="w-full p-1 border-2 border-black font-comic text-lg h-16 resize-none shadow-[3px_3px_0px_rgba(0,0,0,0.2)]" />
                                </div>

                                <div className="mb-2">
                                    <p className="font-comic text-base mb-1 font-bold text-gray-800">剧情走向 (可选)</p>
                                    <textarea 
                                        value={props.plotGuidance} 
                                        onChange={(e) => props.onPlotGuidanceChange(e.target.value)} 
                                        placeholder="描述你想看到的关键事件、结局或转折点..." 
                                        className="w-full p-1 border-2 border-black font-comic text-sm h-16 resize-none shadow-[3px_3px_0px_rgba(0,0,0,0.2)]" 
                                    />
                                </div>
                            </div>
                            
                            <label className="flex items-center gap-2 font-comic text-base cursor-pointer text-black mt-1 p-1 hover:bg-yellow-100 rounded border-2 border-transparent hover:border-yellow-300 transition-colors">
                                <input type="checkbox" checked={props.richMode} onChange={(e) => props.onRichModeChange(e.target.checked)} className="w-4 h-4 accent-black" />
                                <span className="text-black">小说模式 (丰富对话)</span>
                            </label>
                        </div>
                    </div>
                </div>

                <button onClick={props.onLaunch} disabled={!props.hero || props.isTransitioning} className="comic-btn bg-red-600 text-white text-3xl px-6 py-3 w-full hover:bg-red-500 disabled:bg-gray-400 disabled:cursor-not-allowed uppercase tracking-wider">
                    {props.isTransitioning ? '正在开启...' : '开始冒险！'}
                </button>
            </div>
          </div>
        </div>

        {/* Footer is only visible when setup is active */}
        <Footer />
        </>
    );
}
