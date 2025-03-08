import { Component, EventEmitter, Input, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatInput, MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgFor, NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { SearchPipe } from '../../pipes/search.pipe';

type valueType = number | string | number[] | string[] | null | undefined;

@Component({
	selector: 'searchable-multiselect',
	templateUrl: './searchable-multiselect.component.html',
	styleUrls: ['./searchable-multiselect.component.scss'],
	encapsulation: ViewEncapsulation.None,
	standalone: true,
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    MatInputModule,
    NgIf,
    NgFor,
    MatIconModule,
    SearchPipe
  ]
})
export class SearchableMultiselectComponent {
	@ViewChild('searchInput', { static: true }) searchInput: MatInput;
	@Input() options: Array<any> = [];
	@Input() optionTextKey: string;
	@Input() optionValueKey?: string;
	@Input() optionValueType?: 'object' | 'id' = 'id';
	@Input() multiple?: boolean = true;
	@Input() emptyOption?: boolean = false;
	@Input() required?: boolean = false;
	@Input() classes?: string = 'w-full';
	@Input() label?: string = '';
	@Input() searchInputPlaceHolder?: string = 'Qidirish';
	@Input() selectBoxPlaceholder?: string;
	@Input() showTitle?: boolean = false;
	@Input() errorMessage?: string = '';
	@Input() showErrorMessage?: boolean = false;
	@Input() disabled?: boolean = false;
	@Input() textSizeClass?: string = '';

	@Input() set defaultValue(value: valueType) {
		this.matSelectValue = value;
	}

	@Output() selectionChangeEvent = new EventEmitter<string>();
	@Output() enterEvent = new EventEmitter<string>();
	@Output() closedEvent = new EventEmitter<void>();
	matSelectValue: valueType;

	onEnterClicked(): void {
		this.enterEvent.emit(this.searchInput.value);
	}

	selectionChange($event: MatSelectChange): void {
		this.selectionChangeEvent.emit($event.value);
	}

	clearSearchInput(): void {
		this.searchInput.value = '';
		this.searchInput.focus();
	}

	onMatSelectClosed(): void {
		this.closedEvent.emit();
	}

	onMatSelectOpened(): void {
		this.searchInput.focus();
	}
}
