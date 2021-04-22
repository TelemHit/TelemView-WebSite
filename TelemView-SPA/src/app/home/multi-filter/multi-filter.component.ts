//all filters in client side
import {
  Component,
  OnInit,
  Input,
  Pipe,
  PipeTransform,
  ElementRef,
  ViewChild,
  OnChanges,
} from '@angular/core';
import { DataForHome } from 'src/app/_models/dataForHome';
import { ProductsService } from 'src/app/_services/products.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { GeneralDataService } from 'src/app/_services/generalData.service';
import { TypeaheadDirective, TypeaheadMatch } from 'ngx-bootstrap/typeahead';

@Component({
  selector: 'app-multi-filter',
  templateUrl: './multi-filter.component.html',
  styleUrls: ['./multi-filter.component.css'],
})
export class MultiFilterComponent implements OnInit, OnChanges {
  //Array for all params we filtered by
  selectedParams = {
    tasks: [],
    organizations: [],
    productTypes: [],
    organizationTypes: [],
    lecturers: [],
    courses: [],
    degree: [],
    years: [],
    search: [],
  };
  //param for search
  modelChanged: Subject<string> = new Subject<string>();
  debounceTime = 1000;
  isFocused = false;
  openMoreFilters = false;
  mobileSearch = false;
  mobileFilters = false;
  filteredList: Observable<any>;
  showAutoComplete = false;

  @Input() totalProducts: number;
  @Input() data: DataForHome;
  @Input() queryParams;
  //@ViewChild('search') searchElement: ElementRef;
  @ViewChild('search') typeahead: TypeaheadDirective;

  constructor(
    private productService: ProductsService,
    private router: Router,
    private route: ActivatedRoute,
    private generalDataService: GeneralDataService
  ) {
    this.modelChanged.pipe(debounceTime(this.debounceTime)).subscribe(() => {
      this.updateSearch();
    });
  }

  ngOnInit() {
      this.filteredList = new Observable((observer: any) => {
        this.generalDataService
          .getSearchList(this.selectedParams.search[0])
          .subscribe((result: any) => {
            observer.next(result);
          }, (error) => {
            console.log(error);
          });
      });
  }

  fixedHighligth(match: TypeaheadMatch, query: Array<string>): String {
    // Avoid calling
    query = query.filter((value) => value.trim().length > 0);
    return this.typeahead._container.highlight(match, query);
}

  //we use onChange so each time the url changes it changes also in Home component variable
  //then we get the params as GetQueryParams Input
  ngOnChanges(changes) {
    if (changes.queryParams) {
      this.getQueryParams();
    }
  }

  //set focus on search input in mobile after clicking button
  showSearch() {
    this.mobileSearch = !this.mobileSearch;
    this.mobileFilters = false;
    setTimeout(() => {
      // this will make the execution after the above boolean has changed
      this.typeahead.onFocus()
    }, 0);
  }

  //get parameters to filter by and set them in array
  getQueryParams() {
    this.selectedParams = {
      tasks: [],
      organizations: [],
      productTypes: [],
      organizationTypes: [],
      lecturers: [],
      courses: [],
      degree: [],
      years: [],
      search: [],
    };
    // get params from query
    // set selected params according to query
    for (const [key, value] of Object.entries(this.queryParams)) {
      // check that the param in the query is relevant
      if (this.selectedParams[key] != undefined) {
        const newValue: any = value;
        // if param is string push it, if array - loop and push
        if (typeof newValue == 'string') {
          if (key == 'degree' || key == 'search') {
            this.selectedParams[key].push(newValue.toString());
          } else {
            this.selectedParams[key].push(parseInt(newValue));
          }
        } else {
          if (key == 'degree' || key == 'search') {
            for (let id of newValue) {
              this.selectedParams[key].push(id);
            }
          } else {
            for (let id of newValue) {
              this.selectedParams[key].push(parseInt(id));
            }
          }
        }
      }
    }
  }

  //return only objects with products
  filterData(data) {
    return data.filter((d) => d.counter > 0);
  }

  //clear specific filter
  clear(select, filter) {
    select.close();
    this.selectedParams[filter] = [];
    if (this.queryParams[filter] && this.queryParams[filter].length > 0) {
      this.updateQueryParameters(filter);
    }
  }

  //update parameters when closing filter in mobile "back" button
  closeSelect(select, filter) {
    select.close();
    if (
      (this.queryParams[filter] && this.queryParams[filter].length > 0) ||
      this.selectedParams[filter].length > 0
    ) {
      this.updateQueryParameters(filter);
    }
  }

  //update parameters when clicking out of filter
  updateOnBlur(filter) {
    if (
      (this.queryParams[filter] && this.queryParams[filter].length > 0) ||
      this.selectedParams[filter].length > 0
    ) {
      this.updateQueryParameters(filter);
    }
  }

  //get products according to parameters
  updateQueryParameters(filter) {
    const params = { ...this.selectedParams };
    //check all parameters, if parameter is empty do not send it
    for (const property in params) {
      if (params[property]) {
        if (params[property].length == 0 && property != filter) {
          delete params[property];
        }
      }
    }
    //check if search is empty
    if (params.search != undefined && params.search[0] != undefined) {
      if (params.search[0].length == 0) {
        delete params.search;
      }
    }

    //navigate to same route with parameters
    //the change catch in Home component
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: params,
    });
  }

  //clear search
  clearSearch() {
    const params = { ...this.route.snapshot.queryParams };
    delete params.search;
    this.router.navigate([], { queryParams: params });
    this.selectedParams.search = [];
  }

  //get change of search input
  modelChange() {
    this.modelChanged.next();
  }

  selectSearchTimeOut(){
    setTimeout(() => {
      this.updateSearch();
    }, 500);
  }

  //update search parameter
  updateSearch() {
    this.updateQueryParameters('search');
  }

  //clear all parameters besides Search
  clearall() {
    const params = { ...this.route.snapshot.queryParams };
    for (const [key, value] of Object.entries(params)) {
      if (key != 'search') {
        delete params[key];
      }
    }
    this.router.navigate([], {
      queryParams: params,
    });
    this.selectedParams = {
      tasks: [],
      organizations: [],
      productTypes: [],
      organizationTypes: [],
      lecturers: [],
      courses: [],
      degree: [],
      years: [],
      search: this.selectedParams.search,
    };
  }

  //check if any filter is active
  filtersActive() {
    const params = { ...this.route.snapshot.queryParams };
    for (const [key, value] of Object.entries(params)) {
      if (params[key].length > 0 && key != 'search') {
        return true;
      }
    }
    return false;
  }
}
