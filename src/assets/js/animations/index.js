import { gsap } from "gsap";
import { headingFade } from "./heading-fade.js";

export function initAnimations() {
  const mm = gsap.matchMedia();

  mm.add("(prefers-reduced-motion: no-preference)", () => {
    headingFade();
  });
}
