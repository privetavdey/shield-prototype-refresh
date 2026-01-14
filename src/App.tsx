import { useState } from 'react';
import UpdatedHome from './pages/UpdatedHome';
import PullToRefreshHome from './pages/PullToRefreshHome';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from './constants/config';

function App() {
  const [activeScreen, setActiveScreen] = useState<'button' | 'pull'>('button');

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
          Button Refresh
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
      {activeScreen === 'button' ? <UpdatedHome /> : <PullToRefreshHome />}
    </div>
  );
}

export default App;
