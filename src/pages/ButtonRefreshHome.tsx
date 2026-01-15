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
  EASING: 'cubic-bezier(1, -0.01, 0.11, 1.04)',
  SLIDE_DISTANCE: 12,      // pixels - how far it slides from top
};

// Image assets from Figma
const imgImage = "http://localhost:3845/assets/0fa03f08ebbb19ecccc8ae0dcb2e87a88e4576c2.png";
const imgFrame = "http://localhost:3845/assets/6200bbd45c661c2943f3351fced3e39814eca57c.svg";
const imgVector706 = "http://localhost:3845/assets/ca70de762540ea8de8a7a532635c64520f050a1f.svg";
const imgUnion = "http://localhost:3845/assets/5bd763ffeddd93b14afcbc2bc8a7c00356cecc59.svg";
const imgIconPaperPlaneTopRight = "http://localhost:3845/assets/b31de77934e57aaebf29c9a0c2088c6cbc1f611b.svg";
const imgIconShield = "http://localhost:3845/assets/caed0e77bd2a2a0335e85f02ac1531cdfaab1213.svg";
const imgSecondaryIconLight1 = "http://localhost:3845/assets/be4c176d268a73cd779effc0808340c0f4ce2d71.svg";
const imgVector = "http://localhost:3845/assets/b24b30c439916bf8a0ad33590bab631228f3c1dc.svg";
const imgFrame626685 = "http://localhost:3845/assets/200a28103d137b4e76f32c7d2bfb1c891224ea63.svg";
const imgFrame626686 = "http://localhost:3845/assets/444ac1289f9ff817e3b2542551521957e0bd4921.svg";
const imgHome = "http://localhost:3845/assets/22a5bffb99c33829a7afd81a44fe611d313d2f68.svg";
const imgClock = "http://localhost:3845/assets/4b2063ce35aafe63840eb21aea1ad9ed0d37ddb2.svg";
const imgSettingsGear1 = "http://localhost:3845/assets/e34fa51987d860839a07e29b0d8df9f4c000c311.svg";

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

// Number reroll component with rotating/fade effect
interface NumberRerollProps {
  baseValue: string;
  isAnimating: boolean;
}

const NumberReroll: React.FC<NumberRerollProps> = ({ baseValue, isAnimating }) => {
  const generateNewValue = () => {
    const min = 100000;
    const max = 999999;
    const dollars = Math.floor(Math.random() * (max - min) + min);
    const cents = Math.floor(Math.random() * 100);
    return `$${dollars.toLocaleString()}.${cents.toString().padStart(2, '0')}`;
  };

  const [displayValue, setDisplayValue] = useState(baseValue);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (isAnimating) {
      const animDuration = (ROTATE_ANIMATION.FADE_DURATION + displayValue.length * ROTATE_ANIMATION.CHAR_STAGGER) * 1000;
      
      setIsVisible(false);
      
      setTimeout(() => {
        setDisplayValue(generateNewValue());
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
              display: 'inline-block',
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0) rotateX(0deg)' : 'translateY(-15%) rotateX(-90deg)',
              transition: `opacity ${ROTATE_ANIMATION.FADE_DURATION}s ease-out, transform ${ROTATE_ANIMATION.FADE_DURATION}s ease-out`,
              transitionDelay: `${delay}s`,
              transformOrigin: 'center bottom',
            }}
          >
            {char}
          </span>
        );
      })}
    </span>
  );
};

// Token item component
interface TokenItemProps {
  name: string;
  amount: string;
  value: string;
  change: string;
  changePercent: string;
}

