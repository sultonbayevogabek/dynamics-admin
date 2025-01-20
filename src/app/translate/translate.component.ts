import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { HttpBackend, HttpClient } from '@angular/common/http';
import { NgForOf, NgIf } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
	selector: 'translate',
	templateUrl: 'translate.component.html',
	styleUrl: 'translate.component.scss',
	imports: [
		MatInputModule,
		MatButtonModule,
		NgIf,
		NgForOf,
		FormsModule,
		MatPaginatorModule,
		ReactiveFormsModule,
		MatProgressSpinnerModule,
	],
	standalone: true
})
export class TranslateComponent implements OnInit {
	@ViewChild('paginator') matPaginator: MatPaginator;
	public translationForm = new FormGroup({
		key: new FormControl('', [Validators.required]),
		uzbekLatin: new FormControl('', [Validators.required]),
		uzbekCyrillic: new FormControl('', [Validators.required]),
		karakalpak: new FormControl('', [Validators.required]),
		russian: new FormControl('', [Validators.required]),
		english: new FormControl('', [Validators.required]),
	});
	public searchParams = {
		search: '',
		page: 0,
	};
	public total = 0;
	public translations: {
		english: string;
		uzbekCyrillic: string;
		uzbekLatin: string;
		russian: string;
		karakalpak: string;
		key: string;
	}[] = [];
	public converting = false;
	private _httpClient: HttpClient;

	constructor(private handler: HttpBackend) {
		this._httpClient = new HttpClient(handler);
	}

	ngOnInit(): void {
		this.getTranslationsList();
	}

	getTranslationsList(): void {
		this._httpClient.post('http://localhost:3000/get-translations', this.searchParams).subscribe((res: any) => {
			this.translations = res?.translations;
			this.total = res?.total;
		});
	}

	getPage($event: PageEvent): void {
		this.searchParams.page = $event.pageIndex;
		this.getTranslationsList();
	}

	convert($event: any): void {
		$event.preventDefault();

		this.converting = true;

		this._httpClient
			.post('http://localhost:3000/convert', {
				uzbekLatin: this.translationForm.get('uzbekLatin').value,
			})
			.subscribe((res: any) => {
				this.translationForm.get('russian').setValue(res?.russian || res?.uzbekCyrillic);
				this.translationForm.get('english').setValue(res?.english || res?.uzbekCyrillic);
				this.translationForm.get('key').setValue(res?.english?.split(' ')?.join('.')?.toLowerCase());
				this.translationForm.get('uzbekCyrillic').setValue(res?.uzbekCyrillic);
				this.translationForm.get('karakalpak').setValue(res?.karakalpak);
				this.converting = false;
			});
	}

	addNewWord(): void {
		this._httpClient.post('http://localhost:3000/add-new-word', this.translationForm.value).subscribe(
			(res: any) => {
				if (res?.ok) {
					alert('New word added');
					this.translationForm.reset();
					this.searchParams.search = '';
					this.matPaginator.lastPage();
				}
			},
			() => {
				alert('Kalit mavjud')
			},
		);
	}

	editWord($event: any, translation: any, key: string, inputValue: string): void {
		$event.preventDefault();
		if (translation[key] !== inputValue && inputValue.trim().length) {
			this._httpClient
				.post('http://localhost:3000/edit-word', {
					translation,
					key,
					inputValue,
				})
				.subscribe((res: any) => {
					if (res?.ok) {
						translation[key] = inputValue;
						alert('Changed')
					}
				});
		}
	}
}
