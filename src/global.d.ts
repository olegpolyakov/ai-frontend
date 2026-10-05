declare const env: {
  readonly AUTH_URL: string;
  readonly API_URL: string;
  readonly WS_URL: string;
};

declare module '*.module.scss' {
  const content: { readonly [className: string]: string };
  export default content;
}

declare module '*.scss' {
  const content: string;
  export default content;
}

declare module '*.svg' {
  import React from 'react';
  export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}