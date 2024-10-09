export type ExperimentalFeatures = {
  // TO BE Defined
};

export interface ConfigProviderPropsType {
  /**
   * @description Controlling if the users want a11y features
   */
  a11y?: boolean;
  namespace?: string;
}

export const configProviderDefault = {
  a11y: true,
  namespace: 'sy',
};
