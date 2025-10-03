import { Component, Input, Output, EventEmitter } from '@angular/core';
import {Category} from '../../models/models';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  standalone: false,
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent {
  @Input() categories: Category[] = [];
  @Input() selectedCategoryInput: Category | undefined;
  @Input() totalProducts: number = 0;
  @Input() totalCategoryProducts: number = 0;
  @Output() selectedCategoryOutput = new EventEmitter<any>();

  onCategorySelection(category: any): void {
    this.selectedCategoryOutput.emit(category);
  }

  isCategorySelected(category?: any) {
    return !!category && this.selectedCategoryInput?.name === category?.name;
  }
}
