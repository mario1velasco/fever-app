# Fever App - NX Monorepo

A mobile-first Angular application showcasing pet information, built using Tailwind CSS for streamlined styling and leveraging the power of an NX monorepo for efficient development and testing.

---

## Table of Contents

1. [Installation and Configuration](#installation-and-configuration)
2. [UI Library](#ui-library)
3. [Core Library](#core-library)
4. [Fever App](#fever-app)
5. [Fever App E2E](#fever-app-e2e)

---

## 1. Installation and Configuration

To get this project up and running on your local machine, follow these steps:

1. Clone the repository.
2. We used node V.20.16.0 (check .nvmrc file)
3. npm install -g nx
4. Install dependencies using `npm install`.

5. **Available scripts:**

   - **`npm start`**: Launches the Fever app in development mode.
   - **`npm run build`**: Builds the Fever app for production deployment.
   - **`npm run lint`**: Performs linting on the Fever app codebase.
   - **`npm run unit:test`**: Executes unit tests for the Fever app.
   - **`npm run e2e`**: Runs end-to-end tests using Cypress.
   - **`npm run e2e:edit`**: Opens Cypress in interactive mode for test development.
   - **`npm run storybook`**: Starts Storybook for the UI library.

---

## 2. UI Library

This library houses all the reusable UI components for the Fever App.

### Components

#### ButtonComponent

A versatile and performant button component, designed for seamless integration throughout your application.

**Features:**

- **Customizable Appearance:** Tailor the button's look and feel using inputs for `size`, `color`, and `text`.
- **Accessibility:** Built-in support for disabled states and proper `type` attribute for screen readers.
- **Reactive:** Emits a `btnClick` output event for easy interaction handling.
- **Efficient Styling:** Leverages `ngClass` for dynamic class binding, minimizing runtime overhead.
- **Transition Effects:** Smooth transitions on hover and active states enhance user experience.

**Performance Considerations:**

- **Minimal DOM:** The component's template is concise, reducing rendering time.
- **OnPush Change Detection:** Consider using `ChangeDetectionStrategy.OnPush` for further performance gains, especially in large-scale applications.
- **Signals:** Leverages signals for fine-grained reactivity and to minimize unnecessary re-renders.

**Example Usage:**

```html
<ui-button type="submit" text="Submit" size="large" color="primary" (btnClick)="handleSubmit()"> </ui-button>
```

**Key points:**

- I've elaborated on the button's features, flexibility, and accessibility considerations.
- The performance focus is highlighted, mentioning the efficient styling approach and the potential for `OnPush` change detection.
- An example usage snippet is provided for clarity.

#### DialogComponent

A modal dialog component providing a focused interaction layer for user confirmations, alerts, or content presentation.

**Features:**

- **Dynamic Content:** Accepts arbitrary content via `ng-content` for maximum flexibility.
- **Customizable Buttons:** Configure button labels, visibility, and disabled states using inputs.
- **Controlled Visibility:** Manage the dialog's open/close state with the `isOpen` input.
- **Event Handling:** Emits `confirm` and `closed` events for seamless interaction management.
- **Accessibility:** Implements a backdrop overlay to trap focus within the dialog, improving keyboard navigation and screen reader experience.
- **OnPush Change Detection:** Optimized for performance in large-scale applications by using `ChangeDetectionStrategy.OnPush`.

**Performance Considerations:**

- **Conditional Rendering:** The dialog and backdrop are only rendered when `isOpen` is true, minimizing unnecessary DOM elements.
- **OnPush Efficiency:** Change detection is optimized, further enhancing performance.
- **Signals:** Leverages signals for fine-grained reactivity and to minimize unnecessary re-renders.

**Example Usage:**

```html
<ui-dialog [title]="'Confirmation'" [isOpen]="showDialog" (confirm)="handleConfirm()" (closed)="handleClose()">
  <p>Are you sure you want to proceed?</p>
</ui-dialog>
```

**Key improvements:**

- I've highlighted the dialog's role in user interactions and its flexibility in handling various content types.
- Accessibility enhancements and performance optimizations are specifically emphasized.
- The provided example demonstrates basic usage.

#### DropdownComponent

A versatile dropdown component that provides a user-friendly way to select from a list of options.

**Features:**

- **Data-Driven:** Populated using an `options` input array, enabling dynamic option lists.
- **Customizable Placeholder:** Set a clear placeholder using the `placeholder` input.
- **Two-Way Binding:** Supports `[(ngModel)]` or reactive forms integration with `ControlValueAccessor`.
- **Accessibility:** ARIA attributes enhance screen reader support.
- **Event Handling:** Emits `selectionChange` for easy integration with parent components.
- **Efficient Updates:** Utilizes signals and `OnPush` change detection for optimized performance.
- **Keyboard Navigation:** Supports keyboard navigation for accessibility.
- **Outside Click Handling:** Closes the dropdown when clicking outside using `@HostListener`.

**Performance Considerations:**

- **OnPush Change Detection:** Ensures efficient updates by only triggering change detection when necessary.
- **Signals:** Leverages signals for fine-grained reactivity and to minimize unnecessary re-renders.
- **Conditional Rendering:** The options list is only rendered when the dropdown is open, reducing initial DOM load.

**Example Usage:**

```html
<ui-dropdown [(ngModel)]="selectedFruit" [options]="['Apple', 'Banana', 'Orange']" placeholder="Select a fruit" (selectionChange)="onFruitSelected($event)"> </ui-dropdown>
```

**Key additions:**

- Highlighted the use of `ControlValueAccessor`, signals, `@HostListener`, and `ElementRef`.
- Emphasized keyboard navigation and outside click handling for improved accessibility.
- Mentioned the performance benefits of `OnPush` change detection and signals.

#### PaginatorComponent

A user-friendly pagination control, enabling efficient navigation through large datasets.

**Features:**

- **Intuitive Navigation:** Provides clear "Previous" and "Next" buttons, along with a visual page number indicator.
- **Customizable Page Sizes:** Allows users to select the number of items per page using a dropdown.
- **Event-Driven:** Emits `pageChange` and `pageSizeChange` events for seamless integration with data sources.
- **Accessibility:** ARIA attributes enhance screen reader support and keyboard navigation.
- **Smooth Scrolling:** Automatically scrolls to the top of the page upon navigation, enhancing user experience.
- **OnPush Change Detection:** Optimized for performance in large-scale applications.

**Performance Considerations:**

- **OnPush Efficiency:** Change detection is optimized, further enhancing performance.
- **Minimal DOM Manipulation:** Navigation actions primarily trigger event emissions, minimizing direct DOM updates.

**Example Usage:**

```html
<ui-paginator [(currentPage)]="currentPage" [(pageSize)]="pageSize" (pageChange)="onPageChange($event)" (pageSizeChange)="onPageSizeChange($event)"> </ui-paginator>
```

**Key points:**

- Emphasizes the paginator's role in data navigation and its user-friendly interface.
- Mentions smooth scrolling and accessibility features.
- Highlights the performance benefits of `OnPush` change detection and efficient DOM manipulation.

### Storybook Integration

- Storybook is installed for component visualization and development.
- Tailwind CSS integration is pending, limiting interaction testing within Storybook for now.

---

## 3. Core Library

The core library provides reusable functionalities across the project.

### Features

- **Services:**

  #### ApiService

  A streamlined service for making HTTP requests to your backend API. It centralizes API communication and promotes code reusability.

  **Functionality:**

  - Provides a `get` method for performing GET requests.
  - Handles the base API URL configuration.
  - Supports optional query parameters using `HttpParams`.

  **Performance:**

  - **Leverages HttpClient:** Built on Angular's `HttpClient`, which is known for its performance and efficiency.
  - **Observable-Based:** Returns Observables for asynchronous operations, enabling efficient data handling and transformation.

  **Unit Testing with Jest:**

  The provided Jest test suite verifies the core functionality of the `ApiService`. It includes:

  - **Creation Test:** Confirms the service instance is created successfully.
  - **GET Request Test:** Mocks the `HttpClient` response and ensures the `get` method makes a GET request to the correct URL and handles the response as expected.

  **Additional Considerations:**

  - This service can be easily extended to include other HTTP methods (POST, PUT, DELETE) as needed.
  - The unit tests offer confidence in the service's behavior and help maintain its integrity during future updates.

    #### DeviceService

    A service to determine the current device type (desktop, mobile, or tablet) and provide responsive behavior in your application.

    **Functionality:**

    - Detects the device type based on the window's inner width.
    - Returns an Observable that emits the device type ('desktop', 'mobile', or 'tablet').
    - Reactively updates the emitted value when the window is resized.
    - Uses `distinctUntilChanged` to avoid unnecessary emissions if the device type remains the same.

    **Performance:**

    - **Efficient Observables:** Employs RxJS operators for optimized event handling and value emission.
    - **distinctUntilChanged:** Prevents redundant updates, contributing to better performance.

    **Unit Testing with Jest:**

    The Jest test suite comprehensively validates the `DeviceService`:

    - **Creation Test:** Ensures the service is created successfully.
    - **Initial Value Test:** Verifies the initial device type detection based on the initial window width.
    - **Resize Event Tests:** Simulates window resize events and checks if the service correctly emits the updated device type.
    - **Distinct Value Test:** Confirms that the service doesn't emit new values if the device type hasn't actually changed.

    **Additional Considerations:**

    - This service is invaluable for creating responsive layouts and adapting your application's behavior based on the user's device.
    - The thorough unit tests guarantee the service's reliability and facilitate future maintenance.

    #### LocalStorageService

    A simple and efficient service for interacting with the browser's local storage.

    **Functionality:**

    - Provides methods to `saveData`, `getData`, and `removeData` from local storage.
    - Handles JSON serialization and parsing for convenient storage of complex data structures.

    **Performance:**

    - **Direct Local Storage Access:** Utilizes the browser's native `localStorage` API, ensuring optimal performance.

    **Unit Testing with Jest:**

    The Jest tests validate the `LocalStorageService`'s functionality:

    - **Save Data Test:** Confirms that data is correctly saved to local storage.
    - **Retrieve Data Test:** Verifies that stored data can be retrieved successfully.
    - **Non-Existent Data Test:** Checks that `null` is returned when attempting to retrieve non-existent data.
    - **Remove Data Test:** Ensures that data is removed from local storage as expected.

    **Additional Considerations:**

    - This service is handy for persisting user preferences, application state, or other data that needs to be available even after the browser is closed.
    - The unit tests offer assurance that the service interacts with local storage as intended.

- **Directives:**

### ScrollEndDirective

A directive that efficiently detects when the user scrolls to the bottom of the page.

**Functionality:**

- Listens to the `window:scroll` event.
- Compares the current scroll position with the total scrollable height of the document.
- Emits a `scrollEnd` event when the user reaches the bottom.

**Performance:**

- **Passive Event Listener:** The `@HostListener` decorator is used with the `passive` option for the `window:scroll` event, improving scrolling performance, especially on mobile devices.
- **Minimal Calculation:** The scroll position comparison is straightforward and efficient.

**Unit Testing with Jest:**

The provided Jest test suite thoroughly verifies the behavior of the `ScrollEndDirective`. It includes:

- **Creation Test:** Confirms the directive instance is created successfully.
- **Scroll to Bottom Test:** Simulates scrolling to the bottom and checks if the `scrollEnd` event is emitted.
- **Scroll Not to Bottom Test:** Simulates scrolling to a position other than the bottom and ensures the `scrollEnd` event is not emitted.

**Additional Considerations:**

- This directive is particularly useful for implementing features like infinite scrolling or lazy loading content.
- The unit tests provide confidence in the directive's functionality and aid in maintaining its correctness during future development.

### Testing

- Unit testing is implemented using Jest.

### Services

---

## 4. Fever App

The main application that showcases a collection of pet images.

### Functionalities

- Displays a grid of pet images.
- Clicking on an image reveals detailed information about the pet.

### Routing

The Fever App utilizes Angular's routing capabilities to enable navigation between different sections.

#### App-Level Routing (`app.routes.ts`)

- The root path (`/`) loads the `PetsModule` lazily using `loadChildren`.
- A wildcard route (`**`) handles unmatched URLs and displays the `NotFoundComponent`.

#### Pets Module Routing (`pets.module.ts`)

- The empty path within the `PetsModule` (`/pets`) lazily loads the `PetListComponent` using `loadComponent`.
- The `:petId` path (`/pets/:petId`) dynamically loads the `PetDetailsComponent` for displaying individual pet details.
- A redirect rule ensures that any unmatched paths within the `PetsModule` are redirected to the root path of the module.

**Performance Focus:**

- **Lazy Loading:** Both `loadChildren` and the newer `loadComponent` feature are employed to load modules and components on demand, significantly improving initial load times.

### Pet List Feature

The Pet List feature is responsible for displaying a list of pets, along with filtering and pagination controls.

**Key Points:**

- **Performance Optimization:** Employs signals, `OnPush` change detection, and lazy loading to enhance performance.
- **Device Adaptability:** Provides a seamless user experience across different device types.
- **Clean Architecture:** Separates concerns into components and services, promoting maintainability and testability.

#### Components

- `PetListComponent`

  The main component that orchestrates the pet list functionality.

  - **Signals and Reactivity:** Leverages signals for efficient state management and reactivity, ensuring optimal performance with fine-grained updates.
  - **Device Responsiveness:** Adapts its behavior based on the detected device type using the `DeviceService`.
  - **Form Handling:** Manages a reactive form (`PetFormType`) for filtering and sorting pets.
  - **Pagination:** Integrates the `PaginatorComponent` to enable navigation through paginated results.
  - **Infinite Scrolling (Mobile):** Implements infinite scrolling on mobile devices by incrementally fetching more pets as the user scrolls to the bottom.
  - **Data Fetching:** Utilizes the `PetsService` to retrieve pet data based on filters, sorting, and pagination parameters.
  - **Lifecycle Management:** Uses `takeUntilDestroyed` to automatically unsubscribe from Observables when the component is destroyed, preventing memory leaks.

- `PetListResultsComponent`

  This component is responsible for rendering the list of pet results, either displaying the pets or a "No pets found" message based on the search criteria.

  - **Conditional Rendering:** Employs conditional rendering to display either the pet list or the "No pets found" message, depending on the availability of search results.
  - **Pet Data Display:** Iterates over the `pets` input array using `@for` to present each pet's image, name, kind, weight, height, length, and health status.
  - **Navigation:** Includes a "View Details" button for each pet, utilizing the `Router` service to navigate to the pet details page.
  - **Styling:** Leverages Tailwind CSS classes for visually appealing presentation.
  - **Accessibility:** Provides descriptive `alt` text for images and uses semantic HTML elements.
  - **OnPush Change Detection:** Optimized for performance by using `ChangeDetectionStrategy.OnPush`.
  - **ScrollEndDirective:** Incorporates the `ScrollEndDirective` to trigger infinite scrolling on mobile devices.

#### PetListFiltersComponent

This component provides the filtering and sorting controls for the pet list.

- **Form Integration:** Uses a reactive form (`PetFormType`) to capture user input for sorting and searching.
- **Conditional Visibility:** Allows users to toggle the visibility of the filter form.
- **Responsive Design:** Adapts its layout for different screen sizes.
- **Customizable:** Exposes inputs for form control and event emissions for form submission and reset.
- **OnPush Change Detection:** Optimized for performance.

### Pet Details Feature

#### Components

- `PetDetailsComponent`

  This component displays detailed information about a specific pet, identified by its `petId` from the route parameters.

  - **Data Retrieval:** Fetches pet data using the `PetsService` based on the `petId`.
  - **Conditional Rendering:** Uses conditional rendering to either display the pet details or a "Pet not found" message if the pet data is unavailable.
  - **Pet Information Display:** Presents the pet's image, name, favorite delights, well-being (calculated using the `PetsService`), kind, weight, height, and length.
  - **Navigation:** Includes a "Back" button to return to the pet list.
  - **Styling:** Leverages Tailwind CSS classes for a visually pleasing layout.
  - **Accessibility:** Provides descriptive `alt` text for the image and utilizes semantic HTML elements.
  - **Scrolling:** Smoothly scrolls to the pet details section upon component initialization.
  - **OnPush Change Detection:** Optimized for performance.

#### Shared

- `PetsService`

  This service is crucial for fetching and managing pet data within the application.

  - **State Management:**

    - Maintains an internal cache of pet data using a `pets` signal for efficient reactivity.
    - Tracks the `currentPage` and `sortType` using private variables and provides convenient getters and setters for controlled access.

  - **Data Retrieval:** Provides methods to retrieve pet data from the API, including:
    - `getList`: Fetches a list of pets with optional filtering, pagination, and sorting.
    - `get`: Retrieves a single pet by its ID, utilizing local caching for improved performance.
    - `getPetOfTheDay`: Fetches a random "Pet of the Day," storing it in local storage for subsequent reuse on the same day.
  - **Data Processing:** Includes helper methods for:
    - `getPetList`: Retrieves a sorted and paginated subset of pets from the internal cache.
    - `calculatePetHealth`: Calculates a pet's health status based on its attributes.
  - **Caching:** Employs local storage to cache the "Pet of the Day" and potentially other pet data for performance optimization.
  - **Error Handling:** _(Consider adding details about any error handling mechanisms implemented in the service)_
  - **Unit Testing:**

    The Jest tests validate the `PetsService`'s functionality:

    - **Creation Test:** Ensures the service is created successfully
    - **Get List of Pets Test:** Mocks the API response and verifies that the `getList` method fetches and processes pet data correctly.
    - **Get Pet by Id Test:** Mocks the API response and confirms that the `get` method retrieves a pet by its ID as expected
    - **Calculate Pet Health Test:** Provides various pet scenarios and checks if the `calculatePetHealth` method accurately determines their health status
    - **Working on:** _(We could not finish to test the full service)_

- `Pets.types.ts`

  This file defines the essential TypeScript types and interfaces used for managing pet-related data throughout the application.

  - **`Pet` interface:** Represents the structure of a pet object, including properties like `id`, `name`, `kind`, `weight`, `height`, `length`, `photo_url`, `description`, and an optional `number_of_lives` for cats.
  - **`PetOfTheDay` interface:** Defines the structure for storing the "Pet of the Day," including the `day` (as a string) and the selected `pet`.
  - **`SortType` type:** Enumerates the valid sorting options for the pet list.
  - **`PetFormType` type:** Represents the reactive form used for filtering and sorting pets, including controls for `sortBy` and `searchByName`.
  - **`sortBy` type:** Enumerates the valid sorting options including both ascending and descending order

### Shared Components

#### NavBarComponent

This component represents the navigation bar of the application.

- **Responsive Design:** Adapts its content based on the detected device type, providing a compact layout for mobile devices.
- **Pet of the Day:** Features a button to display a "Pet of the Day" in a modal dialog.
- **Contact Button:** Includes a button that opens a link to your LinkedIn profile in a new tab.
- **Dialog Integration:** Utilizes the `DialogComponent` from the UI library to display the "Pet of the Day" details.
- **Service Interaction:** Fetches the "Pet of the Day" data using the `PetsService`.
- **Lifecycle Management:** Employs `takeUntilDestroyed` to prevent memory leaks by unsubscribing from Observables when the component is destroyed.
- **OnPush Change Detection:** Optimized for performance.

#### FooterComponent

This component represents the footer of the application, displaying copyright information.

- **Simple Layout:** Presents a centered copyright notice within a container.
- **Styling:** Utilizes Tailwind CSS classes for basic styling.

#### NotFoundComponent

This component is displayed when the user navigates to a non-existent route.

- **Error Message:** Provides a clear "404 - Not Found" message with a brief explanation.
- **Navigation:** Includes a "Back" button to return to the previous page using the `Location` service.
- **Visual Appeal:** Features an SVG illustration to enhance the user experience.

### Testing

- Unit testing is focused on the `PetsService`.

---

## 5. Fever App E2E

This project includes end-to-end (E2E) tests using Cypress to ensure the Fever App functions correctly across different devices and scenarios.

### Tools

- Cypress

### Test Coverage

- **Comprehensive Application Flow:** The E2E tests cover the entire application flow, including:

  - Navigation between the pet list and pet details pages
  - Filtering and sorting pets
  - Pagination and infinite scrolling
  - Handling of incorrect URLs

- **Device Responsiveness:** Tests are designed to validate the application's behavior on both desktop and mobile viewports.

- **Performance Focus:** The tests include assertions to ensure:
  - **Efficient Loading:** Pages and components load quickly.
  - **Smooth Interactions:** User interactions, such as filtering, sorting, and pagination, are responsive and don't cause noticeable delays.
  - **Minimal Resource Usage:** The application doesn't consume excessive memory or CPU resources during testing.

### Test Examples (`app.cy.ts`)

- **Desktop View Tests:**

  - Verifies visibility of key elements and initial pet list display.
  - Tests the functionality of the dropdown sorting feature.
  - Validates the search by name input and its impact on the results.
  - Ensures pagination works as expected.
  - Confirms that pet details are displayed correctly for different pet types and health conditions.
  - Checks the handling of incorrect URLs.

- **Mobile View Tests:**
  - Verifies the visibility of elements and initial pet list display on a mobile viewport.
  - Tests the infinite scroll functionality.
  - Performs a full test scenario, including filtering, searching, navigating to pet details, and error handling.
  - Checks the handling of incorrect URLs.

**Additional Considerations:**

- The tests can be easily extended to cover new features or scenarios as the application evolves
- Consider incorporating visual regression testing using Cypress plugins to catch unintended UI changes

---

**Note:**

- Emphasis is placed on performance optimization throughout the project.
- The project is built using the latest Angular versions, including Signals.
