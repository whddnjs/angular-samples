import { NgClass } from '@angular/common';
import { Component, InputSignal, Signal, WritableSignal, computed, input, signal, } from '@angular/core';
import { DateTime, Info, Interval } from 'luxon';
import { Meetings } from './meetings.interface';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  imports: [
    NgClass
  ],
  standalone: true,
})
export class CalendarComponent {

  // 부모 컴포넌트(혹은 다른 곳)에서 전달되는 Meetings 데이터를 입력값으로 받기 위한 Signal
  meetings: InputSignal<Meetings> = input.required();

  // 오늘 날짜를 담고 있는 Signal
  today: Signal<DateTime> = signal(DateTime.local());

  // 현재 활성화된 달(월)의 첫째 날을 담고 있는 WritableSignal
  // 기본값으로는 오늘 날짜의 달의 시작일
  firstDayOfActiveMonth: WritableSignal<DateTime> = signal(this.today().startOf('month'));

  // 현재 클릭되거나 활성화된 날짜(일 단위)를 담고 있는 WritableSignal
  // 없을 수도 있으니까 null 허용
  activeDay: WritableSignal<DateTime | null> = signal(null);

  // 요일(월,화,수,목,금,토,일) 정보를 담은 Signal
  // luxon의 Info.weekdays를 사용해서 요일 이름을 받아옴
  weekDays: Signal<string[]> = signal(Info.weekdays('short'));

  // 현재 화면에 렌더링해야 할 달력상의 날짜들을 담은 Signal
  // firstDayOfActiveMonth 기준으로 달력을 구성할 범위를 Interval로 생성하고,
  // day: 1씩 splitBy 해서 날짜 배열을 만듦
  daysOfMonth: Signal<DateTime[]> = computed(() => {
    return Interval.fromDateTimes(
      this.firstDayOfActiveMonth().startOf('week'),
      this.firstDayOfActiveMonth().endOf('month').endOf('week')
    )
      .splitBy({ day: 1 })
      .map((d) => {
        if (d.start === null) {
          throw new Error('Wrong dates');
        }
        return d.start;
      });
  });

  // luxon의 DateTime 포맷 중 하나를 그냥 상수처럼 사용할 것 같음
  readonly DATE_MED = DateTime.DATE_MED;

  // activeDay가 선택되어 있다면 해당 날짜의 미팅(문자열 배열)을 가져오는 Signal
  activeDayMeetings: Signal<string[]> = computed(() => {
    const activeDay = this.activeDay();
    if (activeDay === null) {
      // 날짜가 선택되지 않았으면 미팅은 없음
      return [];
    }
    const activeDayISO = activeDay.toISODate();

    if (!activeDayISO) {
      // ISO 포맷이 없으면 미팅은 없음
      return [];
    }

    // meetings()로부터 activeDayISO 키에 해당하는 배열을 가져옴
    // 없으면 빈 배열
    return this.meetings()[activeDayISO] ?? [];
  });

  onSelectDay(day: DateTime) {
    console.log(day.toISODate());

    if (this.activeDay() === day) {
      this.activeDay.set(null);
    } else {
      this.activeDay.set(day);
    }
  }

  // 이전 달로 이동
  goToPreviousMonth(): void {
    this.firstDayOfActiveMonth.set(
      this.firstDayOfActiveMonth().minus({ month: 1 })
    );
  }

  // 다음 달로 이동
  goToNextMonth(): void {
    this.firstDayOfActiveMonth.set(
      this.firstDayOfActiveMonth().plus({ month: 1 })
    );
  }

  // 오늘 날짜가 속한 달로 이동
  goToToday(): void {
    this.firstDayOfActiveMonth.set(this.today().startOf('month'));
  }
}