import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from "rxjs";
import { debounceTime, distinctUntilChanged, switchMap } from "rxjs/operators";
import { Hero } from "../hero";
import { HeroService } from "../hero.service";
@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.scss']
})
export class HeroSearchComponent implements OnInit {
  heroes$: Observable<Hero[]>;
  private searchTerms = new Subject<string>();
  // Subject既可以是可观察的对象的数据源，本身也是Observable。你可以像订阅任何Observable一样订阅Subject。通过调用next(value)方法往Observable中推送一些值，就像search()方法中一样。
  // search()是通过对文本框的keystroke事件的事件绑定来调用的。
  constructor(
    private heroService: HeroService
  ) { }


  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.heroes$ = this.searchTerms.pipe(
      debounceTime(300), // 300ms的延迟进行节流
      distinctUntilChanged(), // 忽略相同的变量
      switchMap((term: string) => this.heroService.searchHeroes(term)) // 转换新的搜索如果变量发生变化
    )
  }

}
