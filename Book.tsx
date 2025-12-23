/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { ComicFace, TOTAL_PAGES } from './types';
import { Panel } from './Panel';

interface BookProps {
    comicFaces: ComicFace[];
    currentSheetIndex: number;
    isStarted: boolean;
    isSetupVisible: boolean;
    onSheetClick: (index: number) => void;
    onChoice: (pageIndex: number, choice: string) => void;
    onOpenBook: () => void;
    onDownload: () => void;
    onDownloadZip: () => void;
    onRegenerate: (pageIndex: number, instruction: string) => void;
    onReset: () => void;
}

export const Book: React.FC<BookProps> = (props) => {
    const sheetsToRender = [];
    if (props.comicFaces.length > 0) {
        sheetsToRender.push({ front: props.comicFaces[0], back: props.comicFaces.find(f => f.pageIndex === 1) });
        
        const maxPage = Math.max(...props.comicFaces.map(f => f.pageIndex || 0), 0);
        const loopLimit = Math.max(maxPage, 2); // At least cover+page1 (0,1) handled above. Next is 2,3.

        for (let i = 2; i <= loopLimit + 1; i += 2) {
            sheetsToRender.push({ front: props.comicFaces.find(f => f.pageIndex === i), back: props.comicFaces.find(f => f.pageIndex === i + 1) });
        }
    } else if (props.isSetupVisible) {
        // Placeholder sheet for initial render behind setup
        sheetsToRender.push({ front: undefined, back: undefined });
    }

    return (
        <div className={`book ${props.currentSheetIndex > 0 ? 'opened' : ''} transition-all duration-1000 ease-in-out`}
           style={ (props.isSetupVisible) ? { transform: 'translateZ(-600px) translateY(-100px) rotateX(20deg) scale(0.9)', filter: 'blur(6px) brightness(0.7)', pointerEvents: 'none' } : {}}>
          {sheetsToRender.map((sheet, i) => (
              <div key={i} className={`paper ${i < props.currentSheetIndex ? 'flipped' : ''}`} style={{ zIndex: i < props.currentSheetIndex ? i : sheetsToRender.length - i }}
                   onClick={() => props.onSheetClick(i)}>
                  <div className="front">
                      <Panel face={sheet.front} allFaces={props.comicFaces} onChoice={props.onChoice} onOpenBook={props.onOpenBook} onDownload={props.onDownload} onDownloadZip={props.onDownloadZip} onRegenerate={props.onRegenerate} onReset={props.onReset} />
                  </div>
                  <div className="back">
                      <Panel face={sheet.back} allFaces={props.comicFaces} onChoice={props.onChoice} onOpenBook={props.onOpenBook} onDownload={props.onDownload} onDownloadZip={props.onDownloadZip} onRegenerate={props.onRegenerate} onReset={props.onReset} />
                  </div>
              </div>
          ))}
      </div>
    );
}