const TokenItem: React.FC<TokenItemProps> = ({ name, amount, value, change, changePercent }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
    <div style={{ display: 'flex', gap: SPACING.lg, alignItems: 'center' }}>
      <div
        style={{
          width: '44px',
          height: '44px',
          borderRadius: BORDER_RADIUS.full,
          position: 'relative',
        }}
      >
        <img
          alt=""
          src={imgSecondaryIconLight1}
          style={{ width: '44px', height: '44px' }}
        />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
        <p
          style={{
            fontFamily: TYPOGRAPHY.fontFamily.mono,
            fontWeight: TYPOGRAPHY.fontWeight.bold,
            fontSize: TYPOGRAPHY.fontSize.md,
            lineHeight: TYPOGRAPHY.lineHeight.tight,
            color: COLORS.TEXT_PRIMARY,
            letterSpacing: TYPOGRAPHY.letterSpacing.widest,
            textTransform: 'uppercase',
            margin: 0,
          }}
        >
          {name}
        </p>
        <p
          style={{
            fontFamily: TYPOGRAPHY.fontFamily.sans,
            fontWeight: TYPOGRAPHY.fontWeight.medium,
            fontSize: TYPOGRAPHY.fontSize.sm,
            lineHeight: TYPOGRAPHY.lineHeight.tight,
            color: COLORS.TEXT_SECONDARY,
            margin: 0,
          }}
        >
          {amount}
        </p>
      </div>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
      <p
        style={{
          fontFamily: TYPOGRAPHY.fontFamily.sans,
          fontWeight: TYPOGRAPHY.fontWeight.medium,
          fontSize: TYPOGRAPHY.fontSize.md,
          lineHeight: TYPOGRAPHY.lineHeight.tight,
          color: COLORS.TEXT_PRIMARY,
          margin: 0,
        }}
      >
        {value}
      </p>
      <div style={{ display: 'flex', gap: SPACING.xs, alignItems: 'center' }}>
        <p
          style={{
            fontFamily: TYPOGRAPHY.fontFamily.mono,
            fontWeight: TYPOGRAPHY.fontWeight.medium,
            fontSize: TYPOGRAPHY.fontSize.xs,
            lineHeight: TYPOGRAPHY.lineHeight.tight,
            color: COLORS.TEXT_SUCCESS,
            letterSpacing: TYPOGRAPHY.letterSpacing.normal,
            margin: 0,
          }}
        >
          {change}
        </p>
        <p
          style={{
            fontFamily: TYPOGRAPHY.fontFamily.mono,
            fontWeight: TYPOGRAPHY.fontWeight.medium,
            fontSize: TYPOGRAPHY.fontSize.xs,
            lineHeight: TYPOGRAPHY.lineHeight.tight,
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
);

export default function ButtonRefreshHome() {
  const [isRiveVisible, setIsRiveVisible] = useState(false);
  const [isNumberSwapping, setIsNumberSwapping] = useState(false);
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

  const handleRefreshClick = useCallback(() => {
    if (isRiveVisible) return;
    setIsRiveVisible(true);
  }, [isRiveVisible]);

  useEffect(() => {
    if (isRiveVisible) {
      // Hide after configured time
      const hideTimeout = setTimeout(() => {
        setIsRiveVisible(false);
        
        // Trigger number reroll animation when loader fades
        setIsNumberSwapping(true);
        
        // Generate new random number AFTER fade-out is complete (300ms transition)
        setTimeout(() => {
          setRandomRiveNumber();
        }, 300);
        
        // Reset after reroll animation completes
        setTimeout(() => {
          setIsNumberSwapping(false);
        }, (ROTATE_ANIMATION.FADE_DURATION * 2 + ROTATE_ANIMATION.CHAR_STAGGER * 15) * 1000 + 100);
      }, LOADER_ANIMATION.HIDE_AFTER);
      
      return () => clearTimeout(hideTimeout);
    }
  }, [isRiveVisible, setRandomRiveNumber]);

  return (
    <div
      style={{
        position: 'relative',
        width: '360px',
        height: '800px',
        backgroundColor: COLORS.BACKGROUND_PRIMARY,
        overflow: 'hidden',
        borderRadius: '40px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        padding: SPACING['2xl'],
      }}
      data-name="Button Refresh home"
    >
      {/* Header with JUNO dropdown and action buttons */}
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
        <div style={{ display: 'flex', gap: SPACING.sm, alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ width: '20px', height: '20px', position: 'relative' }}>
              <img
                alt=""
                src={imgImage}
                style={{
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
          {/* Refresh button */}
          <div
            onClick={handleRefreshClick}
            style={{
              backgroundColor: COLORS.OVERLAY_PRIMARY,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: SPACING.md,
              borderRadius: BORDER_RADIUS.lg,
              width: '32px',
              height: '32px',
              cursor: 'pointer',
            }}
          >
            <div style={{ width: '20px', height: '20px', pointerEvents: 'none' }}>
              <img alt="" src={imgFrame626686} style={{ width: '100%', height: '100%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Loader */}
      <div
        style={{
          height: '48px',
          width: `calc(100% + ${SPACING['2xl']} * 2)`,
          marginLeft: `-${SPACING['2xl']}`,
          marginRight: `-${SPACING['2xl']}`,
          marginTop: '14px',
          overflow: 'hidden',
          opacity: isRiveVisible ? 1 : 0,
          transform: isRiveVisible ? 'translateY(0)' : `translateY(-${LOADER_ANIMATION.SLIDE_DISTANCE}px)`,
          transition: `opacity ${LOADER_ANIMATION.DURATION}s ${LOADER_ANIMATION.EASING}, transform ${LOADER_ANIMATION.DURATION}s ${LOADER_ANIMATION.EASING}`,
          pointerEvents: isRiveVisible ? 'auto' : 'none',
          position: 'relative',
        }}
        data-name="loader"
      >
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
      </div>

      {/* Main Content */}
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '26px',
          alignItems: 'flex-start',
          marginTop: isRiveVisible ? '0' : '14px',
          transition: 'margin-top 0.3s ease-out',
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

