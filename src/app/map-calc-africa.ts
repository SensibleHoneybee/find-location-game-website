import { MapCalc } from "./map-calc";

const MAP_LONGITUDE_MIN = -30;
const MAP_LONGITUDE_MAX = 60;
const MAP_LATITUDE_MIN = -45;
const MAP_LATITUDE_MAX = 45;

export class MapCalcAfrica implements MapCalc {
    getLatitude(pinLocationY: number): number {
        // Map is not linear in the Y direction, so calculate based on specifric offsets
        if (pinLocationY >= 0 && pinLocationY <= 48/270) {
          return 45 - (pinLocationY * 90);
        }
        if (pinLocationY >= 48/270 && pinLocationY <= 92/270) {
          return 30 - ((pinLocationY - (48/270)) * 90);
        }
        if (pinLocationY >= 92/270 && pinLocationY <= 135/270) {
          return 15 - ((pinLocationY - (92/270)) * 90);
        }
        if (pinLocationY >= 135/270 && pinLocationY <= 177/270) {
          return 0 - ((pinLocationY - (135/270)) * 90);
        }
        if (pinLocationY >= 177/270 && pinLocationY <= 221/270) {
          return -15 - ((pinLocationY - (177/270)) * 90);
        }
        if (pinLocationY >= 221/270 && pinLocationY <= 1) {
          return -30 - ((pinLocationY - (221/270)) * 90);
        }
    
        return 0;
      }
    
      getLongitude(pinLocationX: number): number {
        return MAP_LONGITUDE_MIN + ((MAP_LONGITUDE_MAX - MAP_LONGITUDE_MIN) * pinLocationX);
      }
}