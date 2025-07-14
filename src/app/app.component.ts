import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { Title } from '@angular/platform-browser';

class Problem {
  Num1: number = 0;
  Num2: number = 0;
  operator: string = '+';
  result: number = 0;

  constructor(Num1: number, Num2: number, operator: string, result: number) {
    this.Num1 = Num1;
    this.Num2 = Num2;
    this.operator = operator;
    this.result = result;
  }

  equals(other: Problem): boolean {
    return this.Num1 === other.Num1 && this.Num2 === other.Num2 && this.operator === other.operator && this.result === other.result;
  }
}

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
  protected startOrPauseIcon: string = "play_arrow";
  private timer: any;
  private seconds = 0;
  private minutes = 0;

  protected randomProblemList: string[] = [];

  protected initialing: boolean = true;

  constructor(private titleService: Title) {
  }

  ngOnInit(): void {
    let date = new Date().toLocaleDateString('zh-CN', { weekday: 'long', month: 'long', day: 'numeric', });
    this.titleService.setTitle("听算 - 50题 - " + date);
    this.randomProblemList = this.getRandomProblemList();
  }

  ngAfterViewInit(): void {
    this.initialing = false;
  }

  protected startOrPauseTimer(): void {
    if (this.timerStatus === "stopped" || this.timerStatus === "paused") {
      this.timerStatus = "started";
      this.startOrPauseIcon = "pause";
      this.startCounting();
      return;
    }

    if (this.timerStatus === "started") {
      this.timerStatus = "paused";
      this.startOrPauseIcon = "play_arrow";
      this.stopCounting();
      return;
    }
  }

  protected stopTimer(): void {
    this.timerStatus = "stopped";
    this.startOrPauseIcon = "play_arrow";
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

  protected getRandomProblemList(): string[] {
    // 不进位加法
    var problemList1: Problem[] = [];
    for (let i = 2; i <= 5; i++) {
      for (let j = i; j <= 10 - i; j++) {
        problemList1.push(new Problem(i, j, '+', i + j));
      }
    }

    // 进位加法
    var problemList2: Problem[] = [];
    for (let i = 2; i <= 9; i++) {
      for (let j = 9; j >= 11 - i && j > i; j--) {
        problemList2.push(new Problem(i, j, '+', i + j));
      }
    }

    // 不退位减法
    var problemList3: Problem[] = [];
    for (let i = 4; i <= 10; i++) {
      for (let j = 2; j <= i - 2; j++) {
        problemList3.push(new Problem(i, j, '-', i - j));
      }
    }

    // 退位减法
    var problemList4: Problem[] = [];
    for (let i = 12; i <= 18; i++) {
      for (let j = i - 9; j <= 9; j++) {
        problemList4.push(new Problem(i, j, '-', i - j));
      }
    }

    let randomProblemList1 = this.pickRandomProblemFromList1(problemList1, 5);
    let randomProblemList2 = this.pickRandomProblemFromList2(problemList2, 20);
    let randomProblemList3 = this.pickRandomProblemFromList3(problemList3, 5);
    let randomProblemList4 = this.pickRandomProblemFromList4(problemList4, 20);
    let randomProblemList = randomProblemList1.concat(randomProblemList2).concat(randomProblemList3).concat(randomProblemList4);

    var problemList = this.pickRandomProblemFromList(randomProblemList, 52);
    return problemList;
  }

  private pickRandomProblemFromList1(problemList: Problem[], count?: number): string[] {
    let randomProblemList: string[] = [];
    if (!count || count > problemList.length) { count = problemList.length; }
    for (let i = 0; i < count; i++) {
      let randomIndex = this.getRandomInt(0, problemList.length - 1);

      let num1 = problemList[randomIndex].Num1;
      let num2 = problemList[randomIndex].Num2;

      // 随机交换加数顺序
      if (this.getRandomInt(0, 1) === 0) {
        let num = num1;
        num1 = num2;
        num2 = num;
      }

      // 随机加数+10
      switch (this.getRandomInt(0, 2)) {
        case 0: break;
        case 1:
          num1 += 10;
          break;
        case 2:
          num2 += 10;
          break;
      }

      let formattedProblem = this.formatProblem(new Problem(num1, num2, '+', num1 + num2));
      randomProblemList.push(formattedProblem);
      problemList.splice(randomIndex, 1);
    }

    return randomProblemList;
  }

  private pickRandomProblemFromList2(problemList: Problem[], count?: number): string[] {
    let randomProblemList: string[] = [];
    if (!count || count > problemList.length) { count = problemList.length; }
    for (let i = 0; i < count; i++) {
      let randomIndex = this.getRandomInt(0, problemList.length - 1);

      let num1 = problemList[randomIndex].Num1;
      let num2 = problemList[randomIndex].Num2;

      // 随机交换加数顺序
      if (this.getRandomInt(0, 1) === 0) {
        let num = num1;
        num1 = num2;
        num2 = num;
      }

      let formattedProblem = this.formatProblem(new Problem(num1, num2, '+', num1 + num2));
      randomProblemList.push(formattedProblem);
      problemList.splice(randomIndex, 1);
    }

    return randomProblemList;
  }

  private pickRandomProblemFromList3(problemList: Problem[], count?: number): string[] {
    let randomProblemList: string[] = [];
    if (!count || count > problemList.length) { count = problemList.length; }
    for (let i = 0; i < count; i++) {
      let randomIndex = this.getRandomInt(0, problemList.length - 1);

      let num1 = problemList[randomIndex].Num1;
      let num2 = problemList[randomIndex].Num2;

      // 随机被减数+10
      if (this.getRandomInt(0, 1) === 0) {
        num1 += 10;
      }

      let formattedProblem = this.formatProblem(new Problem(num1, num2, '-', num1 - num2));
      randomProblemList.push(formattedProblem);
      problemList.splice(randomIndex, 1);
    }

    return randomProblemList;
  }

  private pickRandomProblemFromList4(problemList: Problem[], count?: number): string[] {
    let randomProblemList: string[] = [];
    if (!count || count > problemList.length) { count = problemList.length; }
    for (let i = 0; i < count; i++) {
      let randomIndex = this.getRandomInt(0, problemList.length - 1);

      let num1 = problemList[randomIndex].Num1;
      let num2 = problemList[randomIndex].Num2;

      let formattedProblem = this.formatProblem(new Problem(num1, num2, '-', num1 - num2));
      randomProblemList.push(formattedProblem);
      problemList.splice(randomIndex, 1);
    }

    return randomProblemList;
  }

  private pickRandomProblemFromList(problemList: string[], count?: number) {
    let randomProblemList: string[] = [];
    if (!count || count > problemList.length) { count = problemList.length; }
    for (let i = 0; i < count; i++) {
      let randomIndex = this.getRandomInt(0, problemList.length - 1);
      let randomProblem = problemList[randomIndex];
      randomProblemList.push(randomProblem);
      problemList.splice(randomIndex, 1);
    }

    return randomProblemList;
  }

  private getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private formatProblem(problem: Problem) {
    //var random = this.getRandomInt(1, 3);
    // 降低难度
    var random = 3;
    if (random === 1) {
      return `(   ) ${problem.operator} ${problem.Num2} = ${problem.result}`;
    } else if (random === 2) {
      return `${problem.Num1} ${problem.operator} (   ) = ${problem.result}`;
    } else {
      return `${problem.Num1} ${problem.operator} ${problem.Num2} = (   )`;
    }
  }
}
