import { useState } from 'react';
import UpdatedHome from './pages/UpdatedHome';
import PullToRefreshHome from './pages/PullToRefreshHome';
import ButtonRefreshHome from './pages/ButtonRefreshHome';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from './constants/config';

function App() {
  const [activeScreen, setActiveScreen] = useState<'button' | 'pull' | 'buttonV2'>('button');

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
        {[
          { id: 'button', label: 'v1' },
          { id: 'buttonV2', label: 'v2' },
          { id: 'pull', label: 'Pull' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveScreen(item.id as 'button' | 'pull' | 'buttonV2')}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: BORDER_RADIUS.md,
              border: 'none',
              backgroundColor: activeScreen === item.id ? COLORS.OVERLAY_PRIMARY : COLORS.OVERLAY_SECONDARY,
              color: COLORS.TEXT_PRIMARY,
              fontFamily: TYPOGRAPHY.fontFamily.mono,
              fontWeight: TYPOGRAPHY.fontWeight.medium,
              fontSize: TYPOGRAPHY.fontSize.xs,
              cursor: 'pointer',
              transition: 'background-color 0.2s ease',
              opacity: activeScreen === item.id ? 1 : 0.6,
            }}
          >
            {item.label}
          </button>
        ))}
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
      {activeScreen === 'button' && <UpdatedHome />}
      {activeScreen === 'buttonV2' && <ButtonRefreshHome />}
      {activeScreen === 'pull' && <PullToRefreshHome />}
    </div>
  );
}

export default App;
