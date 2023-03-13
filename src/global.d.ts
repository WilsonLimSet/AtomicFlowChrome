declare module '*.svg' {
  import React = require('react');
  export const ReactComponent: React.SFC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.json' {
  const content: string;
  export default content;
}
declare namespace chrome.runtime {
  interface MessageSender {
    id: string;
    url?: string;
    tab?: chrome.tabs.Tab;
    frameId?: number;
  }
}
declare const chrome: any;


