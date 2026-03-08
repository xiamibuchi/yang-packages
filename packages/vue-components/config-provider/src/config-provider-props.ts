export interface ExperimentalFeatures {
  // TO BE Defined
}

export interface ConfigProviderProps {
  /**
   * @description Controlling if the users want a11y features
   */
  a11y?: boolean;
  namespace?: string;
}

export const configProviderDefaults: ConfigProviderProps = {
  a11y: true,
  namespace: 'sy',
};
