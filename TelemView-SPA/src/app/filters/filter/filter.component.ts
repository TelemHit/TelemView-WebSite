import { Component, OnInit, Input, Pipe, PipeTransform } from '@angular/core';
import { DataForHome } from 'src/app/_models/dataForHome';
import { ActivatedRoute, Router, QueryParamsHandling } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  FormControl,
  Validators,
} from '@angular/forms';
import { ProductsService } from 'src/app/_services/products.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css'],
})
export class FilterComponent implements OnInit {
  @Input() dataforfilter;
  @Input() productParamsFromHome;
  @Input() filterName: any;
  @Input() filterTitle: any;
  productParams: any = {};
  form: FormGroup;
  check: boolean;
  activeFilter = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private productsServise: ProductsService
  ) {
    this.form = this.fb.group({
      checkArray: this.fb.array([]),
    });
  }

  ngOnInit() {
    // check if filter already checked
    if (this.productParamsFromHome) {
      if (this.productParamsFromHome.hasOwnProperty(this.filterName)) {
        const checkArray: FormArray = this.form.get('checkArray') as FormArray;
        if (Array.isArray(this.productParamsFromHome[this.filterName])) {
          this.productParamsFromHome[this.filterName].forEach((element) => {
            checkArray.push(new FormControl(element));
          });
        } else {
          checkArray.push(
            new FormControl(this.productParamsFromHome[this.filterName])
          );
        }
        this.activeFilter = checkArray.length;
      }
    }
  }

  updateQueryParameters() {
    const typeName: any = this.filterName;
    const params = { [typeName]: this.form.value.checkArray };
    this.activeFilter = this.form.value.checkArray.length;
    console.log(this.activeFilter);
    if (this.form.value.checkArray.length > 0) {
      this.router.navigate([], {
        queryParams: params,
        queryParamsHandling: 'merge',
      });
    } else {
      if (this.productParamsFromHome) {
        if (this.productParamsFromHome[typeName]) {
          this.router.navigate([], {
            queryParams: params,
            queryParamsHandling: 'merge',
          });
        }
      }
    }
  }

  onCheckboxChange(e) {
    const checkArray: FormArray = this.form.get('checkArray') as FormArray;
    if (e.target.checked) {
      checkArray.push(new FormControl(e.target.value));
      console.log(checkArray);
    } else {
      let i = 0;
      checkArray.controls.forEach((item: FormControl) => {
        if (item.value === e.target.value) {
          checkArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  isChecked(id) {
    if (this.productParamsFromHome) {
      if (this.productParamsFromHome.hasOwnProperty(this.filterName)) {
        return this.productParamsFromHome[this.filterName].includes(
          id.toString()
        );
      } else {
        return false;
      }
    }
  }

  clearFilter() {
    const checkArray: FormArray = this.form.get('checkArray') as FormArray;
    checkArray.clear();
    this.updateQueryParameters();
  }
}
