import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { PetsService } from '../shared/pets.service';
import { ButtonComponent, PaginatorComponent } from '@fever-pets/ui';
import { NavBarComponent } from '../../shared/components/nav-bar/nav-bar.component';
import { PetListFiltersComponent } from './components/pet-list-filters/pet-list-filters.component';
import { PetListResultsComponent } from './components/pet-list-results/pet-list-results.component';
import { FormBuilder, Validators } from '@angular/forms';
import { Pet, PetFormType } from '../shared/pets.types';
import { DeviceService } from '@fever-pets/core';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-pet-list',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    NavBarComponent,
    PetListFiltersComponent,
    PetListResultsComponent,
    PaginatorComponent,
  ],
  providers: [PetsService],
  templateUrl: './pet-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PetListComponent implements OnInit {
  // * Injectors
  public petService = inject(PetsService);
  private fb = inject(FormBuilder);
  private cd = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);
  private deviceService = inject(DeviceService);

  // * Signals Variables
  public device = toSignal(this.deviceService.getDevice());
  public pets = toSignal(this.petService.getList());
  public currentPage = signal(1);
  public pageSize = signal(10);

  // * Variables
  public form: PetFormType = this.fb.group({
    sortBy: ['', Validators.required],
    searchByName: [''],
  });

  // *****************
  // * Lifecycle hooks
  // *****************
  /**
   * The ngOnInit function in TypeScript is a lifecycle hook method used in Angular to initialize
   * component properties and make API calls.
   */
  ngOnInit(): void {
    // ? We mock the initial called API to don't reach the limit of UNSPLASH API calls very fast
    this.onDesktopFormValuesChange();
  }

  // **********************
  // ****** Events  *******
  // **********************
  /**
   * The onSubmitFiltersForm function updates the pet list based on the values in the form.
   */
  onSubmitFiltersForm() {
    this.currentPage.set(1);
    this.updatePetList();
  }

  /**
   * The function `onResetSearch` resets form values and pagination settings before updating the pet
   * list.
   */
  onResetSearch() {
    this.form.reset();
    this.pageSize.set(10);
    this.currentPage.set(1);
    this.updatePetList();
  }

  /**
   * The function `onDesktopFormValuesChange` listens for changes in form values, debounces them, and
   * updates the pets list if the device is a desktop.
   */
  onDesktopFormValuesChange() {
    this.form.valueChanges
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        if (this.device() === 'desktop') {
          this.currentPage.set(1);
          this.updatePetList();
        }
      });
  }
  /**
   * The function `onPageSizeChange` updates the page size for a pet search of.
   * @param {number} newPageSize - The `newPageSize` parameter is a number that represents the new page
   * size that is selected by the user. It is used in the `onPageSizeChange` function to update the
   * page size for displaying search results for pets.
   */
  onPageSizeChange(newPageSize: number) {
    this.currentPage.set(1);
    this.pageSize.set(newPageSize);
    this.updatePetList();
  }

  /**
   * The onPageChange function searches for pets on a new page and updates the current page
   * number.
   * @param {number} newPage - The `newPage` parameter is a number that represents the page number to
   * which the user wants to navigate.
   */
  onPageChange(newPage: number) {
    this.currentPage.set(newPage);
    this.updatePetList();
  }

  // *****************
  // * Private methods
  // *****************
  /**
   * The function `updatePetList` calls a method to search for photos based on the current page and
   * page size, and then marks the component for check.
   */
  private updatePetList(): void {
    const searchByName = this.form.controls.searchByName.value,
      sortBy = this.form.controls.sortBy.value
        ? [this.form.controls.sortBy.value]
        : [];
    const filters: Partial<Pet> = {
      name: searchByName ? searchByName : undefined,
    };
    this.petService
      .getList(filters, this.currentPage(), this.pageSize(), sortBy)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((petList) => {
        this.pets = signal(petList);
        this.cd.markForCheck();
      });
    this.cd.markForCheck();
  }
}
