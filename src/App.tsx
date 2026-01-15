import { useState } from 'react';
import UpdatedHome from './pages/UpdatedHome';
import PullToRefreshHome from './pages/PullToRefreshHome';
import ButtonRefreshHome from './pages/ButtonRefreshHome';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from './constants/config';

function App() {
  const [activeScreen, setActiveScreen] = useState<'button' | 'buttonV2' | 'pull'>('buttonV2');

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        backgroundColor: COLORS.BACKGROUND_APP,
        position: 'static',
        paddingTop: SPACING.md,
        paddingLeft: SPACING.md,
        color: 'rgba(222, 222, 222, 1)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: SPACING.xl,
      }}
    >
      {/* Screen Switcher */}
      <div
        style={{
          display: 'flex',
          gap: SPACING.sm,
          backgroundColor: COLORS.OVERLAY_SECONDARY,
          padding: SPACING.xs,
          borderRadius: BORDER_RADIUS.full,
        }}
      >
        <button
          onClick={() => setActiveScreen('button')}
          style={{
            padding: `${SPACING.sm} ${SPACING.xl}`,
            borderRadius: BORDER_RADIUS.full,
            border: 'none',
            backgroundColor: activeScreen === 'button' ? COLORS.OVERLAY_PRIMARY : 'transparent',
            color: COLORS.TEXT_PRIMARY,
            fontFamily: TYPOGRAPHY.fontFamily.mono,
            fontWeight: TYPOGRAPHY.fontWeight.medium,
            fontSize: TYPOGRAPHY.fontSize.sm,
            cursor: 'pointer',
            transition: 'background-color 0.2s ease',
          }}
        >
          Button (v1)
        </button>
        <button
          onClick={() => setActiveScreen('buttonV2')}
          style={{
            padding: `${SPACING.sm} ${SPACING.xl}`,
            borderRadius: BORDER_RADIUS.full,
            border: 'none',
            backgroundColor: activeScreen === 'buttonV2' ? COLORS.OVERLAY_PRIMARY : 'transparent',
            color: COLORS.TEXT_PRIMARY,
            fontFamily: TYPOGRAPHY.fontFamily.mono,
            fontWeight: TYPOGRAPHY.fontWeight.medium,
            fontSize: TYPOGRAPHY.fontSize.sm,
            cursor: 'pointer',
            transition: 'background-color 0.2s ease',
          }}
        >
          Button (v2)
        </button>
        <button
          onClick={() => setActiveScreen('pull')}
          style={{
            padding: `${SPACING.sm} ${SPACING.xl}`,
            borderRadius: BORDER_RADIUS.full,
            border: 'none',
            backgroundColor: activeScreen === 'pull' ? COLORS.OVERLAY_PRIMARY : 'transparent',
            color: COLORS.TEXT_PRIMARY,
            fontFamily: TYPOGRAPHY.fontFamily.mono,
            fontWeight: TYPOGRAPHY.fontWeight.medium,
            fontSize: TYPOGRAPHY.fontSize.sm,
            cursor: 'pointer',
            transition: 'background-color 0.2s ease',
          }}
        >
          Pull to Refresh
        </button>
      </div>

      {/* Active Screen */}
      {activeScreen === 'button' && <UpdatedHome />}
      {activeScreen === 'buttonV2' && <ButtonRefreshHome />}
      {activeScreen === 'pull' && <PullToRefreshHome />}
    </div>
  );
}

export default App;
