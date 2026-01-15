import { useState } from 'react';
import UpdatedHome from './pages/UpdatedHome';
import PullToRefreshHome from './pages/PullToRefreshHome';
import ButtonRefreshHome from './pages/ButtonRefreshHome';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from './constants/config';

function App() {
  // Check if we're on the standalone v2 page
  const isStandalonePage = window.location.hash === '#/v2';
  
  const [activeScreen, setActiveScreen] = useState<'button' | 'pull'>('button');
  
  // If on standalone page, just render ButtonRefreshHome
  if (isStandalonePage) {
    return (
      <div
        style={{
          width: '100vw',
          height: '100vh',
          backgroundColor: COLORS.BACKGROUND_APP,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <a
          href="#/"
          style={{
            position: 'fixed',
            top: SPACING.md,
            left: SPACING.md,
            color: COLORS.TEXT_PRIMARY,
            fontFamily: TYPOGRAPHY.fontFamily.mono,
            fontSize: TYPOGRAPHY.fontSize.sm,
            opacity: 0.6,
            textDecoration: 'none',
          }}
        >
          ← Back
        </a>
        <ButtonRefreshHome />
      </div>
    );
  }

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        backgroundColor: COLORS.BACKGROUND_APP,
        position: 'relative',
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
      {/* Side Navigation */}
      <div
        style={{
          position: 'fixed',
          left: SPACING.md,
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          flexDirection: 'column',
          gap: SPACING.sm,
          zIndex: 100,
        }}
      >
        <a
          href="#/v2"
          style={{
            width: '40px',
            height: '40px',
            borderRadius: BORDER_RADIUS.md,
            backgroundColor: COLORS.OVERLAY_SECONDARY,
            color: COLORS.TEXT_PRIMARY,
            fontFamily: TYPOGRAPHY.fontFamily.mono,
            fontWeight: TYPOGRAPHY.fontWeight.medium,
            fontSize: TYPOGRAPHY.fontSize.xs,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textDecoration: 'none',
            opacity: 0.6,
            transition: 'opacity 0.2s ease',
          }}
        >
          v2
        </a>
      </div>

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
