/// <reference types="vite/client" />
import type { ThreeElements } from "@react-three/fiber";

declare global {
  namespace React {
    namespace JSX {
      interface IntrinsicElements extends ThreeElements {}
    }
  }
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {}
  }
}

declare module "*.css" {
  const content: { [className: string]: string };
  export default content;
}
