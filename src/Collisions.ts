import { BpxVector2d } from "beetpx";

export type CollisionCircle = {
  center: BpxVector2d;
  r: number;
};

export class Collisions {
  static haveCirclesCollided(
    circle1: CollisionCircle,
    circle2: CollisionCircle
  ): boolean {
    const l1Distance = circle1.center.sub(circle2.center).abs();
    const distance = l1Distance.magnitude();
    return distance < circle1.r + circle2.r;
  }
}
