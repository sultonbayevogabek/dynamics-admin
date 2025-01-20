import { Component, DestroyRef, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute, Params } from '@angular/router';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragPlaceholder,
  CdkDropList,
  moveItemInArray,
  transferArrayItem
} from '@angular/cdk/drag-drop';
import { combineLatest, of, switchMap, tap } from 'rxjs';
import { TaskCardComponent } from '../tasks-card/task-card.component';
import { TasksService } from '../../../core/services/tasks.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { KeyResultsManageModalComponent } from '../key-results-manage-modal/key-results-manage-modal.component';
import { rootObjectives } from '../../../core/constants/root-objectives';

@Component({
  selector: 'key-results-board',
  standalone: true,
  imports: [
    TranslateModule,
    CdkDropList,
    CdkDrag,
    CdkDragPlaceholder,
    TaskCardComponent
  ],
  templateUrl: './key-results-board.component.html',
  host: {
    'style': 'display: block; height: 100%'
  },
})

export class KeyResultsBoardComponent implements OnInit {
  @ViewChild('tasksGrid', { static: true }) tasksGrid: ElementRef;

  tasks = {
    inProgress: [],
    done: [],
    overdue: []
  };

  rootObjectives = [
    {
      id: 'all',
      title: 'all'
    },
    ...rootObjectives
  ];
  private _rootObjectiveId = 'all';
  private _search = null;
  private _tasksService = inject(TasksService);
  private _destroyRef = inject(DestroyRef);
  private _matDialog = inject(MatDialog);
  private _activatedRoute = inject(ActivatedRoute);

  ngOnInit() {
    this._tasksService.refreshKeyResultBoard$
      .subscribe(_ => {
        this.getKeyResultsList();
      })
    this._activatedRoute.queryParams
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((params: Params) => {
        if (params && params['rootObjectiveId']) {
          const rootObjective = this.rootObjectives.find(i => i.id === params['rootObjectiveId']);
          if (rootObjective) {
            this._rootObjectiveId = rootObjective.id;
          } else {
            this._rootObjectiveId = 'all';
          }
        }

        if (params && params['search']) {
          this._search = params['search'];
        } else {
          this._search = null;
        }

        this.getKeyResultsList();
      });
  }

  drop(event: CdkDragDrop<number[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }

    const previousStatus = +event.previousContainer?.id;
    const status = +event.container?.id;

    if (previousStatus !== status) {
      this._tasksService.updateKeyResultStatus((event.item?.data as any)?.id, status)
        .pipe(takeUntilDestroyed(this._destroyRef))
        .subscribe({
          next: () => {

          }
        })
    }
  }

  openDetailsDialog(item: any): void {
    this._matDialog.open(KeyResultsManageModalComponent, {
      width: '700px',
      maxWidth: '100%',
      data: item
    })
  }

  getKeyResultsList(): void {
    const payload1: any = { status: 1 }
    const payload2: any = { status: 2 }
    const payload3: any = { status: 3 }

    if (this._rootObjectiveId && this._rootObjectiveId !== 'all') {
      payload1.root_objective_id = this._rootObjectiveId;
      payload2.root_objective_id = this._rootObjectiveId;
      payload3.root_objective_id = this._rootObjectiveId;
    }

    if (this._search) {
      payload1.search = this._search;
      payload2.search = this._search;
      payload3.search = this._search;
    }

    combineLatest([
      this._tasksService.getKeyResultList(payload1),
      this._tasksService.getKeyResultList(payload2),
      this._tasksService.getKeyResultList(payload3),
    ]).pipe(
      switchMap((params: any[]) => of({
        inProgress: params[0],
        done: params[1],
        overdue: params[2],
      })),
      tap(({inProgress, done, overdue}) => {
        this.tasks.inProgress = inProgress?.data || [];
        this.tasks.done = done?.data || [];
        this.tasks.overdue = overdue?.data || [];
        this.openModalById();
      })
    ).subscribe();
  }

  openModalById(): void {
    this._activatedRoute.queryParams
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((data: { keyId: string }) => {
        if (!data?.keyId) return

        const item = [...this.tasks.inProgress, ...this.tasks.done, ...this.tasks.overdue]
          .find(i => i.id === data?.keyId)

        if (!item) return;

        this.openDetailsDialog(item);
      })
  }
}
