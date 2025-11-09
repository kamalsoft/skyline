// src/utils/moonUtils.js
import {
  WiMoonAltNew,
  WiMoonAltWaxingCrescent3,
  WiMoonAltFirstQuarter,
  WiMoonAltWaxingGibbous3,
  WiMoonAltFull,
  WiMoonAltWaningGibbous3,
  WiMoonAltThirdQuarter,
  WiMoonAltWaningCrescent3,
} from 'react-icons/wi';

/**
 * Calculates the current phase of the moon.
 * This is a simplified calculation and provides a good approximation.
 * @returns {number} A value between 0 (New Moon) and 1.
 */
function getMoonPhase() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();

  // A simple algorithm to approximate moon phase (by John Conway)
  let r = year % 100;
  r %= 19;
  if (r > 9) {
    r -= 19;
  }
  r = ((r * 11) % 30) + month + day;
  if (month < 3) {
    r += 2;
  }
  r -= year < 2000 ? 4 : 8.3;
  r = Math.floor(r + 0.5) % 30;

  return (r < 0 ? r + 30 : r) / 29.53;
}

/**
 * Returns the corresponding React Icon component and name for the current moon phase.
 * @returns {{icon: React.Component, name: string}} An object with the icon and name.
 */
export function getMoonPhaseInfo() {
  const phase = getMoonPhase();

  if (phase <= 0.06 || phase > 0.94) {
    return { icon: WiMoonAltNew, name: 'New Moon' };
  } else if (phase <= 0.18) {
    return { icon: WiMoonAltWaxingCrescent3, name: 'Waxing Crescent' };
  } else if (phase <= 0.31) {
    return { icon: WiMoonAltFirstQuarter, name: 'First Quarter' };
  } else if (phase <= 0.44) {
    return { icon: WiMoonAltWaxingGibbous3, name: 'Waxing Gibbous' };
  } else if (phase <= 0.56) {
    return { icon: WiMoonAltFull, name: 'Full Moon' };
  } else if (phase <= 0.69) {
    return { icon: WiMoonAltWaningGibbous3, name: 'Waning Gibbous' };
  } else if (phase <= 0.82) {
    return { icon: WiMoonAltThirdQuarter, name: 'Third Quarter' };
  } else {
    // phase <= 0.94
    return { icon: WiMoonAltWaningCrescent3, name: 'Waning Crescent' };
  }
}
