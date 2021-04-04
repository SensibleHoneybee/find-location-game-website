import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { Game } from '../game';
import { GameService } from '../game.service';
import { MapCalc } from '../map-calc';
import { MapCalcAfrica } from '../map-calc-africa';

const PIN_OFFSET_X = 10;
const PIN_OFFSET_Y = 34;

@Component({
  selector: 'app-game-screen',
  templateUrl: './game-screen.component.html',
  styleUrls: ['./game-screen.component.css']
})
export class GameScreenComponent implements OnInit {
  @ViewChild('theMap') theMap: ElementRef;
  @ViewChild('theMapPin') theMapPin: ElementRef;

  mapCalc: MapCalc;
  currentGame: Game;
  currentGameSubscription: Subscription;
  loading = false;
  pinLocationX = 0;
  pinLocationY = 0;
  pinPlaced = false;
  submitted = false;
  submitBtnText = 'Submit';

  constructor(
    private gameService: GameService ) { 
      this.currentGameSubscription = this.gameService.currentGame.subscribe(game => {
        this.currentGame = game;
        this.loading = false;
        this.mapCalc = new MapCalcAfrica;
      });
    }

  ngOnInit() {
    this.loading = true;
    this.gameService.loadLatestGame();
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.currentGameSubscription.unsubscribe();
  }

  onEvent(event: MouseEvent): void {
    if (this.loading || this.submitted) {
      // Do not process clicks before loaded, or after submitted
      return;
    }

    var boundingClientRect = this.theMap.nativeElement.getBoundingClientRect();
    var mouseXPos = event.clientX - boundingClientRect.left;
    var mouseYPos = event.clientY - boundingClientRect.top;

    this.pinLocationX = mouseXPos / boundingClientRect.width;
    this.pinLocationY = mouseYPos / boundingClientRect.height;

    this.theMapPin.nativeElement.style.left = (mouseXPos - PIN_OFFSET_X) + 'px';
    this.theMapPin.nativeElement.style.top = (mouseYPos - PIN_OFFSET_Y) + 'px';

    this.pinPlaced = true;
  }

  onResize(event) {
    if (!this.pinPlaced) {
      return;
    }

    var boundingClientRect = this.theMap.nativeElement.getBoundingClientRect();
    
    var newXPos = (this.pinLocationX * boundingClientRect.width);
    var newYPos = (this.pinLocationY * boundingClientRect.height);
    
    this.theMapPin.nativeElement.style.left = (newXPos - PIN_OFFSET_X) + 'px';
    this.theMapPin.nativeElement.style.top = (newYPos - PIN_OFFSET_Y) + 'px';
  }

  submit() {
    this.loading = true;
    this.gameService.submitAnswer(this.longitude, this.latitude).subscribe(result => {
      this.loading = false;
      this.submitBtnText = 'Answer submitted';
      this.submitted = true;
    });
  }

  reload() {
    window.location.reload();
  }

  get latitude(): number {
    return this.mapCalc.getLatitude(this.pinLocationY);
  }

  get longitude(): number {
    return this.mapCalc.getLongitude(this.pinLocationX);
  }

  get latitudeDisplay(): string {
    var theLatitude = this.latitude;
    if (theLatitude < 0) {
      return (Math.round(-theLatitude * 100) / 100).toFixed(2) + '°S'; // Round to 2 decimal places
    }

    return (Math.round(theLatitude * 100) / 100).toFixed(2) + '°N'; // Round to 2 decimal places
  }

  get longitudeDisplay(): string {
    var theLongitude = this.longitude;
    if (theLongitude < 0) {
      return (Math.round(-theLongitude * 100) / 100).toFixed(2) + '°W'; // Round to 2 decimal places
    }

    return (Math.round(theLongitude * 100) / 100).toFixed(2) + '°E'; // Round to 2 decimal places
  }
}
