/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { ComicFace, INITIAL_PAGES, GATE_PAGE } from './types';
import { LoadingFX } from './LoadingFX';

interface PanelProps {
    face?: ComicFace;
    allFaces: ComicFace[]; // Needed for cover "printing" status
    onChoice: (pageIndex: number, choice: string) => void;
    onOpenBook: () => void;
    onDownload: () => void;
    onDownloadZip: () => void;
    onRegenerate: (pageIndex: number, instruction: string) => void;
    onReset: () => void;
}

export const Panel: React.FC<PanelProps> = ({ face, allFaces, onChoice, onOpenBook, onDownload, onDownloadZip, onRegenerate, onReset }) => {
    const [isEditing, setIsEditing] = React.useState(false);
    const [editInstruction, setEditInstruction] = React.useState("");

    if (!face) return <div className="w-full h-full bg-gray-950" />;
    if (face.isLoading && !face.imageUrl) return <LoadingFX />;
    
    const isFullBleed = face.type === 'cover' || face.type === 'back_cover';

    const handleSaveImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (face?.imageUrl) {
            const link = document.createElement('a');
            link.href = face.imageUrl;
            link.download = `page-${face.pageIndex}.jpg`;
            link.click();
        }
    };

    const submitRegen = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (face.pageIndex !== undefined && editInstruction.trim()) {
            onRegenerate(face.pageIndex, editInstruction);
            setIsEditing(false);
            setEditInstruction("");
        }
    };

    return (
        <div className={`panel-container relative group ${isFullBleed ? '!p-0 !bg-[#0a0a0a]' : ''}`}>
            <div className="gloss"></div>
            {face.imageUrl && <img src={face.imageUrl} alt="Comic panel" className={`panel-image ${isFullBleed ? '!object-cover' : ''}`} />}
            
            {/* Hover Toolbar for individual pages (not cover/back) */}
            {face.type === 'story' && !face.isLoading && (
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-30">
                    <button onClick={handleSaveImage} title="Download Page" className="bg-white/90 p-2 rounded-full hover:bg-white hover:scale-110 shadow-md border border-black text-black">
                        ⬇️
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); setIsEditing(true); }} title="Fix / Edit" className="bg-white/90 p-2 rounded-full hover:bg-white hover:scale-110 shadow-md border border-black text-black">
                        ✏️
                    </button>
                </div>
            )}

            {/* Edit Modal */}
            {isEditing && (
                <div className="absolute inset-0 bg-black/80 z-40 flex flex-col items-center justify-center p-6" onClick={(e) => e.stopPropagation()}>
                    <h3 className="text-white font-bold mb-2">Edit Page {face.pageIndex}</h3>
                    <textarea 
                        value={editInstruction}
                        onChange={(e) => setEditInstruction(e.target.value)}
                        placeholder="Describe how to change this panel..."
                        className="w-full h-32 p-2 rounded mb-4 text-black font-sans"
                    />
                    <div className="flex gap-2">
                        <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500">Cancel</button>
                        <button onClick={submitRegen} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 font-bold">Regenerate</button>
                    </div>
                </div>
            )}

            {/* Decision Buttons */}
            {face.isDecisionPage && face.choices.length > 0 && (
                <div className={`absolute bottom-0 inset-x-0 p-6 pb-12 flex flex-col gap-3 items-center justify-end transition-opacity duration-500 ${face.resolvedChoice ? 'opacity-0 pointer-events-none' : 'opacity-100'} bg-gradient-to-t from-black/90 via-black/50 to-transparent z-20`}>
                    <p className="text-white font-comic text-2xl uppercase tracking-widest animate-pulse">What drives you?</p>
                    {face.choices.map((choice, i) => (
                        <button key={i} onClick={(e) => { e.stopPropagation(); if(face.pageIndex) onChoice(face.pageIndex, choice); }}
                          className={`comic-btn w-full py-3 text-xl font-bold tracking-wider ${i===0?'bg-yellow-400 hover:bg-yellow-300':'bg-blue-500 text-white hover:bg-blue-400'}`}>
                            {choice}
                        </button>
                    ))}
                </div>
            )}

            {/* Cover Action */}
            {face.type === 'cover' && (
                 <div className="absolute bottom-20 inset-x-0 flex justify-center z-20">
                     <button onClick={(e) => { e.stopPropagation(); onOpenBook(); }}
                      disabled={!allFaces.find(f => f.pageIndex === GATE_PAGE)?.imageUrl}
                      className="comic-btn bg-yellow-400 px-10 py-4 text-3xl font-bold hover:scale-105 animate-bounce disabled:animate-none disabled:bg-gray-400 disabled:cursor-wait">
                         {(!allFaces.find(f => f.pageIndex === GATE_PAGE)?.imageUrl) ? `PRINTING... ${allFaces.filter(f => f.type==='story' && f.imageUrl && (f.pageIndex||0) <= GATE_PAGE).length}/${INITIAL_PAGES}` : 'READ ISSUE #1'}
                     </button>
                 </div>
            )}

            {/* Back Cover Actions */}
            {face.type === 'back_cover' && (
                <div className="absolute bottom-24 inset-x-0 flex flex-col items-center gap-4 z-20">
                    <div className="flex gap-4">
                        <button onClick={(e) => { e.stopPropagation(); onDownload(); }} className="comic-btn bg-blue-600 text-white px-6 py-3 text-lg font-bold hover:scale-105 border-2 border-white shadow-lg">DOWNLOAD PDF</button>
                        <button onClick={(e) => { e.stopPropagation(); onDownloadZip(); }} className="comic-btn bg-purple-600 text-white px-6 py-3 text-lg font-bold hover:scale-105 border-2 border-white shadow-lg">DOWNLOAD IMAGES (ZIP)</button>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); onReset(); }} className="comic-btn bg-green-500 text-white px-8 py-4 text-2xl font-bold hover:scale-105 mt-4">CREATE NEW ISSUE</button>
                </div>
            )}
        </div>
    );
}
