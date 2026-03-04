'use client';

import { useState } from 'react';

import '@/lib/deckgl-device';
import DeckGL from '@deck.gl/react';
import Map from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

import { MAP_STYLE_DARK, MAP_STYLE_SAT } from '@/components/map/map-styles';

import MapSidebar        from '@/components/map/MapSidebar';
import MapControls       from '@/components/map/MapControls';
import MapOverlays       from '@/components/map/MapOverlays';
import MapLegend         from '@/components/map/MapLegend';
import MapFilterPanel    from '@/components/map/MapFilterPanel';
import MapTimeline       from '@/components/map/MapTimeline';
import MapVisibilityMenu from '@/components/map/MapVisibilityMenu';
import { MobileDetailPanel } from '@/components/map/mobile/MapDetailPanel';

import type { MapPageContext } from '@/components/map/use-map-page';
import type { MapViewState } from '@deck.gl/core';

type Props = {
  ctx: MapPageContext;
  embedded?: boolean;
};

export default function MobileMapLayout({ ctx, embedded = false }: Props) {
  const {
    viewState, activeStory, selectedItem, sidebarOpen, mapStyle, stories,
    overlayVisibility, toggleOverlay, f, tooltip, layers, handleMapClick, showTimeline,
    setViewState, activateStory, setActiveStory, setSelectedItem,
    toggleSidebar, setSidebarOpen, setMapStyle,
  } = ctx;

  const [sheetExpanded, setSheetExpanded] = useState(false);

  return (
    <div className="w-full h-full bg-[var(--bg-app)] overflow-hidden min-w-0">
      <div className="relative overflow-hidden w-full h-full">
        {/* Map canvas */}
        <DeckGL
          viewState={{ ...viewState }}
          onViewStateChange={({ viewState: vs }) => setViewState(vs as MapViewState)}
          controller layers={layers} getTooltip={tooltip} onClick={handleMapClick}
          style={{ width: '100%', height: '100%' }}
        >
          <Map mapStyle={mapStyle === 'dark' ? MAP_STYLE_DARK : MAP_STYLE_SAT} />
        </DeckGL>

        {/* ── Bottom sheet: detail + stories ── */}
        {(sidebarOpen || selectedItem) && (
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              height: sheetExpanded ? '100%' : '55%',
              transition: 'height 0.22s cubic-bezier(0.4,0,0.2,1)',
              zIndex: 25,
              background: 'var(--bg-app)',
              borderTop: '1px solid var(--bd)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Detail panel (inline, above stories) */}
            {selectedItem && (
              <MobileDetailPanel
                item={selectedItem}
                onClose={() => setSelectedItem(null)}
                onSelectItem={setSelectedItem}
                onActivateStory={activateStory}
              />
            )}

            {/* Stories list */}
            {sidebarOpen && (
              <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
                <MapSidebar
                  isOpen={sidebarOpen}
                  stories={stories}
                  activeStory={activeStory}
                  onToggle={() => { setSheetExpanded(false); toggleSidebar(); }}
                  onActivateStory={story => {
                    setSidebarOpen(true);
                    setSelectedItem(null);
                    activateStory(story);
                  }}
                  onClearStory={() => setActiveStory(null)}
                  expanded={sheetExpanded}
                  onToggleExpand={() => setSheetExpanded(prev => !prev)}
                />
              </div>
            )}
          </div>
        )}

        {/* ── Map overlays ── */}
        <MapOverlays
          activeStory={activeStory}
          onClearStory={() => setActiveStory(null)}
          sidebarOpen={sidebarOpen}
          onToggleSidebar={toggleSidebar}
          embedded={embedded}
          isMobile
        />

        {overlayVisibility.legend && (
          <MapLegend hasPanel={false} timelineVisible={showTimeline} />
        )}

        <MapControls
          viewState={viewState}
          mapStyle={mapStyle}
          hasPanel={false}
          timelineVisible={showTimeline}
          isMobile
          onStyleChange={setMapStyle}
        />

        {/* Visibility menu */}
        <div style={{
          position: 'absolute',
          bottom: showTimeline ? 'calc(126px + var(--safe-bottom))' : 'calc(82px + var(--safe-bottom))',
          right: 12,
          zIndex: 10,
        }}>
          <MapVisibilityMenu visibility={overlayVisibility} onToggle={toggleOverlay} />
        </div>

        {/* Filter panel */}
        {overlayVisibility.filters && (
          <div style={{ position: 'absolute', top: 56, right: 12, zIndex: 10 }}>
            <MapFilterPanel
              state={f.state}
              facets={f.facets}
              isFiltered={f.isFiltered}
              onToggleDataset={f.toggleDataset}
              onToggleType={f.toggleType}
              onToggleActor={f.toggleActor}
              onTogglePriority={f.togglePriority}
              onToggleStatus={f.toggleStatus}
              onToggleHeat={f.toggleHeat}
              onReset={f.resetFilters}
            />
          </div>
        )}

        {/* Timeline */}
        {showTimeline && (
          <MapTimeline
            rawData={f.rawData}
            dataExtent={f.dataExtent}
            viewExtent={f.viewExtent}
            onViewExtent={f.setViewExtent}
            timeRange={f.state.timeRange}
            onTimeRange={f.setTimeRange}
            isMobile
          />
        )}
      </div>
    </div>
  );
}
