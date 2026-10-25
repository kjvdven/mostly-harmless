import { gsap } from "gsap";

export function headingFade() {
  gsap.from("h1", { opacity: 0, y: 16, duration: 0.6, ease: "power2.out" });
}
