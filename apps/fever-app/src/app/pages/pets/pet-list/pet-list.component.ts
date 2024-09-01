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
import { PetListFiltersComponent } from './components/pet-list-filters/pet-list-filters.component';
import { PetListResultsComponent } from './components/pet-list-results/pet-list-results.component';
import { FormBuilder, Validators } from '@angular/forms';
import { isPetState, Pet, PetFormType, PetState } from '../shared/pets.types';
import { DeviceService, ScrollEndDirective } from '@fever-pets/core';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-pet-list',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    PetListFiltersComponent,
    PetListResultsComponent,
    PaginatorComponent,
    ScrollEndDirective,
  ],
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
  public petList: PetState | undefined;
  public currentPage = this.petService.currentPage;
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
    const petList = this.petService.getPetList(
      this.petService.currentPage,
      this.pageSize()
    );
    if (isPetState(petList)) {
      this.petList = petList;
    } else {
      this.updatePetList();
    }
    this.onDesktopFormValuesChange();
    this.onDeviceChange();
  }

  // **********************
  // ****** Events  *******
  // **********************
  /**
   * The onSubmitFiltersForm function updates the pet list based on the values in the form.
   * This only happen on mobile and tablet devices.
   */
  onSubmitFiltersForm() {
    this.petService.currentPage = 1;
    this.currentPage = 1;
    this.updatePetList(true);
  }

  /**
   * The function `onResetSearch` resets form values and pagination settings before updating the pet
   * list.
   */
  onResetSearch() {
    this.form.reset();
    this.pageSize.set(10);
    this.petService.currentPage = 1;
    this.currentPage = 1;
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
          this.petService.currentPage = 1;
          this.currentPage = 1;
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
    this.petService.currentPage = 1;
    this.currentPage = 1;
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
    this.petService.currentPage = newPage;
    this.currentPage = newPage;
    this.updatePetList();
  }

  /**
   * The `onScrollEnd` function increases the page size by 10 if the device is mobile.
   */
  onScrollEnd() {
    if (this.device() === 'mobile') {
      this.currentPage = this.petService.currentPage + 1;
      this.petService.currentPage = this.petService.currentPage + 1;
      this.updatePetList();
    }
  }

  /**
   * Listens to changes in the device (mobile or desktop) and updates the pet list and component
   * accordingly. If the device is mobile, it shows all pets. If the device is desktop, it shows
   * only the currently selected page of pets. The component is then marked for check so that
   * the UI is updated.
   */
  onDeviceChange() {
    this.deviceService
      .getDevice()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((device) => {
        let petList: PetState | object | undefined;
        if (device === 'mobile') {
          petList = this.petService.getPetList(0);
        } else {
          const index = (this.petService.currentPage - 1) * this.pageSize() + 1;
          petList = this.petService.getPetList(index, this.pageSize());
        }
        this.petList = isPetState(petList) ? petList : undefined;
        this.cd.markForCheck();
      });
  }

  // *****************
  // * Private methods
  // *****************
  /**
   * The function `updatePetList` calls a method to search for photos based on the current page and
   * page size, and then marks the component for check.
   */
  private updatePetList(isSubmitFromBtnForm = false): void {
    const searchByName = this.form.controls.searchByName.value,
      sortBy = this.form.controls.sortBy.value
        ? [this.form.controls.sortBy.value]
        : [];
    const filters: Partial<Pet> = {
      name: searchByName ? searchByName : undefined,
    };
    this.petService
      .getList(filters, this.petService.currentPage, this.pageSize(), sortBy)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((petList) => {
        if (this.device() === 'mobile' && !isSubmitFromBtnForm) {
          const petList = this.petService.getPetList(0);
          this.petList = isPetState(petList) ? petList : undefined;
        } else {
          this.petList = this.petService.parsePetsResponse(petList);
        }

        this.cd.markForCheck();
      });
    this.cd.markForCheck();
  }
}
