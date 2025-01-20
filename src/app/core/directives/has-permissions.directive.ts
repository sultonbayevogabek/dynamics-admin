import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { UserModel } from '../models/user.model';
import { AuthService } from '../services/auth.service';

@Directive({
	selector: '[hasPermissions]',
	standalone: true,
})

export class HasPermissionsDirective implements OnInit {
	private currentUser: UserModel;
	private permissions: string[] = [];
	private isHidden = true;

	constructor(
		private templateRef: TemplateRef<any>,
		private viewContainer: ViewContainerRef,
		private userService: AuthService,
	) {}

	ngOnInit(): void {
		this.userService.currentUser$.subscribe((user) => {
			this.currentUser = user;
			this.updateView();
		});
	}

	@Input()
	set hasPermissions(permissions: string[]) {
		this.permissions = permissions;
		this.updateView();
	}

	private updateView(): void {
		if (this.checkRole()) {
			if (this.isHidden) {
				this.viewContainer.createEmbeddedView(this.templateRef);
				this.isHidden = false;
			}
		} else {
			this.isHidden = true;
			this.viewContainer.clear();
		}
	}

	private checkRole(): boolean {
		let hasRole = false;
		if (this.currentUser && this.currentUser.permissions && this.currentUser.permissions?.length) {
			for (const role of this.permissions) {
				if (this.currentUser.permissions.some((e) => e === role)) {
					hasRole = true;
					break;
				}
			}
		}
		return hasRole;
	}
}
