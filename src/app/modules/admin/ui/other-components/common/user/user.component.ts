import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FuseHighlightComponent } from '@fuse/components/highlight';
import { OtherComponentsComponent } from 'app/modules/admin/ui/other-components/other-components.component';

@Component({
    selector: 'user',
    templateUrl: './user.component.html',
    imports: [MatIconModule, MatButtonModule, FuseHighlightComponent],
})
export class UserComponent {
    /**
     * Constructor
     */
    constructor(private _otherComponentsComponent: OtherComponentsComponent) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle the drawer
     */
    toggleDrawer(): void {
        // Toggle the drawer
        this._otherComponentsComponent.matDrawer.toggle();
    }
}
