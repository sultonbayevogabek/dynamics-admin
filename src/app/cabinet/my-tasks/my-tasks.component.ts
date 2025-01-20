import { Component, DestroyRef, inject } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Params,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet
} from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatRipple } from '@angular/material/core';
import { MatIcon } from '@angular/material/icon';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { ObjectiveManageModalComponent } from './objective-manage-modal/objective-manage-modal.component';
import { KeyResultsManageModalComponent } from './key-results-manage-modal/key-results-manage-modal.component';
import { OverlayComponent } from '../../core/components/overlay-panel/overlay-panel.component';
import { rootObjectives } from '../../core/constants/root-objectives';
import { NgClass } from '@angular/common';
import { OverlayRef } from '@angular/cdk/overlay';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'my-tasks',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLinkActive,
    RouterLink,
    TranslateModule,
    MatRipple,
    MatIcon,
    OverlayComponent,
    NgClass,
    FormsModule
  ],
  templateUrl: './my-tasks.component.html',
  host: {
    'style': 'display: block; height: 100%'
  }
})

export class MyTasksComponent {
  tabs = [
    {
      link: 'objectives',
      text: 'objectives',
      icon: 'objective'
    },
    {
      link: 'key-results',
      text: 'key.results',
      icon: 'growing-arrow'
    }
  ];

  currentTab = 'objectives';
  rootObjectives = [
    {
      id: 'all',
      title: 'all'
    },
    ...rootObjectives
  ];
  rootObjectiveId = 'all';
  rootObjectiveName = 'all';
  search = ''
  cameFromNotification = false;

  private _router = inject(Router);
  private _activatedRoute = inject(ActivatedRoute);
  private _destroyRef = inject(DestroyRef);
  private _dialog = inject(MatDialog);

  ngOnInit(): void {
    if (this._router.url.includes('objectives')) {
      this.currentTab = 'objectives';
    } else {
      this.currentTab = 'key-results';
    }

    this.changeCurrentTab();

    this._activatedRoute.queryParams
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((params: Params) => {
        if (params && params['rootObjectiveId']) {
          const rootObjective = this.rootObjectives.find(i => i.id === params['rootObjectiveId']);

          if (rootObjective) {
            this.rootObjectiveId = rootObjective.id;
            this.rootObjectiveName = rootObjective.title;
            return;
          }

          this.rootObjectiveId = 'all';
          this.rootObjectiveName = 'all';
          return;
        }

        this.rootObjectiveId = 'all';
        this.rootObjectiveName = 'all';

        if (params && params['search']) {
          this.search = params['search'];
        } else {
          this.search = '';
        }

        this.cameFromNotification = params && (params['objectiveId'] || params['keyId']);
      });
  }

  changeCurrentTab(): void {
    this._router.events
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (event): void => {
          if (event && event instanceof NavigationEnd && event.url.includes('objectives')) {
            this.currentTab = 'objectives';
          } else {
            this.currentTab = 'key-results';
          }
        }
      });
  }

  openObjectiveManageModal() {
    this._dialog.open(ObjectiveManageModalComponent, {
      width: '700px',
      maxWidth: '100%'
    });
  }

  openKeyResultsManageModal() {
    this._dialog.open(KeyResultsManageModalComponent, {
      width: '700px',
      maxWidth: '100%'
    });
  }

  selectRootObjectiveId(rootObjectiveId: string, overlayPanel: OverlayRef): void {
    this._router.navigate(
      [],
      {
        relativeTo: this._activatedRoute,
        queryParams: {
          rootObjectiveId: rootObjectiveId
        },
        queryParamsHandling: 'merge'
      }
    ).then(() => {
      overlayPanel.detach();
    })
  }

  searchTasks(): void {
    this._router.navigate(
      [],
      {
        relativeTo: this._activatedRoute,
        queryParams: {
          search: this.search
        },
        queryParamsHandling: 'merge'
      }
    )
  }
}
