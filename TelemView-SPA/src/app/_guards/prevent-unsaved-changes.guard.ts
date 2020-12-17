import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { EditProductComponent } from '../editor/edit-product/edit-product.component';


@Injectable()
export class PreventUnsavedChangesGuard implements CanDeactivate<EditProductComponent>{
canDeactivate(component: EditProductComponent){
    if (component.productForm.dirty){
        return confirm('השינויים שביצעת לא יישמרו, האם ברצונך להמשיך?');
    }
    return true;
}
}
