import { scaleLinear } from 'd3-scale';
import { useAtom } from 'jotai';
import { useMemo } from 'react';
import { MapTheme } from 'types';
import { colors } from './colors';
import { colorblindModeAtom } from 'utils/state/atoms';

// TODO: Convert this to a Jotai atom and consider if we want to do things differently now with new setup
export function useTheme(): MapTheme {
  const [isColorBlindModeEnabled] = useAtom(colorblindModeAtom);
  const darkThemeMediaQuery = window.matchMedia('(prefers-color-scheme: light)');
  const isBrightModeEnabled = darkThemeMediaQuery.matches;

  return useMemo(() => {
    if (isBrightModeEnabled) {
      return isColorBlindModeEnabled ? colors.colorblindBright : colors.bright;
    } else {
      return isColorBlindModeEnabled ? colors.colorblindDark : colors.dark;
    }
  }, [isBrightModeEnabled, isColorBlindModeEnabled]) as MapTheme;
}

export function useCo2ColorScale() {
  const theme = useTheme();
  return useMemo(() => getCo2ColorScale(theme), [theme]);
}

export function getCo2ColorScale(theme: MapTheme) {
  return scaleLinear<string>()
    .domain(theme.co2Scale.steps)
    .range(theme.co2Scale.colors)
    .unknown(theme.clickableFill)
    .clamp(true);
}