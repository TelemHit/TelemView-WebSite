import {
  Component,
  OnInit,
  Input,
  Pipe,
  PipeTransform,
  Output,
  EventEmitter,
} from '@angular/core';
import { DataForHome } from 'src/app/_models/dataForHome';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  FormControl,
  Validators,
} from '@angular/forms';
import { ProductsService } from 'src/app/_services/products.service';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Pipe({ name: 'keys' })
export class KeysPipe implements PipeTransform {
  transform(value): any {
    if (!value) {
      return null;
    } else {
      return Object.keys(value);
    }
  }
}

@Component({
  selector: 'app-filters-nav',
  templateUrl: './filters-nav.component.html',
  styleUrls: ['./filters-nav.component.css'],
})
export class FiltersNavComponent implements OnInit {
  @Input() dataforhome: DataForHome[];
  @Input() productParamsFromHome;
  @Output() clearFilters = new EventEmitter();
  productParams: any = {};
  form: FormGroup;
  check: boolean;
  isFocused = false;
  someValue = '';
  modelChanged: Subject<string> = new Subject<string>();
  private subscription: Subscription;
  debounceTime = 500;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private productsServise: ProductsService
  ) {
    this.modelChanged
      .pipe(
        debounceTime(this.debounceTime)
      )
      .subscribe(() => {
        this.updateSearch();
      });
  }

  ngOnInit() {
    console.log(this.someValue);
    this.checkIfSearched();
  }

  checkIfSearched(){
    if (this.productParamsFromHome){
      if (this.productParamsFromHome.hasOwnProperty('search')){
        if(this.productParamsFromHome['search'].length>0){
          this.someValue=this.productParamsFromHome['search'];
        }
      }
    }
  }

  clearAll() {
    this.router.navigate([]);
    this.clearFilters.emit();
  }

  checkParams() {
    let toReturn = false;
    if (this.productParamsFromHome) {
      for (const [key, value] of Object.entries(this.productParamsFromHome)) {
        if (Array.isArray(value)) {
          if (value.length > 0) {
            toReturn = true;
            break;
          }
        } else if (value !== '') {
          toReturn = true;
          break;
        }
      }
    }
    return toReturn;
  }
  clearSearch(){
    this.someValue = '';
    this.updateSearch();
  }
  modelChange(){
    this.modelChanged.next();
  }
  updateSearch() {
    const params = { search: this.someValue };
    this.router.navigate([], {
      queryParams: params,
      queryParamsHandling: 'merge',
    });
  }
}
