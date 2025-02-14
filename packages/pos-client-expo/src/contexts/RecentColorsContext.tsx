import React from 'react';

export type RecentColorsType = string[];
type OrganizationContextProps = {
  setRecentColors: (colors: RecentColorsType) => void;
  recentColors: RecentColorsType;
};

/**
 * The react native color picker library im using doesnt support manually editing the color string.
 * In the meantime making recent colors global will make it easier to select the same color for
 * various selections.
 */
export const RecentColorsContext = React.createContext<OrganizationContextProps>({
  setRecentColors: () => {},
  recentColors: [],
});
