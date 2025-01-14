import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { Title } from '@angular/platform-browser';


@Component({
  selector: 'app-root',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    ScrollingModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, AfterViewInit {
  protected time: string = "00:00";
  protected timerStatus: string = "stopped";
  protected startOrPauseIcon: string = "开始计时";
  private timer: any;
  private seconds = 0;
  private minutes = 0;

  protected randomProblemList: string[] = [];
  private allProblemList: string[] = [];

  protected initialing: boolean = true;

  constructor(private titleService: Title) {
  }

  ngOnInit(): void {
    this.titleService.setTitle("听算 - 50题 - " + new Date().toDateString());
    this.generateAllProblems();
    this.pickRandomProblems();
  }

  ngAfterViewInit(): void {
    this.initialing = false;
  }

  protected pickRandomProblems(): void {
    for (let i = 0; i < 50; i++) {
      let randomIndex = this.getRandomInt(0, this.allProblemList.length - 1);
      this.randomProblemList.push(this.allProblemList[randomIndex]);
      this.allProblemList.splice(randomIndex, 1);
    }
  }

  protected startOrPauseTimer(): void {
    if (this.timerStatus === "stopped" || this.timerStatus === "paused") {
      this.timerStatus = "started";
      this.startOrPauseIcon = "暂停计时";
      this.startCounting();
      return;
    }

    if (this.timerStatus === "started") {
      this.timerStatus = "paused";
      this.startOrPauseIcon = "开始计时";
      this.stopCounting();
      return;
    }
  }

  protected stopTimer(): void {
    this.timerStatus = "stopped";
    this.startOrPauseIcon = "开始计时";
    this.minutes = 0;
    this.seconds = 0;
    this.time = this.formatTime(this.minutes) + ":" + this.formatTime(this.seconds);
  }

  private startCounting(): void {
    this.timer = setInterval(() => {
      if (this.timerStatus === "started") {
        this.seconds++;
        if (this.seconds === 60) {
          this.seconds = 0;
          this.minutes++;
        }
        this.time = this.formatTime(this.minutes) + ":" + this.formatTime(this.seconds);
      }
    }, 1000);
  }

  private stopCounting(): void {
    clearInterval(this.timer);
  }

  private formatTime(time: number): string {
    return time < 10 ? "0" + time : time.toString();
  }

  private formatNumber(num: number): string {
    return num < 10 ? "" + num : num.toString();
  }

  private generateAllProblems() {
    for (let i = 1; i <= 19; i++) {
      for (let j = 1; j <= 20 - i; j++) {
        this.allProblemList.push(this.getAdditionProblem(i, j));
      }
    }

    for (let i = 2; i <= 10; i++) {
      for (let j = 1; j <= i - 1; j++) {
        this.allProblemList.push(this.getSubstractionProblem(i, j));
        this.allProblemList.push(this.getSubstractionProblem(i + 10, j));
      }
    }
  }

  private getAdditionProblem(num1: number, num2: number): string {
    return this.formatNumber(num1) + " + " + this.formatNumber(num2) + " = " + (num1 + num2);
  }

  private getSubstractionProblem(num1: number, num2: number): string {
    return this.formatNumber(num1) + " - " + this.formatNumber(num2) + " = " + (num1 - num2);
  }

  private getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
