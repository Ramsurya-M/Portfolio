import { BlurFade } from "@/components/magicui/blur-fade";

export function BlurFadeTextDemo() {
  return (
    <section id="header">
      <BlurFade delay={0.25} inView>
        <h1>Welcome to my</h1>
        <h1>Portfolio</h1>
      </BlurFade>
    </section>
  );
}
