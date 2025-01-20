import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MatIcon } from '@angular/material/icon';
import { DatePipe, DecimalPipe, NgOptimizedImage, NgStyle } from '@angular/common';
import { rootObjectivesIdName } from '../../../core/constants/root-objectives';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'task-card',
  standalone: true,
  imports: [
    TranslateModule,
    MatIcon,
    NgOptimizedImage,
    NgStyle,
    DatePipe,
    DecimalPipe
  ],
  templateUrl: './task-card.component.html'
})

export class TaskCardComponent {
  @Input() task: any;
  members = [
    'assets/img/anonym.png',
    'assets/img/yosh_bola.png',
    'assets/img/achkili.png',
    'assets/img/anonym.png',
    'assets/img/pekos.png'
  ];
  rootObjectives = rootObjectivesIdName;
  fileHost = environment.fileHost;
}
