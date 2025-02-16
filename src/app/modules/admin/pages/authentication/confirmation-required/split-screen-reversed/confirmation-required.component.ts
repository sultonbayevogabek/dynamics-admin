import { Component, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';

@Component({
    selector: 'oauth-redirect-split-screen-reversed',
    templateUrl: './confirmation-required.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
    imports: [RouterLink],
})
export class ConfirmationRequiredSplitScreenReversedComponent {
    /**
     * Constructor
     */
    constructor() {}
}
