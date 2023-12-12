import {Vector3, Group } from 'three';
import Balloon from '../objects/Balloon/Balloon';
import Island from '../objects/Floating Island/Island';

class Obstacles {
    balloons: Balloon[] = [];
    islands: Island[] = [];
  
    constructor(timeStamp: number) {
      // Generate one balloon
      const balloon = new Balloon(timeStamp);
      const balloonScale = 0.0006;
      balloon.scale.copy(
          new Vector3(balloonScale, balloonScale, balloonScale)
      );
      this.balloons.push(balloon);
  
      // Generate one island
      const island = new Island(timeStamp);
      // Set position or any other configurations
      this.islands.push(island);
    }
  
    getRandomObstacle(timeStamp: number): Group {
      const randomIndex = Math.floor(Math.random() * (this.balloons.length + this.islands.length));
      if (randomIndex < this.balloons.length) {
        return this.balloons[randomIndex];
      } else {
        return this.islands[randomIndex - this.balloons.length];
      }
    }
  }
  

export default Obstacles;
