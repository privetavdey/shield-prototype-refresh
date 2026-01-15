import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRive, useStateMachineInput, Layout, Fit, Alignment } from '@rive-app/react-webgl2';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY, OPACITY } from '../constants/config';
import { buttonStyle, activeTabStyle, inactiveTabStyle } from '../constants/styles';

// ============================================
// ANIMATION CONTROLS - Tweak these values
// ============================================
const LOADER_ANIMATION = {
  DURATION: 0.1,           // seconds - how long the fade/slide takes
  HIDE_AFTER: 4000,        // milliseconds - how long loader stays visible
  RESET_DELAY: 1,         // milliseconds - delay before replaying animation
  EASING: 'cubic-bezier(1, -0.01, 0.11, 1.04)',      // 'ease', 'ease-in', 'ease-out', 'ease-in-out', 'linear'
  SLIDE_DISTANCE: 12,      // pixels - how far it slides from top
};

// Pull to refresh settings
const PULL_TO_REFRESH = {
  THRESHOLD: 100,          // pixels - how far to pull before triggering refresh
  MAX_PULL: 200,           // pixels - maximum pull distance
  RESISTANCE: 0.5,         // 0-1 - resistance factor for overscroll
  MIN_HEIGHT: 0,           // pixels - minimum height of the stretch block
};

// Image assets
const imgImage = "/assets/avatar.png";
const imgFrame = "/assets/chevron-up.svg";
const imgVector706 = "/assets/arrow-up.svg";
const imgUnion = "/assets/dot.svg";
const imgIconPaperPlaneTopRight = "/assets/send.svg";
const imgIconShield = "/assets/shield.svg";
const imgSecondaryIconLight1 = "/assets/token.svg";
const imgVector = "/assets/chevron-down.svg";
const imgFrame626685 = "/assets/eye.svg";
const imgFrame626686 = "/assets/refresh.svg";
const imgHome = "/assets/home.svg";
const imgClock = "/assets/clock.svg";
const imgSettingsGear1 = "/assets/settings.svg";

// ============================================
// ROTATING NUMBER - Fade out/in with stagger per character
// ============================================
const ROTATE_ANIMATION = {
  CHAR_STAGGER: 0.025,     // seconds between each character
  FADE_DURATION: 0.3,      // seconds for fade animation
};

// Small value reroll (for percentage and dollar changes)
interface SmallRerollProps {
  type: 'percent' | 'dollar';
  isAnimating: boolean;
}

const SmallReroll: React.FC<SmallRerollProps> = ({ type, isAnimating }) => {
  const generateValue = () => {
    if (type === 'percent') {
      const value = (Math.random() * 15 + 0.5).toFixed(1);
      return `${value}%`;
    } else {
      const value = (Math.random() * 500 + 10).toFixed(2);
      return `$${value}`;
    }
  };
  
  const [displayValue, setDisplayValue] = useState(type === 'percent' ? '2.3%' : '$97.45');
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    if (isAnimating) {
      const animDuration = (ROTATE_ANIMATION.FADE_DURATION + displayValue.length * ROTATE_ANIMATION.CHAR_STAGGER) * 1000;
      
      setIsVisible(false);
      
      setTimeout(() => {
        setDisplayValue(generateValue());
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setIsVisible(true);
          });
        });
      }, animDuration);
    }
  }, [isAnimating]);
  
  const chars = displayValue.split('');
  
  return (
    <span style={{ display: 'inline-flex', whiteSpace: 'nowrap' }}>
      {chars.map((char, index) => {
        const delay = index * ROTATE_ANIMATION.CHAR_STAGGER;
        
        return (
          <span
            key={index}
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(-15%)',
              transition: `opacity ${ROTATE_ANIMATION.FADE_DURATION}s ease-out, transform ${ROTATE_ANIMATION.FADE_DURATION}s ease-out`,
              transitionDelay: `${delay}s`,
            }}
          >
            {char}
          </span>
        );
      })}
    </span>
  );
};

