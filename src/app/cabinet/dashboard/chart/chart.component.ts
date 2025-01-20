import { AfterViewInit, Component, inject, Input, OnInit, ViewChild } from '@angular/core';
import ApexCharts from 'apexcharts';

import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexGrid,
  ApexLegend,
  ApexMarkers,
  ApexPlotOptions,
  ApexResponsive,
  ApexStroke,
  ApexXAxis,
  NgApexchartsModule
} from 'ng-apexcharts';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { DashboardStatisticsModel } from '../../../core/models/dashboard-statistics.model';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  responsive: ApexResponsive[];
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  legend: ApexLegend;
  fill: ApexFill;
  grid: ApexGrid;
  stroke: ApexStroke;
  markers: ApexMarkers;
  tooltip: ApexTooltip;
};

@Component({
  selector: 'chart',
  standalone: true,
  imports: [
    NgApexchartsModule,
    TranslateModule
  ],
  templateUrl: './chart.component.html'
})

export class ChartComponent implements OnInit, AfterViewInit {
  @ViewChild('chart') chart: ChartComponent;
  @Input() data: Partial<DashboardStatisticsModel>;
  public chartOptions: Partial<ChartOptions>;
  private _translateService: TranslateService = inject(TranslateService);

  constructor() {

  }

  async ngOnInit(): Promise<void> {
    const postfix = this.data.postfix;
    const translations = await firstValueFrom(this._translateService.get([ 'fact', 'plan', 'no.information', postfix ]));
    this.chartOptions = {
      series: [
        {
          name: translations.fact,
          color: this.data.colors[0],
          data: this.data.fact
        }, {
          name: translations.plan,
          color: this.data.colors[1],
          data: this.data.plan
        }
      ],
      chart: {
        height: 350,
        type: 'line',
        zoom: {
          enabled: false
        },
        toolbar: {
          show: false,
        },
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: this.data.curve,
        width: 3,
        colors: this.data.colors
      },
      grid: {
        strokeDashArray: 4
      },
      fill: {},
      markers: {
        colors: this.data.colors,
        size: 6,
        hover: {
          sizeOffset: 0
        },
      },
      tooltip: {
        marker: {
          show: false,
        }
      },
      xaxis: {
        type: 'numeric',
        categories: this.data?.years_number,
        decimalsInFloat: 0
      },
      yaxis: {
        labels: {
          formatter: function (value) {
            return value !== null ? value + translations[postfix] : translations['no.information'].toLowerCase();
          }
        },
        reversed: !!this.data?.reversed
      },
    };
  }

  async ngAfterViewInit(): Promise<void> {
    const chart = new ApexCharts(document.querySelector('#chart'), this.chartOptions);
    await chart?.render();
  }
}
