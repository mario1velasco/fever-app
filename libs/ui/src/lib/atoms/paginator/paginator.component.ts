import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownComponent } from '../dropdown/dropdown.component';

@Component({
  selector: 'ui-paginator',
  standalone: true,
  imports: [CommonModule, DropdownComponent],
  templateUrl: './paginator.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginatorComponent {
  // * Inputs & Outputs
  /** Current page number  */
  currentPage = input.required<number>();
  /** Number of items per page  */
  pageSize = input.required<number>();
  /** Event emitted when the current page changes */
  pageChange = output<number>();
  /** Event emitted when the number of items per page changes */
  pageSizeChange = output<number>();

  // * Variables
  pageSizeOptions = ['10', '20', '30'];

  // *************
  // * GETTERS
  // *************
  get from() {
    return this.currentPage() * this.pageSize() + 1;
  }

  get to() {
    return this.from + this.pageSize() - 1;
  }

  // *************
  // * EVENTS
  // *************

  /**
   * Emits the page change event with value 1 and scrolls to the top of the page
   * with a smooth animation.
   */
  onFirstPage() {
    this.pageChange.emit(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /**
   * Emits the page change event with the current page minus one and scrolls to the
   * top of the page with a smooth animation.
   * Does nothing if the current page is 1.
   */
  onPreviousPage() {
    if (this.currentPage() > 0) {
      this.pageChange.emit(this.currentPage() - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  /**
   * Emits the page change event with the current page plus one and scrolls to the
   * top of the page with a smooth animation.
   * Does nothing if the current page is the last page.
   */
  onNextPage() {
    this.pageChange.emit(this.currentPage() + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /**
   * Emits the page size change event with the new page size and scrolls to the top of the page
   * with a smooth animation.
   * @param {string} newPageSize - The new page size that is selected by the user.
   */
  onPageSizeChange(newPageSize: string) {
    this.pageSizeChange.emit(parseInt(newPageSize, 10));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