// Main balance reroll
interface NumberRerollProps {
  baseValue: string;
  isAnimating: boolean;
}

const NumberReroll: React.FC<NumberRerollProps> = ({ baseValue, isAnimating }) => {
  const [displayValue, setDisplayValue] = useState(baseValue);
  const [isVisible, setIsVisible] = useState(true);
  
  const generateRandomBalance = () => {
    const whole = Math.floor(Math.random() * 900000) + 100000;
    const decimal = Math.floor(Math.random() * 100);
    return `$${whole.toLocaleString()}.${decimal.toString().padStart(2, '0')}`;
  };
  
  useEffect(() => {
    if (isAnimating) {
      const chars = displayValue.length;
      const animDuration = (ROTATE_ANIMATION.FADE_DURATION + chars * ROTATE_ANIMATION.CHAR_STAGGER) * 1000;
      
      // Fade out
      setIsVisible(false);
      
      // After fade out, change value and fade back in
      setTimeout(() => {
        setDisplayValue(generateRandomBalance());
        // Small delay to ensure DOM updates before fading in
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setIsVisible(true);
          });
        });
      }, animDuration);
    }
  }, [isAnimating]);
  
  const chars = displayValue.split('');
  const decimalIndex = displayValue.indexOf('.');
  
  return (
    <span style={{ display: 'inline-flex', whiteSpace: 'nowrap' }}>
      {chars.map((char, index) => {
        const isDimmed = decimalIndex >= 0 && index >= decimalIndex;
        const delay = index * ROTATE_ANIMATION.CHAR_STAGGER;
        
        return (
          <span
            key={index}
            style={{
              color: isDimmed ? COLORS.TEXT_TERTIARY : 'inherit',
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(-15%)',
              transition: `opacity ${ROTATE_ANIMATION.FADE_DURATION}s ease-out, transform ${ROTATE_ANIMATION.FADE_DURATION}s ease-out`,
              transitionDelay: `${delay}s`,
            }}
          >
            {char}
          </span>
        );
      })}
    </span>
  );
};

interface TokenItemProps {
  name: string;
  amount: string;
  value: string;
  change: string;
  changePercent: string;
}

