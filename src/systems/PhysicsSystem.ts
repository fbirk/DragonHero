import { Dragon } from '../entities/Dragon';

export class PhysicsSystem {
  applyFlap(dragon: Dragon): void {
    dragon.flap();
  }

  releaseFlap(dragon: Dragon): void {
    dragon.stopFlap();
  }

  update(dragon: Dragon, delta: number): void {
    dragon.update(delta);
  }
}