const TokenItem: React.FC<TokenItemProps> = ({ name, amount, value, change, changePercent }) => (
  <div style={{ display: 'flex', gap: SPACING.xl, alignItems: 'center', width: '100%' }}>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div
        style={{
          backgroundColor: COLORS.BACKGROUND_PRIMARY,
          border: `1px solid ${COLORS.BORDER_PRIMARY}`,
          borderRadius: BORDER_RADIUS.full,
          width: '40px',
          height: '40px',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: '32px',
            height: '32px',
          }}
        >
          <img alt="" src={imgSecondaryIconLight1} style={{ width: '100%', height: '100%' }} />
        </div>
      </div>
    </div>
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <p
          style={{
            fontFamily: TYPOGRAPHY.fontFamily.sans,
            fontWeight: TYPOGRAPHY.fontWeight.semibold,
            fontSize: TYPOGRAPHY.fontSize.md,
            lineHeight: TYPOGRAPHY.lineHeight.normal,
            color: COLORS.TEXT_PRIMARY,
            letterSpacing: TYPOGRAPHY.letterSpacing.wide,
            textTransform: 'uppercase',
            margin: 0,
          }}
        >
          {name}
        </p>
        <p
          style={{
            fontFamily: TYPOGRAPHY.fontFamily.sans,
            fontWeight: TYPOGRAPHY.fontWeight.semibold,
            fontSize: TYPOGRAPHY.fontSize.sm,
            lineHeight: TYPOGRAPHY.lineHeight.relaxed,
            color: COLORS.TEXT_SECONDARY,
            letterSpacing: TYPOGRAPHY.letterSpacing.normal,
            margin: 0,
          }}
        >
          {amount}
        </p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center' }}>
        <p
          style={{
            fontFamily: TYPOGRAPHY.fontFamily.sans,
            fontWeight: TYPOGRAPHY.fontWeight.semibold,
            fontSize: TYPOGRAPHY.fontSize.md,
            lineHeight: TYPOGRAPHY.lineHeight.normal,
            color: COLORS.TEXT_PRIMARY,
            letterSpacing: TYPOGRAPHY.letterSpacing.wide,
            textTransform: 'uppercase',
            margin: 0,
          }}
        >
          {value}
        </p>
        <div style={{ display: 'flex', gap: SPACING.sm, alignItems: 'center', justifyContent: 'center' }}>
          <p
            style={{
              fontFamily: TYPOGRAPHY.fontFamily.sans,
              fontWeight: TYPOGRAPHY.fontWeight.semibold,
              fontSize: TYPOGRAPHY.fontSize.sm,
              lineHeight: TYPOGRAPHY.lineHeight.relaxed,
              color: COLORS.TEXT_SUCCESS,
              letterSpacing: TYPOGRAPHY.letterSpacing.normal,
              textTransform: 'uppercase',
              margin: 0,
            }}
          >
            {change}
          </p>
          <div style={{ width: '4px', height: '4px', display: 'flex', flexDirection: 'column' }}>
            <img alt="" src={imgUnion} style={{ width: '100%', height: '100%' }} />
          </div>
          <p
            style={{
              fontFamily: TYPOGRAPHY.fontFamily.sans,
              fontWeight: TYPOGRAPHY.fontWeight.semibold,
              fontSize: TYPOGRAPHY.fontSize.sm,
              lineHeight: TYPOGRAPHY.lineHeight.relaxed,
              color: COLORS.TEXT_SUCCESS,
              letterSpacing: TYPOGRAPHY.letterSpacing.normal,
              textTransform: 'uppercase',
              margin: 0,
            }}
          >
            {changePercent}
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default function PullToRefreshHome() {
  const [isRiveVisible, setIsRiveVisible] = useState(false);
  const [isNumberSwapping, setIsNumberSwapping] = useState(false);
  
  // Pull to refresh state
  const [pullDistance, setPullDistance] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startY = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastRiveNumber = useRef<number>(0);

  const { RiveComponent, rive } = useRive(
    {
      src: '/mobile-loader.riv',
      artboard: 'Main',
      stateMachines: 'State Machine 1',
      autoplay: true,
      layout: new Layout({
        fit: Fit.Fill,
        alignment: Alignment.Center,
      }),
    },
    {
      shouldResizeCanvasToContainer: true,
    }
  );

  // Get the "Number 1" input from the state machine
  const numberInput = useStateMachineInput(rive, 'State Machine 1', 'Number 1');

  // Second Rive for pull indicator animation
  const { RiveComponent: PullIndicatorRive, rive: pullIndicatorRive } = useRive(
    {
      src: '/pull-indicator.riv',
      artboard: 'Artboard',
      stateMachines: 'State Machine 1',
      autoplay: true,
      layout: new Layout({
        fit: Fit.Contain,
        alignment: Alignment.Center,
      }),
    },
    {
      shouldResizeCanvasToContainer: true,
    }
  );

  // Get inputs from pull indicator state machine
  const progressInput = useStateMachineInput(pullIndicatorRive, 'State Machine 1', 'Progress');
  const startLoopTrigger = useStateMachineInput(pullIndicatorRive, 'State Machine 1', 'StartLoop');
  const endLoopTrigger = useStateMachineInput(pullIndicatorRive, 'State Machine 1', 'EndLoop');

  // Initialize pull indicator Progress to 0 when ready
  useEffect(() => {
    if (progressInput) {
      progressInput.value = 0;
    }
  }, [progressInput]);

  // Helper to generate and set random number for Rive (1-5, never same as previous)
  const setRandomRiveNumber = useCallback(() => {
    if (numberInput) {
      let randomNum: number;
      do {
        randomNum = Math.floor(Math.random() * 5) + 1;
      } while (randomNum === lastRiveNumber.current);
      
      lastRiveNumber.current = randomNum;
      numberInput.value = randomNum;
    }
  }, [numberInput]);

  // Set initial random number when Rive is ready
  useEffect(() => {
    if (numberInput) {
      setRandomRiveNumber();
    }
  }, [numberInput, setRandomRiveNumber]);

  // Height to bounce back to when refreshing
  const REFRESH_HEIGHT = 48;
  const [refreshPullHeight, setRefreshPullHeight] = useState(0);
  
  // Update pull indicator progress based on pull distance
  useEffect(() => {
    if (progressInput && isPulling) {
      // Map pullDistance to 0-100 range based on threshold
      const progress = Math.min((pullDistance / PULL_TO_REFRESH.THRESHOLD) * 100, 100);
      progressInput.value = progress;
    }
  }, [pullDistance, isPulling, progressInput]);

  const triggerRefresh = useCallback(() => {
    if (isRefreshing) return;
    
    // Fire the trigger to start the loop animation
    if (startLoopTrigger) {
      startLoopTrigger.fire();
    }
    
    // Bounce back to fixed height during refresh
    setRefreshPullHeight(REFRESH_HEIGHT);
    setIsRefreshing(true);
    setIsRiveVisible(true);
  }, [isRefreshing, startLoopTrigger]);

  useEffect(() => {
    if (isRiveVisible) {
      // Hide after configured time
      const hideTimeout = setTimeout(() => {
        setIsRiveVisible(false);
        setIsRefreshing(false);
        setRefreshPullHeight(0);
        
        // Trigger number reroll animation when loader fades
        setIsNumberSwapping(true);
        
        // Generate new random number AFTER fade-out is complete (300ms transition)
        // Also reset pull indicator to original state
        setTimeout(() => {
          setRandomRiveNumber();
          
          // Fire EndLoop trigger to reset pull indicator
          if (endLoopTrigger) {
            endLoopTrigger.fire();
          }
          if (progressInput) {
            progressInput.value = 0;
          }
        }, 300);
        
        // Reset after reroll animation completes
        setTimeout(() => {
          setIsNumberSwapping(false);
        }, (ROTATE_ANIMATION.FADE_DURATION * 2 + ROTATE_ANIMATION.CHAR_STAGGER * 15) * 1000 + 100);
      }, LOADER_ANIMATION.HIDE_AFTER);
      
      return () => clearTimeout(hideTimeout);
    }
  }, [isRiveVisible, setRandomRiveNumber, endLoopTrigger, progressInput]);

  // Touch handlers for pull to refresh
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (isRefreshing) return;
    startY.current = e.touches[0].clientY;
    setIsPulling(true);
  }, [isRefreshing]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isPulling || isRefreshing) return;
    
    const currentY = e.touches[0].clientY;
    let distance = currentY - startY.current;
    
    // Only allow pulling down
    if (distance < 0) {
      distance = 0;
    }
    
    // Apply resistance after threshold
    if (distance > PULL_TO_REFRESH.THRESHOLD) {
      const overscroll = distance - PULL_TO_REFRESH.THRESHOLD;
      distance = PULL_TO_REFRESH.THRESHOLD + (overscroll * PULL_TO_REFRESH.RESISTANCE);
    }
    
    // Cap at max pull
    distance = Math.min(distance, PULL_TO_REFRESH.MAX_PULL);
    
    setPullDistance(distance);
  }, [isPulling, isRefreshing]);

  const handleTouchEnd = useCallback(() => {
    if (!isPulling) return;
    
    setIsPulling(false);
    
    if (pullDistance >= PULL_TO_REFRESH.THRESHOLD) {
      triggerRefresh();
    }
    
    setPullDistance(0);
  }, [isPulling, pullDistance, triggerRefresh]);

  // Mouse handlers for desktop testing
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (isRefreshing) return;
    startY.current = e.clientY;
    setIsPulling(true);
  }, [isRefreshing]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isPulling || isRefreshing) return;
    
    const currentY = e.clientY;
    let distance = currentY - startY.current;
    
    if (distance < 0) {
      distance = 0;
    }
    
    if (distance > PULL_TO_REFRESH.THRESHOLD) {
      const overscroll = distance - PULL_TO_REFRESH.THRESHOLD;
      distance = PULL_TO_REFRESH.THRESHOLD + (overscroll * PULL_TO_REFRESH.RESISTANCE);
    }
    
    distance = Math.min(distance, PULL_TO_REFRESH.MAX_PULL);
    
    setPullDistance(distance);
  }, [isPulling, isRefreshing]);

  const handleMouseUp = useCallback(() => {
    if (!isPulling) return;
    
    setIsPulling(false);
    
    if (pullDistance >= PULL_TO_REFRESH.THRESHOLD) {
      triggerRefresh();
    }
    
    setPullDistance(0);
  }, [isPulling, pullDistance, triggerRefresh]);

  const handleMouseLeave = useCallback(() => {
    if (isPulling) {
      setIsPulling(false);
      setPullDistance(0);
    }
  }, [isPulling]);

  // Height of the stretched block - use refreshPullHeight when refreshing, otherwise pullDistance
  const stretchHeight = isRefreshing ? refreshPullHeight : pullDistance;

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      style={{
        backgroundColor: COLORS.BACKGROUND_PRIMARY,
        overflow: 'hidden',
        position: 'relative',
        borderRadius: BORDER_RADIUS.md,
        width: 'fit-content',
        height: '600px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        padding: SPACING['2xl'],
        cursor: isPulling ? 'grabbing' : 'grab',
        userSelect: 'none',
      }}
      data-name="Pull to Refresh home"
    >
      {/* Header - stays at top, not affected by pull */}
      <div
        style={{
          width: '320px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
          zIndex: 10,
        }}
      >
        <div
          style={{
            backgroundColor: COLORS.OVERLAY_PRIMARY,
            display: 'flex',
            gap: SPACING.sm,
            alignItems: 'center',
            height: '32px',
            paddingLeft: '2px',
            paddingRight: SPACING.lg,
            paddingTop: '2px',
            paddingBottom: '2px',
            borderRadius: BORDER_RADIUS.full,
          }}
        >
          <div
            style={{
              border: `0.5px solid ${COLORS.BORDER_PRIMARY}`,
              borderRadius: BORDER_RADIUS.full,
              width: '28px',
              height: '28px',
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                pointerEvents: 'none',
                borderRadius: BORDER_RADIUS.full,
              }}
            >
              <img
                alt=""
                src={imgImage}
                style={{
                  position: 'absolute',
                  maxWidth: 'none',
                  objectFit: 'cover',
                  objectPosition: '50% 50%',
                  borderRadius: BORDER_RADIUS.full,
                  width: '100%',
                  height: '100%',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: BORDER_RADIUS.full,
                  backgroundImage: 'linear-gradient(225deg, rgb(0, 212, 255) 0%, rgb(9, 9, 121) 100%)',
                }}
              />
            </div>
          </div>
          <p
            style={{
              fontFamily: TYPOGRAPHY.fontFamily.mono,
              fontWeight: TYPOGRAPHY.fontWeight.medium,
              fontSize: TYPOGRAPHY.fontSize.sm,
              lineHeight: TYPOGRAPHY.lineHeight.tight,
              color: COLORS.TEXT_PRIMARY,
              letterSpacing: TYPOGRAPHY.letterSpacing.wider,
              textTransform: 'uppercase',
              margin: 0,
            }}
          >
            Juno
          </p>
          <div style={{ height: '4px', width: '8px', position: 'relative' }}>
            <div
              style={{
                position: 'absolute',
                inset: '-18.75% 0',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <img alt="" src={imgVector} style={{ width: '100%', height: '100%' }} />
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: SPACING.xs, alignItems: 'center' }}>
          {/* Eye button */}
          <div
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            style={{
              backgroundColor: COLORS.OVERLAY_PRIMARY,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: SPACING.md,
              borderRadius: BORDER_RADIUS.lg,
              width: '32px',
              height: '32px',
            }}
          >
            <div style={{ width: '20px', height: '20px', pointerEvents: 'none' }}>
              <img alt="" src={imgFrame626685} style={{ width: '100%', height: '100%' }} />
            </div>
          </div>
          {/* Refresh indicator (visual only) */}
          <div
            style={{
              backgroundColor: COLORS.OVERLAY_PRIMARY,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: SPACING.md,
              borderRadius: BORDER_RADIUS.lg,
              width: '32px',
              height: '32px',
              opacity: OPACITY.HALF,
            }}
          >
            <div style={{ width: '20px', height: '20px', pointerEvents: 'none' }}>
              <img alt="" src={imgFrame626686} style={{ width: '100%', height: '100%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Content area - contains stretch block + main content */}
      <div
        style={{
          width: '320px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          marginTop: '14px',
          flex: 1,
        }}
      >
          {/* Pull to refresh stretch block - clips the Rive animation */}
          <div
            style={{
              width: `calc(100% + ${SPACING['2xl']} * 2)`,
              marginLeft: `-${SPACING['2xl']}`,
              marginRight: `-${SPACING['2xl']}`,
              height: stretchHeight > 0 ? `${stretchHeight}px` : '0px',
              minHeight: 0,
              overflow: 'hidden',
              transition: isPulling ? 'none' : 'height 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              opacity: stretchHeight > 0 ? 1 : 0,
              position: 'relative',
            }}
          >
            {/* Rive animation at fixed height - won't distort */}
            {RiveComponent && (
              <RiveComponent
                style={{
                  width: '100%',
                  height: '200px',
                  display: 'block',
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                }}
              />
            )}
            
            {/* Pull indicator Rive animation overlay - set dimensions to match your artboard */}
            {PullIndicatorRive && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  pointerEvents: 'none',
                }}
              >
                <PullIndicatorRive
                  style={{
                    width: '27px',
                    height: '16px',
                  }}
                />
              </div>
            )}
          </div>

          {/* Main Content */}
          <div
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: '26px',
              alignItems: 'flex-start',
            }}
          >
        {/* Balance Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.xs, width: '100%' }}>
          <div
            style={{
              position: 'relative',
              background: `linear-gradient(to bottom, ${COLORS.GRADIENT_START}, ${COLORS.GRADIENT_END})`,
              height: '166px',
              borderRadius: BORDER_RADIUS.lg,
              width: '100%',
            }}
          >
            <p
              style={{
                position: 'absolute',
                left: SPACING.xl,
                top: '60px',
                fontFamily: TYPOGRAPHY.fontFamily.sans,
                fontWeight: TYPOGRAPHY.fontWeight.semibold,
                fontSize: TYPOGRAPHY.fontSize.md,
                lineHeight: TYPOGRAPHY.lineHeight.normal,
                color: COLORS.TEXT_PRIMARY,
                opacity: OPACITY.HALF,
                margin: 0,
              }}
            >
              Balance
            </p>
            <div
              style={{
                position: 'absolute',
                left: SPACING.xl,
                top: '80px',
                display: 'flex',
                alignItems: 'center',
                gap: SPACING.md,
              }}
            >
              <span
                style={{
                  fontFamily: TYPOGRAPHY.fontFamily.sans,
                  fontWeight: TYPOGRAPHY.fontWeight.medium,
                  fontSize: TYPOGRAPHY.fontSize.lg,
                  lineHeight: TYPOGRAPHY.lineHeight.tight,
                  color: COLORS.TEXT_PRIMARY,
                  letterSpacing: TYPOGRAPHY.letterSpacing.tight,
                  transition: 'width 0.1s ease-out',
                }}
              >
                <NumberReroll
                  baseValue="$176,325.57"
                  isAnimating={isNumberSwapping}
                />
              </span>
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: 'scaleY(-1)',
                  flexShrink: 0,
                  transition: 'transform 0.1s ease-out',
                }}
              >
                <img alt="" src={imgFrame} style={{ width: '100%', height: '100%' }} />
              </div>
            </div>
            <div
              style={{
                position: 'absolute',
                left: SPACING.xl,
                top: '132px',
                display: 'flex',
                gap: SPACING.sm,
                alignItems: 'center',
              }}
            >
              <div style={{ display: 'flex', gap: SPACING.sm, alignItems: 'center' }}>
                <div style={{ height: '6.5px', width: '8.5px', position: 'relative' }}>
                  <div style={{ position: 'absolute', inset: '12.73% 9.96% 0 9.96%', display: 'flex', flexDirection: 'column' }}>
                    <img alt="" src={imgVector706} style={{ width: '100%', height: '100%' }} />
                  </div>
                </div>
                <p
                  style={{
                    fontFamily: TYPOGRAPHY.fontFamily.sans,
                    fontWeight: TYPOGRAPHY.fontWeight.semibold,
                    fontSize: TYPOGRAPHY.fontSize.sm,
                    lineHeight: TYPOGRAPHY.lineHeight.relaxed,
                    color: COLORS.TEXT_SUCCESS,
                    letterSpacing: TYPOGRAPHY.letterSpacing.normal,
                    margin: 0,
                  }}
                >
                  <SmallReroll type="percent" isAnimating={isNumberSwapping} />
                </p>
              </div>
          <div style={{ width: '4px', height: '4px', display: 'flex', flexDirection: 'column' }}>
                <img alt="" src={imgUnion} style={{ width: '100%', height: '100%' }} />
              </div>
              <p
                style={{
                  fontFamily: TYPOGRAPHY.fontFamily.sans,
                  fontWeight: TYPOGRAPHY.fontWeight.semibold,
                  fontSize: TYPOGRAPHY.fontSize.sm,
                  lineHeight: TYPOGRAPHY.lineHeight.relaxed,
                  color: COLORS.TEXT_SUCCESS,
                  letterSpacing: TYPOGRAPHY.letterSpacing.normal,
                  margin: 0,
                }}
              >
                <SmallReroll type="dollar" isAnimating={isNumberSwapping} />
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: SPACING.xs, alignItems: 'center', width: '100%' }}>
            {[
              { icon: imgIconPaperPlaneTopRight, label: 'Send', flipped: true },
              { icon: imgIconPaperPlaneTopRight, label: 'Receive', flipped: false },
              { icon: imgIconShield, label: 'Shield', flipped: false },
            ].map((action, index) => (
              <div
                key={index}
                style={{
                  ...buttonStyle,
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '72px',
                  padding: SPACING.lg,
                }}
              >
                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transform: action.flipped ? 'scaleY(-1)' : 'none',
                  }}
                >
                  <img alt="" src={action.icon} style={{ width: '100%', height: '100%' }} />
                </div>
                <p
                  style={{
                    fontFamily: TYPOGRAPHY.fontFamily.mono,
                    fontWeight: TYPOGRAPHY.fontWeight.bold,
                    fontSize: TYPOGRAPHY.fontSize.xs,
                    lineHeight: TYPOGRAPHY.lineHeight.tight,
                    color: COLORS.TEXT_PRIMARY,
                    letterSpacing: TYPOGRAPHY.letterSpacing.widest,
                    textTransform: 'uppercase',
                    margin: 0,
                  }}
                >
                  {action.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Token List Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING['3xl'], width: '100%' }}>
          {/* Filter Tabs */}
          <div
            style={{
              backgroundColor: COLORS.OVERLAY_SECONDARY,
              display: 'flex',
              borderRadius: BORDER_RADIUS.full,
              width: '100%',
            }}
          >
            {['All', 'Public', 'Private'].map((tab, index) => (
              <div
                key={tab}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: `${SPACING.md} ${SPACING.lg}`,
                  ...(index === 0 ? activeTabStyle : inactiveTabStyle),
                }}
              >
                <p
                  style={{
                    fontFamily: TYPOGRAPHY.fontFamily.mono,
                    fontWeight: TYPOGRAPHY.fontWeight.bold,
                    fontSize: TYPOGRAPHY.fontSize.sm,
                    lineHeight: TYPOGRAPHY.lineHeight.tight,
                    color: COLORS.TEXT_PRIMARY,
                    letterSpacing: TYPOGRAPHY.letterSpacing.wider,
                    textTransform: 'uppercase',
                    textAlign: 'center',
                    margin: 0,
                    opacity: index === 0 ? 1 : OPACITY.MEDIUM,
                  }}
                >
                  {tab}
                </p>
              </div>
            ))}
          </div>

          {/* Token Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING['3xl'] }}>
            {[
              { name: 'aleo', amount: '342.5 aleo', value: '$9,348', change: '+$327.19', changePercent: '+12.3%' },
              { name: 'aleo', amount: '342.5 aleo', value: '$9,348', change: '+$327.19', changePercent: '+12.3%' },
              { name: 'aleo', amount: '342.5 aleo', value: '$9,348', change: '+$327.19', changePercent: '+12.3%' },
            ].map((token, index) => (
              <TokenItem key={index} {...token} />
            ))}
          </div>
        </div>
        </div>
      </div>

      {/* Manage Tokens Section */}
      <div
        style={{
          position: 'absolute',
          left: '103px',
          top: '843px',
          width: '154px',
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
          alignItems: 'center',
        }}
      >
        <p
          style={{
            fontFamily: TYPOGRAPHY.fontFamily.sans,
            fontWeight: TYPOGRAPHY.fontWeight.medium,
            fontSize: TYPOGRAPHY.fontSize.md,
            lineHeight: TYPOGRAPHY.lineHeight.tight,
            color: COLORS.TEXT_PRIMARY,
            margin: 0,
            width: 'min-content',
          }}
        >
          Don't see your token?
        </p>
        <div
          style={{
            backdropFilter: 'blur(12px)',
            backgroundColor: COLORS.OVERLAY_PRIMARY,
            border: `1px solid ${COLORS.BORDER_SECONDARY}`,
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            paddingLeft: SPACING.xl,
            paddingRight: SPACING.xl,
            paddingTop: SPACING.md,
            paddingBottom: SPACING.md,
            borderRadius: BORDER_RADIUS.full,
          }}
        >
          <p
            style={{
              fontFamily: TYPOGRAPHY.fontFamily.sans,
              fontWeight: TYPOGRAPHY.fontWeight.semibold,
              fontSize: TYPOGRAPHY.fontSize.md,
              lineHeight: TYPOGRAPHY.lineHeight.tight,
              color: COLORS.TEXT_QUATERNARY,
              margin: 0,
            }}
          >
            Manage tokens
          </p>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '360px',
          backdropFilter: 'blur(8px)',
          backgroundColor: COLORS.BACKGROUND_SECONDARY,
          borderTop: `1px solid ${COLORS.BORDER_SECONDARY}`,
          paddingTop: SPACING.md,
          paddingBottom: SPACING.xl,
          boxShadow: '0px -4px 40px 0px rgba(11, 6, 5, 0.8)',
        }}
      >
        <div
          style={{
            display: 'flex',
            height: '40px',
            alignItems: 'center',
            paddingLeft: SPACING['2xl'],
            paddingRight: SPACING['2xl'],
            width: '360px',
          }}
        >
          {[
            { icon: imgHome, name: 'home' },
            { icon: imgClock, name: 'clock' },
            { icon: imgSettingsGear1, name: 'settings-gear-1' },
          ].map((navItem, index) => (
            <div
              key={index}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                padding: SPACING.md,
                borderRadius: BORDER_RADIUS.md,
              }}
            >
              <div style={{ width: '24px', height: '24px' }}>
                <img alt="" src={navItem.icon} style={{ width: '100%', height: '100%' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

